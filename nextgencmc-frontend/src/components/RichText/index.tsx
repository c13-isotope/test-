"use client";

import React from 'react';

// Define all possible node types
type RichNode = {
  type?: string;
  tag?: string;
  listType?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  format?: number;
  indent?: number;
  version?: number;
  children?: RichNode[];
  direction?: 'ltr' | 'rtl';
  checked?: boolean;
  url?: string;
  // Image/Upload specific fields
  value?: {
    id?: string;
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
    filename?: string;
  };
  relationTo?: string;
  // Block fields
  blockType?: string;
  blockName?: string;
  // For direct HTML content
  html?: string;
  // For simple text content
  content?: any;
}

type ContentStructure = {
  root?: {
    children?: RichNode[];
    direction?: 'ltr' | 'rtl';
    format?: string;
    indent?: number;
    type?: string;
    version?: number;
  };
} | RichNode[] | RichNode | any;

interface RichTextProps {
  content: ContentStructure;
}

export default function RichText({ content }: RichTextProps) {
  if (!content) {
    return (
      <div className="text-body-color italic text-center py-8">
        No content available
      </div>
    );
  }

  console.log('RichText Content:', content);

  // Handle direct HTML string
  if (typeof content === 'string') {
    return (
      <div 
        className="prose prose-lg max-w-none dark:prose-invert rich-text-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Handle block-based content (like from Payload CMS)
  if (Array.isArray(content) && content[0]?.blockType) {
    return (
      <div className="space-y-6">
        {content.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }

  // Handle Lexical JSON structure
  if (content.root?.children || (Array.isArray(content) && content[0]?.type)) {
    const renderedContent = parseLexicalContent(content);
    
    if (!renderedContent) {
      return (
        <div className="text-body-color italic">
          Unable to render content
        </div>
      );
    }

    return (
      <div className="prose prose-lg max-w-none dark:prose-invert rich-text-content">
        {renderedContent}
      </div>
    );
  }

  // Handle simple object with children
  if (content.children && Array.isArray(content.children)) {
    const renderedContent = content.children.map((node: RichNode, index: number) => 
      renderLexicalNode(node, index)
    );

    return (
      <div className="prose prose-lg max-w-none dark:prose-invert rich-text-content">
        {renderedContent}
      </div>
    );
  }

  // Fallback: try to stringify and display for debugging
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <p className="text-sm text-yellow-800 mb-2">
        Unable to render content. Raw data:
      </p>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );

  // Block-based renderer for Payload CMS blocks
  function renderBlock(block: any, index: number): React.ReactNode {
    if (!block) return null;

    switch (block.blockType) {
      case 'richText':
        return (
          <div key={index} className="rich-text-block">
            {parseLexicalContent(block.content)}
          </div>
        );

      case 'heading':
        return (
          <h2 key={index} className="text-2xl font-bold mb-4 text-black dark:text-white">
            {block.text}
          </h2>
        );

      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-base leading-relaxed text-body-color">
            {block.text}
          </p>
        );

      case 'image':
        return (
          <div key={index} className="my-6">
            <img
              src={block.image?.url || `http://localhost:3000${block.image?.url}`}
              alt={block.image?.alt || 'Image'}
              className="w-full h-auto rounded-lg shadow-md"
            />
            {block.caption && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded my-6 overflow-x-auto border">
            <code className="text-sm font-mono text-body-color">
              {block.code}
            </code>
          </pre>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-6 py-2 my-6 italic text-body-color bg-gray-50 dark:bg-gray-800 rounded-r">
            {block.quote}
          </blockquote>
        );

      default:
        console.warn('Unknown block type:', block.blockType);
        return (
          <div key={index} className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 text-sm">
              Unknown block type: {block.blockType}
            </p>
          </div>
        );
    }
  }

  // Lexical content parser
  function parseLexicalContent(contentData: ContentStructure): React.ReactNode {
    // Handle root structure
    if (contentData && typeof contentData === 'object' && 'root' in contentData && contentData.root?.children) {
      return contentData.root.children.map((node, index) => renderLexicalNode(node, index));
    }

    // Handle direct array
    if (Array.isArray(contentData)) {
      return contentData.map((node, index) => renderLexicalNode(node, index));
    }

    // Handle single node
    if (contentData && typeof contentData === 'object' && 'type' in contentData) {
      return renderLexicalNode(contentData, 0);
    }

    return null;
  }

  // Lexical node renderer
  function renderLexicalNode(node: RichNode, index: number): React.ReactNode {
    if (!node) return null;

    // Handle text nodes first
    if (node.text !== undefined) {
      let textElement: React.ReactNode = node.text;

      // Apply formatting based on format flags or individual properties
      if (node.bold || (node.format && node.format & 1)) {
        textElement = <strong key={`bold-${index}`}>{textElement}</strong>;
      }
      if (node.italic || (node.format && node.format & 2)) {
        textElement = <em key={`italic-${index}`}>{textElement}</em>;
      }
      if (node.underline || (node.format && node.format & 8)) {
        textElement = <u key={`underline-${index}`}>{textElement}</u>;
      }
      if (node.strikethrough || (node.format && node.format & 4)) {
        textElement = <del key={`strike-${index}`}>{textElement}</del>;
      }
      if (node.code || (node.format && node.format & 16)) {
        textElement = (
          <code key={`code-${index}`} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
            {textElement}
          </code>
        );
      }

      return <span key={index}>{textElement}</span>;
    }

    // Handle different node types
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-base leading-relaxed text-body-color">
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
          </p>
        );

      case 'heading': {
        const level = (node.tag || '2') as '1' | '2' | '3' | '4' | '5' | '6';
        const HeadingTag = `h${level}` as React.ElementType;

        const headingClass: Record<string, string> = {
          h1: 'text-3xl font-bold mb-6 text-black dark:text-white leading-tight',
          h2: 'text-2xl font-bold mb-5 text-black dark:text-white leading-tight',
          h3: 'text-xl font-semibold mb-4 text-black dark:text-white leading-tight',
          h4: 'text-lg font-semibold mb-3 text-black dark:text-white',
          h5: 'text-base font-semibold mb-3 text-black dark:text-white',
          h6: 'text-sm font-semibold mb-2 text-black dark:text-white',
        };

        return (
          <HeadingTag key={index} className={headingClass[`h${level}`]}>
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
          </HeadingTag>
        );
      }

      case 'list': {
        const isOrdered = node.listType === 'number';
        const isCheck = node.listType === 'check';
        const ListTag = (isOrdered ? 'ol' : 'ul') as React.ElementType;
        
        let listClass = 'mb-6 space-y-2';
        if (isOrdered) {
          listClass += ' list-decimal list-outside pl-6';
        } else if (isCheck) {
          listClass += ' list-none pl-0';
        } else {
          listClass += ' list-disc list-outside pl-6';
        }

        return (
          <ListTag key={index} className={listClass}>
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
          </ListTag>
        );
      }

      case 'listitem': {
        const isCheckList = node.checked !== undefined;
        
        if (isCheckList) {
          return (
            <li key={index} className="flex items-start space-x-2 mb-2">
              <input
                type="checkbox"
                checked={node.checked}
                disabled
                className="mt-1.5 rounded border-gray-300"
              />
              <span className="text-base text-body-color flex-1">
                {Array.isArray(node.children) &&
                  node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
              </span>
            </li>
          );
        }

        return (
          <li key={index} className="text-base text-body-color mb-1 leading-relaxed">
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
          </li>
        );
      }

      case 'quote':
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-6 py-2 my-6 italic text-body-color bg-gray-50 dark:bg-gray-800 rounded-r">
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded my-6 overflow-x-auto border">
            <code className="text-sm font-mono text-body-color">
              {Array.isArray(node.children) &&
                node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
            </code>
          </pre>
        );

      case 'link':
        return (
          <a
            key={index}
            href={node.url || '#'}
            className="text-primary hover:text-primary/80 underline transition-colors"
            target={node.url?.startsWith('http') ? '_blank' : undefined}
            rel={node.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {Array.isArray(node.children) &&
              node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
          </a>
        );

      case 'linebreak':
        return <br key={index} />;

      case 'horizontalrule':
        return <hr key={index} className="my-8 border-gray-300 dark:border-gray-600" />;

      // Handle uploaded images
      case 'upload':
        if (node.value && node.relationTo === 'media') {
          const imageData = node.value;
          return (
            <div key={index} className="my-6">
              <img
                src={imageData.url?.startsWith('http') ? imageData.url : `http://localhost:3000${imageData.url}`}
                alt={imageData.alt || imageData.filename || 'Uploaded image'}
                className="w-full h-auto rounded-lg shadow-md"
                style={{ 
                  maxWidth: imageData.width ? `${imageData.width}px` : '100%',
                  height: 'auto'
                }}
              />
              {imageData.alt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                  {imageData.alt}
                </p>
              )}
            </div>
          );
        }
        return null;

      // Handle unknown nodes with children
      default:
        if (Array.isArray(node.children) && node.children.length > 0) {
          return (
            <div key={index} className="my-2">
              {node.children.map((child, childIndex) => renderLexicalNode(child, childIndex))}
            </div>
          );
        }
        return null;
    }
  }
}