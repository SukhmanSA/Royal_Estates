import React, { useEffect, useLayoutEffect, useState } from 'react'
import EstateItem from '../components/EstateItem'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const MyEstatesListings = () => {

    const [estates,setEstates] = useState([])
    const { currentUser } = useSelector(state=> state.userState)

    useLayoutEffect(() => {
        if (currentUser && currentUser.userId) {
          const fetchUserEstates = async () => {
            try {
              const res = await fetch(`http://localhost:5000/api/estates/get-estates/${currentUser.userId}`);
              if (!res.ok) {
                throw new Error('Failed to fetch estates');
              }
              const data = await res.json();
              setEstates(data);
            } catch (error) {
              console.error(error);
            }
          };
          fetchUserEstates();
        }
      }, [currentUser]);
      

  return (
    <div className='w-screen h-screen flex flex-col items-center'>
    <h1 className='text-center text-5xl mt-4'>My Estate Listings</h1>
        <div className='mt-5 w-5/6 flex gap-16 flex-wrap justify-center'>

        { estates.length === 0 ? <div className='bg-white p-8 rounded-lg mt-2'>
          <h1 className='text-4xl mb-3 font-semibold'>No Listing Found.</h1>
          <Link className='text-2xl ml-12 text-green-600 font-bold' to='/create-estate-listing'>Create One Now!</Link>
        </div> 
          :  estates.map((estate)=>(
            <EstateItem estate={estate} user={currentUser}/>        
        )) }


        </div>
    </div>
  )
}

export default MyEstatesListings
 
 