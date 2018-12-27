import React from 'react';
import { connect } from 'react-redux';
import AppContainer from './AppNavContainer';

import { clearGroupsFocus } from './redux/actions/groups';
import { clearUserFocus } from './redux/actions/users';

class AppNavContainerWrapper extends React.Component {
  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  render() {
    return (
      <AppContainer
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = this.getActiveRouteName(currentState);
          const prevScreen = this.getActiveRouteName(prevState);

          /**
           * for some reason onNavigationStateChange gets called
           * twice - once for the transition and once we're already on the page (and prevScreen === current screen)
           * we want the second time, so we're already off the screen
           */
          if (currentScreen === prevScreen && currentScreen === 'GroupsScreen') {
            this.props.clearGroupFocus();
            this.props.clearUserFocus();
          }

          if (currentScreen === prevScreen && currentScreen === 'GroupScreen') {
            this.props.clearUserFocus();
          }
        }}
      />
    );
  }
}

// DON'T HAVE ACCESS TO THUNK at this point...
const mapDispatchToProps = (dispatch) => {
  return {
    clearGroupFocus: () => {
      dispatch(clearGroupsFocus());
    },
    clearUserFocus: () => {
      dispatch(clearUserFocus());
    },
  };
};

export default connect(null, mapDispatchToProps)(AppNavContainerWrapper);
