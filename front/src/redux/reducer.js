const initialState = "";
export const tokenReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "setToken":
      localStorage.setItem("token", payload);
      return payload;
    default:
      return state;
  }
};
