import { TOGGLE_ACCESSION_DB_FOR_IDA } from 'actions/types';

/*:: export type AccessionDB = string; */

export default (
  state /*: AccessionDB */ = 'pfam',
  action /*: Object */,
) /*: AccessionDB */ => {
  switch (action.type) {
    case TOGGLE_ACCESSION_DB_FOR_IDA:
      return state === 'pfam' ? 'interpro' : 'pfam';
    default:
      return state;
  }
};
