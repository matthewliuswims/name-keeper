import React from 'react';
import { connect } from 'react-redux';
import AppContainer from './AppNavContainer';

import { clearGroupsFocus } from './redux/actions/groups';

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
           * twice - once for the transition and once we're already the page (and prevScreen === current screen)
           * since we don't want care about the second time, we have below if statement
           */
          if (currentScreen === prevScreen) {
            return;
          }

          if (currentScreen === 'GroupsScreen') {
            this.props.clearGroupFocus();
          }
        }}
      />
    );
  }
}

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

// DON'T HAVE ACCESS TO THUNK at this point...
const mapDispatchToProps = (dispatch) => {
  return {
    clearGroupFocus: () => {
      dispatch(clearGroupsFocus());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavContainerWrapper);
