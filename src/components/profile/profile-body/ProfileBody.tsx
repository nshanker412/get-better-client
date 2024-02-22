/**
 * TODO:
 * - move stats container to separate internally driven component (reduce prop spam & unnecessary rerenders)
 */

import { useThemeContext } from '@context/theme/useThemeContext';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useProfileBodyStyles } from './ProfileBody.styles';
import { ProfileBodyProps } from './ProfileBody.types';
import { ConnectedPlanList } from './plan-list/ConnectedPlanList';
import { ConnectedProfilePosts } from './profile-posts/ConnectedProfilePosts';
import { ConnectedStatsList } from './stats-list/ConnectedStatsList';

const Divider = () => {
	const { theme} = useThemeContext();
	return (
		<View style={{padding: 5}} >
		<View style={{
			width: "100%",
			alignSelf: "center",
			backgroundColor: 'white',
			opacity: 1, 
			height: StyleSheet.hairlineWidth,

		}} />
		</View>
	);
  };


export const ProfileBody: React.FC<ProfileBodyProps> = ({ isMyProfile }) => {
	const profileBodyStyles = useProfileBodyStyles();

	/**
	 * TODO: Add shimmer when loading
	 */

	return (
		<View style={profileBodyStyles.container}>
	
			<View style={{ width: Dimensions.get("screen").width, height: "100%", }}>
			<Divider/>

				<View style={[profileBodyStyles.statsCategoryColumn, {flex: 5}]}>
					<View style={profileBodyStyles.statsContainer}>
						<ConnectedStatsList isMyProfile={isMyProfile} />
					</View>
					<View style={profileBodyStyles.categoryContainer}>
						<ConnectedPlanList isMyProfile={isMyProfile} />
					</View>
				</View>
				<Divider/>

				<View style={[profileBodyStyles.postsColumn, {flex: 26 , }]}>
					<View style={profileBodyStyles.scrollInnerContainer}>
					<ConnectedProfilePosts isMyProfile={isMyProfile}
					
					/>
					</View>
				</View>
			</View>
		</View>
	);
};
