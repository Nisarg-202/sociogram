import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {checkAuth} from './action';
import HomePage from './Pages/HomePage';
import AuthPage from './Pages/AuthPage';
import LoadingPage from './Pages/LoadingPage';
import ProfilePage from './Pages/ProfilePage';
import JoinPage from './Pages/JoinPage';

function App(props) {
  const [condition, setCondition] = useState(null);
  useEffect(function () {
    props.checkAuth();
  }, []);
  useEffect(
    function () {
      if (props.auth === null) {
        setCondition(null);
      } else if (props.auth === false) {
        setCondition(false);
      } else {
        setCondition(true);
      }
    },
    [props.auth]
  );
  let router;
  if (condition === null) {
    router = (
      <Switch>
        <Route path="/" component={LoadingPage} exact />
        <Redirect to="/" exact />
      </Switch>
    );
  } else if (condition === false) {
    router = (
      <Switch>
        <Route path="/" component={AuthPage} exact />
        <Redirect to="/" exact />
      </Switch>
    );
  } else {
    router = (
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/profile" component={ProfilePage} exact />
        <Route path="/join" component={JoinPage} exact />
        <Redirect to="/" />
      </Switch>
    );
  }
  return <BrowserRouter>{router}</BrowserRouter>;
}

function mapStateToProps(state) {
  return {auth: state.auth};
}

export default connect(mapStateToProps, {checkAuth})(App);
