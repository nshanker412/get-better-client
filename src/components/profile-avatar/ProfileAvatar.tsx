import { ProfileIcon } from '@assets/darkSvg/ProfileIcon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { SvgXml } from 'react-native-svg';
import { useProfileAvatarStyles } from './ProfileAvatar.styles';
import { ProfileAvatarProps } from './ProfileAvatar.types';

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
	username,
	size,
	imgSrc,
	hasProfileImage,
	priority,
	onError,
}) => {
	const { theme } = useThemeContext();
	const opacity = useSharedValue(0);
	const shimmerOpacity = useSharedValue(0.5);

	const onLoadEnd = () => {
		opacity.value = withTiming(1, {
			duration: 800,
			easing: Easing.out(Easing.cubic),
		});
		shimmerOpacity.value = withTiming(0, {
			duration: 800,
			easing: Easing.out(Easing.cubic),
		});
	};

	const animatedImageStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const animatedShimmerStyle = useAnimatedStyle(() => ({
		opacity: shimmerOpacity.value,
	}));

	const profileAvatarStyles = useProfileAvatarStyles();

	return (
		<View
			style={[profileAvatarStyles.container, { borderRadius: size / 2 }]}>
			<LinearGradient
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				colors={[
					theme.grayShades.gray400,
					theme.grayShades.gray500,
					theme.grayShades.gray600,
				]}
				style={{ borderRadius: size / 2 }}>
				{hasProfileImage ? (
					<>
						<Animated.View
							style={[
								{
									position: 'absolute',
									zIndex: 1,
								},
								animatedShimmerStyle,
							]}>
							<ShimmerPlaceholder
								LinearGradient={LinearGradient}
								duration={1000}
								style={{
									borderRadius: size,
									width: size,
									height: size,
								}}
								shimmerColors={[
									theme.grayShades.gray500,
									theme.grayShades.gray600,
									theme.grayShades.gray500,
								]}
							/>
						</Animated.View>
						<Animated.View
							style={[
								{
									borderRadius: size,
									width: size,
									height: size,
								},
								animatedImageStyle,
							]}>
							<Image
								key={username}
								onError={onError}
								onLoadEnd={onLoadEnd}
								recyclingKey={username}
								style={{
									borderRadius: size,
									width: size,
									height: size,
								}}
								source={imgSrc}
								// priority={priority}
								allowDownscaling={false}
							/>
						</Animated.View>
					</>
				) : (
					<SvgXml
						style={{ flex: 1, borderRadius: size }}
						opacity={0.7}
						xml={ProfileIcon}
						width={size}
						height={size}
					/>
				)}
			</LinearGradient>
		</View>
	);
};
