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
              name TEXT NOT NULL UNIQUE, 
              description TEXT NOT NULL,
              createdDate TEXT NOT NULL UNIQUE,
              lastEdit TEXT NOT NULL,
              groupNameOne TEXT NOT NULL,
              groupNameTwo TEXT,
              groupNameThree TEXT,
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
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'INSERT INTO users (name, description, createdDate, lastEdit, groupNameOne, groupNameTwo, groupNameThree, location) values (?, ?, ?, ?, ?, ?, ?, ?)',
              [user.name,
                user.description,
                timeUserAdded,
                timeUserAdded,
                user.groupNameOne,
                user.groupNameTwo,
                user.groupNameThree,
                user.location,
              ],
            );
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    listUsers(groupName) {
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            // can get from executeSql
            tx.executeSql('SELECT * FROM users WHERE groupNameOne = ? OR groupNameTWO = ? OR groupNameThree = ? ORDER BY timeUserAdded;',
              [groupName,
                groupName,
                groupName,
              ],
              (_, { rows }) => {
                resolve(rows._array); //eslint-disable-line 
              });
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }
}
