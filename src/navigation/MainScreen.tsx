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
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LeaderboardStack } from './LeaderboardStack';
import { MyProfileStack } from './MyProfileStack';
import { SearchStack } from './SearchStack';

const HomeTabIcon = ({ focused }) => {
	return (
	  <View style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'flex-end', height: "100%" }}>
		{focused && (
		  <View style={{
			width: '100%',
			height: 3,
			borderRadius: 2,
			backgroundColor: 'white',
			position: 'absolute',
			top: 0,
		  }} />
		)}
		<TouchableOpacity onPress={() => {
		  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}}>
				<SvgXml
					
			  xml={HI}
			  width={30}
			  height={30}
			  fill={focused ? 'white' : 'none'}
			/>
		</TouchableOpacity>
	  </View>
	);
  };
  

const SearchTabIcon = ({ focused }) => {
	return (
		<View style={{ alignItems: 'center', justifyContent: 'flex-end', height: "100%"}}>
		{focused && (
		  <View style={{
			width: '100%',
					height: 3,
			borderRadius: 2,
			backgroundColor: 'white',
					position: 'absolute',
			top: 0,
		  }} />
		)}
		<TouchableOpacity onPress={() => {
		  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			}}>
				
				<SvgXml
					style={{ marginBottom: -2 }}
					xml={SearchIcon}
					width={40}
					height={40}
					fill={focused ? 'white' : 'none'}
					/>
			</TouchableOpacity>
			</View>

	);
};

const PostTabIcon = ({ focused }) => {
	return (
		
		<TouchableOpacity
			activeOpacity={0.9}

			onPress={() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		  }}>			
		  <SvgXml
				style={{ marginTop: -20 }}
				xml={PostIcon}
				width={60}
				height={60}

			/>
			
		</TouchableOpacity>
	);
};

const RankingTabIcon = ({ focused }) => {
	return (
		<View style={{ alignItems: 'center', justifyContent: 'flex-end', height: "100%" }}>
		{focused && (
		  <View style={{
			width: '100%',
					height: 3,
			borderRadius: 2,
			backgroundColor: 'white',
			position: 'absolute',
			top: 0,
		  }} />
		)}
			<TouchableOpacity style={{paddingTop: 10}} onPress={() => {
		  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			}}>
				<SvgXml
					xml={RankingIcon}
					width={35}
					height={35}
					fill={focused ? 'white' : 'none'}
				/>
			</TouchableOpacity>
			</View>
	);
};

const ProfileTabIcon = ({ focused }) => {
	return (
		<View style={{ alignItems: 'center', justifyContent: 'flex-end', height: "100%" }}>
		{focused && (
		  <View style={{
			width: '100%',
			height: 3,
			borderRadius: 2,
			backgroundColor: 'white',
			position: 'absolute',
			top: 0,
		  }} />
		)}
			<TouchableOpacity
				onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			}}>
				<SvgXml
				xml={ProfileIcon}
				width={35}
				height={35}
				fill={focused ? 'white' : 'none'}
			/>
			</TouchableOpacity>
			</View>	
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
				hiddenTabBar={true} 
			screenOptions={{
				tabBarTestID: 'bottom-tab-navigator-testid',
				headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: tabBarStyles.safeArea,
				// tabBarBackground: () => (
				// 	<BlurView
				// 		tint='dark'
				// 		intensity={25}
				// 		style={{ ...StyleSheet.absoluteFillObject }}
				// 	/>
				// ),
				
			}}>
			<Tab.Screen
				name='hometab'
				component={HomeStack}
				options={{
					tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
				}}
			/>
			<Tab.Screen
				name='searchtab'
				component={SearchStack}
				options={{
					tabBarIcon: ({ focused }) => <SearchTabIcon focused={focused} />,
				}}
			/>
			<Tab.Screen
				name='post'
				component={CreatePost}
					options={{
						tabBarIcon: ({ focused }) => <PostTabIcon focused={focused} />
					}}
			/>
			<Tab.Screen
				name='leaderboard'
				component={LeaderboardStack}
				options={{
					tabBarIcon: ({ focused }) => <RankingTabIcon focused={focused} />,
					}}
				/>
			<Tab.Screen
				name='profileTab'
				component={MyProfileStack}
				options={{ tabBarIcon: ProfileTabIcon , headerShown: false, footerShown: false}}
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
			borderColor: 'transparent',
			borderWidth: 1,

			// borderWidth: 1, 
			// flex: 1,
			// height: 80,
			// borderColor: 'transparent',
			// paddingTop: 20,
			alignContent: 'center',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.15)',
			backfaceVisibility: 'hidden',
			shadowColor: '#000',
		},
		divbar: {
			color: theme.div.color,
			opacity: theme.div.opacity,
		},
		footerContainer: {
			// borderTopWidth: 1,
			// borderTopColor: theme.innerBorderColor,
			// backgroundColor: 'transparent',
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
