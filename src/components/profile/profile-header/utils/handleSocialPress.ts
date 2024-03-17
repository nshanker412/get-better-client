
export const handleSocialPress = (username: string, navigation: any, numFollowers: number , numFollowing: number, screen: 'Followers' | 'Following') => {

    if (screen === 'Followers') {
        navigation.navigate('profileTab',
            {
                screen: 'followerFollowing', params: {
                    screen: 'Followers',
                    following: numFollowing,
                    followers: numFollowers,
                    params: {
                        profileUsername: username,
                        following: numFollowing,
                        followers: numFollowers,
                    }
               
                }
            }
        );
    }

    if (screen === 'Following') {
        navigation.navigate('profileTab',
            {
                screen: 'followerFollowing',
                params: {
                    screen: 'Following',
                    following: numFollowing,
                    followers: numFollowers,
                    params: {
                        // profileUsername: username,

                        profileUsername: username,
                        following: numFollowing,
                        followers: numFollowers,
                    }
                }
            }
        );
    }

}