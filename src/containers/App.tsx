import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { login, LoginAction, LoginPayload, RootState } from "../types";

type StateProps = {
  name: string;
};

type DispatchProps = {
  app_actions: {
    login: (payload: LoginPayload) => void;
  };
};

type Props = StateProps & DispatchProps;

export const App: React.FC<Props> = (props: Props) => {
  
  const Name = () => {
    if (props.name) {
      return (
        <p>{`${props.name} さん、こんにちは。`}</p>
      );
    }
    else {
      return (
        <button
          onClick={() => props.app_actions.login({ login_user_name: "test" })}
        >
          こんにちは
        </button>
      );
    }
  };
  
  return (
    <Container>
      {Name()}
    </Container>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    name: state.app.name
  };
};
const mapDispatchToProps = (dispatch: Dispatch<LoginAction>): DispatchProps => {
  return {
    app_actions: bindActionCreators({ login }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;
