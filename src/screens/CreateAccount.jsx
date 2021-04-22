import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";

// Helpers
import { request } from "../utils/requests";
import { setInStorage } from "../storage";
import { JWT_USER, TYPE_STRING } from "../storage/constants";

// Components
import ButtonPrimary from "../components/ButtonPrimary";
import ViewContainerScrollable from "../components/ViewContainerScrollable";

// Elements
import Header from "../elements/Header";
import Paragraph from "../elements/Paragraph";
import TextInput from "../elements/TextInput";
import Logo from "../elements/svgs/Logo";

// Redux
import { addModalAsync } from "../store/modal";

function CreateAccount({ route, navigation }) {
  const dispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm();
  const [submitting] = useState(false);

  const onPress = async (data) => {
    if (errors.password || errors.email) return;

    const response = await request("/accounts/", {
      method: "POST",
      body: data,
    });
    const body = response.body;
    const status = response.status;

    if (!body.token) {
      console.error(
        "could not get the token for some reason with response",
        response
      );

      console.log("response is", response);
      return dispatch(
        addModalAsync({
          props: {
            text:
              status === 403
                ? "That email is already in use - please login to your existing account."
                : "There was an issue creating your account",
          },
          type: "warning",
          actionCB: () => console.log("action"),
        })
      );
    }
    setInStorage({
      key: JWT_USER,
      value: body.token,
      type: TYPE_STRING,
    });
    navigation.navigate("Onboard1");
  };
  return (
    <ViewContainerScrollable style={{ justifyContent: "center" }}>
      <View style={styles.top}>
        <Logo />
        <Header style={styles.header}>Create Account!</Header>
      </View>
      <View style={styles.bottom}>
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
          rules={{
            pattern: {
              value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Not a valid email",
            },
            required: true,
          }}
          defaultValue=""
        />
        {errors.email && (
          <Paragraph color="error" style={{ margin: 0, marginBottom: 10 }}>
            {errors.email.message || "A valid email is required"}
          </Paragraph>
        )}
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
          rules={{
            pattern: {
              value: /^.{8,}$/,
              message: "Not a valid password: need at least 8 characters",
            },
            required: true,
          }}
          defaultValue=""
        />
        {errors.password && (
          <Paragraph color="error" style={{ margin: 0 }}>
            {errors.password.message ||
              "Not a valid password: need at least 8 characters"}
          </Paragraph>
        )}
        <Paragraph
          style={{
            alignSelf: "flex-end",
            marginBottom: 30,
            marginTop: 5,
            alignItems: "center",
          }}
        >
          Already have an account?{" "}
          <Paragraph
            onPress={() => {
              console.log("login clicked");
              navigation.navigate("Login");
            }}
            color="primary"
            style={{ fontWeight: "bold" }}
          >
            Login
          </Paragraph>
        </Paragraph>

        <ButtonPrimary onPress={handleSubmit(onPress)} disabled={submitting}>
          Sign up
        </ButtonPrimary>
      </View>
    </ViewContainerScrollable>
  );
}

export default CreateAccount;

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 20,
  },
});
