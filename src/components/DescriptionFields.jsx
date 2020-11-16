import * as React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

import { Controller } from "react-hook-form";

// Elements
import Paragraph from "../elements/Paragraph";

const DescriptionFields = ({
  append,
  control,
  remove,
  placeholder,
  data,

  setTip = () => {},
  groups,
}) => {
  const { colors } = useTheme();

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={data}
      style={{ flexGrow: 1 }}
      renderItem={({ item, index }) => (
        <Controller
          render={({ onChange, onBlur, value }) => (
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
              {item.isPlus ? (
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
                    remove(index);
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
          )}
          control={control}
          name={`description[${index}].descriptor`}
          defaultValue={item.descriptor} // make sure to set up defaultValue
        />
      )}
      ListFooterComponent={<Paragraph> {groups[0]} Right below list</Paragraph>}
    />
  );
};

export default DescriptionFields;
