import { gql } from '@lib/gql';
import { hygraph } from '@lib/Hygraph';

// Import fragments for all block types
import ACCORDION_BLOCK_FRAGMENT from '@components/accordion-block/AccordionBlock.fragment';
// Add other block fragments as you create them

/**
 * Interface for Page query result
 */
export interface PageData {
  page: {
    id: string;
    title: string;
    slug: string;
    seoDescription?: string | null;
    components: Array<{
      __typename: string;
      id: string;
      [key: string]: any;
    }>;
  } | null;
}

/**
 * Interface for Page query variables
 */
export interface PageVariables {
  slug: string;
}

/**
 * GraphQL query for fetching a page by slug
 * Includes all possible block types through fragments
 */
export const PAGE_QUERY = gql<PageData, PageVariables>`
  query GetPageBySlug($slug: String!) {
    page(where: { slug: $slug }) {
      id
      title
      slug
      seoDescription
      components: blocks {
        __typename
        ... on AccordionBlock {
          ...AccordionBlockFragment
        }
        # Add additional block types here as they're created
      }
    }
  }
  ${ACCORDION_BLOCK_FRAGMENT}
  # Add other fragments here as they're created
`;

export async function getPage(slug: string): Promise<PageData> {
  try {
    const data = await hygraph.request<PageData, PageVariables>(PAGE_QUERY.toString(), { slug });

    return data;
  } catch (error) {
    console.error(`Error fetching page with slug "${slug}":`, error);
    // Re-throw to allow caller to handle or transform the error
    throw new Error(
      `Failed to fetch page "${slug}": ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
