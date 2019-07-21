import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Icon } from 'react-native-elements';

const Description = (locals) => {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var textboxStyle = stylesheet.textbox.normal;
  var textboxViewStyle = stylesheet.textboxView.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    textboxStyle = stylesheet.textbox.error;
    textboxViewStyle = stylesheet.textboxView.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  if (locals.editable === false) {
    textboxStyle = stylesheet.textbox.notEditable;
    textboxViewStyle = stylesheet.textboxView.notEditable;
  }

  var label = locals.label ? (
    <Text style={controlLabelStyle}>Description</Text>
  ) : null;
  var help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  var error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  const actionButton = locals.config.isLast
    ? (
      <TouchableOpacity
        onPress={locals.config.addDescription}
        style={styles.actionContainer}
      >
        <Icon name="add" size={24} />
      </TouchableOpacity>
    )
    : (
      <TouchableOpacity
        onPress={() => locals.config.removeDescription(locals.config.id)}
        style={styles.actionContainer}
      >
        <Icon name="remove" size={24} />
      </TouchableOpacity>
    );

  return (
    <View style={formGroupStyle}>
      {locals.config.isFirst && label}
      <View style={styles.descriptionBox}>
        {actionButton}
        <View style={[textboxViewStyle, styles.textBoxOverrides]}>
          <TextInput
            accessibilityLabel={locals.label}
            ref="input"
            allowFontScaling={locals.allowFontScaling}
            autoCapitalize={locals.autoCapitalize}
            autoCorrect={locals.autoCorrect}
            autoFocus={locals.autoFocus}
            blurOnSubmit={locals.blurOnSubmit}
            editable={locals.editable}
            keyboardType={locals.keyboardType}
            maxLength={locals.maxLength}
            multiline={locals.multiline}
            onBlur={locals.onBlur}
            onEndEditing={locals.onEndEditing}
            onFocus={locals.onFocus}
            onLayout={locals.onLayout}
            onSelectionChange={locals.onSelectionChange}
            onSubmitEditing={locals.onSubmitEditing}
            onContentSizeChange={locals.onContentSizeChange}
            placeholderTextColor={locals.placeholderTextColor}
            secureTextEntry={locals.secureTextEntry}
            selectTextOnFocus={locals.selectTextOnFocus}
            selectionColor={locals.selectionColor}
            numberOfLines={locals.numberOfLines}
            clearButtonMode={locals.clearButtonMode}
            clearTextOnFocus={locals.clearTextOnFocus}
            enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
            keyboardAppearance={locals.keyboardAppearance}
            onKeyPress={locals.onKeyPress}
            returnKeyType={locals.returnKeyType}
            selectionState={locals.selectionState}
            onChangeText={value => locals.onChange(value)}
            onChange={locals.onChangeNative}
            placeholder={locals.placeholder}
            style={[textboxStyle, styles.textboxstyle]}
            value={locals.value}
            testID={locals.testID}
            textContentType={locals.textContentType}
          />
        </View>
      </View>
      {help}
      {error}
    </View>
  );
};


const styles = StyleSheet.create({
  textBoxOverrides: {
    flex: 1,
  },
  actionContainer: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingLeft: 12,
    paddingRight: 18,
    alignContent: 'center',
    justifyContent: 'center',
  },
  descriptionBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});


export default Description;
