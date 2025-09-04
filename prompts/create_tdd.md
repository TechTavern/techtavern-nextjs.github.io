Please examine the entire codebase, including the existing PRD.md document, to create a comprehensive Technical Design Document (TDD) and store it as documentation/TDD.md in markdown format.

## Analysis Requirements

1. **Codebase Analysis**: Review all source code, configuration files, package.json, next.config.js, GitHub Actions workflows, and any existing documentation to understand the current architecture.

2. **PRD Alignment**: Reference the PRD.md to ensure the technical design aligns with stated product requirements and goals.

3. **Static Site Architecture**: Document how the NextJS application is configured for static site generation and GitHub Pages deployment.

## TDD Structure Required

Create a detailed Technical Design Document with the following sections:

### 1. Project Overview
- Purpose and scope
- Key stakeholders and target audience
- High-level architecture summary

### 2. System Architecture
- Component hierarchy and relationships
- Data flow diagrams (use mermaid syntax where helpful)
- Static site generation strategy
- Build and deployment pipeline architecture

### 3. Technology Stack
- Framework and library choices with rationale
- Development dependencies
- Build tools and configuration

### 4. File Structure and Organization
- Directory structure with explanations
- Naming conventions currently in use
- Module organization patterns

### 5. Data Management
- Content structure and sources
- Static data handling
- Asset management strategy

### 6. Build and Deployment
- GitHub Actions workflow analysis
- Static site generation process
- GitHub Pages configuration and constraints

### 7. Development Workflow
- Local development setup
- Testing strategies (if any)
- Code quality tools and processes

### 8. Performance and Optimization
- Current optimization strategies
- Bundle analysis and code splitting
- SEO and accessibility considerations

## Design Analysis and Recommendations

After completing the TDD, add a comprehensive "Recommendations for Design Improvements" section that includes:

### Architecture Analysis
- Identify any violations of SOLID principles
- Highlight areas where DRY principles are not followed
- Document inconsistent patterns or anti-patterns

### Specific Recommendations
For each identified issue, provide:
- **Current State**: What exists now
- **Proposed Change**: Specific improvement recommendation
- **Rationale**: Why this change improves the design
- **Impact**: Effort level and benefits
- **Implementation Priority**: High/Medium/Low

### Best Practices Alignment
- NextJS best practices adherence
- Static site generation optimizations
- GitHub Pages deployment improvements
- Code organization and maintainability enhancements

### Future Scalability
- Recommendations for handling growth
- Modular architecture improvements
- Extensibility considerations

Please ensure the TDD is comprehensive, technically accurate, and serves as both documentation for the current state and a roadmap for future improvements. Use clear, professional language with appropriate technical detail for a development audience.