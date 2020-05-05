import App from "next/app";
import 'firebase/firestore';
import 'firebase/storage';
import useAutenticacion from '../hooks/useAutenticacion';
import firebase, { FirebaseContext } from "../firebase";

const MyApp = (props) => {
  const usuario = useAutenticacion();
  console.log(usuario);
  
  const { Component, pageProps } = props;

  return (
    <FirebaseContext.Provider value={{ firebase, usuario }}>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
};

export default MyApp;
