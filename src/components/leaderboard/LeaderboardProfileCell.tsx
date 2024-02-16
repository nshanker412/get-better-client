import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { Pressable } from 'react-native';
import { LeaderboardItem } from './LeaderboardItem';
import { LeaderboardProfile } from './models/LeaderboardProfile';

interface LeaderboardProfileCell {
    item: LeaderboardProfile;
    index: number;
}



export const LeaderboardProfileCell: React.FC<LeaderboardProfileCell> = ({item, index}) => {

    const navigation = useNavigation();
    

    const onPressProfile = () => {
        console.log('onPressProfile', item.username);
        navigation.navigate('profile', { profileUsername: item.username });
    }

    return (
        <Pressable
            onPress={onPressProfile}
        >
            <LeaderboardItem  user={item} index={index}  />
        </Pressable>
      );
}
