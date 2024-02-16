import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ConnectedLeaderboard } from '../components/leaderboard/ConnectedLeaderboard';
import { Profile } from '../components/profile/Profile';


export const LeaderboardStack = () => {
    const LeaderboardStackNav = createStackNavigator();

    return (
        <LeaderboardStackNav.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'black'} }} >
            <LeaderboardStackNav.Screen name="search" component={ConnectedLeaderboard} />
            <LeaderboardStackNav.Screen name="profile" component={Profile}  />
        </LeaderboardStackNav.Navigator>
  );
};
