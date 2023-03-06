export default function (state = [], action) {
  switch (action.type) {
    case 'FRIENDS':
      return action.payload;
    default:
      return state;
  }
}
