import React, {useState, useRef, useEffect} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {
  addPost,
  getPosts,
  Logout,
  Search,
  getUsers,
  Friends,
  getComment,
  getMessage,
} from '../action';
import LoadingPage from './LoadingPage';
import PostComponent from '../Component/PostComponent';
import NavbarComponent from '../Component/NavbarComponent';

function HomePage(props) {
  const [followPost, setFollowPost] = useState([]);

  useEffect(
    function () {
      const users = [];
      props.friend.forEach(function (item) {
        if (item.from === props.auth) {
          users.push(item.to);
        }
      });
      props.friend.forEach(function (item) {
        if (item.to === props.auth) {
          users.push(item.from);
        }
      });
      users.push(props.auth);
      setFollowPost(_.uniq(users));
    },
    [props.friend]
  );
  useEffect(async function () {
    await props.getComment();
  }, []);
  useEffect(async function () {
    await props.getPosts();
  }, []);
  useEffect(async function () {
    await props.getUsers();
  }, []);
  useEffect(async function () {
    await props.Friends();
  }, []);
  useEffect(async function () {
    await props.getMessage();
  }, []);

  if (props.error.loading) {
    return <LoadingPage />;
  }
  return (
    <div className="">
      <NavbarComponent condition={true} />
      {followPost.length > 0 &&
        props.posts.length > 0 &&
        followPost.map(function (id) {
          return props.posts.map(function (post) {
            return <PostComponent post={post} id={id} key={id} />;
          });
        })}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    error: state.error,
    posts: state.posts,
    auth: state.auth,
    search: state.search,
    friend: state.friend,
  };
}

export default connect(mapStateToProps, {
  addPost,
  getPosts,
  Logout,
  getComment,
  Search,
  getUsers,
  Friends,
  getMessage,
})(HomePage);
