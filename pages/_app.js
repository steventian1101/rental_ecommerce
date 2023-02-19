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
  useEffect(()=>{
    if(!localStorage.getItem("durationResult") && navigator.geolocation){
      storeDurationToSessionstorag();
    } 
    
  },[]);
 

  return (
    <AuthUserProvider>
      <Layout>
        <Head>
          <title>Sdrop</title>
          <meta
            name="Description"
            content="Sydney Rental"
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </AuthUserProvider>
  );
}

export default MyApp;
