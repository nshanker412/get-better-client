
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { TabActions, useNavigation } from "@react-navigation/native";
import * as Haptics from 'expo-haptics';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SearchItemCellProps } from './Search.types';
import { SearchItemContent } from './SearchItemContent';


export const SearchItemCell: React.FC<SearchItemCellProps> = ({ user }) => {
    const navigation = useNavigation();

    const { username: myUsername } = useMyUserInfo();   


    const onPressProfile = (username: string) => {
		if (!username) return;
		if (username === myUsername) {
			navigation.dispatch(TabActions.jumpTo('profileTab'));
		}

        navigation.navigate('profile', {
                profileUsername: username,
                prev_screen_name:"search",
            });
        };

    return (
        <TouchableOpacity
            onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onPress={() => onPressProfile(user.username)}>
        <SearchItemContent user={user} />
    </TouchableOpacity>
    );
}

