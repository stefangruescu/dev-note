import { combineReducers } from "redux";

import cellReducer from "./cells-reducer";
import bundleReducer from "./bundles-reducer";

const reducers = combineReducers({
  cells: cellReducer,
  bundles: bundleReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
