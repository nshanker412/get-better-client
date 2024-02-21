// import { BellIconAlert } from '@assets/darkSvg/BellIconAlert.js';
import { BlurView } from 'expo-blur';
import React from 'react';
import { View } from 'react-native';
import { Circle, Path, Svg, Text as SvgText } from 'react-native-svg';
import { LoadingSpinner } from '../../../loading-spinner/LoadingSpinner';
import { NotificationsBellProps } from '../NotificationsDrawer.types';

/**
 * SVG icon for the notifications bell
 * shows a red circle with notification count in it if there are new notifications
 * @returns
 */
const BellIconAlert = ({ number = 0, width = 50, height = 54 }) => {
	const showNotification = number >= 1;

	const displayNumber = number <= 9 ? number : '9+';

	return (
		<Svg
			width={width}
			height={height}
			viewBox='0 0 30 34'
			fill='none'
		>
			<Path
				d='M14.2856 3.45898C10.3517 3.45898 7.15464 6.65603 7.15464 10.5899V14.0247C7.15464 14.7496 6.84563 15.8549 6.4772 16.473L5.11043 18.743C4.2666 20.1454 4.84896 21.7023 6.394 22.2253C11.5164 23.9367 17.0429 23.9367 22.1653 22.2253C23.6034 21.7499 24.2333 20.0503 23.4489 18.743L22.0821 16.473C21.7256 15.8549 21.4166 14.7496 21.4166 14.0247V10.5899C21.4166 6.66791 18.2076 3.45898 14.2856 3.45898Z'
				stroke='white'
				strokeWidth='1.78274'
				strokeLinecap='round'
			/>
			<Path
				d='M16.4843 3.80316C16.1159 3.6962 15.7356 3.613 15.3434 3.56547C14.2024 3.42285 13.109 3.50604 12.0869 3.80316C12.4316 2.92368 13.2873 2.30566 14.2856 2.30566C15.284 2.30566 16.1397 2.92368 16.4843 3.80316Z'
				stroke='white'
				strokeWidth='1.78274'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<Path
				d='M17.8511 22.6533C17.8511 24.6143 16.2467 26.2188 14.2857 26.2188C13.3111 26.2188 12.4078 25.8147 11.7661 25.1729C11.1243 24.5311 10.7202 23.6279 10.7202 22.6533'
				stroke='white'
				strokeWidth='1.78274'
			/>

			{showNotification && (
				<>
				<Circle
					cx='22.5'
					cy='8'
					r='7.5'
					fill='#FF0000'
				/>
		
				<SvgText
					x='22.5'
					y='8'
					textAnchor='middle'
					alignmentBaseline='middle'
					fill='white'
					fontSize='11'
					fontWeight='bold'>
					{displayNumber}
					</SvgText>
					</>
			)}
		</Svg>
	);
};



export const NotificationsBell: React.FC<NotificationsBellProps> = ({ unreadNum, loading }) => {


	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<View style={{ zIndex: 1, shadowColor:"#000", shadowOffset: {width: -2, height: 2}, shadowRadius: 2, shadowOpacity: 0.65 }}>
		<BlurView
			tint='dark'
			intensity={80}
			style={{
				position: 'absolute',
				right: 15,
				top: 56,
				alignItems: 'flex-end',
				justifyContent: 'center',
				zIndex: 1,
			}}/>
		
		<BellIconAlert
			number={unreadNum}
			height={40}
			width={40}
			/>
</View>
				);
};
