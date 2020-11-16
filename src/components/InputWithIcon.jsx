import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

const InputWithIcon = ({
  // below are from react-hook-form controller
  onChange,
  onBlur,
  value,
  append,
  remove,

  placeholder,
  isPlus,
  setTip,
}) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
      <TextInput
        style={{ flex: 6 }}
        onBlur={onBlur}
        onChangeText={(value) => onChange(value)}
        value={value}
        textAlign="center"
        onFocus={() => setTip(false)}
        mode="outlined"
        placeholder={placeholder}
      />
      {isPlus ? (
        <Pressable
          onPress={() => {
            append({ descriptor: "" });
          }}
          style={({ pressed }) => {
            return {
              opacity: pressed ? 0.5 : 1,
              borderColor: colors.black,
              backgroundColor: colors.green,
              borderColor: colors.placeholder,
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,

              // below is a hack to just cover up the react native paper border radius, since react native
              // paper doesn't allow us to change the border radius
              position: "relative",
              right: 2,
              height: "91%",
              top: 6,
            };
          }}
        >
          <Text style={{ color: "white", fontSize: 30 }}> + </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            // @TODO: change append to remove instead
            remove({ descriptor: "" });
          }}
          style={({ pressed }) => {
            return {
              opacity: pressed ? 0.5 : 1,
              borderColor: colors.black,
              backgroundColor: colors.red,
              borderColor: colors.placeholder,
              flex: 1,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,

              // below is a hack to just cover up the react native paper border radius, since react native
              // paper doesn't allow us to change the border radius
              position: "relative",
              right: 2,
              height: "91%",
              top: 6,
            };
          }}
        >
          <Text style={{ color: "white", fontSize: 30 }}> - </Text>
        </Pressable>
      )}
    </View>
  );
};

export default InputWithIcon;
