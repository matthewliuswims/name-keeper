export function makeAction(actionType, payload) {
  return {
    type: actionType,
    payload,
  };
}

/**
 * @param {Array<Object>} usersList
 * @return almost same as the @param, except that the user object in the array will
 * have its groupNames value be an array instead of a JSON string
 */
export function turnUsersListGroupNamesIntoArray(usersList) {
  if (!Array.isArray(usersList)) {
    return usersList; // hopefully we'll never get here
  }
  if (!usersList.length) {
    return usersList;
  }

  const newUsers = usersList.map((user) => {
    const userCopy = Object.assign({}, user);
    const groupNamesArray = JSON.parse(userCopy.groupNames);
    userCopy.groupNames = groupNamesArray; // changing groupNamesField
    return userCopy;
  });

  return newUsers;
}

function matches(groupName) {

  console.log('11');
  console.log(this.currentGroupName);
  console.log(groupName);
  return groupName === this.currentGroupName; // this is currentGroupName
}


/**
 * by relevantUsers, we mean if a user in the usersList has any pointers
 * to the current groupname - if so, it's part of the list of users we return.
 */
export function getRelevantUsers(currentGroupName, usersList) {
  console.log('usersList list before is', usersList);
  if (!Array.isArray(usersList)) {
    return usersList; // hopefully we'll never get here
  }
  if (!usersList.length) {
    return usersList;
  }

  const newUsersList = [];
  for (const user of usersList) {
    if (user.primaryGroupName === currentGroupName) {
      newUsersList.push(user);
    } else if (user.groupNames.find(matches, { currentGroupName })) {
      newUsersList.push(user);
    }
  }
  console.log('new users list iss', newUsersList);
  return newUsersList;
}
