import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';



export interface DropdownItemType {
    label: string;
    value: string;
    search: string;
}
  
export interface BaseDropdownItem {
    label: string;
    value: string;
    icon?: string; // Assuming we want to allow an optional icon for each item
}


export interface DropdownProps<T extends BaseDropdownItem> {
    label: string;
    data: T[];
    onSelectionChange: (items: T[]) => void;
    icon?: string;
    styles?: any;
    search?: boolean;
  }

export const MultiSelectComponent = <T extends BaseDropdownItem>({ label, data, onSelectionChange, icon, styles = stylesd, search = false }: DropdownProps<T>) => {
  const [selected, setSelected] = useState<T[]>([]);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
            <FontAwesome6 name="dumbbell" size={24} color="black" />
      </View>
    );
  };
    
    useEffect(() => {
        console.log('selected', selected);
        onSelectionChange(selected);
    }, [selected]);

  return (
    <View style={styles.container}>
      <MultiSelect<T>
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        backgroundColor={'rgba(0,0,0,0.2)'}
        data={data}
        labelField="label"
        valueField="value"
        label="search"
        placeholder={selected.length ? `(${selected.length}) Selected` : "Choose your exercises..."}
        value={selected}
        search={search}
        searchPlaceholder="Search..."
        onChange={(item) => {
            setSelected(item);
            
        }}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
            <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                    <Ionicons name="close" size={20} color="black" />
          </TouchableOpacity>
            </View>
        )}
        confirmSelectItem
        confirmUnSelectItem
        renderLeftIcon={() => (<MaterialCommunityIcons name={icon} size={24} color="black" />) }   

      />
    </View>
  );
};


const stylesd = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'transparent'},
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderColor: grayDark.gray12,

    elevation: 2,
    },
 
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
    selectedTextStyle: {
        fontFamily: fonts.inter.regular,
        fontWeight: 'bold',
      fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: grayDark.gray11,
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
    textSelectedStyle: {
      fontFamily: fonts.inter.regular,
    marginRight: 5,
    fontSize: 16,
  },
});


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