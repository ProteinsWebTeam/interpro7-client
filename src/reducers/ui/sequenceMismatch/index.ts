import { SET_SEQUENCE_MISMATCH, SequenceMismatchAction } from 'actions/types';

export default (state = false, action: SequenceMismatchAction) => {
  switch (action.type) {
    case SET_SEQUENCE_MISMATCH:
      return action.hasMismatch;
    default:
      return state;
  }
};

export const sequenceMismatchSelector = (state: GlobalState) =>
  state.ui.sequenceMismatch;
