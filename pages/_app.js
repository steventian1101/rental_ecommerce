import "../css/index.css";
import "../css/style.css";
import "../css/calendar.css";
import Head from "next/head";
import Layout from "../components/layout";
import ProgressBar from '@badrap/bar-of-progress'
import Router from 'next/router'
import { AuthUserProvider } from "../context/useAuth";
import storeDurationToSessionstorag from '../utils/getDuration'
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useAuth } from "../context/useAuth";

const progress = new ProgressBar({
  size: 2,
  color: '#6D25BF',
  className: 'bar-of-progress',
  delay: 100,
})


Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps }) {
  const { authenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("durationResult") && navigator.geolocation) {
      if (typeof window !== "undefined" && "localStorage" in window && localStorage.getItem("geo")) {
        if (localStorage.getItem("geo") == "true") {
          storeDurationToSessionstorag();
        }
        else {
        }
      }
    }
  }, []);


  return (
    <AuthUserProvider>
      <Layout>
        <Head>
          <title>Sdrop - Rent anything, anywhere</title>
          <meta
            name="Description"
            content="Sydney Rental"
          />
          
          <meta property="og:image" content="/logo/site_preview_img.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="600" />
          <meta property="og:image:type" content="image/jpeg" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </AuthUserProvider>
  );
}

export default MyApp;
