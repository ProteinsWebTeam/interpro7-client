// @flow
import { combineReducers } from 'redux';

import sideNav from './sideNav';
import emblMapNav from './emblMapNav';
import stuck from './stuck';

export default combineReducers({ sideNav, emblMapNav, stuck });
