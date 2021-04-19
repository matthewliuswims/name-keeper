import Constants from "expo-constants";

// https://docs.expo.io/distribution/release-channels/ <-- 1st way
// https://docs.expo.io/workflow/configuration/ <-- 2nd way
function getEnvironment() {
  let releaseChannel = Constants.manifest.releaseChannel;

  if (releaseChannel === undefined) {
    return { envName: "DEVELOPMENT", host: "http://192.168.50.78:3000" }; // dev env settings
  }

  return { envName: "PRODUCTION", host: "@TODO" }; // prod env settings
}

export function getHost() {
  return getEnvironment().host;
}
