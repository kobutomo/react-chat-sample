// import { Map } from "immutable";
import { AppAction, AppState } from "../actions/app";
import { Reducer } from "redux";


export type RootState = {
  app: AppState;
};

export const initialRootState: RootState = {
  app: {
    name: "",
    messages: [],
    newMessage: "",
    nameForLogin: ""
  }
};

const loginReducer: Reducer<AppState> = (state: AppState = initialRootState.app, action: AppAction): AppState => {
  switch (action.type) {
    case "APP_LOGIN":
      return {
        ...state,
        name: action.payload.login_user_name
      };
    case "SET_MSG":
      return {
        ...state,
        messages: action.payload.messages,
      };
    case "CREATE_MSG":
      return {
        ...state,
        newMessage: action.payload.message
      };
    case "SET_NAME":
      return {
        ...state,
        nameForLogin: action.payload.nameForLogin
      };
    default:
      return state;
  }
};

export default loginReducer;
