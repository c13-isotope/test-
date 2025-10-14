import { CollectionConfig } from "payload";

const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Enter post title',
      }
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload a featured image for this blog post',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief summary of the blog post content',
        placeholder: 'Enter a brief excerpt...',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        // Enhanced Rich Text Block with Font Options
        {
          slug: 'richText',
          fields: [
            {
              name: 'fontFamily',
              type: 'select',
              options: [
                { label: 'Default (System)', value: 'default' },
                { label: 'Times New Roman', value: 'times-new-roman' },
                { label: 'Arial', value: 'arial' },
                { label: 'Georgia', value: 'georgia' },
                { label: 'Verdana', value: 'verdana' },
                { label: 'Calibri', value: 'calibri' },
                { label: 'Garamond', value: 'garamond' },
                { label: 'Helvetica', value: 'helvetica' },
                { label: 'Courier New', value: 'courier-new' },
                { label: 'Trebuchet MS', value: 'trebuchet-ms' },
                { label: 'Brush Script MT', value: 'brush-script' },
              ],
              defaultValue: 'default',
              admin: {
                description: 'Choose font family for this text block',
                position: 'sidebar',
              }
            },
            {
              name: 'fontSize',
              type: 'select',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Normal', value: 'normal' },
                { label: 'Large', value: 'large' },
                { label: 'Extra Large', value: 'xlarge' },
              ],
              defaultValue: 'normal',
              admin: {
                description: 'Choose font size',
                position: 'sidebar',
              }
            },
            {
              name: 'textColor',
              type: 'select',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Primary Blue', value: 'primary' },
                { label: 'Dark Gray', value: 'dark' },
                { label: 'Light Gray', value: 'light' },
                { label: 'Success Green', value: 'success' },
                { label: 'Warning Orange', value: 'warning' },
                { label: 'Error Red', value: 'error' },
              ],
              defaultValue: 'default',
              admin: {
                description: 'Choose text color',
                position: 'sidebar',
              }
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              admin: {
                description: 'Main content with formatting options',
              },
            },
          ],
        },
        // Code Block
        {
          slug: 'code',
          fields: [
            {
              name: 'language',
              type: 'select',
              options: [
                'javascript',
                'typescript',
                'python',
                'html',
                'css',
                'json',
                'bash',
                'java',
                'php',
                'sql',
                'text'
              ],
              defaultValue: 'javascript',
            },
            {
              name: 'code',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Enter your code here',
              },
            },
          ],
        },
        // Rich Table Block with Colors
        {
          slug: 'richTable',
          fields: [
            {
              name: 'tableTitle',
              type: 'text',
              required: false,
              admin: {
                description: 'Optional table title',
                placeholder: 'e.g., Regulatory Compliance Rules',
              },
            },
            {
              name: 'headerStyle',
              type: 'group',
              fields: [
                {
                  name: 'backgroundColor',
                  type: 'select',
                  options: [
                    { label: 'Blue', value: '#3B82F6' },
                    { label: 'Green', value: '#10B981' },
                    { label: 'Red', value: '#EF4444' },
                    { label: 'Purple', value: '#8B5CF6' },
                    { label: 'Orange', value: '#F59E0B' },
                    { label: 'Gray', value: '#6B7280' },
                    { label: 'Teal', value: '#14B8A6' },
                  ],
                  defaultValue: '#3B82F6',
                },
                {
                  name: 'textColor',
                  type: 'select',
                  options: [
                    { label: 'White', value: '#FFFFFF' },
                    { label: 'Black', value: '#000000' },
                  ],
                  defaultValue: '#FFFFFF',
                },
              ],
            },
            {
              name: 'headers',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Enter header text',
                  },
                },
              ],
              admin: {
                description: 'Table column headers',
              },
            },
            {
              name: 'rows',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'cells',
                  type: 'array',
                  minRows: 1,
                  fields: [
                    {
                      name: 'content',
                      type: 'textarea',
                      required: true,
                      admin: {
                        placeholder: 'Enter cell content',
                      },
                    },
                    {
                      name: 'highlight',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Highlight this cell',
                      },
                    },
                  ],
                },
              ],
              admin: {
                description: 'Add table rows - ensure each row has same number of cells as headers',
              },
            },
            {
              name: 'borderStyle',
              type: 'select',
              options: [
                { label: 'All Borders', value: 'all' },
                { label: 'Horizontal Only', value: 'horizontal' },
                { label: 'Header Only', value: 'header' },
                { label: 'No Borders', value: 'none' },
              ],
              defaultValue: 'all',
            },
            {
              name: 'stripedRows',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Alternate row background colors for better readability',
              },
            },
          ],
        },
        // Kanban Board
        {
          slug: 'kanbanBoard',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'columns',
              type: 'array',
              fields: [
                {
                  name: 'columnTitle',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'cards',
                  type: 'array',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'text',
                    },
                    {
                      name: 'status',
                      type: 'select',
                      options: ['todo', 'in-progress', 'done'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Timeline
        {
          slug: 'timeline',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'timeframe',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'actions',
                  type: 'array',
                  fields: [
                    {
                      name: 'action',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Callout
        {
          slug: 'callout',
          fields: [
            {
              name: 'emoji',
              type: 'text',
              admin: {
                placeholder: '💡',
              },
            },
            {
              name: 'text',
              type: 'richText',
              required: true,
            },
            {
              name: 'color',
              type: 'select',
              options: [
                { label: 'Gray', value: 'gray' },
                { label: 'Yellow', value: 'yellow' },
                { label: 'Blue', value: 'blue' },
                { label: 'Green', value: 'green' },
                { label: 'Red', value: 'red' },
              ],
              defaultValue: 'gray',
            },
          ],
        },
        // Divider
        {
          slug: 'divider',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Line', value: 'line' },
                { label: 'Dashed', value: 'dashed' },
              ],
              defaultValue: 'line',
            },
          ],
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' }
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'CMC Regulatory', value: 'cmc-regulatory' },
        { label: 'MHRA', value: 'mhra' },
        { label: 'Pharmaceutical', value: 'pharmaceutical' },
        { label: 'Validation', value: 'validation' },
        { label: 'Quality Control', value: 'quality-control' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'API', value: 'api' },
        { label: 'Specification', value: 'specification' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date();
        }
        return data;
      },
    ],
  },
}

export default Posts;