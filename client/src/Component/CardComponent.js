import React from 'react';
import {Link} from "react-router-dom";

function CardComponent(props) {
  return (
    <Link
      key={props.item._id}
      to={{pathname: '/profile', state: props.item}}
      className="border shadow p-3 d-flex justify-content-between my-2"
      style={{width: '100%', textDecoration: 'none'}}
    >
      <div className="d-flex align-items-center mr-3">
        <img
          alt={`${props.item.name} image`}
          src={`${props.item.profileImageUrl}`}
          height="100"
          width="100"
          style={{borderRadius: '100%'}}
        />
      </div>
      {props.condition ? (
        <div className="d-flex align-items-center">
          <p>{props.item.name}</p>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center text-dark">
          <div className="">
            <p>Name : {props.item.name}</p>
          </div>
          <div className="">
            <p>Comment : {props.item.comment}</p>
          </div>
        </div>
      )}
    </Link>
  );
}

export default CardComponent;
