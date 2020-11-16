import * as React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Elements
import Title from "../elements/Title";

export default function PersonScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Person Screen</Title>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
