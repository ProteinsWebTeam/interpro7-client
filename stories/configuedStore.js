import { createStore } from 'redux';

const configureStore = (mockedState) => {
  return createStore((x) => x, mockedState);
};

export default configureStore;
