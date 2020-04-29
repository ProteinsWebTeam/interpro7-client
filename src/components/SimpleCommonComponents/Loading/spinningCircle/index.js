// @flow
import React from 'react';
import { foundationPartial } from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);

const SpinningCircle = () => <div className={f('loader', 'awesome-spin')} />;

export default SpinningCircle;
