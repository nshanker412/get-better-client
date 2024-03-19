import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { MenuItem } from './Settings.types';
import { SettingsListItem } from './SettingsListItem';
import { SettingsListSectionHeader } from './SettingsListSectionHeader';

const StyledSearchItemSeparator = () => (

    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.05);',
      }}
    />
);
    


const settingsData: {
  title: string;
  icon: JSX.Element;
  data: MenuItem[];
}[] = [
  {
    title: 'About',
    icon: (
            <MaterialIcons name="verified-user" size={24}  color="black" />
    ),
    data: ['aboutMe', 'spaceAPI', 'theme'],
  },
  {
    title: 'Feedback and Help',
    icon: (
        <MaterialIcons name="feedback" size={24} color="black" />
    ),
      data: ['help', 'review'],
    

        },
        {
            title: 'Notifications',
            icon: (
                <MaterialIcons name="notifications-active" size={24} color="black" />
            ),
              data: ['help', 'review'],
            
        
        },
        
            {
                title: 'Logout',
                icon: (
<MaterialIcons name="logout" size={24} color="black" />
                ),
                  data: ['help', 'review'],
                
            
            },

    
    ];


export const SettingsList = () => {

  const listLength = settingsData.length;

  return (
    <SectionList
      sections={settingsData}
      style={{ flex: 1, width: '100%', marginTop: 24 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={StyledSearchItemSeparator}
      keyExtractor={(it) => it}
      renderItem={({item, index}) => {

        return (

          <SettingsListItem
            item={item}
            isFirstElement={index === 0}
            isLastElement={index === listLength - 1}
          />
        );
      }}
      renderSectionHeader={({ section: { title, icon } }) => (
        <SettingsListSectionHeader icon={icon} title={title} />
      )}
    />
  );
};


const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
  },
});