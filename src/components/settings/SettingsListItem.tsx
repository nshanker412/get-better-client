import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { grayDark } from '@context/theme/colors_neon';
import { Text } from '@rneui/base';
import { TouchableHighlight } from 'react-native';
import { SettingsListItemProps } from './Settings.types';



export const SettingsListItem: React.FC<SettingsListItemProps>  = ({item}) => {

    return (
        <TouchableHighlight
            style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 8,
                backgroundColor:  grayDark.gray10,
            }}
      activeOpacity={0.4}
            onPress={() => actionForMenuItem(item)}
        >
      <Text  >
        {item}
      </Text>


            </TouchableHighlight>   
  );
};

const actionForMenuItem = (item: MenuItem) => {


  switch (item) {
    case 'privacyPolicy': {
        return Linking.openURL("https://getbetterbrand.com/privacy-policy");
        break;
      }
    case 'EULA': {
      return Linking.openURL("https://getbetterbrand.com/eula");
      break;
    }
      default: {
        return null;
        break;
      }
          
   
  }
};