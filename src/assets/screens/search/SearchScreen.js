import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import SearchBar from 'react-native-searchbar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
    this.handleResults = this.handleResults.bind(this);
  }

  handleResults(results) {
    console.log('results are', results);
    this.setState({ results });
  }

  placeHolderText(groupName) {
    if (groupName) {
      return `Search for users in ${groupName}`;
    }
    return 'Search for ALL users';
  }

  render() {
    const groupName = this.props.navigation.getParam('groupName');
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 110 }}>
          {
            this.state.results.map((result, i) => {
              return (
                <Text key={i}>
                  {result.name}
                </Text>
              );
            })
          }
        </View>
        <SearchBar
          ref={function (ref) {
            this.searchBar = ref;
          }}
          data={items}
          handleResults={this.handleResults}
          showOnLoad
          placeholder={this.placeHolderText(groupName)}
          heightAdjust={Platform.OS === 'ios' ? 0 : hp('3%')}
        />
        <Text> I search screen and we are searching for this group: {groupName} </Text>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('GroupsScreen');
        }}>
          <Text> Click to go back to groups screen </Text>
        </TouchableOpacity>
      </View>
    );
  }
}


const items = [
  {
    name: 'Mark',
    groupNames: ['Work'],
    primaryGroupName: 'Work',
    description: 'introduced me to work',
  },
  {
    name: 'Adrian',
    groupNames: ['Work'],
    primaryGroupName: 'Work',
    description: 'Sat next to the right of me',
  },
  {
    name: 'Reilly',
    groupNames: ['Church', 'Community Group'],
    primaryGroupName: 'Church',
    description: 'first person i met at church',
  },
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = state => (
  {
    usersState: state.users,
  }
);

export default withNavigation(connect(mapStateToProps)(SearchScreen));
