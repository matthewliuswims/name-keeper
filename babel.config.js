module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        // will remove unused imports - https://callstack.github.io/react-native-paper/getting-started.html
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
