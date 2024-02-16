import { useThemeContext } from '@context/theme/useThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Keyboard,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSearchBarStyles } from './SearchBar.styles';
export interface SearchBarProps {
	onSearchChange: (text: string | undefined) => Promise<void>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
	const [isFocused, setIsFocused] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [isLoading, setLoading] = useState(false);

	const route = useRoute();
	const profileUsername = route.params?.profileUsername;
	const relationship = route.params?.relationship;

	useEffect(() => {
		// if routed from another screen set prepoulated search text
		console.log('insearch profileUsername', profileUsername);
		console.log('inSSearch relationship', relationship);
		if (profileUsername && relationship) {
			const type =
				relationship === 'followers' ? 'motivators' : 'motivating';
			setSearchText(`@${profileUsername}:${type}`);
		} else {
			setSearchText('');
		}
	}, [profileUsername, relationship]);

	const styles = useSearchBarStyles();

	const { theme } = useThemeContext();
	const iconInitialX = 5;

	const iconX = useSharedValue(iconInitialX);

	// Animated style for the icon that responds to focus changes
	const animatedIconStyle = useAnimatedStyle(() => {
		return {
			// Use absolute positioning to move the icon
			position: 'absolute',
			// Use the shared value for the horizontal position
			left: iconX.value,
		};
	});

	const handleFocus = () => {
		setIsFocused(true);
		// Move the icon to the left when focused
		iconX.value = withTiming(-25, {
			duration: 300,
			easing: Easing.out(Easing.quad),
		});
	};

	const handleBlur = () => {
		setIsFocused(false);
		if (!searchText) {
			// Return the icon to the original position when there is no text
			iconX.value = withTiming(iconInitialX, {
				duration: 300,
				easing: Easing.out(Easing.quad),
			});
		}
	};

	const handleSearchChange = async (text: string) => {
		setLoading(true);
		setSearchText(text);
		await onSearchChange(text);
		setLoading(false);
	};

	const handleCancel = () => {
		setSearchText('');
		setIsFocused(false);
		Keyboard.dismiss();
		onSearchChange('');
		iconX.value = withTiming(0, {
			duration: 300,
			easing: Easing.out(Easing.quad),
		}); // Reset icon position
	};

	return (
		<TouchableWithoutFeedback onPress={handleBlur}>
			<View style={styles.outerContainer}>
				<Animated.View
					style={[
						styles.container,
						isFocused && styles.focusedContainer,
					]}>
					<Animated.View
						style={[styles.iconContainer, animatedIconStyle]}>
						<FontAwesome
							name='search'
							size={20}
							color={theme.grayShades.gray500}
						/>
					</Animated.View>
					<TextInput
						placeholder='Search users by name'
						placeholderTextColor={theme.grayShades.gray500}
						style={styles.inputStyle}
						onChangeText={handleSearchChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						value={searchText}
						clearButtonMode='never'
						keyboardAppearance='dark'
					/>
					{isLoading && (
						<ActivityIndicator
							color={theme.grayShades.gray500}
							style={styles.spinnerStyle}
						/>
					)}
					{isFocused && (
						<TouchableOpacity
							onPress={handleCancel}
							style={styles.cancelButton}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					)}
				</Animated.View>
			</View>
		</TouchableWithoutFeedback>
	);
};
