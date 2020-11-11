
import React, { useState, useEffect } from 'react'
import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import { TextInput } from 'react-native-paper';
import { useForm, Controller, useFieldArray, } from "react-hook-form";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ScrollView
} from 'react-native';

// Components
import ButtonPrimary from '../components/ButtonPrimary'
import ProgressBar from '../components/ProgressBar'
import ViewContainerScrollable from '../components/ViewContainerScrollable'

// Elements
import Title from '../elements/Title'
import Paragraph from '../elements/Paragraph'

// Redux
import {
  addGroupAsync,
} from '../store/groups';

// @TODO: have a transition to 100 after hitting save?
// @TODO: need to get the group from the 

export default function Onboard3Screen({
  navigation,
  route
}) {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    errors
  } = useForm();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "description"
    }
  );

  const { 
    group = ''
  } = route.params

  const onSubmit = async data => {
    const { name, group } = data
    await dispatch(addGroupAsync(group))
    // @TODO: add person from group here too.
    // @TODO: see flag to storage saying that tutorial is over. 
    navigation.replace('Home')
  }

  const [ showTip, setTip ] = useState(false)

  useEffect(() => {
    // we can't just do useState(true), because there's some weird timing issue
    // so we need to do this stupid hack to let everything mount first
    setTimeout(() => setTip(true), 500)
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ flex: 2}}>
        <Tooltip
          isVisible={showTip}
          content={
            <>
              <Title style={{ color: 'black' }}>Nearly There...</Title>
              <Paragraph color={'black'}>
                We need to add a person to the group we just made
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
                style={styles.input}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}

                onFocus={() => setTip(false)}
                mode="outlined"
                placeholder="Name (e.g. Joe)"
                style={{ width: "100%"}} // need this for whatever reason.
              />
            )}
            name="name"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.name && <Paragraph color='error'>This is required.</Paragraph>}
        </Tooltip>
           <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={{ marginTop: 10, width: "100%"}}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
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
        <FlatList
          style={{flex: 1}}
          data={fields}
          renderItem={({item, index}) => (
            <Controller
              render={({ onChange, onBlur, value }) => (
                <TextInput
                  style={{ marginTop: 10, width: "100%"}}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  value={value}

                  onFocus={() => setTip(false)}
                  mode="outlined"
                  placeholder="Description"
                />
              )}
              control={control}
              name={`description[${index}].descriptor`}
              defaultValue={item.descriptor} // make sure to set up defaultValue
            />
          )}
        />
      </View>
      <View style={{flex: 1}}/>
      <View style={{flex: 1}}>
          <ProgressBar progress={0.66} />
          <ButtonPrimary
            onPress={
              () => {
                  append({ descriptor: "some description"});
                }
              }
            >
              Add Descriptor
          </ButtonPrimary>
          <ButtonPrimary
            onPress={
              handleSubmit(onSubmit)
            }
          >
            Save
          </ButtonPrimary>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  }
});
