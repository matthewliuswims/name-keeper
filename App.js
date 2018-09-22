import { Provider } from 'react-redux';

import React, { Component } from 'react';
import Navigator from './src/AppNavigation';
import store from './src/redux/configureStore';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  }
}
