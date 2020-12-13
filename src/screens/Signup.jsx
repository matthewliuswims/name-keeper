import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput as TextInputVanilla } from "react-native";
import parsePhoneNumber from "libphonenumber-js";
import Amplify, { Auth } from "aws-amplify";

// @TODO: upgrade expo version

// Components
import ButtonPrimary from "../components/ButtonPrimary";
import ProgressBar from "../components/ProgressBar";
import ViewContainer from "../components/ViewContainer";

// Elements
import Title from "../elements/Title";
import Paragraph from "../elements/Paragraph";
import TextInput from "../elements/TextInput";

// @TODO: https://stackoverflow.com/a/61547869 use localization

const format = (value) => {
  // return nothing if no value
  if (!value) return value;

  // only allows 0-9 inputs
  const digits = value.replace(/[^\d]/g, "");
  const digitsLength = digits.length;

  // returns: "x", "xx", "xxx"
  if (digitsLength < 4) return digits;

  // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
  if (digitsLength < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
  if (digitsLength < 11)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
      6,
      10
    )}`;

  return digits;
};

const deFormat = (formatted) => {
  const digits = formatted.replace(/[^\d]/g, "");
  return digits;
};

function SignUpScreen({ navigation }) {
  const [value, setValue] = useState();
  const cognitoUserRef = useRef();

  // const onPress = () => {
  //   const phoneNumber = '5129941006'
  //   try {
  //     // sign up
  //     const { user } = await Auth.signUp({
  //       username: phoneNumber,
  //       password: Date.now().toString(),
  //       attributes: {
  //         phone_number: phoneNumber
  //     }
  //     });
  //     console.log('user is', user)
  //   } catch {
  //     console.log('error signing up:', error);
  //   }

  //   try {
  //     // sign in
  //     const cognitoUser = await Auth.signIn(phoneNumber);
  //     cognitoUserRef.current = cognitoUser
  //   } catch {
  //     console.log('error signing in', error);
  //   }
  // }
  // use https://www.npmjs.com/package/awesome-phonenumber
  return (
    <ViewContainer>
      <View style={styles.top}>
        {/* <Toasting /> */}
        <Title style={styles.title}>Enter Your Phone Number to Start</Title>
        <Paragraph style={styles.subText}>
          An activation code will be sent
        </Paragraph>
        <TextInput
          autoFocus={true}
          mode="outlined"
          placeholder="Phone Number"
          keyboardType="number-pad"
          style={{ width: "100%" }} // need this for whatever reason.
          onChangeText={(text) => {
            const deFormatted = deFormat(text);
            setValue(deFormatted);
          }}
          value={format(value)}
        />
      </View>
      <View style={styles.bottom}>
        <ProgressBar progress={0} />
        <ButtonPrimary onPress={() => console.log("do stuff")}>
          Next
        </ButtonPrimary>
      </View>
    </ViewContainer>
  );
  s;
}

export default SignUpScreen;

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
    textAlign: "left",
    width: "100%",
  },
  subText: {
    textAlign: "left",
    width: "100%",
    marginBottom: 20,
  },
});
