import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = { 
  title: "Articles",
  description: "Insights and expertise on technology, cybersecurity, and IT solutions from Tech Tavern LLC."
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function ArticlesIndexPage() {
  const posts = await getAllPosts();
  
  return (
    <>
      {/* Hero Section */}
      <section className="gradient-brand text-light py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Articles & Insights
            </h1>
            <p className="text-xl md:text-2xl text-light/90 leading-relaxed">
              Expert perspectives on technology, cybersecurity, and strategic IT solutions
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-secondary/10 rounded-lg p-12 max-w-md mx-auto">
                <h2 className="text-2xl font-heading font-semibold text-dark mb-4">
                  Coming Soon
                </h2>
                <p className="text-dark/70">
                  We&rsquo;re working on some great content for you. Check back soon for insights on technology and cybersecurity.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article 
                  key={post.url}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-secondary/20"
                >
                  {post.featuredImage && (
                    <div className="relative w-full overflow-hidden bg-secondary/10" style={{aspectRatio: '16/9'}}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-accent font-medium">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        {post.readingTimeMinutes ? (
                          <span className="text-dark/50">· {post.readingTimeMinutes} min</span>
                        ) : null}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-heading font-semibold text-dark mb-3 line-clamp-2">
                      <Link 
                        href={post.url}
                        className="hover:text-primary transition-colors duration-300"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-dark/70 mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <Link
                      href={post.url}
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors duration-300"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-dark mb-4">
            Need Technology Expertise?
          </h2>
          <p className="text-xl text-dark/70 mb-8 max-w-2xl mx-auto">
            Let&rsquo;s discuss how Tech Tavern can help your business with innovative technology solutions and cybersecurity expertise.
          </p>
          <Link
            href="/#Contact"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-colors duration-300 rounded-lg shadow-lg hover:shadow-xl"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
