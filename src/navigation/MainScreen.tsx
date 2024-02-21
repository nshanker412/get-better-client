import React from 'react';

import { SvgXml } from 'react-native-svg';
import CreatePost from '../components/createPost/createPost';
import { HomeStack } from './HomeStack';

import { HomeIcon as HI } from '@assets/darkSvg/HomeIcon.js';
import { PostIcon } from '@assets/darkSvg/PostIcon.js';
import { ProfileIcon } from '@assets/darkSvg/ProfileIcon.js';
import { RankingIcon } from '@assets/darkSvg/RankingIcon.js';
import { SearchIcon } from '@assets/darkSvg/SearchIcon.js';
import { CommentDrawerProvider } from '@context/comment-drawer/CommentDrawerContext';
import { useThemeContext } from '@context/theme/useThemeContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LeaderboardStack } from './LeaderboardStack';
import { MyProfileStack } from './MyProfileStack';
import { SearchStack } from './SearchStack';

const HomeTabIcon = () => {
	return (
		<TouchableOpacity>
			<SvgXml
				xml={HI}
				width={30}
				height={30}
			/>
		</TouchableOpacity>
	);
};

const SearchTabIcon = () => {
	return (
		<TouchableOpacity>
			<SvgXml
				xml={SearchIcon}
				width={40}
				height={40}
			/>
		</TouchableOpacity>
	);
};

const PostTabIcon = () => {
	return (
		<TouchableOpacity>
			<SvgXml
				style={{ marginTop: -20 }}
				xml={PostIcon}
				width={65}
				height={65}
			/>
		</TouchableOpacity>
	);
};

const RankingTabIcon = () => {
	return (
		<TouchableOpacity>
			<SvgXml
				xml={RankingIcon}
				width={35}
				height={35}
			/>
		</TouchableOpacity>
	);
};

const ProfileTabIcon = () => {
	return (
		<TouchableOpacity>
			<SvgXml
				xml={ProfileIcon}
				width={35}
				height={35}
			/>
		</TouchableOpacity>
	);
};

export function MainScreen() {
	const Tab = createBottomTabNavigator();
	const tabBarStyles = useFooterStyles();

	return (
		<CommentDrawerProvider>
		<Tab.Navigator
			id='bottom-tab-navigator'
			initialRouteName='hometab'
			screenOptions={{
				tabBarTestID: 'bottom-tab-navigator-testid',
				headerShown: false,
				tabBarLabel: '',
				tabBarStyle: tabBarStyles.safeArea,
				tabBarBackground: () => (
					<BlurView
						tint='dark'
						intensity={10}
						style={{ ...StyleSheet.absoluteFillObject }}
					/>
				),
			}}>
			<Tab.Screen
				name='hometab'
				component={HomeStack}
				options={{ tabBarIcon: HomeTabIcon }}
			/>
			<Tab.Screen
				name='searchtab'
				component={SearchStack}
				options={{ tabBarIcon: SearchTabIcon }}
			/>
			<Tab.Screen
				name='post'
				component={CreatePost}
				options={{ tabBarIcon: PostTabIcon }}
			/>
			<Tab.Screen
				name='leaderboard'
				component={LeaderboardStack}
				options={{ tabBarIcon: RankingTabIcon }}
			/>
			<Tab.Screen
				name='profileTab'
				component={MyProfileStack}
				options={{ tabBarIcon: ProfileTabIcon }}
			/>
		</Tab.Navigator>
		</CommentDrawerProvider>
	);
}

export const useFooterStyles = () => {
	const { theme } = useThemeContext();

	const footerStyles = StyleSheet.create({
		safeArea: {
			position: 'absolute',
			borderWidth: 0,
			borderColor: 'transparent',
			paddingTop: 20,
			alignContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.15)',
			backfaceVisibility: 'hidden',
			shadowColor: '#000',
		},
		divbar: {
			color: theme.div.color,
			opacity: theme.div.opacity,
		},
		footerContainer: {
			borderTopWidth: 1,
			borderTopColor: theme.innerBorderColor,
			backgroundColor: 'transparent',
		},

		footerInnerContainer: {
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			alignContent: 'stretch',
			backgroundColor: 'transparent',
		},

		footerIcon: {
			height: 30,
			width: 30,
		},

		leaderboardIcon: {
			height: 35,
			width: 35,
		},

		gbIcon: {
			height: 35,
			width: 35,
		},

		postIconContainer: {
			height: 48,
			width: 48,
		},
		iconBox: {
			height: 40,
			width: 40,
			justifyContent: 'center',
			alignSelf: 'center',
			alignItems: 'center',
		},
		iconListContianer: {
			flex: 1,
		},
		listItem: {
			borderRadius: 5,
			alignSelf: 'baseline',
		},
	});

	return footerStyles;
};
