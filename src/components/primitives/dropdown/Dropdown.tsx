import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown as DD } from 'react-native-element-dropdown';
import { BaseDropdownItem, DropdownProps } from './Dropdown.types';

// const data = [
//   { label: 'Item 1', value: '1', search: 'Item 1' },
//   { label: 'Item 2', value: '2', search: 'Item 2' },
//   { label: 'Item 3', value: '3', search: 'Item 3' },
//   { label: 'Item 4', value: '4', search: 'Item 4' },
//   { label: 'Item 5', value: '5', search: 'Item 5' },
//   { label: 'Item 6', value: '6', search: 'Item 6' },
//   { label: 'Item 7', value: '7', search: 'Item 7' },
//   { label: 'Item 8', value: '8', search: 'Item 8' },
// ];


export const Dropdown = <T extends BaseDropdownItem>({ label, data, onSelectionChange, styles = ddstyles, search = false }: DropdownProps<T>) => {
    const [value, setValue] = useState<T>();
    const [isFocus, setIsFocus] = useState(false);
    

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: grayDark.gray12 , fontFamily: fonts.inter.regular}]}>
              {label ?? "Dropdown label"}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
          <DD
                containerStyle={{ backgroundColor: 'transparent'}}
              style={[styles.dropdown, isFocus && { borderColor: grayDark.gray12 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={{ backgroundColor: grayDark.gray5 }}
              itemTextStyle={{ color: grayDark.gray10, fontFamily: fonts.inter.regular }}   
              backgroundColor={'rgba(0,0,0,0.2)'}
            showsVerticalScrollIndicator={false}
              data={data}
              search={search}
              maxHeight={300}
              minHeight={100}
              labelField="label"
              valueField="value"
              searchField="search"
              
              placeholder={!isFocus ? 'Dropdown 1' : '...'}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                  setValue(item);
                  setIsFocus(false);
                    onSelectionChange(item);
              }}
            //   renderLeftIcon={() => {
            //       value ? (
            //           <AntDesign
            //               style={styles.icon}
            //               color={isFocus ? grayDark.gray12 : grayDark.gray10}
            //               name="folderopen"
            //               size={20}
            //           />
            //       ) : null
            //   }
              />
    </View>
  );
};


const ddstyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: grayDark.gray12,
    opacity: 0.5,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'black',
      left: 22,
      fontFamily: fonts.inter.regular,
        color: grayDark.gray10,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
      fontSize: 16,
      fontFamily: fonts.inter.regular,
      color: grayDark.gray10,


  },
    selectedTextStyle: {
        fontFamily: fonts.inter.regular,  
        // backgroundColor: grayDark.gray12,
        color: grayDark.gray12,
        fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});