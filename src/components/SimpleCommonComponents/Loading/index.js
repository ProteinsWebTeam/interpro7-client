// @flow
import React from 'react';
import T from 'prop-types';
import classnames from 'classnames/bind';

import style from './style.css';

const s = classnames.bind(style);

const Loading = ({ inline = false } /*: {inline?: boolean}*/) => (
  <div className={s('loading-spinner', { inline })}>
    <div />
    <div />
    <div />
  </div>
);
Loading.propTypes = {
  inline: T.bool,
};

export default Loading;
