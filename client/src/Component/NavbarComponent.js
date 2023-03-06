import React, {useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Search, addPost, Logout} from '../action';
import SearchComponent from './SearchComponent';
import AddPostComponent from './AddPostComponent';

function NavbarComponent(props) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState();
  const photo = useRef();

  const [secondModal, setSecondModal] = useState(false);
  const [search, setSearch] = useState('');

  function onSecondModalShow() {
    setSecondModal(true);
  }

  function onSecondModalHide() {
    setSecondModal(false);
  }

  function onModalShow() {
    setShow(true);
  }

  function onModalHide() {
    setShow(false);
  }

  function onSearch(e) {
    setSearch(function () {
      return e.target.value;
    });
    props.Search(e.target.value);
  }

  function onTitleChange(e) {
    setTitle(e.target.value);
  }
  function onDescriptionChange(e) {
    setDescription(e.target.value);
  }
  function onImageChange(e) {
    setImage(e.target.files[0]);
    photo.current.src = URL.createObjectURL(e.target.files[0]);
    photo.current.onload = function () {
      URL.revokeObjectURL(photo.current.src);
    };
  }

  function onLogout() {
    props.Logout();
  }

  function onFormSubmit(e) {
    e.preventDefault();
    setShow(function (prevState) {
      return !prevState;
    });
    props.addPost({title, description, image});
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <SearchComponent
        onSearch={onSearch}
        searches={search}
        secondModal={secondModal}
        onSecondModalHide={onSecondModalHide}
      />
      <AddPostComponent
        show={show}
        onModalHide={onModalHide}
        onTitleChange={onTitleChange}
        title={title}
        onDescriptionChange={onDescriptionChange}
        description={description}
        photo={photo}
        onImageChange={onImageChange}
        onFormSubmit={onFormSubmit}
      />
      <Link className="navbar-brand" to="/">
        <i className="fas fa-hashtag"></i> Sociogram
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          {props.condition && (
            <li className="nav-item">
              <form className="form-inline my-2 my-lg-0">
                <input
                  onClick={onSecondModalShow}
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={onSecondModalShow}
                />
              </form>
            </li>
          )}
          {props.condition && (
            <li className="nav-item">
              <Link className="nav-link" onClick={onModalShow}>
                Add Post
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link
              className="nav-link"
              to={{pathname: props.condition ? '/profile' : '/'}}
            >
              {props.condition ? 'Profile' : 'Posts'}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/join">
              Chat
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" onClick={onLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function mapStateToProps(state) {
  return {
    search: state.search,
  };
}

export default connect(mapStateToProps, {Search, addPost, Logout})(
  NavbarComponent
);
