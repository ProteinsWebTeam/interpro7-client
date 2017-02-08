// @flow
import {combineReducers} from 'redux';

import location from './location';
import ui from './ui';
import settings from './settings';
import data from './data';
import dataMap from './dataMap';
import toasts from './toasts';

export default combineReducers({location, ui, settings, data, dataMap, toasts});
