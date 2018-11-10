import React from 'react';
import databaseConnection from './DatabaseConnection';

// see GroupsDB for good documentation, as this class mimics GroupsDB structure
export default class UsersDB extends React.Component {
    static singletonInstance;

    static getInstance() {
      if (!UsersDB.singletonInstance) {
        UsersDB.singletonInstance = new UsersDB();
        this.singletonInstance.createTable().then(() => {
          return this.singletonInstance;
        });
      }
      return this.singletonInstance;
    }

    get dbConnection() {
      return databaseConnection.dbConnection;
    }

    createTable() {
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
              user_id INTEGER PRIMARY KEY NOT NULL, 
              name TEXT NOT NULL UNIQUE, 
              description TEXT NOT NULL UNIQUE,
              last_edit NOT NULL TEXT,
              group_id NOT NULL INTEGER,
              group_id_2 INTEGER,
              group_id_3 INTEGER,
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
              'INSERT INTO users (name, description, last_edit, group_id, group_id_2, group_id_3, location) values (?, ?, ?, ?, ?, ?, ?)',
              [user.userName,
                user.description,
                timeUserAdded,
                user.group_id,
                user.group_id_2,
                user.group_id_3,
                user.location,
              ],
            );
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    listUsers() {
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
