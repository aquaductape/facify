import { AppProps } from "next/dist/next-server/lib/router/router";
import { Provider } from "react-redux";
import store from "../store/store";
import "../styles/global.scss";
import "../styles/index.scss";
import "focus-visible";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
