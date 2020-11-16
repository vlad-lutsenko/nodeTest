import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import { tokenReducer } from "./reducer";
const store = createStore(tokenReducer, devToolsEnhancer());
export default store;
