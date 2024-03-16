import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Button } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';
import { LGColor, LGdirection, getLinearGradientProps } from './utils/getLinearGradient';

interface ButtonAsyncProps {
	loading: boolean;
	title: string;
    onPress: () => void;
    disabled?: boolean; 
    isPrimary?: boolean;
    buttonStyle?: any;
    gradientDirection?: LGdirection;
	textStyle?: any;
    containerStyle?: any;
    type?: 'solid' | 'clear' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    gradientColor?: LGColor;

}

export const ButtonAsync: React.FC<ButtonAsyncProps> = ({
	loading, 
    title,
    disabled = false,
    type,
    buttonStyle,
    textStyle,
    isPrimary=true,
    containerStyle,
    gradientDirection = "diagonalTR",

    gradientColor='blue',
    size="md",
	onPress
}) => {
    const lgProps = getLinearGradientProps(gradientColor, isPrimary, gradientDirection);

 


	return (
        <Button 
            ViewComponent={LinearGradient}
            linearGradientProps={lgProps}
            containerStyle={containerStyle ?? style.containerStyle}
            buttonStyle={buttonStyle ?? style.button}
            disabled={disabled}
            disabledStyle={style.disabledButton}
			titleStyle={textStyle ?? style.textStyle}
			loading={loading}
            onPress={onPress}
            type={type ?? 'solid'}
            size={size}
            radius={10}
			title={title}
			/>
	)
}
export default ButtonAsync;


// export interface ButtonProps extends TouchableOpacityProps, TouchableNativeFeedbackProps {
//     title?: string | React.ReactElement<{}>;
//     titleStyle?: StyleProp<TextStyle>;
//     titleProps?: TextProps;
//     buttonStyle?: StyleProp<ViewStyle>;
//     type?: 'solid' | 'clear' | 'outline';
//     loading?: boolean;
//     loadingStyle?: StyleProp<ViewStyle>;
//     loadingProps?: ActivityIndicatorProps;
//     containerStyle?: StyleProp<ViewStyle>;
//     icon?: IconNode;
//     iconContainerStyle?: StyleProp<ViewStyle>;
//     iconRight?: boolean;
//     linearGradientProps?: object;
//     TouchableComponent?: typeof React.Component;
//     ViewComponent?: typeof React.Component;
//     disabled?: boolean;
//     disabledStyle?: StyleProp<ViewStyle>;
//     disabledTitleStyle?: StyleProp<TextStyle>;
//     raised?: boolean;
//     iconPosition?: 'left' | 'right' | 'top' | 'bottom';
//     uppercase?: boolean;
//     radius?: number | StringOmit<keyof ThemeSpacing>;
//     size?: 'sm' | 'md' | 'lg';
//     color?: StringOmit<'primary' | 'secondary' | 'success' | 'error' | 'warning'>;
// }

const style = StyleSheet.create({	
    button: {
        alignItems: 'center',
        justifyContent: 'center',
		borderRadius: 10,
		padding: 10,
		color: grayDark.gray12,
        backgroundColor: 'transparent',
        

    },
    disabledButton: {
		borderRadius: 10,
		padding: 10,
		color: grayDark.gray12,
		backgroundColor: grayDark.gray3,
	},
    textStyle: {
       
        backgroundColor: 'transparent',
		fontSize: 16,
		fontFamily: fonts.inter.black,
		color: grayDark.gray12,
	},
    containerStyle: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
		flex: 1,
    },
});
