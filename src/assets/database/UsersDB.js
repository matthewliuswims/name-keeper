import React from 'react';
import databaseConnection from './DatabaseConnection';

import { turnUsersListGroupNamesIntoArray, getRelevantUsers, changeGroupReferences } from '../../lib/actions';
// see GroupsDB for good documentation, as this class mimics GroupsDB structure
export default class UsersDB extends React.Component {
    static singletonInstance;

    static getInstance() {
      if (!UsersDB.singletonInstance) {
        UsersDB.singletonInstance = new UsersDB();
        return this.singletonInstance.createTable().then((success) => {
          console.log('created users table code', success);
          return this.singletonInstance;
        }).catch((err) => {
          throw err;
        });
      }
      return new Promise((res) => {
        res(this.singletonInstance);
      });
    }

    get dbConnection() {
      return databaseConnection.dbConnection;
    }

    createTable() {
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
              userID INTEGER PRIMARY KEY NOT NULL, 
              name TEXT NOT NULL, 
              description TEXT NOT NULL,
              createdDate TEXT NOT NULL UNIQUE,
              lastEdit TEXT NOT NULL,
              primaryGroupName TEXT NOT NULL,
              groupNames TEXT NOT NULL,
              location TEXT
            );`,
          );
        },
        err => reject(err),
        () => resolve('success'));
      });
    }

    makeGroupNamesArray(groupNameOne, groupNameTwo, groupNameThree) {
      const groups = [];
      groups.push(groupNameOne);
      if (groupNameTwo) groups.push(groupNameTwo);
      if (groupNameThree) groups.push(groupNameThree);
      return groups;
    }

    addUser(user) {
      const timeUserAdded = new Date();
      const groupNamesArray = this.makeGroupNamesArray(user.groupNameOne, user.groupNameTwo, user.groupNameThree);
      const groupNames = JSON.stringify(groupNamesArray);
      const primaryGroupName = user.groupNameOne;

      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'INSERT INTO users (name, description, createdDate, lastEdit, primaryGroupName, groupNames, location) values (?, ?, ?, ?, ?, ?, ?)',
              [user.name,
                user.description,
                timeUserAdded,
                timeUserAdded,
                primaryGroupName,
                groupNames,
                user.location,
              ],
            );
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    deleteUser(user) {
      const { userID } = user;
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'DELETE FROM users WHERE userID = (?)', [userID],
            );
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    //
    // GET ALL USERS WHERE: <-- matches
    //   1) primaryGroupName matches groupName
    //   2) 'like' operator for the groupNames

    // update/ or reinsert?
    // @TODO; make this much more efficient
    async updateUsersWithNewGroupName(currentGroupName, newGroupName) {
      const allUsers = await this.listAllUsers();
      const parsedUsers = turnUsersListGroupNamesIntoArray(allUsers);
      const relevantUsers = getRelevantUsers(currentGroupName, parsedUsers);
      console.log('relevantUsers users are', relevantUsers);
      const updatedUsers = changeGroupReferences(currentGroupName, newGroupName, relevantUsers);
      console.log('updatedUsers users are', updatedUsers);
      const promises = updatedUsers.map(this.editUserGroupNames);
      await Promise.all(promises);
    }

    editUserGroupNames(user) {
      const { userID, primaryGroupName, groupNames } = user;
      const lastEdit = new Date();
      const groupNamesStringified = JSON.stringify(groupNames);
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'UPDATE users SET primaryGroupName = (?), groupNames = (?), lastEdit = (?) WHERE userID = (?)', [primaryGroupName, groupNamesStringified, lastEdit, userID],
            );
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }


    editUser(user) {
      const { userID, name, description, location } = user;
      const lastEdit = new Date();
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'UPDATE users SET name = (?), description = (?), location = (?), lastEdit = (?) WHERE userID = (?)', [name, description, location, lastEdit, userID],
            );
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }


    listAllUsers() {
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            // can get from executeSql
            tx.executeSql('SELECT * FROM users', [], (_, { rows }) => {
              resolve(rows._array); //eslint-disable-line 
            });
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }
}
