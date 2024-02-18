import axios from 'axios';
import { useEffect, useState } from 'react';

interface ImageSource {
    uri: string;
}

interface ProfilePicHookReturn {
    profileImage: ImageSource | null;
    hasProfileImage: boolean;
}

// Cache object for storing ImageSource based on username and fetchSize
const profileImageCache: Record<string, ImageSource> = {};

const useProfileImage = (username: string, fetchSize: number): ProfilePicHookReturn => {
    const cacheKey = `${username}-${fetchSize}`;
    const [profileImage, setProfileImage] = useState<ImageSource | null>(profileImageCache[cacheKey]);
    const [hasProfileImage, setHasProfileImage] = useState<boolean>(true);

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (profileImageCache[cacheKey]) {
                // Use cached image if available
                setProfileImage(profileImageCache[cacheKey]);
                return;
            }

            try {
                const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/${username}/profile/${fetchSize}/${fetchSize}`);
                const image = response.data.image;
                const imageSource: ImageSource = { uri: `data:image/jpeg;base64,${image}` };
                
                // Update state and cache
                setProfileImage(imageSource);
                profileImageCache[cacheKey] = imageSource;
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    // Check for 404 status and specific error message
                    if (error.response?.status === 404 && error.response.data === `No image exists at ${username}_profile`) {
                        console.log(`No profile image set for ${username}.`);
                        setHasProfileImage(false);
                        // Optionally, you can also clear the profile image state
                        setProfileImage(null);
                    } else {
                        console.error(`Error fetching profile image for ${username}:`, error.response?.data || error.message);
                        setHasProfileImage(false);
                    }
                } else {
                    // Handle non-Axios errors
                    console.error(`Error fetching profile image for ${username}:`, error);
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
