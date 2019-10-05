import { login, LoginState, LoginAction, LoginPayload } from "../actions/app";

export type RootState = {
  app: LoginState;
};

export { login, LoginState, LoginAction, LoginPayload };
