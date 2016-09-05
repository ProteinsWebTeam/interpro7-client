import React, {PropTypes as T} from 'react';

const Error = ({error}) => (
  <div style={{backgroundColor: 'red'}}>
    {String(error.message || 'Unknown error')}
  </div>
);
Error.propTypes = {
  error: T.any.isRequired,
};

export default Error;
