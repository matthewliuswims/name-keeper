export const DUPLICATE_GROUP_NAME = {
  errCode: '19',
  message: 'Enter a group name that does not already exist',
  errHook: 'UNIQUE CONSTAINT',
};

// 3 groups includes the primary group (but the end user doesn't know this)
export const MORE_THAN_3_GROUPS = {
  default: true,
  message: 'Only 2 or less group tags are allowed.',
};

export const NO_GROUPS_SELECTED = {
  default: true,
  message: 'Have at least one group selected!',
};

// convention: anything with default will have default at end
export const PLACE_HOLDER_DEFAULT = {
  default: true,
  message: 'Something went wrong - please try again.',
};
