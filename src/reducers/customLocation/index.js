// @flow
import { combineReducers } from 'redux';

import description from './description';
import search from './search';
import hash from './hash';
import state from './state';

export default combineReducers({ description, search, hash, state });
