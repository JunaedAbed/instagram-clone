const initialState = {
  currentUser: null,
};

//action will call db and fetch data and then send it to reducer which will update the state
export const user = (state = initialState, action) => {
  return {
    ...state,
    currentUser: action.currentUser,
  };
};
