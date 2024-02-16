import React from 'react';
import { Text, View } from 'react-native';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useLeaderboardStyles } from './Leaderboard.styles';
import { LeaderboardProfile, LeaderboardProfileChallenges, LeaderboardProfileConsistency } from './models/LeaderboardProfile';
import { LeaderboardProfileType } from './models/LeaderboardProfile.type';



interface ConsistencyProfileProps {
    user: LeaderboardProfileConsistency;
    index: number;
}

const _ConsistencyProfile: React.FC<ConsistencyProfileProps> = ({user, index}) => {
    const leaderboardStyles = useLeaderboardStyles();

    return (
        <View style={leaderboardStyles.profile}>
            <View style={leaderboardStyles.rankContainer}>
                <Text style={leaderboardStyles.rankText}>{index + 1}.</Text>
            </View>
            <View style={leaderboardStyles.profileContainer}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <ConnectedProfileAvatar key={user.username}  username={user.username} size={50} />
    
                </View>
                <View style={leaderboardStyles.profileInfoContainer}>
                    <Text style={leaderboardStyles.name}>{user.name}</Text>
                    <Text style={leaderboardStyles.username}>@{user.username}</Text>
                </View>
            </View>
            <View style={leaderboardStyles.metricContainer}>
                <Text style={leaderboardStyles.metricText}>
                    {user.consistency ? `${user.consistency}%` :  "-"}
                </Text>
            </View>
        </View>
    );
}


interface ChallengesProfileProps {
    user: LeaderboardProfileChallenges;
    index: number;
}


const _ChallengesProfile: React.FC<ChallengesProfileProps> = ({user, index}) => {
    const leaderboardStyles = useLeaderboardStyles();

    return (
        <View style={leaderboardStyles.profile}>
        <View style={leaderboardStyles.rankContainer}>
            <Text style={leaderboardStyles.rankText}>{index + 1}.</Text>
        </View>
        <View style={leaderboardStyles.profileContainer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ConnectedProfileAvatar key={user.username}  username={user.username} size={50} />

            </View>
            <View style={leaderboardStyles.profileInfoContainer}>
                <Text style={leaderboardStyles.name}>{user.name}</Text>
                <Text style={leaderboardStyles.username}>@{user.username}</Text>
            </View>
        </View>
        <View style={leaderboardStyles.metricContainer}>
            <Text style={leaderboardStyles.metricText}>
                {user.challengesComplete }
            </Text>
        </View>
    </View>
    );
}



interface LeaderboardItemProps {
    user: LeaderboardProfile,
    index: number;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ user, index }) => {

    console.log('LeaderboardItem', user);
    

    switch (user.type) {
        case LeaderboardProfileType.CONSISTENCY:
            return <_ConsistencyProfile user={user} index={index} />;
        case LeaderboardProfileType.CHALLENGES:
            return <_ChallengesProfile user={user} index={index} />;
    }
	  
}