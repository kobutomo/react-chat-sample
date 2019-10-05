import { Map } from "immutable";
import { LoginAction, LoginState } from "../types";
// import { Reducer } from "redux"

const loginReducer = (state: LoginState, action: LoginAction) => {
  switch (action.type) {
    case "APP_LOGIN":
      return {
        name: action.payload.login_user_name
      };

    default:
      return state || Map({ name: "" });
  }
};

export default loginReducer;
