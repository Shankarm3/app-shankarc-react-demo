import {ADD_ITEM, REMOVE_ITEM} from './ActionTypes.js';

export const addItem = (text) => ({
  type: ADD_ITEM,
  text
});

export const removeItem = (id) => ({
  type: REMOVE_ITEM,
  id
});

