import * as React from "react";

import { StyleSheet } from "react-native";

import { Paragraph as PaperParagraph, useTheme } from "react-native-paper";

const Paragraph = ({
  children,
  style = {},
  color: colorParam = "text",
  marginTop = false,
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <PaperParagraph
      style={[
        styles.paragraph,
        {
          ...style,
          color: colors[colorParam],
          ...(marginTop && { marginTop: 20 }),
        },
      ]}
      {...rest}
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
