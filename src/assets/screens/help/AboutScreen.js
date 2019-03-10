import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import nameOfApp from '../../../lib/variables';

import { container } from '../../styles/base';

export default class About extends Component {
  static navigationOptions = {
    title: 'About',
  };

  render() {
    return (
      <View style={container}>
        <ScrollView>
          <View style={styles.HeaderQuestion}>
            <Text style={styles.headerQuestionText}>What is the problem <Text style={{ fontStyle: 'italic' }}>{nameOfApp}</Text> is solving?</Text>
          </View>
          <Text style={styles.AnswerText}>We&apos;ve all been there. You know that person&apos;s face. You remember his horn-rimmed glasses, fiery-red hair and shy demeanor. BUT: you just cannot remember his name.
          </Text>
          <View style={styles.HeaderQuestion}>
            <Text style={styles.headerQuestionText}>What does <Text style={{ fontStyle: 'italic' }}>{nameOfApp}</Text> do then? TL;DR answer.</Text>
          </View>
          <Text style={styles.AnswerText}>This is an app that stores the names + descriptions of the people you meet within your social groups.
          </Text>
          <View style={styles.HeaderQuestion}>
            <Text style={styles.headerQuestionText}>Why should I use <Text style={{ fontStyle: 'italic' }}>{nameOfApp}</Text>?</Text>
          </View>
          <Text style={styles.AnswerText}>People like it when you remember their names. </Text>
          <View style={styles.HeaderQuestion}>
            <Text style={styles.headerQuestionText}>How do I use this App?</Text>
          </View>
          <Text style={styles.AnswerText}>After meeting someone, you write down their name in the App with a unique characteristic/description. Next time you meet, you&apos;ll remember their name.</Text>
          <View style={styles.HeaderQuestion}>
            <Text style={styles.headerQuestionText}>Can you give an example? </Text>
          </View>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 1. </Text> You volunteer weekly at an after-school program.</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 2. </Text> You notice a shy kid with red spiky hair sitting in the corner.</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 3. </Text> Talking to him, you learn Andrew moved here a couple days ago and enjoys playing chess.</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 4. </Text> A minute after the conversation, you write down Andrew&apos;s name along with the description &ldquo;new guy with red spiky hair who likes chess.&rdquo;</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 5. </Text> Right before you volunteer next week, you realize you forgot the name of that new-red-hair-guy-who-plays-chess.</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 6. </Text> No fear: using <Text style={{ fontStyle: 'italic' }}>{nameOfApp}</Text> you are able to quickly remember his name: Andrew!</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 7. </Text> You greet Andrew using his name. He feels loved and estatic that you remembered his name.</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  HeaderQuestion: {
    fontWeight: 'bold',
  },
  headerQuestionText: {
    fontWeight: 'bold',
    fontSize: RF(3),
    marginBottom: hp('3%'),
    marginTop: hp('3%'),
  },
  AnswerText: {
    fontSize: RF(2),
    marginBottom: hp('1%'),
  },
});
