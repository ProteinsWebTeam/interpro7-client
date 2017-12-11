import {combineReducers} from 'redux';

import description from './description';
import search from './search';
import hash from './hash';

export default combineReducers({description, search, hash});
