import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown as DD } from 'react-native-element-dropdown';
import { BaseDropdownItem, DropdownProps } from './Dropdown.types';


export const Dropdown = <T extends BaseDropdownItem>({placeholder="...",  label, data, onSelectionChange, styles = ddstyles, search = false }: DropdownProps<T>) => {
    const [value, setValue] = useState<T>();
    const [isFocus, setIsFocus] = useState(false);
    

  const renderLabel = () => {
    if (value || isFocus || label) {
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
              style={[styles.dropdown, isFocus && {  }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={{ backgroundColor: grayDark.gray5 }}
              itemTextStyle={{ color: grayDark.gray10, fontFamily: fonts.inter.regular }}   
              backgroundColor={'rgba(0,0,0,0.2)'}
              showsVerticalScrollIndicator={false}
              data={data}
              label={label}
              search={search}
              maxHeight={300}
              minHeight={100}
              labelField="label"
              valueField="value"
              searchField="search"
              placeholder={!isFocus ? placeholder : '...'}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                  setValue(item);
                  setIsFocus(false);
                    onSelectionChange(item);
              }}
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
    color: grayDark.gray12,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 18,
    fontFamily: fonts.inter.bold,
    color: grayDark.gray12,
  },
    selectedTextStyle: {
      fontSize: 18,
      fontFamily: fonts.inter.semi_bold,
      color: grayDark.gray12,
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