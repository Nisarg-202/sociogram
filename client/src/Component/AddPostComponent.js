import React from 'react';
import {Modal} from 'react-bootstrap';

function AddPostComponent(props) {
  return (
    <Modal show={props.show} onHide={props.onModalHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>ADD POST</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={props.onFormSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              required
              placeholder="Title ..."
              onChange={props.onTitleChange}
              value={props.title}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              required
              placeholder="Description ..."
              onChange={props.onDescriptionChange}
              value={props.description}
            />
          </div>
          <div className="form-group">
            <img
              ref={props.photo}
              height="100"
              width="100"
              style={{height: 100, width: 100, border: 1}}
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              className="form-control-file"
              required
              onChange={props.onImageChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            POST
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default AddPostComponent;
