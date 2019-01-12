export function makeAction(actionType, payload) {
  return {
    type: actionType,
    payload,
  };
}

/**
 * @param {Array<Object>} usersList - returned from SQLLITE
 * @return almost same as the @param, except that the user object in the array will
 * have its groupNames value be an array instead of a JSON string
 */
export function turnUsersListGroupNamesIntoArray(usersList) {
  if (!Array.isArray(usersList)) {
    throw new Error('turnUsersListGroupNamesIntoArray expects usersList to be an Array');
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
 * if a user in @usersList has it's primaryGroupName match currentGroupName
 * then that user is returned as part of the newUsersList array.
 * @param usersList - all users (for every group)
 */
export function usersPrimaryGroupNameMatch(groupName, usersList) {
  if (!Array.isArray(usersList)) {
    throw new Error('usersPrimaryGroupNameMatch expects usersList to be an Array');
  }
  if (!usersList.length) {
    return usersList;
  }

  const newUsersList = [];
  for (const user of usersList) {
    if (user.primaryGroupName === groupName) {
      newUsersList.push(user);
    }
  }
  return newUsersList;
}

/**
 * @param {Array<String>} groupNames
 * @param {Array<Object>} usersList
 * @return Array<Object> - all users who match at least one of the groupnames
 */
export function usersGroupNamesMatch(groupNames, usersList) {
  const usersThatHaveGroupName = usersList.filter((user) => {
    const userGroupName = user.primaryGroupName;
    const usrGrpMatches = groupNames.includes(userGroupName); // groupNames should only ever include one userGroupName, btw
    return usrGrpMatches;
  });
  return usersThatHaveGroupName;
}

/**
 * does not mutate @param groupNames
 * @return {[string]} groupNames without the groupNameToDelete
 */
function removeGroupName(groupNameToDelete, groupNames) {
  const newGroupNames = groupNames.filter((groupName) => {
    return groupName !== groupNameToDelete;
  });
  return newGroupNames;
}


/**
 * @param {string} groupName - groupTag we seek to delete from all the users in our usersList
 * @param {[Object]} usersList - all our users
 * @return {[Object]} a new users list where any groupTags with @param groupName are gone
 */
export function deleteGroupTag(groupName, usersList) {
  const updatedUsersList = usersList.map((user) => {
    let newUser;
    const { groupNames } = user;
    if (groupNames.includes(groupName)) {
      newUser = Object.assign({}, user, {
        groupNames: removeGroupName(groupName, groupNames),
      });
    } else {
      newUser = user;
    }
    return newUser;
  });

  return updatedUsersList;
}

/**
 * by relevantUsers, we mean if a user in the usersList has any pointers
 * to the current groupname - if so, it's part of the list of users we return.
 */
export function getRelevantUsers(currentGroupName, usersList) {
  if (!Array.isArray(usersList)) {
    throw new Error('getRelevantUsers expects usersList to be an Array');
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

function replaceCurrGroupNameWithNewGroupName(currentGroupName, newGroupName, groupNames) {
  const newGroupNames = groupNames.map((groupName) => {
    if (currentGroupName === groupName) {
      return newGroupName;
    }
    return groupName;
  });
  return newGroupNames;
}

/**
 * in @param usersList: all the references to @param currentGroupName (for primaryGroupName and groupNames)
 * will be changed to @param newGroupName
 * @param {string} currentGroupName
 * @param {string} newGroupName
 * @param {Array<Object>} usersList - return value of getRelevantUsers() - though could be any users list though
 */
export function changeGroupReferences(currentGroupName, newGroupName, usersList) {
  const updatedUsersList = usersList.map((user) => {
    let newUser;
    const { primaryGroupName, groupNames } = user;

    if (primaryGroupName === currentGroupName && groupNames.includes(currentGroupName)) {
      newUser = Object.assign({}, user, {
        primaryGroupName: newGroupName,
        groupNames: replaceCurrGroupNameWithNewGroupName(currentGroupName, newGroupName, groupNames),
      });
    } else if (primaryGroupName === currentGroupName) {
      newUser = Object.assign({}, user, {
        primaryGroupName: newGroupName,
      });
    } else if (groupNames.includes(currentGroupName)) {
      newUser = Object.assign({}, user, {
        groupNames: replaceCurrGroupNameWithNewGroupName(currentGroupName, newGroupName, groupNames),
      });
    } else {
      newUser = user;
    }

    return newUser;
  });
  return updatedUsersList;
}
