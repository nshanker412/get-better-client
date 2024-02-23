/**
 * TODO:
 * - move stats container to separate internally driven component (reduce prop spam & unnecessary rerenders)
 */

import { useThemeContext } from '@context/theme/useThemeContext';
import React from 'react';
import { View } from 'react-native';
import { useProfileBodyStyles } from './ProfileBody.styles';
import { ProfileBodyProps } from './ProfileBody.types';
import { ConnectedPlanList } from './plan-list/ConnectedPlanList';
import { ConnectedProfilePosts } from './profile-posts/ConnectedProfilePosts';
import { ConnectedStatsList } from './stats-list/ConnectedStatsList';

const Divider = () => {
	const { theme} = useThemeContext();
	return (
		<View style={{padding: 1}} >
		<View style={{
			width: "100%",
			alignSelf: "center",
			backgroundColor: 'white',
			opacity: 0.2, 
			// height: StyleSheet.hairlineWidth,
			height: 1,
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
					<ConnectedProfilePosts isMyProfile={isMyProfile}/>
					</View>
				</View>
			</View>
	);
};
