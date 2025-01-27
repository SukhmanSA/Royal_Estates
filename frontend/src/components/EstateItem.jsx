import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const EstateItem = ({ estate, user, home }) => {

    const { imageUrls } = estate
    const firstImage = imageUrls[0]
    const navigate = useNavigate()
    
    const handleDelete = async() => {

        const res = await fetch(`http://localhost:5000/api/estates/deleteById/${estate._id}`,{
            method: "DELETE"
        })
        const data = await res.json()

        navigate(`/`)

    }


  return (
    <div className='w-80 shadow-md rounded-lg'>
        <Link key={estate._id} to={`/estate/${estate._id}`}>
        <img src={ firstImage } className='w-80 h-56'/>
        </Link>
        <div className='flex'>
        <div className='p-3 flex flex-col'>
            <h1 className='text-xl line-clamp-1 w-72 text-slate-700 font-semibold'> { estate ? estate.name : "name"}</h1>
            <h1 className='flex text-sm gap-2 my-2' >
                <i class="bi bi-geo-alt-fill"></i>
                <p className='text-slate-500 font-semibold'>{ estate ? estate.address : "address"}</p>
            </h1>
            <p className='line-clamp-2 w-44 text-sm'>{ estate ? estate.description : "description"}</p>
            <p className='text-slate-500 my-2 font-semibold flex'>
                ${ estate ? estate.regularPrice : "0"}
            { estate.type !== "sale" ? <pre> / Month</pre> : ""  }    
            </p>
            <h1 className='flex gap-2'>
                <p>{ estate ? estate.bedrooms : 0} beds</p>
                <p>{ estate ? estate.bathrooms : 0} baths</p>
            </h1>

        </div>
        { home ? "" : <div className='flex gap-3 mt-32 -mb-4 -ml-16'>
            <i onClick={()=> navigate(`/update-estate-listing/${estate._id}`)} class="bi bi-pencil-square text-green-500 text-lg cursor-pointer"></i>
            <i onClick={handleDelete} class="bi bi-trash text-lg text-red-600 cursor-pointer"></i>                
        </div>}
        </div>
    </div>
  )
}

export default EstateItem
 
 