import { turnUsersListGroupNamesIntoArray, getRelevantUsers } from '../src/lib/actions';

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
];

const groupNamesModified = [
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
];

// turnUsersListGroupNamesIntoArray
test('normal usersList', () => {
  expect(turnUsersListGroupNamesIntoArray(bigUsersListFromDB)).toEqual(groupNamesModified);
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
];
test('getRelevantUsers for normal case', () => {
  expect(getRelevantUsers('GroupTest11', groupNamesModified)).toEqual(matchingGroups);
});

test('getRelevantUsers for no users', () => {
  expect(getRelevantUsers('GroupTest11', [])).toEqual([]);
});
