'use client'
import React from 'react'

interface ExternalVideoEmbedProps {
  url: string
  title?: string
  className?: string
}

const ExternalVideoEmbed: React.FC<ExternalVideoEmbedProps> = ({ url, title, className = '' }) => {
  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return url
  }

  const embedUrl = getEmbedUrl(url)

  return (
    <div className={`my-6 ${className}`}>
      {title && (
        <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          {title}
        </h4>
      )}
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title || 'Embedded Video'}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  )
}

export default ExternalVideoEmbed
