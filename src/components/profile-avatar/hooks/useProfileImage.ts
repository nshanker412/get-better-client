import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface ImageSource {
  uri: string;
}

interface ProfilePicHookReturn {
  profileImage: ImageSource | null;
  hasProfileImage: boolean;
}

interface ApiResponse {
  image: string;
}

const profileImageCache: Record<string, ImageSource> = {};

const useProfileImage = (username: string, fetchSize: number): ProfilePicHookReturn => {
  const cacheKey = `${username}-${fetchSize}`;
  const [profileImage, setProfileImage] = useState<ImageSource | null>(profileImageCache[cacheKey]);
  const [hasProfileImage, setHasProfileImage] = useState<boolean>(!!profileImage);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (profileImageCache[cacheKey]) {
        setProfileImage(profileImageCache[cacheKey]);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/${username}/profile/${fetchSize}/${fetchSize}`);
        const imageSource: ImageSource = { uri: `data:image/jpeg;base64,${response.data.image}` };
        setProfileImage(imageSource);
        profileImageCache[cacheKey] = imageSource;
        setHasProfileImage(true);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 404) {
          setHasProfileImage(false);
          setProfileImage(null);
        } else {
          console.log(`Error fetching profile image for ${username}: ${axiosError.message}`);
          setHasProfileImage(false);
        }
      }
    };

    if (!profileImage) {
      fetchProfileImage();
    }
  }, [username, fetchSize, cacheKey, profileImage]);

  return { profileImage, hasProfileImage };
};

export default useProfileImage;
