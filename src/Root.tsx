// Redux の更新があったときに React を呼ぶ処理です
// このファイルについては理解できなくて OK です

import * as React from "react";
import { Provider } from "react-redux";
import App from "./containers/App";
import { Store } from "redux";

type Props = {
  store: Store<{}>;
};
const Root: React.FC<Props> = ({ store }) => {
  return (
    <Provider store={store as any}>
      <App />
    </Provider>
  );
};

export default Root;
