import { useState } from "react";
import Cookies from "js-cookie"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import OAuth from "../components/OAuth";

const Login = () => {
  const [formData, setFormData] = useState({});
  const { loading, error, currentUser } = useSelector(state => state.userState)
  const dispatch = useDispatch()
  const token = Cookies.get("token")
  const navigate = useNavigate();

  const handleChange = (e) =>{
        setFormData({
          ...formData,
          [e.target.id]:e.target.value
        })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        dispatch(loginStart());
        const res = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log('Response Data:', data); // Debugging
        if (!data.success) {
            dispatch(loginFailure(data.message));
            return;
        }
        dispatch(loginSuccess(data));
        navigate('/');
    } catch (error) {
        console.error('Error:', error); // Log error
        dispatch(loginFailure(error.message));
    }
};



  return (
    <div className="p-3 max-w-lg mx-auto mt-3">
      <h1 className="text-3xl font-semibold text-center">Login</h1>
      <form className="flex flex-col gap-4 align-middle w-ful mt-4" onSubmit={handleSubmit}>
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
      <button className="bg-slate-700 text-white rounded-lg px-52 py-2.5 mt-1">
        LOGIN
      </button>
      <OAuth/>
      </form>
      <p className="mt-4">Don't have an account ? 
        <Link className="text-blue-600" to="/signup">
        {loading ? 'Loading...' : 'Sign Up'}
        </Link> 
        </p>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Login