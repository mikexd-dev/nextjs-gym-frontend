import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import initFirebase from "../config";
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from "./userCookie";

initFirebase();

export const mapUserData = async (user) => {
  const { uid, email } = user;
  let token = user?.multiFactor?.user?.accessToken;
  let exp = user?.multiFactor?.user?.stsTokenManager?.expirationTime;

  if (Date.now() >= exp) {
    console.log("gonna expire");
    token = await user.getIdToken(true);
  }
  return {
    id: uid,
    email,
    token: token,
  };
};

const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (userToken) => {
        if (userToken) {
          const userData = await mapUserData(userToken);
          setUserCookie(userData);
          setUser(userData);
        } else {
          removeUserCookie();
          setUser();
        }
      });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);
    return () => cancelAuthListener;
  }, []);

  return { user, logout };
};

export { useUser };
