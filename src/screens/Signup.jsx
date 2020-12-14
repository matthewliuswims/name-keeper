import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput as TextInputVanilla } from "react-native";
import Amplify, { Auth } from "aws-amplify";
import CountryPicker, {
  DARK_THEME,
  DEFAULT_THEME,
} from "react-native-country-picker-modal";

// @TODO: upgrade expo version

// Hooks
import useColorScheme from "../hooks/useColorScheme";

// Components
import ButtonPrimary from "../components/ButtonPrimary";
import ProgressBar from "../components/ProgressBar";
import ViewContainer from "../components/ViewContainer";

// Elements
import Title from "../elements/Title";
import Paragraph from "../elements/Paragraph";
import TextInput from "../elements/TextInput";

// @TODO: https://stackoverflow.com/a/61547869 use localization

// try with https://www.npmjs.com/package/react-native-country-picker-modal

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
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState();
  const [country, setCountry] = useState({
    callingCode: "1", // default is US
  });
  console.log("country is", country);
  const colorScheme = useColorScheme();
  const countryPickerTheme =
    colorScheme === "dark" ? DARK_THEME : DEFAULT_THEME;

  const [countryCode, setCountryCode] = useState("US");
  const onSelectCountry = (country) => {
    console.log("country is", country);
    setCountryCode(country.cca2);
    setCountry(country);
  };

  const onPress = async () => {
    // function validE164PhoneNumber(phoneNumber) {
    //   const regEx = /^\+[1-9]\d{10,14}$/;
    //   return regEx.test(phoneNumber);
    // }
    // const numberAssembled = `+${country.callingCode[0]}${value}`;
    // console.log("numberAssembled is", numberAssembled);
    // if (!validE164PhoneNumber(numberAssembled)) {
    //   setErrorMessage("Please set a valid number");
    //   return;
    // }
    // try {
    //   // sign up
    //   const { user } = await Auth.signUp({
    //     username: numberAssembled,
    //     password: Date.now().toString(),
    //     attributes: {
    //       phone_number: numberAssembled,
    //     },
    //   });
    //   console.log("user is", user);
    // } catch {
    //   console.log("error signing up:", error);
    //   setErrorMessage("Oops - there was an issue with your number. Try again!");
    // }
    // try {
    //   // sign in - will initiate authentication flow/challenge
    //   const cognitoUser = await Auth.signIn(numberAssembled);
    //   console.log("cognitoUser is", cognitoUser);
    // } catch {
    //   console.log("error signing in and initiating auth flow challenge", error);
    //   setErrorMessage("Oops - there was an issue with your number. Try again!");
    // }
  };

  return (
    <ViewContainer>
      <View style={styles.top}>
        <Title style={styles.title}>Verify Your Phone Number to Start</Title>
        <Paragraph style={styles.subText}>
          An activation code will be sent
        </Paragraph>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "grey",
              position: "relative",
              left: 2,
              height: "91%",
              top: 6,
              borderRadius: 4,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,

              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CountryPicker
              countryCode={countryCode}
              onSelect={onSelectCountry}
              withCallingCode={true}
              withCallingCodeButton={true}
              theme={countryPickerTheme}
            />
          </View>
          <TextInput
            autoFocus={true}
            mode="outlined"
            placeholder="Phone Number"
            keyboardType="number-pad"
            style={{ flex: 3 }}
            onChangeText={(text) => {
              setErrorMessage(""); // clear any previous error message
              const deFormatted = deFormat(text);
              setValue(deFormatted);
            }}
            value={format(value)}
          />
        </View>
        {errorMessage ? (
          <Paragraph color="error">{errorMessage}</Paragraph>
        ) : null}
      </View>
      <View style={styles.bottom}>
        <ProgressBar progress={0} />
        <ButtonPrimary
          onPress={async () => {
            await onPress();
            console.log("sup");
            navigation.navigate("Verify");
          }}
        >
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
