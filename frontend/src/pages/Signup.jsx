import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice"
import OAuth from "../components/OAuth"
 
const SignUp = () => {
  const [formData, setFormData] = useState({});
  const { loading, error, currentUser } = useSelector(state => state.userState)
  const [file, setFile] = useState("");
  const [imageIsSelected, setImageIsSelected] = useState(false)
  const fileRef = useRef("");
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e) =>{
        setFormData({
          ...formData,
          [e.target.id]:e.target.value
        })
  }

  const handleImageInput = () => {
    fileRef.current.click()
  }

   const handleImageChange = (e) => {
    setFile(e.target.files[0])
    setImageIsSelected(true)
   }


  const handleSubmit = async(e) =>{
    e.preventDefault()
    try {
      dispatch(loginStart)
      const dataForm = new FormData()
      dataForm.append("username", formData.username);
      dataForm.append("password", formData.password);
      dataForm.append("email", formData.email)
      dataForm.append("image", file)
      const res = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        body: dataForm
    });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(loginFailure(data.message))
        return;
      }
      dispatch(loginSuccess(data))
      navigate('/');
    } catch (error) {
      dispatch(loginFailure(data.message))
    }
    
    
  }


  return (
    <div className="p-3 max-w-lg mx-auto mt-3">
      <h1 className="text-3xl font-semibold text-center">Sign Up</h1>
      <form className="flex flex-col gap-4 align-middle w-ful mt-4" onSubmit={handleSubmit}>
        <input 
        type="file" 
        ref={fileRef}
        hidden
        accept="image/*"
        onChange={handleImageChange}
        />

        { !imageIsSelected && <div onClick={handleImageInput} className={`signup-image w-36 h-32 -mb-3`}></div>}
        { imageIsSelected && <img onClick={handleImageInput} className="rounded-full w-36 h-36 ml-44 bg-contain" src={URL.createObjectURL(file)}/> }         
        

        <input 
        className="border p-2.5 rounded-lg w-42 border-none" 
        placeholder="Please enter a Username"
        type="text"
        id="username"
        onChange={handleChange}
        />
        <input 
        className="border p-2.5 rounded-lg w-42 border-none" 
        placeholder="Please enter an E-mail"
        type="email"
        id="email"
        onChange={handleChange}
        />
        <input 
        className="p-2.5 rounded-lg w-42 border-none" 
        placeholder="Please enter a password"
        type="password"
        id="password"
        onChange={handleChange}
        />
      <button className="bg-slate-700 text-white rounded-lg px-52 py-2.5 -mt-1">
        SIGN UP
      </button>
      <OAuth/>
      </form>
      <p className="mt-4 mb-5">Have an account already ? 
        <Link className="text-blue-600" to="/login">
        {loading ? 'Loading...' : 'Login'}
        </Link> 
        </p>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
};

export default SignUp;
