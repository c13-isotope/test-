import { getImageUrl, getImageAlt } from '@/utils/imageHelpers';

const imageUrl = getImageUrl(post.featuredImage);
return imageUrl ? (
  <div className="mb-10">
    <img
      src={imageUrl}
      alt={getImageAlt(post.featuredImage, post.title)}
      className="w-full rounded-lg object-cover shadow-md"
    />
  </div>
) : null;
