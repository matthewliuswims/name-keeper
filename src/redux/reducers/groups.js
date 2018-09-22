import * as ActionTypes from '../actions/groups';

const groups = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_GROUPS_START:
      return [
        {
          groupName: action.groupName,
          error: null,
          completed: false,
        },
      ];
    case ActionTypes.ADD_GROUPS_SUCCESS:
      return [
        {
          groupName: action.groupName,
          error: null,
          completed: true,
        },
      ];
    case ActionTypes.ADD_GROUPS_FAIL:
      return [
        {
          groupName: action.groupName,
          error: action.error,
          completed: false,
        },
      ];
    default:
      return state;
  }
};

export default groups;
