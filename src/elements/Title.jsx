import * as React from "react";

import { StyleSheet } from "react-native";

import { Text } from "react-native-paper";

const Title = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
});

export default Title;
