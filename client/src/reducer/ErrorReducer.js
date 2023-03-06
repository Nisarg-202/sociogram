export default function (state = {error: '', loading: false}, action) {
  switch (action.type) {
    case 'ADD_ACTION':
      return action.payload;
    default:
      return state;
  }
}
