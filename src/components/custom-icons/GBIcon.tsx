import { GB } from '@assets/darkSvg/GB';
import React from 'react';
import { SvgXml } from 'react-native-svg';


export interface GBIconProps {

    size: number;

}

 const _GBIcon: React.FC<GBIconProps> = ({ size, }) => {
    


    return (
        <SvgXml
            xml={GB}
            width={size}
            height={size}
        />
  
    );
}


export const  GBIcon = React.memo(_GBIcon);