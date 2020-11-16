import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { info, latency, logout } from "./fetch.helper";
import { setToken } from "./redux/action";

const MainPage = () => {
  const [user, setUser] = useState({});
  const [userLatency, setUserLatency] = useState("");
  const tokenFromStore = useSelector((store) => store);
  const tokenFromLS = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tokenFromStore && tokenFromLS) {
      dispatch(setToken(tokenFromLS));
    }
  }, [dispatch, tokenFromStore, tokenFromLS]);

  const onButtonInfo = async (e) => {
    const response = await info(tokenFromStore);
    setUser(response.data);
  };

  const onButtonLatency = async (e) => {
    const response = await latency(tokenFromStore);
    setUserLatency(response.data.latency);
  };

  const onButtonLogoutFalse = async (e) => {
    await logout(tokenFromStore, false);
    console.log("logout completed");
  };
  const onButtonLogoutTrue = async (e) => {
    await logout(tokenFromStore, true);
    console.log("logout completed");
  };

  return (
    tokenFromStore && (
      <div>
        <h2>Main Page</h2>
        <button onClick={onButtonInfo}>get info</button>
        {!!Object.keys(user).length && (
          <div>
            <p>
              user's {user.id_type}: {user.id}
            </p>
          </div>
        )}
        <button onClick={onButtonLatency}>get latency</button>
        {userLatency && <p>latency: {userLatency} ms</p>}

        <button onClick={onButtonLogoutFalse}>logout (all=false)</button>
        <button onClick={onButtonLogoutTrue}>logout (all=true)</button>
      </div>
    )
  );
};

export default MainPage;
