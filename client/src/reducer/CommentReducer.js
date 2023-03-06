export default function (state = [], action) {
  switch (action.type) {
    case 'COMMENTS':
      return action.payload;
    default:
      return state;
  }
}
