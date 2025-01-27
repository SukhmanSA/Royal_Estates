import React from "react";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      console.log(data)
      dispatch(loginSuccess(data));
      navigate("/")
    } catch (error) {
      console.log("Could not Login with Google!", error);
    }
  };

  const handleGithubClick = async() =>{
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("user:email")
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result)
      const token = result.user.accessToken;


      const res = await fetch("http://localhost:5000/api/users/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: result._tokenResponse.screenName,
          email: result._tokenResponse.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      console.log(data)
      dispatch(loginSuccess(data));
      navigate("/")
    } catch (error) {
      console.log("Could not Login with Google!", error);
    }
  }

  return (
    <>
    <h1 className="text-center font-semibold text-xl">Other Options</h1>
    <div className="flex gap-3 w-[480px] justify-center">
    <div
      onClick={handleGoogleClick}
      className=" rounded-lg px-2 cursor-pointer flex items-center border-solid justify-center align-middle border-2 border-black"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.3 3.4 30 1.5 24 1.5 14.7 1.5 6.8 7.7 3.4 16.4l7.9 6.2C13 14.2 18.1 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.5 24c0-1.4-.1-2.8-.4-4.2H24v8h12.6c-.5 2.6-2 4.8-4.2 6.3l6.7 6.7c3.9-3.6 6.4-9 6.4-16.8z"></path>
        <path fill="#FBBC05" d="M10.8 28.6c-.1-1.1-.9-3.3-.9-5.1s.3-3.5.9-5.1L3 12.2C1.2 15.6 0 19.7 0 24s1.2 8.4 3 11.8l7.8-7.2z"></path>
        <path fill="#34A853" d="M24 46.5c6 0 11-2 14.6-5.5L31.9 34.3c-2 1.3-4.6 2-7.9 2-5.9 0-10.9-3.8-12.7-9l-7.9 7.2C6.8 40.3 14.7 46.5 24 46.5z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg> <h1 className="ml-2 text-2xl ">Google</h1>
    </div>
    <div
      onClick={handleGithubClick}
      className="rounded-lg px-2 py-1 cursor-pointer border-solid items-center border-black flex justify-center align-middle border-2"
    >
      <i class="bi bi-github text-3xl mb-2 "></i> <h1 className="ml-2 text-2xl ">Github</h1>
    </div>
    </div>
    </>
  );
};

export default OAuth;
