import * as React from "react";
import { useEffect, useRef } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { login, setName, createMessage, fetchMsg, AppState, AppAction, LoginPayload, CreateMessagePayload, SetNamePayload } from "../actions/app";
import { RootState } from "../reducers/app";
import * as firebase from "firebase";
import { ThunkDispatch } from "redux-thunk";

// 日付を正規化する関数
const NormalizeDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const MM = ('0' + month).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  const hh = ('0' + (Number(date.getHours())).toString()).slice(-2);
  const mm = ('0' + date.getMinutes()).slice(-2);
  return MM + '月' + dd + '日' + hh + ':' + mm;
};


type DispatchProps = {
  app_actions: {
    login?: (payload: LoginPayload) => void;
    submitMsg?: (payload: LoginPayload) => void;
    fetch: () => void;
    createMessage: (payload: CreateMessagePayload) => void;
    setName: (payload: SetNamePayload) => void;
  };
};

type Props = AppState & DispatchProps;

// ログイン画面
const Login: React.FC<Props> = (props) => {
  // 入力中かどうか
  const isEditing = props.nameForLogin.length > 0;
  return (
    <LoginWrap isEditing={isEditing}>
      <div>
        <label>
          <input
            type="text"
            onChange={e => {
              props.app_actions.setName({ nameForLogin: e.target.value });
            }}
          />
          <span>{isEditing ? "ログインして利用を開始" : "名前を入力"}</span>
        </label>
        <Button
          onClick={_ => {
            props.app_actions.login({ login_user_name: props.nameForLogin });
          }}
        >ログイン</Button>
      </div>
    </LoginWrap>
  );
};

// チャット本体
const Chat: React.FC<Props> = (props) => {
  // firebaseリアルタイムデータベースのリスナーを登録
  // データベースに変更があるたびにfetchする
  useEffect(() => {
    const messageRef = firebase.database().ref('messages');
    messageRef.on("value", async () => {
      props.app_actions.fetch();
    });
  }, [props.app_actions]);

  const inputEl = useRef<HTMLTextAreaElement>(null);

  const submitMessage = () => {
    const messageRef = firebase.database().ref('messages');
    messageRef.push({
      name: props.name,
      timestamp: Date.now(),
      message: props.newMessage
    });
  };

  const isEditing = props.newMessage.length > 0;

  return (
    <div>
      <Messages>
        {props.messages.map(msg => {
          return (
            <Message
              // 自分のメッセージかどうかでスタイルを変える
              isOwnMessage={msg.name === props.name}
              key={msg.timestamp}
            >
              <p className="name">{msg.name}</p>
              <div>
                <p className="message">{msg.message}</p>
                <p className="time">{NormalizeDate(new Date(msg.timestamp))}</p>
              </div>
            </Message>
          );
        })}
      </Messages>
      <InputArea>
        <Label isEditing={isEditing}>
          <span>{isEditing ? "Ctr+Enterで送信" : "メッセージを入力"}</span>
          <textarea
            onChange={e => {
              props.app_actions.createMessage({ message: e.target.value });
            }}
            onKeyDown={e => {
              // ctr + enterで送信する
              if (e.ctrlKey && e.keyCode === 13) {
                submitMessage();
                e.currentTarget.value = "";
              }
            }}
            ref={inputEl}
          ></textarea>
        </Label>
        <SubmitButton onClick={e => {
          submitMessage();
          // textareaの内容を消す
          inputEl.current.value = "";
        }}
        >送信</SubmitButton>
      </InputArea>
    </div>
  );
};

export const App: React.FC<Props> = (props: Props) => {
  return (
    <Container>
      <h1>React-Chat</h1>
      {props.name
        ? <Chat {...props}></Chat>
        : <Login {...props}></Login>
      }
    </Container>
  );
};

const mapStateToProps = (state: RootState) => {
  return state.app;
};

