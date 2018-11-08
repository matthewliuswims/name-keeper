import React from 'react';
import databaseConnection from './DatabaseConnection';

export default class GroupsDB extends React.Component {
    static singletonInstance;

    /**
     * @tutorial https://stackoverflow.com/questions/44719103/singleton-object-in-react-native
     * @tutorial https://stackoverflow.com/questions/28627908/call-static-methods-from-regular-es6-class-methods/28648214
     * BELOW IS IMPORTANT!!!
     *  When in context of a static method in JS or getter there is no "current instance" by intention and so
        'this' refers to the definition of current class
     */
    static getInstance() {
      // BELOW IS IMPORANT!!!!!!!!!!!!!!
      // this -> the class definition
      // GroupsDB.singletonInstance (once defined) -> class instance (i.e. instance of class)
      // this.singletonInstance -> class instance
      // i.e. GroupsDB.singletonInstance === this.singletonInstance
      if (!GroupsDB.singletonInstance) {
        GroupsDB.singletonInstance = new GroupsDB();
        this.singletonInstance.createTable().then(() => {
          return this.singletonInstance;
        });
      }
      return this.singletonInstance;
    }

    get dbConnection() {
      return databaseConnection.dbConnection;
    }

    /**
     * createTable() is a method, so only instances (e.g. this.singletonInstance) can call this method
     */
    createTable() {
      return new Promise((resolve, reject) => {
        GroupsDB.singletonInstance.dbConnection.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS groups (
              group_id INTEGER PRIMARY KEY NOT NULL, 
              name TEXT NOT NULL UNIQUE, 
              last_edit NOT NULL TEXT
            );`,
          );
        },
        err => reject(err),
        () => resolve('success'));
      });
    }

    addGroup(groupName) {
      const timeGroupAdded = new Date();
      return new Promise((resolve, reject) => {
        GroupsDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql('INSERT INTO groups (name, last_edit) values (?, ?)', [groupName, timeGroupAdded]);
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    listGroups() {
      return new Promise((resolve, reject) => {
        GroupsDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            // can get from executeSql
            tx.executeSql('SELECT * FROM groups', [], (_, { rows }) => {
              resolve(rows._array); //eslint-disable-line 
            });
          },
          err => reject(err),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }
}
