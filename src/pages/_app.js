import "bootstrap/dist/css/bootstrap.min.css";
import "../utils/styles/global.css";
import GlobalStyles from "../utils/styles/GlobalStyles";
import { GoogleTagManager } from '@next/third-parties/google'
export const metadata = {
  title: "Vikash Kumar Pal",
  robots: {
    index: false,
    follow: false,
  },
  description: "Vikash Kumar Pal",
};
function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <GoogleTagManager gtmId="GTM-NSPV8NBM" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

