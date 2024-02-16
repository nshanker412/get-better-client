import React from 'react';
import { View } from 'react-native';
import { useCOMPONENT_NAMEStyles } from "./COMPONENT_NAME.styles";
import { COMPONENT_NAMEProps } from "./COMPONENT_NAME.types";


export const COMPONENT_NAME: React.FC<COMPONENT_NAMEProps> = (...) => {

    const COMPONENT_NAMEStyles = useCOMPONENT_NAMEStyles();

    return (
        <View style={COMPONENT_NAMEStyles.container}>
         
        </View>
    );
};

