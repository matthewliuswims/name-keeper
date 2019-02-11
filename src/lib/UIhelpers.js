/**
 * @tutorial https://reactnavigation.org/docs/en/header-buttons.html#header-interaction-with-its-screen-component
 * for onPress we need a noOp, otherwise we'd get an error, because React Navigation does NOT guarantee
 * that the screen component will be mounted before the header.
 */
export default function noOp() {
  console.log('please try again in a second'); // eslint-disable-line no-console
}
