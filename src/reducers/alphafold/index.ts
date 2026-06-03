import {
  SET_ALPHAFOLD_MODEL_COUNT,
  AlphafoldModelCountAction,
} from 'actions/types';

type AlphafoldState = Record<string, number>;

export default (
  state: AlphafoldState = {},
  action: AlphafoldModelCountAction,
) => {
  switch (action.type) {
    case SET_ALPHAFOLD_MODEL_COUNT:
      return { ...state, [action.accession]: action.count };
    default:
      return state;
  }
};
