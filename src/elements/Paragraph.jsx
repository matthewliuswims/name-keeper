import * as React from "react";

import { StyleSheet } from "react-native";

import { Paragraph as PaperParagraph, useTheme } from "react-native-paper";

const Paragraph = ({ children, style = {}, color: colorParam = "text" }) => {
  const { colors } = useTheme();

  return (
    <PaperParagraph
      style={[
        styles.paragraph,
        {
          ...style,
          color: colors[colorParam],
        },
      ]}
    >
      {children}
    </PaperParagraph>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    margin: 10,
    // can put anything here
  },
});

export default Paragraph;
