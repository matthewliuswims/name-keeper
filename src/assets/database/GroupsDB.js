import Sentry from 'sentry-expo';
import React from 'react';
import databaseConnection from './DatabaseConnection';
import { nextColor } from '../../lib/groupColors';

import UsersDB from './UsersDB';

import { getMessage } from '../../lib/errors/errors';

import { MAXIMUM_GROUP_SIZE, DUPLICATE_GROUP_NAME, PLACE_HOLDER_DEFAULT } from '../../lib/errors/overrides';

const GROUP_NUMBER_LIMIT = 8;
// Why do we set a hard limit to the maxmimum number of groups a phone-user can have?
// because: a) limit clutter b) want control over specific colors

export default class GroupsDB extends React.Component {
    static singletonInstance;

    /**
     * @tutorial https://stackoverflow.com/questions/44719103/singleton-object-in-react-native
     * @tutorial https://stackoverflow.com/questions/28627908/call-static-methods-from-regular-es6-class-methods/28648214
     * BELOW IS IMPORTANT!!!
     *  When in context of a static method in JS or getter there is no "current instance" by intention and so
        'this' refers to the definition of current class
        @return {Promise<Object>} - promise that will resolve with the instance
     */
    static getInstance() {
      // BELOW IS IMPORANT!!!!!!!!!!!!!!
      // this -> the class definition
      // GroupsDB.singletonInstance (once defined) -> class instance (i.e. instance of class)
      // this.singletonInstance -> class instance
      // i.e. GroupsDB.singletonInstance === this.singletonInstance

      // everytime the app is loaded, the below block of code will be loaded
      // but afterwards (for the duration of the app session) we will go to the
      // return New Promise code block
      if (!GroupsDB.singletonInstance) {
        GroupsDB.singletonInstance = new GroupsDB();
        return this.singletonInstance.createTable().then((success) => {
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

    /**
     * createTable() is a method, so only instances (e.g. this.singletonInstance) can call this method
     */
    createTable() {
      return new Promise((resolve, reject) => {
        GroupsDB.singletonInstance.dbConnection.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS groups (
              groupID INTEGER PRIMARY KEY NOT NULL, 
              name TEXT NOT NULL UNIQUE, 
              color TEXT NOT NULL UNIQUE, 
              lastEdit DATE NOT NULL,
              createdDate DATE NOT NULL
            );`,
          );
        },
        err => reject(this.parsedSQLError(err)),
        () => resolve('successfully created table or successfully did not create table because it was already there'));
      });
    }

    async editGroup(currentGroupName, newGroupName) {
      const usersDBInstance = await UsersDB.getInstance();
      await usersDBInstance.updateUsersWithNewGroupName(currentGroupName, newGroupName);
      await this.editGroupName(currentGroupName, newGroupName);
    }

    async editGroupName(currentGroupName, newGroupName) {
      const lastEdit = new Date();
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'UPDATE groups SET name = (?), lastEdit = (?) WHERE name = (?)', [newGroupName, lastEdit, currentGroupName],
            );
          },
          err => reject(this.parsedSQLError(err)),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    async deleteGroup(groupName) {
      const usersDBInstance = await UsersDB.getInstance();
      await usersDBInstance.updateUsersGroupDelete(groupName);
      await this.deleteGroupFromDB(groupName);
    }

    deleteGroupFromDB(groupName) {
      return new Promise((resolve, reject) => {
        UsersDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql(
              'DELETE FROM groups WHERE name = (?)', [groupName],
            );
          },
          err => reject(this.parsedSQLError(err)),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    parsedSQLError = (err, overrides = null) => {
      // getMessage will usually just return the default generic messsage
      // that is unless there's an overrides sql object.
      const errMsg = getMessage(err, overrides);
      // known error messages for group-related errors.
      const knownErrorMessages = [MAXIMUM_GROUP_SIZE.message, DUPLICATE_GROUP_NAME.message, PLACE_HOLDER_DEFAULT.message];

      if (!knownErrorMessages.includes(errMsg)) {
        Sentry.captureException(err);
      }

      return new Error(errMsg);
    }

    async addGroup(groupName) {
      const timeGroupAdded = new Date();
      let groups;

      try {
        groups = await this.listGroups();
      } catch (e) {
        throw e;
      }

      if (groups.length >= GROUP_NUMBER_LIMIT) {
        throw new Error(MAXIMUM_GROUP_SIZE.message);
      }

      const groupColors = [];

      for (const group of groups) {
        groupColors.push(group.color);
      }

      const nextGrpColor = nextColor(groupColors);

      return new Promise((resolve, reject) => {
        GroupsDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            tx.executeSql('INSERT INTO groups (name, lastEdit, createdDate, color) values (?, ?, ?, ?)', [groupName, timeGroupAdded, timeGroupAdded, nextGrpColor]);
          },
          // will give custom error if err happens to match DUPLICATE_GROUP_NAME code.
          err => reject(this.parsedSQLError(err, DUPLICATE_GROUP_NAME)),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }

    listGroups() {
      return new Promise((resolve, reject) => {
        GroupsDB.singletonInstance.dbConnection.transaction(
          (tx) => {
            // can get from executeSql
            tx.executeSql('SELECT * FROM groups ORDER BY createdDate;', [], (_, { rows }) => {
              resolve(rows._array); //eslint-disable-line 
            });
          },
          err => reject(this.parsedSQLError(err)),
          () => resolve('success'), // executeSql doesn't requre anything, so we can't resolve with anything meaningful
        );
      });
    }
}
