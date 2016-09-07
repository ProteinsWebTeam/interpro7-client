import {combineReducers} from 'redux';
import ui from './ui';
import settings from './settings';
import data from './data';

export default combineReducers({ui, settings, data});
