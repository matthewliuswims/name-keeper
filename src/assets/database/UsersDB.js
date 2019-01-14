import React from 'react';
import databaseConnection from './DatabaseConnection';

import {
  usersPrimaryGroupNameMatch,
  changeGroupReferences,
} from '../../lib/actions';

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
              location TEXT
            );`,
          );
        },
        err => reject(err),
        () => resolve('success'));
      });
    }


    addUser(user) {
      const timeUserAdded = new Date();
      const { primaryGroupName } = user;

      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'INSERT INTO users (name, description, createdDate, lastEdit, primaryGroupName, location) values (?, ?, ?, ?, ?, ?)',
              [user.name,
                user.description,
                timeUserAdded,
                timeUserAdded,
                primaryGroupName,
                user.location,
              ],
            );
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    // delete all users where primaryGroupName matches groupname
    async updateUsersGroupDelete(groupName) {
      const allUsers = await this.listAllUsers();
      const usersPrimaryGroupMatches = usersPrimaryGroupNameMatch(groupName, allUsers);
      // delete any users whose primaryGroupname matches groupName
      const deleteUserPromises = usersPrimaryGroupMatches.map(this.deleteUser);
      await Promise.all(deleteUserPromises);
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

    async updateUsersWithNewGroupName(currentGroupName, newGroupName) {
      const allUsers = await this.listAllUsers();
      const relevantUsers = usersPrimaryGroupNameMatch(currentGroupName, allUsers);
      const updatedUsers = changeGroupReferences(currentGroupName, newGroupName, relevantUsers);
      const editGroupPromises = updatedUsers.map(this.editUserGroupNames);
      await Promise.all(editGroupPromises);
    }

    editUserGroupNames(user) {
      const { userID, primaryGroupName } = user;
      const lastEdit = new Date();
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'UPDATE users SET primaryGroupName = (?), lastEdit = (?) WHERE userID = (?)', [primaryGroupName, lastEdit, userID],
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
