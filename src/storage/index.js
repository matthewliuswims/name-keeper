import AsyncStorage from "@react-native-async-storage/async-storage";
import * as CONSTANTS from "./constants";

/***
 * @param {Object} obj - An object.
 * @param {string} obj.key - key in async storage
 * @param {string} obj.type - type of key (enum)
 * @return {Promise} - resolves to be string or null
 */
export const getFromStorage = async ({ key, type = CONSTANTS.TYPE_OBJECT }) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (type === CONSTANTS.TYPE_OBJECT) {
      return value != null ? JSON.parse(value) : null;
    }
    // otherwise is string, number, etc...
    return value;
  } catch (e) {
    console.error(
      "could not get item from storage with type",
      type,
      "and error",
      e
    );
  }
};

/***
 * @param {Object} obj - An object.
 * @param {string} obj.key - key in async storage
 * @param {any} obj.value - value in async storage
 * @param {string} obj.type - type of key (enum)
 * @return {Promise}
 */
export const setInStorage = async ({
  key,
  value,
  type = CONSTANTS.TYPE_OBJECT,
}) => {
  try {
    if (type === CONSTANTS.TYPE_OBJECT) {
      const jsonValue = JSON.stringify(value);
      return await AsyncStorage.setItem(key, jsonValue);
    }
    // otherwise is string, number, etc...
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(
      "could not set item to storage with type",
      type,
      "and error",
      e
    );
  }
};
