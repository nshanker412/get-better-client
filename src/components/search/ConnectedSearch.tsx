import { CellContainer } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { Search } from "./search";

const AnimatedCellContainer = Animated.createAnimatedComponent(CellContainer);

export const CustomCellRendererComponent = React.forwardRef((props: any, _) => {
  const offset = useSharedValue(400);
  const cellContainerRef = useRef<View>(null);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      // make an animation to transition when the page data goes from empty to populated
      opacity: 1,
      transform: [{ translateY: offset.value}],
    };
  }, []);
  useEffect(() => {
    offset.value = withDelay(props.index * 2, withSpring(10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    cellContainerRef.current?.setNativeProps({ opacity: 1 });
  });

  return (
    <AnimatedCellContainer
      ref={cellContainerRef}
      {...props}
      style={[animatedStyles, { opacity: 0 }, props.style]}
    />
  );
});

CustomCellRendererComponent.displayName = "CustomCellRendererComponent";

const SearchCustomCellContainer = () => {
  return (
    <Search
      
      CellRendererComponent={CustomCellRendererComponent}
    />
  );
};
export default SearchCustomCellContainer;