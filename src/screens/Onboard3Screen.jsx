import React, { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import Tooltip from "react-native-walkthrough-tooltip";
import { TextInput } from "react-native-paper";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { View, ScrollView } from "react-native";

// Components
import ButtonPrimary from "../components/ButtonPrimary";
import ProgressBar from "../components/ProgressBar";
import DescriptionFields from "../components/DescriptionFields";

// Elements
import Paragraph from "../elements/Paragraph";

// Redux
import { addGroupAsync } from "../store/groups";

// Other
import { isPlus } from "../utils/ui";

// @TODO: have a transition to 100 after hitting save?
// @TODO: need to get the group from the
// @TODO: change "add person" + green button to match UI

export default function Onboard3Screen({ navigation, route }) {
  const dispatch = useDispatch();

  const { control, handleSubmit, errors } = useForm({
    defaultValues: {
      description: [{ descriptor: "" }],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "description",
    }
  );

  const { group = "" } = route.params;

  const onSubmit = async (data) => {
    console.log("data are", data);
    // console.log('data.description[0]', data.description[0].descriptor)

    // await dispatch(addGroupAsync(group))
    // @TODO: add person from group here too.
    // @TODO: see flag to storage saying that tutorial is over.
    // navigation.replace('Home')
  };

  const [showTip, setTip] = useState(true);

  const fieldsParsed = fields.map((field, index) => {
    return {
      ...field,
      isPlus: isPlus(index, fields.length),
    };
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 4 }}>
          <Tooltip
            isVisible={showTip}
            content={
              <>
                <Paragraph color={"black"}>
                  Add a name of someone you want to remember
                </Paragraph>
              </>
            }
            placement="bottom"
            useInteractionManager={true}
            onClose={() => setTip(false)}
          >
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  onFocus={() => setTip(false)}
                  mode="outlined"
                  placeholder="Name (e.g. Joe)"
                  style={{ width: "100%" }} // need this for whatever reason.
                />
              )}
              name="name"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.name && (
              <Paragraph color="error">This is required.</Paragraph>
            )}
          </Tooltip>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={{ marginTop: 10, width: "100%" }}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                onFocus={() => setTip(false)}
                mode="outlined"
                placeholder="Location"
              />
            )}
            name="location"
            rules={{ required: false }}
            defaultValue=""
          />
          <DescriptionFields
            control={control}
            data={fieldsParsed}
            style={{ flexGrow: 1 }}
            groups={[group]}
            placeholder="Notable Impression"
            append={append}
            remove={remove}
            setTip={setTip}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <ProgressBar progress={0.66} />
          <ButtonPrimary
            onPress={handleSubmit(onSubmit)}
            // disabled={groupValue === ''}
          >
            Save
          </ButtonPrimary>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
