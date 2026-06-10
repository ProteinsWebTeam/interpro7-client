import {
  AfConfidenceChainFilterAction,
  AfConfidenceChainFilterValue,
  SET_AF_CONFIDENCE_CHAIN_FILTER,
} from 'actions/types';

// value === undefined: not yet initialised (confidence data hasn't loaded yet)
// value === null:      ready, no chain filter needed (monomer)
// value === object:   ready, restrict to this chain (multimer)
//
// The wrapper exists because Redux combineReducers forbids returning undefined
// from a slice reducer, even as an initial state.
type State = { value: AfConfidenceChainFilterValue | undefined };

const initialState: State = { value: undefined };

export default (
  state: State = initialState,
  action: AfConfidenceChainFilterAction,
): State => {
  switch (action.type) {
    case SET_AF_CONFIDENCE_CHAIN_FILTER:
      return { value: action.filter };
    default:
      return state;
  }
};

export const afConfidenceChainFilterSelector = (state: GlobalState) =>
  state.ui.afConfidenceChainFilter.value;
