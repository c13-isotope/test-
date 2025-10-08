import { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'), // Make sure this directory exists
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    mimeTypes: [
      'image/*',
      // Audio formats
      'audio/mpeg', // MP3
      'audio/wav', // WAV
      'audio/ogg', // OGG
      'audio/webm', // WebM audio
      // Video formats
      'video/mp4', // MP4
      'video/webm', // WebM
      'video/avi', // AVI
      'video/quicktime', // MOV
      'video/x-msvideo', // AVI alternative
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alternative text for images or description for audio/video',
      },
    },
    {
      name: 'mediaType',
      type: 'select',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Type of media file',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Auto-detect media type from mimeType
            if (siblingData.mimeType) {
              if (siblingData.mimeType.startsWith('image/')) {
                return 'image'
              } else if (siblingData.mimeType.startsWith('audio/')) {
                return 'audio'
              } else if (siblingData.mimeType.startsWith('video/')) {
                return 'video'
              }
            }
            return siblingData.mediaType
          },
        ],
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Duration in seconds (for audio/video)',
        condition: (data) => data.mediaType === 'audio' || data.mediaType === 'video',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Caption or subtitles for the media',
      },
    },
  ],
}
