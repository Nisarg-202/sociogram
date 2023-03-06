import Axios from '../Request/Axios';

export const Login = function ({email, password, condition, name}) {
  return async function (dispatch) {
    await dispatch({type: 'ADD_ACTION', payload: {error: '', loading: true}});
    if (condition) {
      await Axios.post('/login', {email, password, name})
        .then(async function (response) {
          if (response.data.success) {
            await dispatch({
              type: 'ADD_ACTION',
              payload: {error: '', loading: false},
            });
            localStorage.setItem('SOCIO_TOKEN', response.data.token);
            await dispatch({type: 'LOGIN', payload: response.data.user});
          } else {
            await dispatch({
              type: 'ADD_ACTION',
              payload: {error: response.data.message, loading: false},
            });
            await dispatch({type: 'LOGOUT', payload: false});
          }
        })
        .catch(async function (err) {
          await dispatch({
            type: 'ADD_ACTION',
            payload: {error: '', loading: false},
          });
          await dispatch({type: 'LOGOUT', payload: false});
        });
    } else {
      await Axios.post('/signup', {email, password, name})
        .then(async function (response) {
          if (response.data.success) {
            localStorage.setItem('SOCIO_TOKEN', response.data.token);
            await dispatch({
              type: 'ADD_ACTION',
              payload: {error: '', loading: false},
            });
            await dispatch({type: 'LOGIN', payload: response.data.user});
          } else {
            await dispatch({
              type: 'ADD_ACTION',
              payload: {error: response.data.message, loading: false},
            });
            await dispatch({type: 'LOGOUT', payload: false});
          }
        })
        .catch(async function (err) {
          await dispatch({
            type: 'ADD_ACTION',
            payload: {error: '', loading: false},
          });
          await dispatch({type: 'LOGOUT', payload: false});
        });
    }
  };
};

export const checkAuth = function () {
  return async function (dispatch) {
    await dispatch({
      type: 'ADD_ACTION',
      payload: {error: '', loading: true},
    });
    await Axios.post('/checkAuth')
      .then(async function (response) {
        if (response.data.success) {
          await dispatch({
            type: 'ADD_ACTION',
            payload: {error: '', loading: false},
          });
          await dispatch({type: 'LOGIN', payload: response.data.user});
        } else {
          await dispatch({
            type: 'ADD_ACTION',
            payload: {error: '', loading: false},
          });
          await dispatch({type: 'LOGOUT', payload: false});
        }
      })
      .catch(async function (err) {
        await dispatch({
          type: 'ADD_ACTION',
          payload: {error: '', loading: false},
        });
        await dispatch({type: 'LOGOUT', payload: false});
      });
  };
};

export const Logout = function () {
  return async function (dispatch) {
    localStorage.removeItem('SOCIO_TOKEN');
    await dispatch({type: 'LOGOUT', payload: false});
  };
};

export const addPost = function ({title, description, image}) {
  return async function (dispatch) {
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('image', image);
    Axios.post('/addPost', data)
      .then(async function (response) {
        await dispatch(getPosts());
      })
      .catch(function (err) {
        console.log(err);
      });
  };
};

export const getPosts = function () {
  return async function (dispatch) {
    await dispatch({
      type: 'ADD_ACTION',
      payload: {error: '', loading: true},
    });
    await Axios.get('/getPosts')
      .then(async function (response) {
        if (response.data.success) {
          await dispatch({type: 'POSTS', payload: response.data.posts});
          await dispatch({
            type: 'ADD_ACTION',
            payload: {error: '', loading: false},
          });
        } else {
          alert(response.data.message);
          await dispatch({
            type: 'ADD_ACTION',
            payload: {error: '', loading: false},
          });
        }
      })
      .catch(async function (err) {
        alert(err.message);
        console.log(err.message);
        await dispatch({
          type: 'ADD_ACTION',
          payload: {error: '', loading: false},
        });
      });
  };
};

export const onLike = function (post) {
  return async function (dispatch) {
    await Axios.post('/like', post)
      .then(async function (response) {
        if (response.data.success) {
          await dispatch(getPosts());
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
};

export const getUsers = function () {
  return async function (dispatch) {
    await Axios.post('/getUser')
      .then(function (response) {
        if (response.data.success) {
          dispatch({type: 'USERS', payload: response.data.users});
        } else {
          dispatch({type: 'USERS', payload: []});
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
};

export const Search = function (search) {
  return async function (dispatch, getState) {
    const users = getState().users.filter(function (item) {
      return item._id != getState().auth;
    });
    const searches = [];
    if (search.length > 0) {
      users.forEach(function (item) {
        if (item.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
          searches.push(item);
        }
      });
      dispatch({type: 'SEARCH', payload: searches});
    } else {
      dispatch({type: 'SEARCH', payload: []});
    }
  };
};

export const Friends = function () {
  return function (dispatch) {
    Axios.post('/Friend')
      .then(async function (response) {
        if (response.data.success) {
          await dispatch({type: 'FRIENDS', payload: response.data.friends});
        } else {
          console.log(response.data.message);
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
};

export const onFollow = function (id) {
  return function (dispatch, getState) {
    Axios.post('/Follow', {from: getState().auth, to: id})
      .then(async function (response) {
        if (response.data.success) {
          await dispatch(Friends());
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
};

export const profileImage = function (image) {
  return function (dispatch) {
    const data = new FormData();
    data.append('image', image);
    Axios.post('/uploadImage', data)
      .then(async function (response) {
        if (response.data.success) {
          await dispatch(getUsers());
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (err) {
        alert(err.message);
      });
  };
};

export const deletePost = function (id) {
  return function (dispatch) {
    Axios.post('/deletePost', {id})
      .then(async function (response) {
        if (response.data.success) {
          await dispatch(getPosts());
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (err) {
        alert(err.message);
      });
  };
};

export const ProfileChange = function ({id, name, description}) {
  return function (dispatch) {
    Axios.post('/ProfileChange', {id, name, description})
      .then(async function (response) {
        if (response.data.success) {
          await dispatch(getUsers());
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (err) {
        alert(err.message);
      });
  };
};

export const getComment = function () {
  return function (dispatch) {
    Axios.get('/getComment')
      .then(async function (response) {
        if (response.data.success) {
          await dispatch({type: 'COMMENTS', payload: response.data.comments});
        } else {
          await dispatch({type: 'COMMENTS', payload: []});
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
};

export const addComment = function ({from, to, postId, comment}) {
  return function (dispatch) {
    Axios.post('/addComment', {from, to, comment, postId})
      .then(async function (response) {
        if (response.data.success) {
          await dispatch(getComment());
        } else {
          alert(response.data.message);
        }
      })
      .catch(function (err) {
        alert(err.message);
      });
  };
};

export const getMessage = function () {
  return function (dispatch) {
    Axios.get('/getMessage')
      .then(async function (response) {
        if (response.data.success) {
          await dispatch({type: 'MESSAGE', payload: response.data.messages});
        } else {
          console.log(response.data.message);
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };
};

export const addMessage = function ({from, to, message, socket}) {
  return function (dispatch) {
    socket.emit('sendMessage', {from, to, message});
    socket.on('broadcast', async function ({messages, success}) {
      if (success) {
        await dispatch({type: 'MESSAGE', payload: messages});
      } else {
        alert('Please Try Again!');
      }
    });
  };
};
