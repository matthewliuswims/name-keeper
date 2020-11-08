
import * as React from 'react';

import { StyleSheet } from 'react-native';

import { Paragraph as PaperParagraph } from 'react-native-paper';

const Paragraph = ({ children, style }) => {
  return (
    <PaperParagraph style={[styles.paragraph, style]}>{children}</PaperParagraph>
  )
}

const styles = StyleSheet.create({
    paragraph: {
      margin: 10
        // can put anything here
    }
});
  

export default Paragraph;
