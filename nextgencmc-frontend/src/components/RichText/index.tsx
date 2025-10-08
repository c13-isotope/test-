import React from 'react'
import AudioPlayer from '@/components/Media/AudioPlayer'
import VideoPlayer from '@/components/Media/VideoPlayer'
import ExternalVideoEmbed from '@/components/Media/ExternalVideoEmbed'

type RichNode = {
  type?: string
  tag?: string
  listType?: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  format?: number
  indent?: number
  version?: number
  children?: RichNode[]
  direction?: 'ltr' | 'rtl'
  checked?: boolean
  // Image/Upload specific fields
  value?: {
    id?: string
    url?: string
    alt?: string
    width?: number
    height?: number
    filename?: string
    mimeType?: string
    mediaType?: string
    caption?: string
    duration?: number
  }
  relationTo?: string
  // For external embeds
  url?: string
  fields?: {
    url?: string
    caption?: string
  }
}

type ContentStructure = {
  root?: {
    children?: RichNode[]
    direction?: 'ltr' | 'rtl'
    format?: string
    indent?: number
    type?: string
    version?: number
  }
} | RichNode[] | RichNode

export default function RichText({ content }: { content: ContentStructure }) {
  if (!content) return null

  const renderNode = (node: RichNode, index: number): React.ReactNode => {
    if (!node) return null

    // Handle text nodes first
    if (node.text !== undefined) {
      let textElement: React.ReactNode = node.text

      // Apply formatting based on format flags or individual properties
      if (node.bold || (node.format && node.format & 1)) {
        textElement = <strong key={`bold-${index}`}>{textElement}</strong>
      }
      if (node.italic || (node.format && node.format & 2)) {
        textElement = <em key={`italic-${index}`}>{textElement}</em>
      }
      if (node.underline || (node.format && node.format & 8)) {
        textElement = <u key={`underline-${index}`}>{textElement}</u>
      }
      if (node.strikethrough || (node.format && node.format & 4)) {
        textElement = <del key={`strike-${index}`}>{textElement}</del>
      }
      if (node.code || (node.format && node.format & 16)) {
        textElement = (
          <code key={`code-${index}`} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
            {textElement}
          </code>
        )
      }

      return <span key={index}>{textElement}</span>
    }

    // Handle different node types
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-base leading-relaxed text-body-color">
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderNode(child, childIndex))}
          </p>
        )

      case 'heading': {
        const level = (node.tag || '2') as '1' | '2' | '3' | '4' | '5' | '6'
        const HeadingTag = `h${level}` as React.ElementType

        const headingClass: Record<string, string> = {
          h1: 'text-3xl font-bold mb-6 text-black dark:text-white leading-tight',
          h2: 'text-2xl font-bold mb-5 text-black dark:text-white leading-tight',
          h3: 'text-xl font-semibold mb-4 text-black dark:text-white leading-tight',
          h4: 'text-lg font-semibold mb-3 text-black dark:text-white',
          h5: 'text-base font-semibold mb-3 text-black dark:text-white',
          h6: 'text-sm font-semibold mb-2 text-black dark:text-white',
        }

        return (
          <HeadingTag key={index} className={headingClass[`h${level}`]}>
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderNode(child, childIndex))}
          </HeadingTag>
        )
      }

      case 'list': {
        const isOrdered = node.listType === 'number'
        const isCheck = node.listType === 'check'
        const ListTag = (isOrdered ? 'ol' : 'ul') as React.ElementType
        
        let listClass = 'mb-6 space-y-2'
        if (isOrdered) {
          listClass += ' list-decimal list-outside pl-6'
        } else if (isCheck) {
          listClass += ' list-none pl-0'
        } else {
          listClass += ' list-disc list-outside pl-6'
        }

        return (
          <ListTag key={index} className={listClass}>
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderNode(child, childIndex))}
          </ListTag>
        )
      }

      case 'listitem': {
        const isCheckList = node.checked !== undefined
        
        if (isCheckList) {
          return (
            <li key={index} className="flex items-start space-x-2 mb-2">
              <input
                type="checkbox"
                checked={node.checked}
                disabled
                className="mt-1.5 rounded"
              />
              <span className="text-base text-body-color flex-1">
                {Array.isArray(node.children) &&
                  node.children.map((child, childIndex) => renderNode(child, childIndex))}
              </span>
            </li>
          )
        }

        return (
          <li key={index} className="text-base text-body-color mb-1 leading-relaxed">
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderNode(child, childIndex))}
          </li>
        )
      }

      case 'quote':
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-6 py-2 my-6 italic text-body-color bg-gray-50 dark:bg-gray-800 rounded-r">
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderNode(child, childIndex))}
          </blockquote>
        )

      case 'code':
        return (
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded my-6 overflow-x-auto border">
            <code className="text-sm font-mono">
              {Array.isArray(node.children) &&
                node.children.map((child, childIndex) => renderNode(child, childIndex))}
            </code>
          </pre>
        )

      case 'link':
        return (
          <a
            key={index}
            href="#"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderNode(child, childIndex))}
          </a>
        )

      case 'linebreak':
        return <br key={index} />

      case 'horizontalrule':
        return <hr key={index} className="my-8 border-gray-300 dark:border-gray-600" />

      // Handle uploaded images, audio, and video
      case 'upload':
        if (node.value && node.relationTo === 'media') {
          const mediaData = node.value
          const mediaUrl = `http://localhost:3000${mediaData.url}`
          
          // Determine media type from mimeType or mediaType field
          const mimeType = mediaData.mimeType || ''
          const mediaType = mediaData.mediaType
          
          // Handle audio files
          if (mediaType === 'audio' || mimeType.startsWith('audio/')) {
            return (
              <AudioPlayer
                key={index}
                src={mediaUrl}
                alt={mediaData.alt || mediaData.filename}
                caption={mediaData.caption}
              />
            )
          }
          
          // Handle video files
          if (mediaType === 'video' || mimeType.startsWith('video/')) {
            return (
              <VideoPlayer
                key={index}
                src={mediaUrl}
                alt={mediaData.alt || mediaData.filename}
                caption={mediaData.caption}
              />
            )
          }
          
          // Handle images (default behavior)
          return (
            <div key={index} className="my-6">
              <img
                src={mediaUrl}
                alt={mediaData.alt || mediaData.filename || 'Uploaded image'}
                className="w-full h-auto rounded-lg shadow-md"
                style={{ 
                  maxWidth: mediaData.width ? `${mediaData.width}px` : '100%',
                  height: 'auto'
                }}
              />
              {mediaData.alt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                  {mediaData.alt}
                </p>
              )}
            </div>
          )
        }
        return null

      // Handle external video embeds
      case 'video-embed':
      case 'embed':
        if (node.url || node.fields?.url) {
          const embedUrl = node.url || node.fields?.url
          const embedCaption = node.fields?.caption
          return (
            <ExternalVideoEmbed
              key={index}
              url={embedUrl!}
              caption={embedCaption}
            />
          )
        }
        return null

      // Handle unknown nodes with children
      default:
        if (Array.isArray(node.children) && node.children.length > 0) {
          return (
            <div key={index} className="my-2">
              {node.children.map((child, childIndex) => renderNode(child, childIndex))}
            </div>
          )
        }
        return null
    }
  }

  // Enhanced content parsing
  const parseContent = (contentData: ContentStructure): React.ReactNode => {
    // Handle root structure
    if (contentData && typeof contentData === 'object' && 'root' in contentData && contentData.root?.children) {
      return contentData.root.children.map((node, index) => renderNode(node, index))
    }

    // Handle direct array
    if (Array.isArray(contentData)) {
      return contentData.map((node, index) => renderNode(node, index))
    }

    // Handle single node
    if (contentData && typeof contentData === 'object' && 'type' in contentData) {
      return renderNode(contentData, 0)
    }

    // Handle children array
    if (contentData && typeof contentData === 'object' && 'children' in contentData && Array.isArray(contentData.children)) {
      return contentData.children.map((node, index) => renderNode(node, index))
    }

    return null
  }

  const renderedContent = parseContent(content)

  if (!renderedContent) {
    return (
      <div className="text-body-color italic">
        No content available
      </div>
    )
  }

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert rich-text-content">
      {renderedContent}
    </div>
  )
}
