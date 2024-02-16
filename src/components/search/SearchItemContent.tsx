
import React from 'react';
import { Text, View } from 'react-native';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { SearchItemCellProps } from './Search.types';
import { useSearchStyles } from './search.styles';


export const SearchItemContent: React.FC<SearchItemCellProps> = ({ user}) => {

    const searchStyles = useSearchStyles();

    return (
  
        <View style={searchStyles.profile}>
            {/* <View style={{width: 50, height: 50 }} /> */}
            <ConnectedProfileAvatar
                key={user.username}
                username={user.username}
                size={50}
            />
            <View style={searchStyles.profileInfoContainer}>
                <Text style={searchStyles.name}>{user.name}</Text>
                <Text style={searchStyles.username}>@{user.username}</Text>
            </View>
        </View>
    );
}
