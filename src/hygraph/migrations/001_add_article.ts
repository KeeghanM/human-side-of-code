import { Client, SimpleFieldType } from "@hygraph/management-sdk";

export const migrate = async (client: Client) => {
  console.log("Running migration: 001_add_article.ts");

  try {
    client.createModel({
      apiId: "Article",
      apiIdPlural: "Articles",
      displayName: "Article",
    });

    client.createSimpleField({
      parentApiId: "Article",
      apiId: "title",
      displayName: "Title",
      type: SimpleFieldType.String,
      isRequired: true,
      isTitle: true,
    });

    client.createSimpleField({
      parentApiId: "Article",
      apiId: "content",
      displayName: "Content",
      type: SimpleFieldType.Richtext,
      isRequired: true,
    });

    client.createSimpleField({
      parentApiId: "Article",
      apiId: "tags",
      displayName: "Tags",
      type: SimpleFieldType.String,
      isRequired: false,
      isList: true,
    });

    client.createSimpleField({
      parentApiId: "Article",
      apiId: "slug",
      displayName: "Slug",
      type: SimpleFieldType.String,
      isRequired: true,
      isUnique: true,
      tableRenderer: "GCMS_SLUG",
      formRenderer: "GCMS_SLUG",
    });

    console.log("Migration 001_add_article.ts completed");
  } catch (error) {
    console.error(
      "Migration 001_add_article.ts failed with specific error:",
      error,
    );
    throw error; // Re-throw to let the migration-runner know there was an error
  }
};
