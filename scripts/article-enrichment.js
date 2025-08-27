#!/usr/bin/env node
/*
  article-enrichment.js
  Uses OpenAI API to generate excerpts and tags for existing articles
  that are missing these fields in their frontmatter.
*/

const fs = require('node:fs/promises');
const path = require('node:path');
const matter = require('gray-matter');
const { OpenAI } = require('openai');

const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

// Load environment variables from .env.local
async function loadEnvLocal() {
  const envPath = path.join(rootDir, '.env.local');
  try {
    const envContent = await fs.readFile(envPath, 'utf8');
    const env = {};
    
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
        }
      }
    }
    
    return env;
  } catch (error) {
    console.warn('Warning: Could not read .env.local file');
    return {};
  }
}

// Initialize OpenAI client
async function createOpenAIClient() {
  const env = await loadEnvLocal();
  const apiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add OPENAI_API_KEY to your .env.local file or environment variables.');
  }
  
  return new OpenAI({ apiKey });
}

// System prompt for OpenAI
const SYSTEM_PROMPT = `You are an expert technology content analyst specializing in creating concise, engaging excerpts and generating relevant categorical tags for technology-focused business articles. Your analysis should reflect professional technical writing standards while remaining accessible to a diverse technical audience.

## Core Task

Analyze technology blog posts and articles to:
1. Generate a compelling excerpt (100-160 characters)
2. Create 2-5 descriptive tags that accurately categorize the content

## Excerpt Guidelines

### Requirements:
- **Length**: 100-160 characters (strictly enforced)
- **Format**: Single sentence, plain text only
- **Style**: Professional yet engaging
- **Content**: Capture the core value proposition or key insight
- **Constraints**: 
  - No markdown formatting
  - No quotation marks
  - No trailing ellipsis (...)
  - Avoid repeating the article title
  - Focus on the unique value or insight provided

## Tag Generation Guidelines

### Characteristics:
- **Quantity**: 2-5 tags per article
- **Format**: Title case, concise phrases
- **Scope**: Mix of broad categories and specific topics
- **Relevance**: Directly related to the main content themes

### Tag Categories to Consider:
1. **Technology Domain** (e.g., "Cloud Computing", "Machine Learning", "DevOps", "Cybersecurity")
2. **Technical Level** (e.g., "Architecture", "Implementation", "Best Practices", "Tutorial")
3. **Business Context** (e.g., "Enterprise", "Startup", "Digital Transformation", "Cost Optimization")
4. **Specific Technologies** (e.g., "Python", "AWS", "Kubernetes", "React")
5. **Content Type** (e.g., "Case Study", "Technical Analysis", "Industry Trends", "How-To Guide")

## Output Format

Return a JSON object with exactly this structure:
{
  "excerpt": "Your 100-160 character excerpt here as a single sentence",
  "tags": ["Tag One", "Tag Two", "Tag Three"]
}

Remember: The goal is to help technology professionals quickly understand the article's value and find relevant content through effective categorization.`;

// Analyze article with OpenAI
async function analyzeArticle(openai, title, content) {
  try {
    const userPrompt = `Please analyze this technology article and provide an excerpt and tags.

Title: ${title}

Content:
${content}

Return your analysis as a JSON object with "excerpt" and "tags" fields.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const result = response.choices[0].message.content.trim();
    
    // Try to parse JSON response
    let analysis;
    try {
      // Extract JSON from potential markdown code block
      const jsonMatch = result.match(/```json\n?(.*?)\n?```/s) || result.match(/```\n?(.*?)\n?```/s);
      const jsonText = jsonMatch ? jsonMatch[1] : result;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', result);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate response structure
    if (!analysis.excerpt || !Array.isArray(analysis.tags)) {
      throw new Error('Invalid analysis structure from OpenAI');
    }

    // Validate excerpt length
    if (analysis.excerpt.length < 100 || analysis.excerpt.length > 160) {
      console.warn(`Warning: Excerpt length (${analysis.excerpt.length}) outside recommended range (100-160) for "${title}"`);
    }

    return analysis;
  } catch (error) {
    console.error(`Error analyzing article "${title}":`, error.message);
    throw error;
  }
}

// Process a single article file
async function processArticle(openai, filePath) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const parsed = matter(fileContent);
    const { data: frontmatter, content } = parsed;

    // Check if article already has excerpt and tags
    const needsExcerpt = !frontmatter.excerpt || frontmatter.excerpt === 'A brief description of this article.';
    const needsTags = !frontmatter.tags || (Array.isArray(frontmatter.tags) && frontmatter.tags.length <= 2 && frontmatter.tags.includes('technology'));

    if (!needsExcerpt && !needsTags) {
      console.log(`Skipping ${path.basename(filePath)} - already has excerpt and tags`);
      return;
    }

    console.log(`Processing ${path.basename(filePath)}...`);

    // Get title for analysis
    const title = frontmatter.title || path.basename(filePath, '.mdx');
    
    // Analyze with OpenAI
    const analysis = await analyzeArticle(openai, title, content);

    // Update frontmatter
    let updated = false;
    if (needsExcerpt) {
      frontmatter.excerpt = analysis.excerpt;
      updated = true;
      console.log(`  ✓ Added excerpt: "${analysis.excerpt}"`);
    }

    if (needsTags) {
      frontmatter.tags = analysis.tags;
      updated = true;
      console.log(`  ✓ Added tags: [${analysis.tags.join(', ')}]`);
    }

    if (updated) {
      // Write updated file
      const updatedContent = matter.stringify(content, frontmatter);
      await fs.writeFile(filePath, updatedContent, 'utf8');
      console.log(`  ✅ Updated ${path.basename(filePath)}`);
    }

  } catch (error) {
    console.error(`Error processing ${path.basename(filePath)}:`, error.message);
  }
}

// Get all article files
async function getArticleFiles() {
  try {
    const files = await fs.readdir(articlesDir);
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => path.join(articlesDir, file));
  } catch (error) {
    throw new Error(`Could not read articles directory: ${error.message}`);
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting article enrichment process...\n');

    // Initialize OpenAI client
    const openai = await createOpenAIClient();
    console.log('✅ OpenAI client initialized\n');

    // Get all article files
    const articleFiles = await getArticleFiles();
    console.log(`Found ${articleFiles.length} article(s) to process\n`);

    if (articleFiles.length === 0) {
      console.log('No articles found in content/articles directory');
      return;
    }

    // Process each article
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const filePath of articleFiles) {
      try {
        const initialContent = await fs.readFile(filePath, 'utf8');
        await processArticle(openai, filePath);
        
        // Check if file was actually modified
        const finalContent = await fs.readFile(filePath, 'utf8');
        if (initialContent !== finalContent) {
          processedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to process ${path.basename(filePath)}: ${error.message}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  • ${processedCount} article(s) updated`);
    console.log(`  • ${skippedCount} article(s) skipped (already complete)`);
    console.log(`  • ${errorCount} article(s) had errors`);
    console.log('\n✨ Article enrichment complete!');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Article Enrichment Script

This script uses OpenAI's API to automatically generate excerpts and tags for articles
that are missing these fields in their frontmatter.

Usage:
  npm run article-enrichment

Requirements:
  - OpenAI API key in .env.local file (OPENAI_API_KEY=your_key_here)
  - Articles in content/articles/ directory with .mdx extension

The script will:
  1. Scan all .mdx files in content/articles/
  2. Skip articles that already have good excerpts and tags
  3. Use OpenAI to generate excerpts (100-160 characters) and relevant tags
  4. Update the frontmatter of each processed article
  5. Provide a summary of changes made
`);
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});