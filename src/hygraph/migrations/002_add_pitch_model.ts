import { Client, SimpleFieldType } from '@hygraph/management-sdk'

export const migrate = async (client: Client) => {
  console.log('Running migration: 002_add_pitch_model.ts')

  try {
    client.createModel({
      apiId: 'Pitch',
      apiIdPlural: 'Pitches',
      displayName: 'Pitch',
    })

    client.createSimpleField({
      parentApiId: 'Pitch',
      apiId: 'title',
      displayName: 'Title',
      type: SimpleFieldType.String,
      isRequired: true,
      isTitle: true,
    })

    client.createSimpleField({
      parentApiId: 'Pitch',
      apiId: 'content',
      displayName: 'Content',
      type: SimpleFieldType.Richtext,
      isRequired: true,
    })

    console.log('Migration 002_add_pitch_model.ts completed')
  } catch (error) {
    console.error(
      'Migration 002_add_pitch_model.ts failed with specific error:',
      error
    )
    throw error // Re-throw to let the migration-runner know there was an error
  }
}
