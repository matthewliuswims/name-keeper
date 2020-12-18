import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Auth } from "aws-amplify";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

// Components
import ButtonPrimary from "../components/ButtonPrimary";
import ProgressBar from "../components/ProgressBar";
import ViewContainer from "../components/ViewContainer";

// Elements
import Title from "../elements/Title";
import Paragraph from "../elements/Paragraph";

// Hooks
import useTheme from "../hooks/useTheme";

const CELL_COUNT = 6;

function Verify({ route, navigation }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const theme = useTheme();
  const { cognitoUser: cognitoUserFromSignUp } = route.params || {};

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const borderColorStyles = {
    borderColor: theme.colors.border,
  };

  const onPress = async () => {
    try {
      setSubmitting(true);
      const cognitoUser = await Auth.sendCustomChallengeAnswer(
        cognitoUserFromSignUp,
        value
      );
      // @TODO: also make the call to the api wtih this user and then set it
      console.log("SUCCESS: i will store this user somewhere", cognitoUser);
      // @TODO: navigate below if the user doesn't have any previous groups or users
      navigation.navigate("Onboard1", { cognitoUser: cognitoUser });
    } catch (error) {
      console.log("error sending challenge is", error);
      if (error.code === "NotAuthorizedException") {
        setErrorMessage(
          "That code didn't work - make sure the code is correct"
        );
      } else {
        setErrorMessage(
          "Something went wrong. Try again, or try a new phone number if the problem persists"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ViewContainer>
      <View style={styles.top}>
        <Title style={styles.title}>Your Activation Code Has Been Sent!</Title>
        <Paragraph>Once you get your code, enter it below</Paragraph>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={(text) => {
            setErrorMessage(""); // clear any previous error message
            setValue(text);
          }}
          editable={!submitting}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => {
            const borderColorStylesFocus = isFocused
              ? {
                  borderColor: theme.colors.accent,
                }
              : {};
            return (
              <Paragraph
                key={index}
                style={{
                  ...styles.cell,
                  ...borderColorStyles,
                  ...borderColorStylesFocus,
                }}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Paragraph>
            );
          }}
        />
        {errorMessage ? (
          <Paragraph color="error" marginTop>
            {errorMessage}
          </Paragraph>
        ) : null}
      </View>
      <View style={styles.bottom}>
        <ProgressBar progress={0.25} />
        <ButtonPrimary onPress={onPress} disabled={submitting}>
          Next
        </ButtonPrimary>
      </View>
    </ViewContainer>
  );
}

export default Verify;

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
  },
  bottom: {
    justifyContent: "flex-end",
    flex: 1,
  },
  title: {
    marginBottom: 20,
  },

  // CodeField code
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    textAlign: "center",
  },
});
