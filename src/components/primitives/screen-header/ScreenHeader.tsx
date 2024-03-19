import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';



interface HeaderProps {
    title: string;
    subtitle?: string;
  }
  

  const headerStyle = StyleSheet.create({
    header: {
      paddingLeft: 24,
      paddingRight: 24,
      marginBottom: 12,
    },
    title: {
      fontSize: 32,
      fontFamily: fonts.inter.bold,
      color: grayDark.gray12,
      marginBottom: 6,
    },
      subtitle: {
        fontFamily: fonts.inter.semi_bold,
        color: grayDark.gray10,
      fontSize: 15,

    },
  });
  
  export const ScreenHeader: React.FC<HeaderProps> = ({title, subtitle}) => {
    return (
      <View style={headerStyle.header}>
        <Text style={headerStyle.title}>{ title}</Text>
        {subtitle && <Text style={headerStyle.subtitle}>
          {subtitle}
        </Text>}
      </View>
    );
  }