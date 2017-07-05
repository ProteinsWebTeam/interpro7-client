// @flow
import { combineReducers } from 'redux';

import newLocation from './newLocation';
import ui from './ui';
import settings from './settings';
import data from './data';
import toasts from './toasts';

export default combineReducers({ newLocation, ui, settings, data, toasts });
