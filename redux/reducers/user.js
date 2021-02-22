import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE } from "../constants";

const initialState = {
  currentUser: null,
  posts: [],
};

//action will call db and fetch data and then send it to reducer which will update the state
export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };

    case USER_POSTS_STATE_CHANGE:
      return {
        ...state,
        posts: action.posts,
      };

    default:
      return state;
  }
};
