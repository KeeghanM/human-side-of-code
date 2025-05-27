import { EntityTypeName } from "@cms/graphql";

// Import all component types
import NoComponentFile from "@components/NoComponentFile.astro";
import AccordionBlock from "@components/accordion-block/index.astro";
import AccordionItem from "@components/accordion-item/index.astro";

/**
 * Map of component types to their implementations
 * Using the EntityTypeName enum from generated GraphQL types for better type safety
 */
const componentMap: Record<string, any> = {
  [EntityTypeName.AccordionBlock]: AccordionBlock,
  [EntityTypeName.AccordionItem]: AccordionItem,
};

/**
 * Get the component implementation for a given typename
 * Falls back to a placeholder component if not found
 */
export function getComponentForName(typename: string): any {
  return componentMap[typename] || NoComponentFile;
}
