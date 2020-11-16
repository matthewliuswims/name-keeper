import * as React from "react";

import { StyleSheet } from "react-native";

import { ProgressBar as PaperProgressBar, useTheme } from "react-native-paper";

const ProgressBar = ({ progress }) => {
  const { colors } = useTheme();

  return (
    <PaperProgressBar
      color={colors.accent}
      style={styles.progressBar}
      progress={progress}
    />
  );
};

const styles = StyleSheet.create({
  progressBar: {
    margin: 10,
  },
});

export default ProgressBar;
