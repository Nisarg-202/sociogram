import React, {useState} from 'react';
import {connect} from 'react-redux';

import {Login} from '../action';

function AuthPage(props) {
  const [condition, setCondition] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  function onNameChange(e) {
    setName(e.target.value);
  }
  function onEmailChange(e) {
    setEmail(e.target.value);
  }
  function onPasswordChange(e) {
    setPassword(e.target.value);
  }
  function onButtonChange() {
    setCondition(!condition);
  }
  function onFormSubmit(e) {
    e.preventDefault();
    props.Login({email, password, condition, name});
  }

  return (
    <div className="container d-flex justify-content-center text-center">
      <div className="card shadow mt-3">
        <div className="card-header h5 text-info">Sociogram</div>
        <div className="card-body">
          <h5 className="card-title text-info">
            {condition ? 'Login' : 'Sign Up'}
          </h5>
          <form onSubmit={onFormSubmit}>
            {!condition && (
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  required
                  placeholder="Name ..."
                  onChange={onNameChange}
                  value={name}
                />
              </div>
            )}
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                required
                placeholder="Email ..."
                onChange={onEmailChange}
                value={email}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                minLength="6"
                required
                placeholder="Password ..."
                onChange={onPasswordChange}
                value={password}
              />
            </div>
            <p>{props.error.error && props.error.error}</p>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                {!props.error.loading && condition ? (
                  <i class="fas fa-sign-in-alt"></i>
                ) : (
                  <i class="fas fa-user-plus"></i>
                )}
                {props.error.loading ? (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : condition ? (
                  ' Login'
                ) : (
                  ' Sign Up'
                )}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={onButtonChange}
                className="btn btn-secondary btn-block"
              >
                {!props.error.loading && !condition ? (
                  <i class="fas fa-sign-in-alt"></i>
                ) : (
                  <i class="fas fa-user-plus"></i>
                )}
                {condition ? ' Sign Up' : ' Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {error: state.error, loading: state.loading};
}

export default connect(mapStateToProps, {Login})(AuthPage);
