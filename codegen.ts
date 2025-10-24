import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'

dotenv.config()

const config: CodegenConfig = {
  schema: process.env.HYGRAPH_ENDPOINT as string,
  ignoreNoDocuments: true,
  generates: {
    './src/hygraph/graphql/': {
      preset: 'client',
      plugins: [],
      config: {
        documentMode: 'string',
        useTypeImports: true,
        dedupeFragments: true,
        pureMagicComment: true,
        nonOptionalTypename: true,
      },
    },
    './src/hygraph/graphql/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
}

export default config
