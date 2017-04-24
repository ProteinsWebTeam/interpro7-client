import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

const ObjectList = ({object}) => {
  const base = location.pathname + (location.pathname.endsWith('/') ? '' : '/');
  return (
    <ul>
      {Object.entries(object).map(([key, value]) => (
        <li key={key}>
          {`${key}: `}
          {
            typeof value === 'object' ?
              <ObjectList object={value || {}} /> :
              (
                <span>
                  <Link to={`${base}${key}`}>{String(value)}</Link>|
                  <Link to={`${base}${value}`}>{String(value)}</Link>
                </span>
              )
          }
        </li>
      ))}
    </ul>
  );
};

ObjectList.propTypes = {
  object: T.oneOfType([T.object, T.array]).isRequired,
};

export default ObjectList;
