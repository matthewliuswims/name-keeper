import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');
/**
 * have a getter function as part of the object, so the dbConnection is not directly
 * exposed.
 */
const databaseConnection = {
  get dbConnection() {
    return db;
  },
};

export default databaseConnection;
