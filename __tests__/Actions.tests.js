import {
  changeGroupReferences,
  usersPrimaryGroupNameMatch,
  usersGroupNamesMatch,
} from '../src/lib/actions';


const usersWithGroupNamesModified = [
  {
    name: 'Someone in group test',
    primaryGroupName: 'GroupTest',
  },
  {
    name: 'Someone in group test',
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'COOLERONI',
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'iruser',
    primaryGroupName: 'Grouperoni22',
  },
];

// changeGroupReferences
const usersWithUpdatedGroupReferences = [
  {
    name: 'Someone in group test',
    primaryGroupName: 'GroupTest',
  },
  {
    name: 'Someone in group test',
    primaryGroupName: 'newgroupName!',
  },
  {
    name: 'COOLERONI',
    primaryGroupName: 'newgroupName!',
  },
  {
    name: 'iruser',
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
    primaryGroupName: 'GroupTest11',
  },
  {
    name: 'COOLERONI',
    primaryGroupName: 'GroupTest11',
  },
];

test('usersPrimaryGroupNameMatch - normal case', () => {
  expect(usersPrimaryGroupNameMatch('GroupTest11', usersWithGroupNamesModified)).toEqual(primaryGroupNameGroupTest11Matches);
});
test('usersPrimaryGroupNameMatch - no matches', () => {
  expect(usersPrimaryGroupNameMatch('group name with no matches', usersWithGroupNamesModified)).toEqual([]);
});


// usersGroupNamesMatch
const groupNames = [
  'AustinGroup33',
  'GroupTest11',
];

const userToTestGroupNamesMatch = [
  {
    name: 'Someone in group test',
    primaryGroupName: 'GroupTest11',
  },
];

test('usersGroupNamesMatch - normal case', () => {
  expect(usersGroupNamesMatch(groupNames, userToTestGroupNamesMatch)).toEqual(userToTestGroupNamesMatch);
});


const groupNamesNoMatch = [
  'AustinGroup333333',
  'GroupTest11`242141',
];

test('usersGroupNamesMatch - no match', () => {
  expect(usersGroupNamesMatch(groupNamesNoMatch, userToTestGroupNamesMatch)).toEqual([]);
});
