import './App.css';
import Home from './pages/Home';
import Header from './components/Header';
import Login from './pages/Login';
import SignUp from './pages/Signup'
import About from './pages/About';
import Cookies from "js-cookie"
import { Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './redux/userSlice';
import CreateEstate from './pages/CreateEstate';
import MyEstatesListings from './pages/MyEstatesListings';
import UpdateEstateListing from './pages/UpdateEstateListing';
import EstateDetail from './pages/EstateDetail';




function App() {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch()
  const { currentUser } = useSelector(state=> state.userState)

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
        setToken(storedToken);
    }
}, []);

useEffect(() => {
    if (token && !currentUser) {
        const userData = JSON.parse(localStorage.getItem("currentUser")); 
        if (userData) {
            dispatch(loginSuccess(userData)); 
        }
    }
}, [dispatch, token, currentUser]);


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/create-estate-listing' element={<CreateEstate/>}  />
        <Route path="/estate-listing/:eid" element={<MyEstatesListings/>}/>
        <Route path="/update-estate-listing/:eid" element={<UpdateEstateListing/>}/>
        <Route path="/estate/:eid" element={<EstateDetail/>}/>
      </Routes>
    </>
  );
}

export default App;
