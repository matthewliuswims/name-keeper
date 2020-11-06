import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Onboard1Screen from '../screens/Onboard1Screen';
import Onboard2Screen from '../screens/Onboard2Screen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
    return (
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Onboard1" component={Onboard1Screen} />
          <Stack.Screen name="Onboard2" component={Onboard2Screen} />
        </Stack.Navigator>
      );
  }
  