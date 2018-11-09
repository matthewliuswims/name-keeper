// TODO

// import UsersDB from '../../assets/database/UsersDB';
// import makeAction from '../../lib/actions';

// export const ADD_USER_START = 'ADD_USER_START';
// export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
// export const ADD_USER_FAIL = 'ADD_USER_FAIL';


// export function addUser() {
//   return (dispatch) => {
//     dispatch(makeAction(ADD_USER_START));
//     const dbInstance = UsersDB.getInstance();
//     const addUserDB = dbInstance.addUser;
//     return addUserDB()
//       .then((user) => {
//         dispatch(makeAction(ADD_USER_SUCCESS, groupsList));
//       }).catch((error) => {
//         dispatch(makeAction(ADD_USER_FAIL, error));
//         // no need to throw err in this particular instance
//       });
//   };
// }
