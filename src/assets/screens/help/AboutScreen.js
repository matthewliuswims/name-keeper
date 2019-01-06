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
            <Text style={styles.headerQuestionText}>What is <Text style={{ fontStyle: 'italic' }}>{nameOfApp}</Text> for? TL;DR answer, please. </Text>
          </View>
          <Text style={styles.AnswerText}>How often do you remember someone&apos;s face, but not their name? This app offers a solution. </Text>
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
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 2. </Text> You notice a shy kid with long red hair sitting in the corner</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 3. </Text> Talking to her, you learn Brittany moved here a couple days ago and enjoys playing chess.</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 4. </Text> A minute after the conversation, you write down Brittany&apos;s name along with the description &ldquo;new red hair girl who likes chess.&rdquo;</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 5. </Text> Next time you volunteer, you realize you forgot the name of that new-red-hair-girl-who-plays-chess.</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 6. </Text> No fear: using <Text style={{ fontStyle: 'italic' }}>{nameOfApp}</Text> you are able to quickly remember her name: Brittany!</Text>
          <Text style={styles.AnswerText}><Text style={{ fontWeight: 'bold' }}> 7. </Text> You greet Brittany using her name. She feels loved and estatic that you remembered her name.</Text>
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
  },
});
