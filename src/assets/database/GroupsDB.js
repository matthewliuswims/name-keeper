import React from 'react';
import databaseConnection from './DatabaseConnection';

/**
 * use redux for this...so here's we'll be dispatching actions setting status of the error thing?
 */
export default class GroupsDB extends React.Component {
    static singletonInstance;

    /**
     * @tutorial https://stackoverflow.com/questions/28627908/call-static-methods-from-regular-es6-class-methods/28648214
     * BELOW IS IMPORTANT!!!
     *  When in context of a static method in JS or getter there is no "current instance" by intention and so
        this is available to refer to the definition of current class directly
     */
    static getInstance() {
      // BELOW IS IMPORANT!!!!!!!!!!!!!!
      // this -> the class definition
      // GroupsDB.singletonInstance -> class instance
      // this.singletonInstance -> class instance
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
     * createTable() is a method, so only instances can call this method, MEANING:
     * this -> GroupsDB.singletonInstance
     * this.singletonInstance -> UNDEFINED
     */
    createTable() {
      return new Promise((resolve, reject) => {
        GroupsDB.singletonInstance.dbConnection.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS groups (
              id INTEGER PRIMARY KEY NOT NULL, 
              name TEXT, 
              date TEXT
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
            tx.executeSql('INSERT INTO groups (name, date) values (?, ?)', [groupName, timeGroupAdded]);
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
