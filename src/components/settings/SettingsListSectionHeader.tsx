import * as React from 'react';

// import { StyledSectionWrapper } from './Settings.styled';
import { fonts } from '@context/theme/fonts';
import { Text } from '@rneui/base';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SettingsListSectionHeaderProps } from './Settings.types';



const stylesV = StyleSheet.create({
    sectionWrapper: {
        marginTop: 32,
        marginBottom: 24,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
    

export const SettingsListSectionHeader = (props: SettingsListSectionHeaderProps) => {
  const { icon, title } = props;

  return (
    <View style={stylesV.sectionWrapper}>
      {icon}

          <Text style={{
                fontSize: 16,
              fontFamily: fonts.inter.black
                // marginLeft: 16,
          }}>   
              {title}
            </Text>
    </View>
  );
};

const theme = {
    listItemBackgroundColor: '#f0f0f0', // Example background color
  };
  
  const radius = 16;

  export const SettingsListItemWrapper = (

  ) => {
    return (
      <TouchableOpacity
        style={[
          {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: radius,
            backgroundColor: theme.listItemBackgroundColor,
            borderTopLeftRadius:   radius ,
            borderTopRightRadius:  radius ,
            borderBottomLeftRadius:   radius ,
            borderBottomRightRadius:   radius ,
          },
        ]}
      >
      </TouchableOpacity>
    );
  };
  