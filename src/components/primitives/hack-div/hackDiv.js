/**
 *
 * Todo waaaay later:
 * - update to TS
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const HackDiv = ({ color = 'black', opacity = 1 }) => {
	<View
		style={{
			borderBottomColor: color,
			opacity: opacity,
			borderBottomWidth: StyleSheet.hairlineWidth,
			zIndex: 2,
		}}
	/>;
};
