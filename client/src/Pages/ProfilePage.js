import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import {
  Search,
  onFollow,
  profileImage,
  Logout,
  deletePost,
  ProfileChange,
} from '../action';
import {Modal} from 'react-bootstrap';

import NavbarComponent from '../Component/NavbarComponent';

function ProfilePage(props) {
  const [show, setShow] = useState(false);
  const [myPosts, setMyPosts] = useState();
  const [myProfile, setMyProfile] = useState();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowed, setIsFollowed] = useState();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState();
  const fileRef = useRef();

  useEffect(
    function () {
      setName(function () {
        return myProfile ? myProfile.name : '';
      });
      setDescription(function () {
        return myProfile
          ? myProfile.description
            ? myProfile.description
            : ''
          : '';
      });
    },
    [myProfile]
  );

  useEffect(
    function () {
      if (props.location.state) {
        setIsFollowed(
          props.friend.find(function (item) {
            return (
              item.to == props.location.state._id && item.from == props.auth
            );
          })
        );
      }
    },
    [props.friend]
  );

  useEffect(
    function () {
      setMyPosts(
        props.posts.length > 0
          ? props.posts.filter(function (item) {
              return (
                item.userId ==
                ((props.location.state && props.location.state._id) ||
                  props.auth)
              );
            })
          : []
      );
    },
    [props.posts]
  );

  useEffect(
    function () {
      setMyProfile(
        props.users.find(function (item) {
          return (
            item._id ==
            ((props.location.state && props.location.state._id) || props.auth)
          );
        })
      );
    },
    [props.users]
  );

  useEffect(
    function () {
      setFollowers(
        props.friend.filter(function (item) {
          return (
            item.to ==
            ((props.location.state && props.location.state._id) || props.auth)
          );
        })
      );
    },
    [props.friend]
  );

  useEffect(
    function () {
      setFollowing(
        props.friend.filter(function (item) {
          return (
            item.from ==
            ((props.location.state && props.location.state._id) || props.auth)
          );
        })
      );
    },
    [props.friend]
  );

  useEffect(function () {
    props.Search('');
  }, []);

  function onFriendFollow() {
    props.onFollow(myProfile._id);
  }

  async function onDeletePost(id) {
    await props.deletePost(id);
  }

  function onFileUpload(e) {
    setFile(function () {
      return e.target.files[0];
    });
    fileRef.current.src = URL.createObjectURL(e.target.files[0]);
    fileRef.current.onload = function () {
      URL.revokeObjectURL(fileRef.current.src);
    };
    props.profileImage(e.target.files[0]);
  }

  function onModalHide() {
    setShow(false);
  }

  function onModalShow() {
    setShow(true);
  }

  function onNameChange(e) {
    setName(e.target.value);
  }

  function onDescriptionChange(e) {
    setDescription(e.target.value);
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    await props.ProfileChange({name, description, id: props.auth});
    onModalHide();
  }

  return (
    <div className="">
      <Modal show={show} onHide={onModalHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>EDIT PROFILE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onFormSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                onChange={onNameChange}
                value={name}
                required
                placeholder="Your Name"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                onChange={onDescriptionChange}
                value={description}
                placeholder="About YourSelf"
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary" type="submit">
                Update
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <NavbarComponent condition={false} />
      <div className="d-flex flex-column align-items-center container">
        <div className="d-flex flex-column align-items-center">
          <img
            className="mt-2"
            ref={fileRef}
            height="150"
            width="150"
            src={myProfile && `${myProfile.profileImageUrl}`}
            style={{border: 1, borderRadius: '100%'}}
          />
          {myProfile && props.auth == myProfile._id && (
            <input
              type="file"
              className="form-control-file mt-2"
              onChange={onFileUpload}
            />
          )}
          {myProfile && <h5 className="mt-3">{myProfile.name}</h5>}
          {myProfile && myProfile.description && (
            <p className="mt-1">{myProfile.description}</p>
          )}
          {myProfile && props.auth == myProfile._id && (
            <button className="btn btn-primary mt-1" onClick={onModalShow}>
              Edit Profile
            </button>
          )}
        </div>
        <div className="d-flex justify-content-center my-3">
          <p className="mx-4 text-muted" style={{fontWeight: 'bold'}}>
            Followers : {followers ? followers.length : 0}
          </p>
          <p className="mx-4 text-muted" style={{fontWeight: 'bold'}}>
            Following : {following ? following.length : 0}
          </p>
        </div>
        <div className="my-2">
          {myProfile && props.auth != myProfile._id && (
            <button className="btn btn-secondary" onClick={onFriendFollow}>
              {isFollowed ? 'UnFollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>
      {myPosts && myPosts.length > 0 ? (
        myPosts.map(function (item) {
          return (
            <div
              className="container text-center d-flex justify-content-center my-3"
              key={item._id}
            >
              <div className="card shadow">
                <img className="card-img-top" src={`${item.imageUrl}`} />
                <div className="card-body">
                  <h5 className="card-title text-muted">{item.title}</h5>
                  <p className="card-text text-muted">{item.description}</p>
                  <h6 className="card-subtitle text-muted">
                    Likes : {item.like.length}
                  </h6>
                  {myProfile && props.auth == myProfile._id && (
                    <button
                      className="btn btn-danger my-2"
                      onClick={function () {
                        onDeletePost(item._id);
                      }}
                    >
                      Delete Post
                    </button>
                  )}
                </div>
                <div className="card-footer">
                  <p className="text-muted" style={{fontWeight: 'bold'}}>
                    Created At {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="d-flex flex-column container align-items-center mt-3">
          <h4 className="text-muted">No Posts</h4>
          <i class="far fa-folder-open fa-7x mt-3 text-muted"></i>
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    posts: state.posts,
    auth: state.auth,
    users: state.users,
    friend: state.friend,
    comments: state.comments,
  };
}

export default connect(mapStateToProps, {
  Search,
  onFollow,
  profileImage,
  Logout,
  deletePost,
  ProfileChange,
})(ProfilePage);
