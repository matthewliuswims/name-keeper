export function makeAction(actionType, payload) {
  return {
    type: actionType,
    payload,
  };
}

/**
 * @param {Array<Object>} usersList - return frmo USe
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

/**
 * whether or not the groupname matches this.currentGroupName - used as a CB for find func
 * @param {string} groupName - can assume is never null
 */
function matches(groupName) {
  return groupName === this.currentGroupName; // this is currentGroupName
}


/**
 * by relevantUsers, we mean if a user in the usersList has any pointers
 * to the current groupname - if so, it's part of the list of users we return.
 */
export function getRelevantUsers(currentGroupName, usersList) {
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
  return newUsersList;
}
