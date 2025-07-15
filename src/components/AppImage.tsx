import React from 'react';
import NextImage, { ImageProps } from 'next/image';

interface AppImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt?: string;
  className?: string;
}

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc("/assets/images/no_image.png")}
      {...props}
    />
  );
};

export default AppImage; 