// redux-thunkを使っているときにdispatchをbindしようとすると
// 型が解決できなかったのでひとつずつやってます。
const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, undefined, AppAction> & Dispatch<AppAction>
): DispatchProps => ({
  app_actions: {
    fetch: () => {
      dispatch(fetchMsg());
    },
    login: (payload: LoginPayload) => {
      dispatch(login(payload));
    },
    createMessage: (payload: CreateMessagePayload) => {
      dispatch(createMessage(payload));
    },
    setName: (payload: SetNamePayload) => {
      dispatch(setName(payload));
    },
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);


// スタイル
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  height: calc(100vh - 100px);
  background-color: #fff;
  margin: 0 auto;
  padding:30px;
  border-radius:10px;
  h1{
    text-align: center;
    font-size: 3rem;
    font-weight: bold;
    margin-bottom:20px;
    text-shadow: 0px 0px 5px rgba(0, 81, 255, 0.231);
  }
  > div{
    height:100%;
  }
`;

const LoginWrap = styled.div`
  display:flex;
  width:100%;
  height:100%;
  justify-content:center;
  align-items:center;
  > div{
    position:relative;
  }
  span{
    position: absolute;
    width: 200px;
    cursor: text;
    font-size:1.5rem;
    left 15px;
    color: #a0a0a0;
    transition:all ease .1s;
    top:${(props: { isEditing: boolean }) => props.isEditing ? '6px' : '20px'};
    font-size:${(props: { isEditing: boolean }) => props.isEditing ? '1rem' : '1.5rem'};
  }
  input{
    width:100%;
    -moz-appearance: none;
    -webkit-appearance: none;
    display:block;
    appearance: none;
    background-color: #f0f0f0;
    background-image: none;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 0;
    color: inherit;
    font-family: inherit;
    font-size: 1em;
    padding: 18px 15px 15px;
    box-sizing: border-box;
    resize:none;
  }
  button{
    margin: 40px auto 0;
  }
`;

const Messages = styled.ul`
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 230px);
  overflow-y:scroll;
  padding: 30px;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 30px;
    background: #eee;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background: #b6b6b6;
  }
  li + li{
    margin-top: 20px;
  }
`;

const Message = styled.li`
  display: flex;
  width: 100%;
  align-self: flex-start;
  align-items: flex-start;
  flex-direction:${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? 'row-reverse' : 'initial'};
  .name {
    width: 100px;
    background-color: #f0f0f0;
    font-size: 1.3rem;
    border-radius: 10px;
    margin: ${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? '0 0 0 20px' : '0 20px 0 0'};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
  .time{
    font-size: 1.2rem;
    width: 94px;
    margin: ${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? '0 10px 0 0' : '0 0 0 10px'};
  }
  div{
    flex: 1;
    text-align:${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? 'right' : 'left'};
    flex-direction: ${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? 'row-reverse' : 'initial'};
    display: flex;
    align-items: flex-end;
  }
  .message{
    position: relative;
    text-align: left;
    white-space:pre-line;
    border-radius: 10px;
    padding: 10px 20px;
    background-color:#f0f0f0;
    display: inline-block;
    max-width: 450px;
    &::before{
      content: "";
      position: absolute;
      top: 17px;
      left: ${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? 'auto' : '-26px'};
      right: ${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? '-26px' : 'auto'};
      margin-top: -15px;
      border: 15px solid transparent;
      border-left: 30px solid #f0f0f0;
      z-index: 0;
      -webkit-transform: ${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? 'rotate(-20deg)' : 'rotate(195deg)'};
      transform: ${(props: { isOwnMessage: boolean }) => props.isOwnMessage ? 'rotate(-20deg)' : 'rotate(195deg)'};
    }
  }
`;

const InputArea = styled.div`
  margin-top: 30px;
  display:flex;
  align-items:flex-end;
`;

const Label = styled.label`
  position:relative;
  width: calc(100% - 70px);
  span{
    position: absolute;
    font-size:1.5rem;
    top: 24px;
    left 15px;
    color: #a0a0a0;
    transition:all ease .1s;
    top:${(props: { isEditing: boolean }) => props.isEditing ? '10px' : '29px'};
    font-size:${(props: { isEditing: boolean }) => props.isEditing ? '1.2rem' : '1.5rem'};
  }
  textarea{
    width:100%;
    -moz-appearance: none;
    -webkit-appearance: none;
    display:block;
    appearance: none;
    background-color: #f0f0f0;
    background-image: none;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 0;
    height: 150px;
    color: inherit;
    font-family: inherit;
    font-size: 1em;
    padding: 25px 15px;
    box-sizing: border-box;
    resize:none;
  }
`;

const SubmitButton = styled.button`
  flex:1;
  background-color: #167edf;
  color: #fff;
  height: 35px;
  transition:all ease .3s;
  font-weight: bold;
  &:hover{
    opacity:0.7;
  }
`;

const Button = styled.button`
  background-color: #167edf;
  display: block;
  color: #fff;
  transition:all ease .3s;
  font-weight: bold;
  padding: 10px 15px;
  &:hover{
    opacity:0.7;
  }
`;