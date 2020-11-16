import AsyncStorage from "@react-native-async-storage/async-storage";

/***
 * @param {string} resourceType
 * @return {Promise<Array>}
 */
const getResource = async (resourceType) => {
  const resource = await AsyncStorage.getItem(resourceType);
  if (!resource) return [];
  return JSON.parse(resource);
};

/***
 * @param {string} resourceType
 * @return {Promise}
 */
const setResource = async (resourceType, resource) => {
  const resourceStringified = JSON.stringify(resource);
  return await AsyncStorage.setItem(resourceType, resourceStringified);
};

const validateAsString = (input) => {
  const validString = input && typeof input == "string";
  if (!validString)
    throw Error(`expected input to be valid string, got ${input}`);
  return true;
};

const validateAsObject = (input) => {
  const validItem =
    input && typeof input == "object" && input.hasOwnProperty("id");
  if (!validItem)
    throw Error(`expected input to be valid object, got ${input}`);
  return true;
};

/**
 * @param {string} key
 * @param {string} resource
 */
export const deleteResource = async ({ key, resource: resourceParam }) => {
  validateAsString(key) && validateAsString(resourceParam);

  const resource = await getResource(resourceParam);
  const resourceUpdated = resource.filter((item) => item.id !== key);
  return await setResource(resourceParam, resourceUpdated);
};

/**
 * @param {string} key
 * @param {object} item
 * @param {string} resource
 */
export const editItem = async ({
  key,
  item: itemParam,
  resource: resourceParam,
}) => {
  validateAsString(key) &&
    validateAsString(resourceParam) &&
    validateAsObject(itemParam);

  const resource = await getResource(resourceParam);
  const resourceUpdated = resource.map((item) => {
    if (item.id === key) return itemParam;
    return item;
  });
  return await setResource(resourceParam, resourceUpdated);
};
/***
 * @param {string} key
 * @param {string} resource
 */
export const getItem = async ({ key, resource: resourceParam }) => {
  validateAsString(key) && validateAsString(resourceParam);

  const resource = await getResource(resourceParam);
  return resource.find((item) => item.id === key);
};

/***
 * @param {object} item
 * @param {string} resource
 */
export const addItem = async ({ item, resource: resourceParam }) => {
  validateAsString(resourceParam) && validateAsObject(item);

  const resource = await getResource(resourceParam);
  const resourceNew = [...resource, item];
  return await setResource(resourceParam, resourceNew);
};
