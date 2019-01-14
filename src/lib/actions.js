export function makeAction(actionType, payload) {
  return {
    type: actionType,
    payload,
  };
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
 * used for filtering: to see which users should be listed as per the groupNames fitler options
 * @param {Array<String>} groupNames - all group names currently present
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
 * for any users in the @param usersList: their primaryGroupName is changed to @param currentGroupName
 * @param {string} currentGroupName
 * @param {string} newGroupName
 * @param {Array<Object>} usersList - return value of usersPrimaryGroupNameMatch() - though could be any users list though
 */
export function changeGroupReferences(currentGroupName, newGroupName, usersList) {
  const updatedUsersList = usersList.map((user) => {
    let newUser;
    const { primaryGroupName } = user;
    if (primaryGroupName === currentGroupName) {
      newUser = Object.assign({}, user, {
        primaryGroupName: newGroupName,
      });
    } else {
      newUser = user;
    }
    return newUser;
  });
  return updatedUsersList;
}
