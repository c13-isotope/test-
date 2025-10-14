// src/utils/imageHelpers.js

export function getImageUrl(featuredImage) {
    if (!featuredImage) return null;
    return `${process.env.NEXT_PUBLIC_API_URL}/media/${featuredImage}`;
  }
  
  export function getImageAlt(featuredImage, title) {
    return featuredImage?.alt || title || "Image";
  }
  