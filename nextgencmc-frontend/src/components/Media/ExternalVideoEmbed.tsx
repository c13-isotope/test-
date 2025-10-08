import React from 'react'

interface ExternalVideoEmbedProps {
  url: string
  caption?: string
}

const ExternalVideoEmbed: React.FC<ExternalVideoEmbedProps> = ({ url, caption }) => {
  const getEmbedUrl = (url: string): { embedUrl: string; type: string } | null => {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return {
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
        type: 'youtube'
      }
    }

    // Vimeo patterns
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return {
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
        type: 'vimeo'
      }
    }

    // Twitter patterns
    const twitterRegex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
    const twitterMatch = url.match(twitterRegex)
    if (twitterMatch) {
      return {
        embedUrl: url,
        type: 'twitter'
      }
    }

    return null
  }

  const embedData = getEmbedUrl(url)

  if (!embedData) {
    return (
      <div className="my-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-body-color">
          Unsupported video URL. Please use YouTube, Vimeo, or Twitter links.
        </p>
      </div>
    )
  }

  if (embedData.type === 'twitter') {
    // Twitter embed requires special handling
    return (
      <div className="my-6 max-w-2xl mx-auto">
        <blockquote className="twitter-tweet">
          <a href={url}>View Tweet</a>
        </blockquote>
        {caption && (
          <p className="text-sm text-body-color mt-2 text-center">{caption}</p>
        )}
      </div>
    )
  }

  return (
    <div className="my-6 w-full max-w-4xl mx-auto">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={embedData.embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={caption || 'Embedded video'}
        />
      </div>
      {caption && (
        <p className="text-sm text-body-color mt-3 text-center">{caption}</p>
      )}
    </div>
  )
}

export default ExternalVideoEmbed
