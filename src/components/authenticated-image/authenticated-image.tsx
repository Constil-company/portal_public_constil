import React, { useEffect, useState } from 'react';
import { getTokens } from '../../constants/storage/functions';

interface AuthenticatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: string;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({ url, ...imgProps }) => {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | undefined;

    const fetchImage = async () => {
      try {
        const token = getTokens();
        if (!token?.accessToken) {
          return;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) setSrc(objectUrl);
      } catch {
        if (isMounted) setSrc(undefined);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return <img src={src} {...imgProps} />;
};

export default AuthenticatedImage;
