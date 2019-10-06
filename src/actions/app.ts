import { ThunkAction } from "redux-thunk";
import { Dispatch, Action } from 'redux';
import * as firebase from "firebase";

type Message = {
  name: string
  message: string
  timestamp: number
}

// スネークケースとキャメルケースの分け方がわからなかったので、
// login_user_name以外はキャメルケースで書いています。

// 以下型
// 型定義は本来ファイル分けるべきなのかも。
export type AppState = {
  name: string
  messages: Message[],
  newMessage: string,
  nameForLogin: string
}

export type LoginPayload = {
  login_user_name: string
}

export type SetNamePayload = {
  nameForLogin: string
}

export type SetMessagePayload = {
  messages: Message[]
}

export type CreateMessagePayload = {
  message: string
}

export interface LoginAction extends Action {
  type: "APP_LOGIN"
  payload: LoginPayload
}
export interface SetMessageAction extends Action {
  type: "SET_MSG"
  payload: SetMessagePayload
}

export interface CreateMessageAction extends Action {
  type: "CREATE_MSG"
  payload: CreateMessagePayload
}

export interface SetNameAction extends Action {
  type: "SET_NAME"
  payload: SetNamePayload
}

export type AppAction = LoginAction & SetMessageAction & CreateMessageAction & SetNameAction
// ここまで各種型定義

export const login = (payload: LoginPayload): LoginAction => {
  return {
    type: "APP_LOGIN",
    payload: payload
  };
};

export const setName = (payload: SetNamePayload): SetNameAction => {
  return {
    type: "SET_NAME",
    payload: payload
  };
};

export const createMessage = (payload: CreateMessagePayload): CreateMessageAction => {
  return {
    type: "CREATE_MSG",
    payload: payload
  };
};

export const setMessage = (payload: SetMessagePayload): SetMessageAction => {
  return {
    type: "SET_MSG",
    payload: payload
  };
};

export const fetchMsg = (): ThunkAction<void, AppState, undefined, AppAction> => async (dispatch: Dispatch<Action>) => {
  try {
    const messageRef = firebase.database().ref('messages');
    const snapshot = await messageRef.orderByChild('timestapm').limitToLast(100).once("value");
    const messages = snapshot.val();
    const payload: Message[] = Object.keys(messages).map((key: string) => {
      return {
        message: messages[key].message,
        timestamp: messages[key].timestamp,
        name: messages[key].name
      };
    });
    dispatch(setMessage({ messages: payload }));
    // fetchが走ったタイミングで一番下にスクロールさせる
    const chatHeight = document.querySelectorAll("ul")[0].scrollHeight;
    document.querySelectorAll("ul")[0].scrollTo(0, chatHeight);
  } catch (e) {
    console.log(e);
    // dispatch();
  }
};