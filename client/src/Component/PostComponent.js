import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Modal} from 'react-bootstrap';
import {onLike, addComment} from '../action';

import CardComponent from './CardComponent';

function PostComponent(props) {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const [name, setName] = useState(
    props.users.find(function (item) {
      return item._id === props.id;
    })
  );
  const [myLike, setMyLike] = useState(
    props.post.like.length > 0
      ? props.post.like.filter(function (item) {
          return item === props.auth;
        })
      : []
  );

  useEffect(
    function () {
      setComments(
        props.comments.length > 0
          ? props.comments
              .filter(function (item) {
                return item.postId === props.post._id;
              })
              .map(function (c) {
                let foundUser = props.users.find(function (user) {
                  return user._id === c.from;
                });
                return {comment: c.comment, ...foundUser};
              })
          : []
      );
    },
    [props.comments]
  );

  function onLike(post) {
    props.onLike(post);
  }

  function onCommentChange(e) {
    setComment(e.target.value);
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    await props.addComment({
      from: props.auth,
      to: props.post.userId,
      postId: props.post._id,
      comment,
    });
    setComment('');
  }

  function onModalHide() {
    setShow(false);
  }

  function onModalShow() {
    setShow(true);
  }

  if (props.post.userId !== props.id) {
    return null;
  }

  return (
    <div className="container text-center d-flex justify-content-center my-3">
      <Modal show={show} onHide={onModalHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            {comments.map(function (item) {
              return <CardComponent item={item} condition={false} />;
            })}
          </div>
        </Modal.Body>
      </Modal>
      <div className="card shadow">
        <div className="card-header d-flex justify-content-start">
          <img
            alt="Image"
            height="50"
            width="50"
            style={{borderRadius: '100%'}}
            src={`${name.profileImageUrl}`}
          />
          <Link
            to={{pathname: '/profile', state: name}}
            className="ml-3 mt-2 text-muted"
            style={{fontWeight: 'bold', textDecoration: 'none'}}
          >
            {name.name}
          </Link>
        </div>
        <img
          alt="Post Image"
          className="card-img-top"
          src={`${props.post.imageUrl}`}
        />
        <div className="card-body">
          <h5 className="card-title text-muted">{props.post.title}</h5>
          <p className="card-text text-muted">{props.post.description}</p>
          <button
            className="btn btn-primary"
            onClick={function () {
              onLike(props.post);
            }}
          >
            {myLike.length > 0 ? 'Unlike' : 'Like'} : {props.post.like.length}
          </button>
          <form onSubmit={onFormSubmit} className="my-2">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Add Comment"
                onChange={onCommentChange}
                value={comment}
                required
              />
              <div className="input-group-append">
                <button className="btn btn-secondary">Comment</button>
              </div>
            </div>
          </form>
          {comments.length > 0 && (
            <Link onClick={onModalShow}>
              There are {comments.length} Comments
            </Link>
          )}
        </div>
        <div className="card-footer">
          <p className="text-muted" style={{fontWeight: 'bold'}}>
            Created At {new Date(props.post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {auth: state.auth, users: state.users, comments: state.comments};
}

export default connect(mapStateToProps, {onLike, addComment})(PostComponent);
