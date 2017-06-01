// @flow
import {combineReducers} from 'redux';

import location from './location';
import newLocation from './newLocation';
import ui from './ui';
import settings from './settings';
import data from './data';
import toasts from './toasts';

export default combineReducers(
  {location, newLocation, ui, settings, data, toasts}
);
