
export const handleSocialPress = (username: string, navigation: any, numFollowers: number , numFollowing: number, screen: 'Followers' | 'Following') => {

    if (screen === 'Followers') {
        navigation.navigate('followerFollowing',
        {
            
            params: {
                screen: 'Followers',
                profileUsername: username,
                following: numFollowing,
                followers: numFollowers,
                params: {
                    profileUsername: username,
                    following: numFollowing,
                    followers: numFollowers,}
            }
        }
        );
    }

    if (screen === 'Following') {
        navigation.navigate('followerFollowing',
            {
                params: {
                    screen: 'Following',
                    profileUsername: username,
                    following: numFollowing,
                    followers: numFollowers,
                    params: {
                        profileUsername: username,
                        following: numFollowing,
                        followers: numFollowers,}
                }
            }
        );
    }

}
