import type { AppProps } from "next/app";
import { MessageProvider } from "../components/MessageBox";
import "../src/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MessageProvider>
      <Component {...pageProps} />
    </MessageProvider>
  );
}
