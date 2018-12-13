import React from 'react';
import databaseConnection from './DatabaseConnection';

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
