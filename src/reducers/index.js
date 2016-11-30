import {combineReducers} from 'redux';
import ui from './ui';
import settings from './settings';
import data from './data';
import toasts from './toasts';

export default combineReducers({ui, settings, data, toasts});
