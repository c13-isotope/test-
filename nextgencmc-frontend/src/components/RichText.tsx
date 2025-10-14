"use client";

import React from 'react';

interface RichTextProps {
  content: any[];
}

// Enhanced Code Block Component with Copy Functionality - CLIENT COMPONENT
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Get language display name
  const getLanguageName = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      python: 'Python',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      bash: 'Bash',
      shell: 'Shell',
      java: 'Java',
      php: 'PHP',
      sql: 'SQL',
      text: 'Text',
    };
    return languageMap[lang] || lang || 'Code';
  };

  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-xl border border-gray-700 bg-gray-900">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-sm font-medium text-gray-300">
            {getLanguageName(language || 'text')}
          </span>
        </div>
        
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="p-4 overflow-x-auto m-0">
        <code className={`text-sm leading-relaxed text-gray-100 font-mono whitespace-pre`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

// Lexical JSON to HTML converter
const lexicalToHtml = (lexicalJson: any): string => {
  if (!lexicalJson || !lexicalJson.root || !lexicalJson.root.children) {
    return '';
  }

  const convertNode = (node: any): string => {
    if (!node) return '';
    
    switch (node.type) {
      case 'paragraph':
        return `<p>${convertChildren(node)}</p>`;
      
      case 'heading':
        const tag = node.tag || `h${node.level || 2}`;
        return `<${tag} class="font-semibold mt-6 mb-4">${convertChildren(node)}</${tag}>`;
      
      case 'text':
        let text = node.text || '';
        if (node.format & 1) text = `<strong>${text}</strong>`; // Bold
        if (node.format & 2) text = `<em>${text}</em>`; // Italic
        if (node.format & 8) text = `<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">${text}</code>`; // Code
        return text;
      
      case 'list':
        const tagName = node.listType === 'bullet' ? 'ul' : 'ol';
        const listClass = node.listType === 'bullet' ? 'list-disc ml-6' : 'list-decimal ml-6';
        return `<${tagName} class="${listClass} mb-4">${convertChildren(node)}</${tagName}>`;
      
      case 'listitem':
        return `<li class="mb-1">${convertChildren(node)}</li>`;
      
      case 'quote':
        return `<blockquote class="border-l-4 border-primary bg-gray-50 dark:bg-gray-800 px-6 py-4 my-4 rounded-r-lg">${convertChildren(node)}</blockquote>`;
      
      case 'link':
        return `<a href="${node.url}" class="text-primary hover:underline">${convertChildren(node)}</a>`;
      
      default:
        return convertChildren(node);
    }
  };

  const convertChildren = (node: any): string => {
    if (!node.children || !Array.isArray(node.children)) return '';
    return node.children.map((child: any) => convertNode(child)).join('');
  };

  try {
    return convertChildren(lexicalJson.root);
  } catch (error) {
    console.error('Error converting Lexical JSON to HTML:', error);
    return '<p>Error rendering content</p>';
  }
};

// Helper function to safely extract HTML from various content formats
const extractHtmlFromRichText = (content: any): string => {
  if (!content) return '';
  
  // If it's already HTML string
  if (typeof content === 'string') {
    // Check if it's already HTML or plain text
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    return `<p>${content}</p>`;
  }
  
  // If it's a Lexical JSON object
  if (content.root && content.root.children) {
    return lexicalToHtml(content);
  }
  
  // If it's an object with html property
  if (content.html && typeof content.html === 'string') {
    return content.html;
  }
  
  // Fallback for any other object
  return '<p>Unable to render content</p>';
};

// Enhanced Rich Text Block with Font Styling
const RichTextBlock: React.FC<{ 
  content: any; 
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
}> = ({ content, fontFamily, fontSize, textColor }) => {
  const htmlContent = extractHtmlFromRichText(content);
  
  // Map font families to Tailwind CSS classes (from tailwind.config.js)
  const getFontFamilyClass = (font: string) => {
    const fontMap: { [key: string]: string } = {
      'times-new-roman': 'font-times-new-roman',
      'arial': 'font-arial',
      'georgia': 'font-georgia',
      'verdana': 'font-verdana',
      'calibri': 'font-calibri',
      'garamond': 'font-garamond',
      'helvetica': 'font-helvetica',
      'courier-new': 'font-courier-new',
      'trebuchet-ms': 'font-trebuchet-ms',
      'brush-script': 'font-brush-script',
      'default': '',
    };
    return fontMap[font] || '';
  };

  // Map font sizes to CSS classes
  const getFontSizeClass = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      'small': 'text-sm',
      'normal': 'text-base',
      'large': 'text-lg',
      'xlarge': 'text-xl',
    };
    return sizeMap[size] || 'text-base';
  };

  // Map text colors to CSS classes
  const getTextColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'default': 'text-body-color dark:text-body-color-dark',
      'primary': 'text-primary',
      'dark': 'text-black dark:text-white',
      'light': 'text-gray-600 dark:text-gray-400',
      'success': 'text-green-600 dark:text-green-400',
      'warning': 'text-yellow-600 dark:text-yellow-400',
      'error': 'text-red-600 dark:text-red-400',
    };
    return colorMap[color] || 'text-body-color dark:text-body-color-dark';
  };

  const fontClass = getFontFamilyClass(fontFamily || 'default');
  const sizeClass = getFontSizeClass(fontSize || 'normal');
  const colorClass = getTextColorClass(textColor || 'default');

  return (
    <div 
      className={`rich-text-content prose prose-lg max-w-none 
                  ${fontClass} ${sizeClass} ${colorClass}
                  prose-headings:text-black prose-headings:dark:text-white
                  prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-black prose-strong:dark:text-white
                  prose-blockquote:border-l-4 prose-blockquote:border-primary
                  prose-blockquote:bg-gray-50 prose-blockquote:dark:bg-gray-800
                  prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
                  prose-ul:list-disc prose-ol:list-decimal prose-li:mb-1
                  prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1 prose-code:rounded
                  prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0
                  dark:prose-invert`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

// Main RichText component
const RichText: React.FC<RichTextProps> = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <div className="text-center py-8 text-body-color dark:text-body-color-dark italic">
        No content available.
      </div>
    );
  }

  const renderBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'richText':
        return (
          <div key={index} className="mb-8 rich-text-block">
            <RichTextBlock 
              content={block.content}
              fontFamily={block.fontFamily}
              fontSize={block.fontSize}
              textColor={block.textColor}
            />
          </div>
        );

      case 'code':
        return (
          <CodeBlock 
            key={index}
            code={block.code || ''}
            language={block.language}
          />
        );

      case 'richTable':
        return (
          <div key={index} className="mb-8">
            {block.tableTitle && (
              <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                {block.tableTitle.replace(/"/g, '')}
              </h4>
            )}
            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full border-collapse bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    {block.headers?.map((header: any, headerIndex: number) => (
                      <th
                        key={headerIndex}
                        className="px-6 py-4 text-left font-semibold bg-primary text-white border-b border-gray-300 dark:border-gray-600"
                      >
                        {header.text ? header.text.replace(/"/g, '') : `Header ${headerIndex + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows?.map((row: any, rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className={block.stripedRows && rowIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
                    >
                      {row.cells?.map((cell: any, cellIndex: number) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 text-body-color dark:text-body-color-dark"
                          style={{
                            backgroundColor: cell.highlight ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            fontWeight: cell.highlight ? '600' : 'normal',
                          }}
                        >
                          {cell.content ? cell.content.replace(/"/g, '') : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'kanbanBoard':
        return (
          <div key={index} className="mb-8">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-6">
              {block.title || 'Project Board'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {block.columns?.map((column: any, columnIndex: number) => (
                <div key={columnIndex} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <h5 className="font-semibold text-black dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {column.columnTitle}
                  </h5>
                  <div className="space-y-3">
                    {column.cards?.map((card: any, cardIndex: number) => (
                      <div
                        key={cardIndex}
                        className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border-l-4"
                        style={{
                          borderLeftColor: 
                            card.status === 'done' ? '#10B981' :
                            card.status === 'in-progress' ? '#F59E0B' : '#EF4444'
                        }}
                      >
                        <h6 className="font-medium text-black dark:text-white mb-2">
                          {card.title}
                        </h6>
                        {card.description && (
                          <p className="text-sm text-body-color dark:text-body-color-dark mb-2">
                            {card.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <span 
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{
                              backgroundColor: 
                                card.status === 'done' ? '#10B981' :
                                card.status === 'in-progress' ? '#F59E0B' : '#EF4444'
                            }}
                          >
                            {card.status || 'todo'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div key={index} className="mb-8">
            {block.title && (
              <h4 className="text-xl font-semibold text-black dark:text-white mb-6">
                {block.title}
              </h4>
            )}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>
              
              <div className="space-y-8">
                {block.items?.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className="absolute left-4 mt-2 w-3 h-3 rounded-full bg-primary border-4 border-white dark:border-gray-900 z-10"></div>
                    
                    <div className="ml-12 flex-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-2 sm:mb-0">
                            {item.timeframe}
                          </span>
                        </div>
                        <h5 className="text-lg font-semibold text-black dark:text-white mb-2">
                          {item.title}
                        </h5>
                        {item.description && (
                          <p className="text-body-color dark:text-body-color-dark leading-relaxed mb-4">
                            {item.description}
                          </p>
                        )}
                        {item.actions && item.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.actions.map((action: any, actionIndex: number) => (
                              <span
                                key={actionIndex}
                                className="inline-block bg-gray-100 dark:bg-gray-700 text-body-color dark:text-body-color-dark text-sm px-3 py-1 rounded-full"
                              >
                                {action.action}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'callout':
        const colorStyles = {
          gray: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
          yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        };

        const calloutContent = extractHtmlFromRichText(block.text);

        return (
          <div key={index} className="mb-6">
            <div className={`rounded-lg border-l-4 border-primary p-6 ${colorStyles[block.color as keyof typeof colorStyles] || colorStyles.gray}`}>
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0 mt-1">
                  {block.emoji || '💡'}
                </span>
                <div 
                  className="flex-1 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: calloutContent }}
                />
              </div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div key={index} className="my-8">
            <hr className={
              block.type === 'dashed' 
                ? 'border-t-2 border-dashed border-gray-300 dark:border-gray-600'
                : 'border-t border-gray-200 dark:border-gray-700'
            } />
          </div>
        );

      default:
        console.warn('Unknown block type:', block.blockType, block);
        return null;
    }
  };

  return (
    <div className="rich-text-container space-y-8">
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default RichText;