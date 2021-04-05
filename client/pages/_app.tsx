import { AppProps } from "next/dist/next-server/lib/router/router";
import { Provider } from "react-redux";
import store from "../store/store";
import "../styles/global.scss";
import "../styles/index.scss";
import "focus-visible";
import { useEffect } from "react";
import { setMenu } from "../containers/Menu/menuSlice";
import { loadFromLocalStorage } from "../utils/ls";

const MyApp = ({ Component, pageProps }: AppProps) => {
  // useEffect(() => {
  //   const menuState = loadFromLocalStorage("menu") as any;
  //   if (menuState) {
  //     store.dispatch(setMenu(menuState));
  //   }
  // }, []);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
