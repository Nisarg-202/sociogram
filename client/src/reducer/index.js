import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import ErrorReducer from './ErrorReducer';
import PostReducer from './PostReducer';
import UserReducer from './UserReducer';
import SearchReducer from './SearchReducer';
import FriendReducer from './FriendReducer';
import CommentReducer from './CommentReducer';
import MessageReducer from './MessageReducer';

export default combineReducers({
  auth: AuthReducer,
  error: ErrorReducer,
  posts: PostReducer,
  users: UserReducer,
  search: SearchReducer,
  friend: FriendReducer,
  comments: CommentReducer,
  messages: MessageReducer,
});
