import * as React from "react";
import { StyleSheet, View } from "react-native";

// Elements
import Title from "../elements/Title";

export default function GroupsListScreen() {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Groups List</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
