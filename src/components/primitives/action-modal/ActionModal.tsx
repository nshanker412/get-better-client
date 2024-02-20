import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RNModal from "react-native-modal";

type ModalProps = {
  isVisible: boolean;
  children: React.ReactNode;
  style?: object; // Custom style for the main container
  [x: string]: any;
};

export const Modal = ({
  isVisible = false,
  children,
  style,
  ...props
}: ModalProps) => {
  return (
    <RNModal
      isVisible={isVisible}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      style={[styles.modal, style]}
      {...props}
    >
      {children}
    </RNModal>
  );
};

const ModalContainer = ({ children, containerStyle }: { children: React.ReactNode; containerStyle?: object }) => (
  <View style={[styles.container, containerStyle]}>{children}</View>
);

const ModalHeader = ({ title, headerStyle }: { title: string; headerStyle?: object }) => (
  <View style={[styles.header, headerStyle?.container]}>
    <Text style={[styles.text, headerStyle?.text]}>{title}</Text>
  </View>
);

const ModalBody = ({ children, bodyStyle }: { children?: React.ReactNode; bodyStyle?: object }) => (
  <View style={[styles.body, bodyStyle]}>{children}</View>
);

const ModalFooter = ({ children, footerStyle }: { children?: React.ReactNode; footerStyle?: object }) => (
  <View style={[styles.footer, footerStyle]}>{children}</View>
);

const styles = StyleSheet.create({
  modal: {
    // You can add some default styles here if needed
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    paddingTop: 10,
    textAlign: "center",
    fontSize: 24,
  },
  body: {
    justifyContent: "center",
    paddingHorizontal: 15,
    minHeight: 100,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
});

Modal.Header = ModalHeader;
Modal.Container = ModalContainer;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
