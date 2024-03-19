import { darkPalette, grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Button } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { LGColor, LGdirection, getLinearGradientProps } from './utils/getLinearGradient';

interface ButtonAsyncProps {
    id?: string;
    icon?:  JSX.Element;
	loading: boolean;
	title: string;
    onPress: () => void;
    disabled?: boolean; 
    isPrimary?: boolean;
    hasLG?: boolean; 
    buttonStyle?: any;
    loadingStyle?: any;
    iconContainerStyle?: any;
    gradientDirection?: LGdirection;
	textStyle?: any;
    containerStyle?: any;
    type?: 'solid' | 'clear' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    iconPosition?: 'left' | 'right' | 'top' | 'bottom';
    gradientColor?: LGColor;
}

export const ButtonAsync: React.FC<ButtonAsyncProps> = ({
    id,
    loading,
    title,
    disabled = false,
    type,
    buttonStyle,
    hasLG=true,
    textStyle,
    icon,
    iconContainerStyle,
    isPrimary = true,
    loadingStyle,
    iconPosition = 'left',
    containerStyle,
    gradientDirection = "diagonalTR",
    gradientColor = 'blue',
    size = "md",
    onPress
}) => {

    const style = useButtonAsyncStyles(isPrimary, type === "outline");
    const lgProps = getLinearGradientProps(gradientColor, isPrimary, gradientDirection);

    const linearGradientProps = type === "outline" ? {
        colors: [darkPalette[1], darkPalette[0]],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        } : lgProps;

    const lg = hasLG ? linearGradientProps : undefined;


	return (
        <Button 
            id={id}

            ViewComponent={hasLG ? LinearGradient : undefined}
            linearGradientProps={lg}
            containerStyle={containerStyle ?? style.containerStyle}
            buttonStyle={buttonStyle ?? style.button}
            disabled={disabled}
            disabledStyle={style.disabledButton}
			titleStyle={textStyle ?? style.textStyle}
            loading={loading}
            loadingStyle={loadingStyle}
            onPress={onPress}
            type={type ?? 'solid'}
            size={size}
            radius={10}
            iconPosition={iconPosition}
            icon={icon}
            iconContainerStyle={iconContainerStyle ?? { marginRight: 10 }}
			title={title}
			/>
	)
}
export default ButtonAsync;



const useButtonAsyncStyles = (isDark: boolean, isOutline: boolean) => {
    
    const textColor = isDark ? grayDark.gray12 : grayDark.gray1;
    const textColorOutline = isDark ? grayDark.gray12 : grayDark.gray10;

    const style = useMemo(() => StyleSheet.create({
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
            fontSize: 14,
            fontFamily: isOutline ? fonts.inter.medium : fonts.inter.black,
            color: isOutline ? textColorOutline : textColor,
        },
    
        containerStyle: {
            // padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            // width: '100%',
            // height: '100%',
            flex: 1,
        },
    })
        , [isDark, isOutline]);

    return style;
}