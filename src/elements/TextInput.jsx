import * as React from "react";

import { TextInput as ReactNativeTextInput } from "react-native-paper";

const TextInput = ({ children, ...rest }) => {
  return <ReactNativeTextInput {...rest} />;
};

export default TextInput;
