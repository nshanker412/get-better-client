import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Leaderboard } from '../components/leaderboard/Leaderboard';
import { Profile } from '../components/profile/Profile';


export const LeaderboardStack = () => {
    const LeaderboardStackNav = createStackNavigator();

    return (
        <LeaderboardStackNav.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'black'} }} >
            <LeaderboardStackNav.Screen name="search" component={Leaderboard} />
            <LeaderboardStackNav.Screen name="profile" component={Profile}  />
        </LeaderboardStackNav.Navigator>
  );
};
