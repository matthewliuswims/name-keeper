import * as React from "react";

import { Headline as PaperHeadline } from "react-native-paper";

const Headline = ({ children, style }) => {
  return <PaperHeadline style={[style]}>{children}</PaperHeadline>;
};

export default Headline;
