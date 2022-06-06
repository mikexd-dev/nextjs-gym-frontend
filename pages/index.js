import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import initFirebase from "../config";
import { setUserCookie } from "../auth/userCookie";
import { mapUserData } from "../auth/useUser";
import LoginComponent from "../components/Login";

initFirebase();
const firebaseAuthConfig = ({ signInSuccessUrl }) => ({
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl,
  credentialHelper: "none",
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      const userData = await mapUserData(user);
      setUserCookie(userData);
    },
  },
});

const FirebaseAuth = () => {
  const signInSuccessUrl = "/home";
  return (
    <LoginComponent>
      <StyledFirebaseAuth
        uiConfig={firebaseAuthConfig({ signInSuccessUrl })}
        firebaseAuth={firebase.auth()}
        signInSuccessUrl={signInSuccessUrl}
      />
    </LoginComponent>
  );
};

export default FirebaseAuth;
