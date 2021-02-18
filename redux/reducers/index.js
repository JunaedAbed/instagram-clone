import { combinerReducers } from "redux";
import { user } from "./user";

const Reducers = combinerReducers({
  userState: user,
});

export default Reducers;
