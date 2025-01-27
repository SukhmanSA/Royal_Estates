import { Link } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';
import { useSelector } from "react-redux";

const Header = () => {

  const { currentUser } = useSelector(state => state.userState)

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center -translate-x-11 max-w-5xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Royal</span>
            <span className='text-slate-700'>Estates</span>
          </h1>
        </Link>
        
        <ul className='flex gap-4 -mr-20'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
          </Link>
          { currentUser && <Link to={`/estate-listing/${currentUser.userId}`}>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              My Listings
            </li>
          </Link>}
          { currentUser ? 
          (<> <Link to='/profile'><li className=' text-slate-700 hover:underline'> 
            Profile 
          </li> </Link> <img className="w-9 h-9 -mt-1 -ml-3 rounded-full" src={currentUser.image} /></>) :
           (<Link to='/login'><li className=' text-slate-900 hover:underline'> Login</li></Link>)}
        </ul>
      </div>
    </header>
  )
};

export default Header;
