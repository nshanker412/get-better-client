import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardVisibility = () => {
	const [isKeyboardVisible, setKeyboardVisibility] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisibility(true);
			},
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisibility(false);
			},
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return isKeyboardVisible;
};
