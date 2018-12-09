import { Provider } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

import React, { Component } from 'react';
import Navigator from './src/AppNavContainerWrapper';
import store from './src/redux/configureStore';

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
