import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {io} from 'socket.io-client';
import {addMessage} from '../action';
import MessageComponent from '../Component/MessageComponent';

let socket;

function JoinPage(props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatFriends, setChatFriends] = useState([]);

  function userMessage() {
    if (props.messages.length > 0) {
      const currentMessages = props.messages.filter(function (item) {
        return (
          (item.from == chatUser._id || item.from == props.auth) &&
          (item.to == chatUser._id || item.to == props.auth)
        );
      });
      setMessages(
        currentMessages.sort(function (a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        })
      );
    } else {
      setMessages([]);
    }
  }

  useEffect(function () {
    socket = io('https://immense-woodland-13360.herokuapp.com');
    return function () {
      socket.disconnect();
    };
  }, []);

  useEffect(
    function () {
      if (chatUser) {
        userMessage();
      }
    },
    [chatUser, props.messages]
  );

  useEffect(
    function () {
      const users = [];
      const friends = [];
      props.friend.forEach(function (item) {
        if (item.from == props.auth) {
          users.push(item.to);
        }
      });
      props.friend.forEach(function (item) {
        if (item.to == props.auth) {
          users.push(item.from);
        }
      });
      _.uniq(users).forEach(function (item) {
        props.users.forEach(function (user) {
          if (user._id == item) {
            friends.push(user);
          }
        });
      });
      setChatFriends(friends);
    },
    [props.friend]
  );

  function onMessageChange(e) {
    setMessage(e.target.value);
  }

  async function onHandleChange(e) {
    e.preventDefault();
    await props.addMessage({
      from: props.auth,
      to: chatUser._id,
      message,
      socket,
    });
    setMessage('');
  }

  return (
    <div className="container row mt-3">
      <div className="col-lg-4 col-md-6 col-sm-12">
        {chatFriends.length > 0 ? (
          chatFriends.map(function (item) {
            return (
              <div
                onClick={function () {
                  setChatUser(item);
                }}
                style={{cursor: 'pointer'}}
                className="shadow-sm mt-3 d-flex justify-content-start align-items-center p-2"
              >
                <img
                  className="mr-3"
                  src={`${item.profileImageUrl}`}
                  height="40"
                  width="40"
                  style={{border: 1, borderRadius: '100%'}}
                />
                <p className="mt-2">{item.name}</p>
              </div>
            );
          })
        ) : (
          <h4>No Friends Found!</h4>
        )}
      </div>
      <div className="col-lg-8 col-md-6 col-sm-12 d-flex justify-content-center">
        {chatUser && (
          <div className="container d-flex justify-content-center my-3">
            <div className="card shadow">
              <form onSubmit={onHandleChange}>
                <div className="card-header text-center text-secondary">
                  <h5 className="card-title">{chatUser.name}</h5>
                </div>
                <div
                  className="card-body"
                  style={{height: '500px', overflowY: 'scroll'}}
                >
                  {messages.length > 0 &&
                    messages.map(function (item) {
                      return item.from == props.auth ? (
                        <MessageComponent
                          className="d-flex justify-content-end"
                          name="You"
                          message={item.message}
                        />
                      ) : (
                        <MessageComponent
                          className="d-flex justify-content-start"
                          message={item.message}
                          name={chatUser.name}
                        />
                      );
                    })}
                </div>
                <div className="card-footer">
                  <div className="input-group">
                    <input
                      className="form-control"
                      required
                      onChange={onMessageChange}
                      value={message}
                      type="text"
                      placeholder="Type Message ..."
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    friend: state.friend,
    auth: state.auth,
    users: state.users,
    messages: state.messages,
  };
}

export default connect(mapStateToProps, {addMessage})(JoinPage);
