import React from 'react';

function MessageComponent(props) {
  return (
    <div className={props.className}>
      <div className="bg-primary m-2 p-2 text-white rounded shadow">
        <blockquote className="blockquote">
          <p className="mb-0 text-white">{props.message}</p>
          <footer className="blockquote-footer text-dark">
            {props.name}
          </footer>
        </blockquote>
      </div>
    </div>
  );
}

export default MessageComponent;
