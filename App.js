import { Provider } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

import Sentry from 'sentry-expo';

import React, { Component } from 'react';
import Navigator from './src/AppNavContainerWrapper';
import store from './src/redux/configureStore';

// Remove this once Sentry is correctly setup.
/**
 * all your dev/local errors will be ignored and only app releases will report errors to Sentry.
 * You can call methods like Sentry.captureException(new Error('Oops!')) but these methods will be no-op.
 */
Sentry.enableInExpoDevelopment = true;

Sentry.config('https://3bf48e7028f641eb869c85a11919fb78@sentry.io/1364814').install();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MenuProvider>
          <Navigator />
        </MenuProvider>
      </Provider>
    );
  }
}
