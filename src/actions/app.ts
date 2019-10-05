import { Action } from "redux";

export type LoginPayload = {
  login_user_name: string;
};

export interface LoginAction extends Action {
  type: "APP_LOGIN";
  payload: LoginPayload;
}

export type LoginState = {
  name: string;
};

export const login = (payload: LoginPayload): LoginAction => {
  return {
    type: "APP_LOGIN",
    payload: payload
  };
};
