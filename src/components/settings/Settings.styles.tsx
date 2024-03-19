import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// Define your theme colors and other constants outside of the component
const theme = {
  listItemBackgroundColor: '#f0f0f0', // Placeholder theme color
};
const radius = 16;

// StyleSheet definition
const styles = StyleSheet.create({
  sectionWrapper: {
    marginTop: 32,
    marginBottom: 24,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Static part of the SettingsListItemWrapper styles
  settingsListItemWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: radius,
    backgroundColor: theme.listItemBackgroundColor, // Assuming static theme
  },
});

// SettingsListItemWrapper component with dynamic styles based on props
export const SettingsListItemWrapper = ({ isFirstElement, isLastElement, children }) => {
  const dynamicStyles = {
    borderTopLeftRadius: isFirstElement ? radius : 0,
    borderTopRightRadius: isFirstElement ? radius : 0,
    borderBottomLeftRadius: isLastElement ? radius : 0,
    borderBottomRightRadius: isLastElement ? radius : 0,
  };

  return (
    <TouchableOpacity style={[styles.settingsListItemWrapper, dynamicStyles]}>
      {children}
    </TouchableOpacity>
  );
};