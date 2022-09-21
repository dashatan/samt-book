import {createStore} from 'redux';
import reducer from "./reducers";

let Store = createStore(reducer);

export default Store;
