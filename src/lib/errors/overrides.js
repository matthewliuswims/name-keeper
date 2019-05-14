export const DUPLICATE_GROUP_NAME = {
  errCode: '19',
  message: 'Enter a group name that does not already exist',
  errHook: 'UNIQUE CONSTAINT',
};

export const MAXIMUM_GROUP_SIZE = {
  message: 'You cannot have more than 8 groups. Please delete a group to make another one',
};

// convention: anything with default will have default at end
export const PLACE_HOLDER_DEFAULT = {
  default: true,
  message: 'Something went wrong - please try again.',
};
