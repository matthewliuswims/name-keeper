import {
  turnUsersListGroupNamesIntoArray,
  getRelevantUsers,
  changeGroupReferences,
  usersPrimaryGroupNameMatch,
  deleteGroupTag,
} from '../src/lib/actions';

const bigUsersListFromDB = [
  {
    name: 'Someone in group test',
    groupNames: JSON.stringify(['GroupTest', 'Grouperoni', 'AustinGroup']),
    primaryGroupName: 'GroupTest',
  },
  {
    name: 'Someone in group test',
    groupNames: JSON.stringify(['GroupTest11', 'Grouperoni22', 'AustinGroup33']),
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'COOLERONI',
    groupNames: JSON.stringify(['GroupTest11', 'Grouperoni22', 'AustinGroup33']),
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'iruser',
    groupNames: JSON.stringify(['Grouperoni22', 'GroupTest11']),
    primaryGroupName: 'Grouperoni22',
  },
];

const usersWithGroupNamesModified = [
  {
    name: 'Someone in group test',
    groupNames: ['GroupTest', 'Grouperoni', 'AustinGroup'],
    primaryGroupName: 'GroupTest',
  },
  {
    name: 'Someone in group test',
    groupNames: ['GroupTest11', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'COOLERONI',
    groupNames: ['GroupTest11', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'iruser',
    groupNames: ['Grouperoni22', 'GroupTest11'],
    primaryGroupName: 'Grouperoni22',
  },
];

// turnUsersListGroupNamesIntoArray
test('normal usersList', () => {
  expect(turnUsersListGroupNamesIntoArray(bigUsersListFromDB)).toEqual(usersWithGroupNamesModified);
});

const noUsers = [];

test('no users list', () => {
  expect(turnUsersListGroupNamesIntoArray(noUsers)).toBe(noUsers);
});

const singleUserDB = [
  {
    name: 'Single person',
    groupNames: JSON.stringify(['GroupTest', 'Grouperoni', 'AustinGroup']),
  },
];

const singleUser = [
  {
    name: 'Single person',
    groupNames: ['GroupTest', 'Grouperoni', 'AustinGroup'],
  },
];

test('single user list', () => {
  expect(turnUsersListGroupNamesIntoArray(singleUserDB)).toEqual(singleUser);
});


// getrelevantUsers Test

const matchingGroups = [
  {
    name: 'Someone in group test',
    groupNames: ['GroupTest11', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'COOLERONI',
    groupNames: ['GroupTest11', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'iruser',
    groupNames: ['Grouperoni22', 'GroupTest11'],
    primaryGroupName: 'Grouperoni22',
  },
];
test('getRelevantUsers for normal case', () => {
  expect(getRelevantUsers('GroupTest11', usersWithGroupNamesModified)).toEqual(matchingGroups);
});

test('getRelevantUsers for no users', () => {
  expect(getRelevantUsers('GroupTest11', [])).toEqual([]);
});

// changeGroupReferences
const usersWithUpdatedGroupReferences = [
  {
    name: 'Someone in group test',
    groupNames: ['GroupTest', 'Grouperoni', 'AustinGroup'],
    primaryGroupName: 'GroupTest',
  },
  {
    name: 'Someone in group test',
    groupNames: ['newgroupName!', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'newgroupName!',
  },
  {
    name: 'COOLERONI',
    groupNames: ['newgroupName!', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'newgroupName!',
  },
  {
    name: 'iruser',
    groupNames: ['Grouperoni22', 'newgroupName!'],
    primaryGroupName: 'Grouperoni22',
  },
];

test('changeGroupReferences - normal case', () => {
  expect(changeGroupReferences('GroupTest11', 'newgroupName!', usersWithGroupNamesModified)).toEqual(usersWithUpdatedGroupReferences);
});

// usersPrimaryGroupNameMatch
const primaryGroupNameGroupTest11Matches = [
  {
    name: 'Someone in group test',
    groupNames: ['GroupTest11', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'COOLERONI',
    groupNames: ['GroupTest11', 'Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
];

test('usersPrimaryGroupNameMatch - normal case', () => {
  expect(usersPrimaryGroupNameMatch('GroupTest11', usersWithGroupNamesModified)).toEqual(primaryGroupNameGroupTest11Matches);
});
test('usersPrimaryGroupNameMatch - no matches', () => {
  expect(usersPrimaryGroupNameMatch('group name with no matches', usersWithGroupNamesModified)).toEqual([]);
});

// deleteGroupTag
const noGroupTest11Tag = [
  {
    name: 'Someone in group test',
    groupNames: ['GroupTest', 'Grouperoni', 'AustinGroup'],
    primaryGroupName: 'GroupTest',
  },
  {
    name: 'Someone in group test',
    groupNames: ['Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'COOLERONI',
    groupNames: ['Grouperoni22', 'AustinGroup33'],
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'iruser',
    groupNames: ['Grouperoni22'],
    primaryGroupName: 'Grouperoni22',
  },
];


test('deleteGroupTag - normal case', () => {
  expect(deleteGroupTag('GroupTest11', usersWithGroupNamesModified)).toEqual(noGroupTest11Tag);
});
