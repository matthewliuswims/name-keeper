
import React, { useState, useEffect } from 'react'
import Tooltip from 'react-native-walkthrough-tooltip';
import { TextInput } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

// Components
import ButtonPrimary from '../components/ButtonPrimary'
import ProgressBar from '../components/ProgressBar'
import ViewContainer from '../components/ViewContainer'

// Elements
import Title from '../elements/Title'
import Paragraph from '../elements/Paragraph'

// @TODO: disable button until some1 writes something for name?

export default function Onboard2Screen({
  navigation,
}) {
  const { control, handleSubmit, errors } = useForm();
  const defaultValue = ''
  const [groupValue, setGroupValue] = useState(defaultValue)

  const onSubmit = async data => {
    const { group } = data
    navigation.replace('Onboard3', { group })
  }

  const [ showTip, setTip ] = useState(false)

  useEffect(() => {
    // we can't just do useState(true), because there's some weird timing issue
    // so we need to do this stupid hack to let everything mount first
    setTimeout(() => setTip(true), 500)
  }, [])

  return (
    <ViewContainer style={styles.container}>
      <Tooltip
        isVisible={showTip}
        content={
          <>
            <Title style={{ color: 'black' }}>Add a Group</Title>
            <Paragraph color={'black'}>
              Groups contain people that are related in some way
            </Paragraph>
          </>
        }
        placement="bottom"
        onClose={() => setTip(false)}
      >
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={value => {
                onChange(value)
                setGroupValue(value)
              }}
              value={value}

              onFocus={() => setTip(false)}
              mode="outlined"
              placeholder="Name (e.g. Work)"
              style={{ width: "100%"}} // need this for whatever reason.
            />
          )}
          name="group"
          rules={{ required: true }}
          defaultValue={defaultValue}
        />
        {errors.group && <Paragraph color='error'>This is required.</Paragraph>}
      </Tooltip>
      <View style={{ flex : 1 }} />
      <>
        <ProgressBar progress={0.33} />
        <ButtonPrimary
          onPress={
            handleSubmit(onSubmit)
          }
          disabled={groupValue === ''}
        >
          Save
        </ButtonPrimary>
      </>
    </ViewContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around'
  }
});
