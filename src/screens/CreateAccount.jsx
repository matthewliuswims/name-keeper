import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useForm, Controller } from "react-hook-form";

// Components
import ButtonPrimary from "../components/ButtonPrimary";
import ViewContainer from "../components/ViewContainer";

// Elements
import Title from "../elements/Title";
import Paragraph from "../elements/Paragraph";
import TextInput from "../elements/TextInput";

function CreateAccount({ route, navigation }) {
  const { control, handleSubmit, errors } = useForm();
  // console.log("control is", control);
  const [submitting, setSubmitting] = useState(false);
  console.log("errors os", errors);
  const onPress = async (data) => {
    console.log("data is", data);
    navigation.navigate("Onboard1");
  };

  return (
    <ViewContainer>
      <Title style={styles.title}>Create Account!</Title>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            mode="outlined"
            placeholder="Email"
            style={{ width: "100%" }} // need this for whatever reason.
          />
        )}
        name="email"
        rules={{ required: true }}
        defaultValue=""
      />
      {errors.email && <Paragraph color="error">This is required.</Paragraph>}
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            mode="outlined"
            placeholder="Password"
            style={{ width: "100%" }} // need this for whatever reason.
          />
        )}
        name="password"
        rules={{ required: true }}
        defaultValue=""
      />
      {errors.password && (
        <Paragraph color="error">This is required.</Paragraph>
      )}
      <Paragraph>Forgot password?</Paragraph>

      <ButtonPrimary onPress={handleSubmit(onPress)} disabled={submitting}>
        Sign up
      </ButtonPrimary>
    </ViewContainer>
  );
}

export default CreateAccount;

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
});
