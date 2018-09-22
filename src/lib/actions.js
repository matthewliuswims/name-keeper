export default function makeAction(actionType, payload) {
  return {
    type: actionType,
    payload,
  };
}
