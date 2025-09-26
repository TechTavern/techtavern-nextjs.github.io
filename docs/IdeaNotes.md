# Ideation for New Features

This document contains rough outlines of future development ideas for the site. It is NOT to be used for initiationg development and is only present to capture ideas for future spec development before implementation.

## Ideas

### Pagination

**Area:** Reusable Feature, Article Index

This specification outlines the requirements for implementing pagination for search results.

#### 1. UI Component: `Pagination`

* A dedicated **`Pagination`** component is required to handle navigation between pages of results.
* This component should render controls such as **"Previous"** and **"Next"** buttons, as well as numbered page links.
* The component should only be visible when the total number of results exceeds the number of items displayed per page.

#### 2. Core Logic

* The system must use a predefined constant (e.g., `itemsPerPage`) to determine how many results to display on a single page.
* Before rendering, the full list of search results must be logically "sliced" to isolate the subset of items for the currently active page.
    * For example, for page `2` with `10` items per page, the component should display items 11 through 20 from the total results.

#### 3. State Management & URL Integration

* The currently active page number must be stored in the URL using a query parameter named **`page`**.
* The application must be able to read this parameter to display the correct page of results on initial load or page refresh.
* If the **`page`** parameter is not present in the URL, the system should default to displaying page `1`.
* **Example URL**: `https://example.com/search?q=query&page=3`

---

### Article Search & Tag Filtering

Area: Reusable Feature, Search

The feature provides a fast, client-side fuzzy search experience. It relies on a pre-built JSON index generated at build time, eliminating the need for a server-side search endpoint. The search functionality will allow users to find articles by a text query, by selecting one or more tags, or by a combination of both. All results will be paginated.

* **Core Technology**: **Fuse.js** for client-side fuzzy searching.
* **Data Source**: A static `search-index.json` file.
* **Filtering**: Supports full-text search and filtering by content tags.
* **UI**: Consists of an input field, a tag selector, a results display, and pagination controls.

#### 1. Search Index Generation

A searchable index of all content must be generated during the site's build process.

* **Trigger**: This process is handled by a script (e.g., `generate-search-index.ts`) that is executed as part of the build pipeline (e.g., `npm run build`).
* **Process**:
    1.  The script will scan the `content/posts/` directory.
    2.  For each non-draft MDX file, it will parse the frontmatter and content.
    3.  It will extract the necessary fields to construct a JSON object for each article.
* **Output**: The script will generate a single file, `public/search-index.json`, which contains an array of all post objects.
* **Index Item Schema**: Each object in the `search-index.json` array should conform to a strict type, for example:
    ```typescript
    interface SearchIndexItem {
      slug: string;       // URL slug for linking
      title: string;      // Post title
      excerpt: string;    // Brief summary
      tags: string[];     // Array of tags
      content: string;    // The main body of the post, stripped of markdown
    }
    ```

#### 2. Client-Side Implementation & UI

The user-facing search functionality is composed of several components that work together.

Components:

* **`SearchInput`**: An input field for text queries. It should implement **debouncing** to prevent triggering a search on every keystroke, waiting instead until the user has stopped typing for a brief moment (e.g., 300ms).
* **`TagFilter`**: A new component that displays all available tags. Users can select one or more tags to filter the articles. This could be implemented as a list of checkboxes or clickable "pill" elements.
* **`SearchResults`**: A component that receives the list of filtered and paginated results and renders them. Each result should link to the corresponding article page.
* **`Pagination`**: A central component that displays pagination controls (e.g., "Previous," "Next," and page numbers) when the total number of search results exceeds the number of items per page.

Search & Filtering Logic:

The search logic should execute in the following order upon any change to the search query or selected tags:
1.  **Tag Filtering**: First, filter the entire list of posts from `search-index.json` to include only those that contain **all** of the currently selected tags. If no tags are selected, this step is skipped.
2.  **Text Search**: Next, if a text query exists, use Fuse.js to perform a fuzzy search on the result set from the previous step. The search should be configured to check fields like `title`, `excerpt`, `tags`, and `content`.
3.  **Pagination**: Finally, the resulting list of articles is "sliced" based on the current page number and a predefined `itemsPerPage` constant (e.g., 10) to get the final list to be displayed.

#### 3. State Management and URL Integration

To ensure search results are shareable and integrated with browser history, the state of the search must be stored in the URL's query parameters.

* **`q`**: Stores the text search query.
    * *Example*: `?q=dungeons-and-dragons`
* **`tags`**: Stores a comma-separated list of selected tags.
    * *Example*: `?tags=osr,shadowdark`
* **`page`**: Stores the current page number for pagination. Defaults to `1` if not present.
    * *Example*: `?page=2`

A complete URL might look like: `https://example.com/search?q=rules&tags=dnd,ttrpg&page=1`. The application should listen for changes to these URL parameters and re-trigger the search and filtering logic accordingly.