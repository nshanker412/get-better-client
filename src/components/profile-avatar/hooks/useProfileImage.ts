import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '@context/auth/useAuth';
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
  const {userToken} = useAuth();
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (profileImageCache[cacheKey]) {
        setProfileImage(profileImageCache[cacheKey]);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
        );
        if (response.data.profile_picture.includes("s3.amazonaws.com")){
          const imageSource: ImageSource = { uri: `${response.data.profile_picture}` };
          setProfileImage(imageSource);
          profileImageCache[cacheKey] = imageSource;
          setHasProfileImage(true);
        }
        else{
          const imageSource: ImageSource = { uri: `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}${response.data.profile_picture}` };
          setProfileImage(imageSource);
          profileImageCache[cacheKey] = imageSource;
          setHasProfileImage(true);
        }
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
