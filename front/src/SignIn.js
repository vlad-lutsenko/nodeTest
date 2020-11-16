import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./redux/action";
import { signIn } from "./fetch.helper";

const SingIn = () => {
  const userInitial = { id: "", password: "" };
  const [user, setUser] = useState(userInitial);
  const dispatch = useDispatch();

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(user);
    const token = result.data.token;

    dispatch(setToken(token));
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <label>
          login (email or phone)
          <input type="text" value={user.id} name="id" onInput={onChange} />
        </label>
        <label>
          password
          <input
            type="text"
            value={user.password}
            name="password"
            onInput={onChange}
          />{" "}
        </label>
        <button>signup</button>
      </form>
    </div>
  );
};

export default SingIn;
