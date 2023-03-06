import React from 'react';
import {Modal} from 'react-bootstrap';
import {connect} from 'react-redux';

import CardComponent from './CardComponent';

function SearchComponent(props) {
  return (
    <Modal show={props.secondModal} onHide={props.onSecondModalHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <input
            class="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={props.onSearch}
            value={props.searches}
          />
          {props.search.length > 0 &&
            props.search.map(function (item) {
              return <CardComponent item={item} condition={true} />;
            })}
        </div>
      </Modal.Body>
    </Modal>
  );
}

function mapStateToProps(state) {
  return {
    search: state.search,
  };
}

export default connect(mapStateToProps)(SearchComponent);
