import type { AppProps } from "next/app";
import { MessageProvider } from "../components/MessageBox";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MessageProvider>
      <Component {...pageProps} />
    </MessageProvider>
  );
}