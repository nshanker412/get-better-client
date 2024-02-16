/**
 * TODO:
 * - move stats container to separate internally driven component (reduce prop spam & unnecessary rerenders)
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useProfileBodyStyles } from './ProfileBody.styles';
import { ProfileBodyProps } from './ProfileBody.types';
import { ConnectedPlanList } from './plan-list/ConnectedPlanList';
import { ConnectedProfilePosts } from './profile-posts/ConnectedProfilePosts';
import { ConnectedStatsList } from './stats-list/ConnectedStatsList';

export const ProfileBody: React.FC<ProfileBodyProps> = ({ isMyProfile }) => {
	const profileBodyStyles = useProfileBodyStyles();

	/**
	 * TODO: Add shimmer when loading
	 */

	return (
		<View style={profileBodyStyles.container}>
			<View style={{ flexDirection: 'row' }}>
				<Text style={profileBodyStyles.labelText}>Stats / Plans</Text>
				<Text style={profileBodyStyles.labelText}>Dailys</Text>
			</View>
			<View style={profileBodyStyles.outerContainer}>
				<View style={profileBodyStyles.statsCategoryColumn}>
					<View style={profileBodyStyles.statsContainer}>
						<ConnectedStatsList isMyProfile={isMyProfile} />
					</View>
					<View style={profileBodyStyles.categoryContainer}>
						<ConnectedPlanList isMyProfile={isMyProfile} />
					</View>
				</View>
				<View style={profileBodyStyles.postsColumn}>
					<View style={profileBodyStyles.scrollInnerContainer}>
					<ConnectedProfilePosts isMyProfile={isMyProfile}
					
					/>
					</View>
				</View>
			</View>
		</View>
	);
};
