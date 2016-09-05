/* eslint no-undefined: 0 */
import {DEV} from 'config';

// TODO: check this, if it does as expected on non DEV
const required = DEV ?
  (name = 'parameter') => {
    throw new Error(`${name} is a required parameter`);
  } :
  () => undefined;

export default required;
