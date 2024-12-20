


import { blue, blueDark, gray, grayDark, green, greenDark, yellow, yellowDark,lightgreen } from '@context/theme/colors_neon';

export type LGColor = 'green' | 'blue' | 'gray' | 'yellow'| 'lightgreen';
export type LGdirection = 'horizontal' | 'vertical' | 'diagonalTR' | 'diagonalBL';

export const getLinearGradientProps = (gradientColor: LGColor, dark: boolean, direction: LGdirection="diagonalTR") => {
    
    const horizontal = {
        start: { x: 0, y: 1 },
        end: { x: 1, y: 0 },
    }
    const vertical = {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    }
    const diagonalTR = {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    }
    const diagonalBL = {
        start: { x: 1, y: 1 },
        end: { x: 0, y: 0 },
    }


    if (dark) {
        switch (gradientColor) {
            case 'green':
                return {
                    colors: [greenDark.green10, greenDark.green9, greenDark.green8],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'blue':
                return {
                    colors: [blueDark.blue10, blueDark.blue9, blueDark.blue8],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'gray':
                return {
                    colors: [grayDark.gray10, grayDark.gray9, grayDark.gray8],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'yellow':
                return {
                    colors: [yellowDark.yellow10, yellowDark.yellow9, yellowDark.yellow8],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'lightgreen':
                return {
                    colors: [lightgreen.lightgreen1, lightgreen.lightgreen2, lightgreen.lightgreen3],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            default:
                return {
                    colors: [blueDark.blue10, blueDark.blue9, blueDark.blue8],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end :
                        direction === 'vertical' ? vertical.end :
                            direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
        }
    }
    else {
        switch (gradientColor) {
            case 'green':
                return {
                    colors: [green.green7, green.green6, green.green5],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'blue':
                return {
                    colors: [blue.blue7, blue.blue6, blue.blue5],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'gray':
                return {
                    colors: [gray.gray12, gray.gray11, gray.gray10],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'yellow':
                return {
                    colors: [yellow.yellow7, yellow.yellow6, yellow.yellow5],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            case 'lightgreen':
                return {
                    colors: [lightgreen.lightgreen1, lightgreen.lightgreen2, lightgreen.lightgreen3],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end : direction === 'vertical' ? vertical.end : direction === 'diagonalTR' ? diagonalTR.end : diagonalBL.end,
                }
            default:
                return {
                    colors: [blue.blue7, blue.blue6, blue.blue5],
                    start: direction === 'horizontal' ? horizontal.start : direction === 'vertical' ? vertical.start : direction === 'diagonalTR' ? diagonalTR.start : diagonalBL.start,
                    end: direction === 'horizontal' ? horizontal.end :
                        direction === 'vertical' ? vertical.end :
                            direction === 'diagonalTR'
                                ? diagonalTR.end : diagonalBL.end,
                }
            
        }
    }
}


   