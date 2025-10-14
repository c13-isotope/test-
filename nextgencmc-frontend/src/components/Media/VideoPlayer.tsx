'use client'
import React, { useState, useRef, useEffect } from 'react'

interface VideoPlayerProps {
  src: string
  title?: string
  poster?: string
  className?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, poster, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setVideoData = () => {
      setDuration(video.duration)
      setCurrentTime(video.currentTime)
    }

    const setVideoTime = () => setCurrentTime(video.currentTime)

    video.addEventListener('loadeddata', setVideoData)
    video.addEventListener('timeupdate', setVideoTime)

    return () => {
      video.removeEventListener('loadeddata', setVideoData)
      video.removeEventListener('timeupdate', setVideoTime)
    }
  }, [])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden my-6 ${className}`}>
      {title && (
        <div className="bg-gray-900 text-white p-3">
          <h4 className="text-lg font-semibold">{title}</h4>
        </div>
      )}

      <div 
        className="relative group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-auto"
          onClick={togglePlayPause}
          preload="metadata"
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-4 transition-all"
            >
              <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        )}

        {/* Controls Overlay */}
        {showControls && isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-gray-300"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="flex-grow">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer
