import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EstateItem from "../components/EstateItem";

const Home = () => {
  const [estates,setEstates] = useState(null)

  useEffect(()=>{
    const fetchAllEstates = async() => {
        const res = await fetch("http://localhost:5000/api/estates")
        const data = await res.json()
        setEstates(data)
    }
    fetchAllEstates()
  },[])

  console.log(estates)


  return (
    <>
    <div className="mt-24 ml-20 pb-12">
    <div className="flex flex-col"> 
    <div className="flex"><h1 className="text-6xl font-bold mr-5 text-slate-700">Find your next</h1><h1 className="text-6xl font-bold text-slate-500"> perfect</h1></div>
    <h1 className="text-6xl font-bold text-slate-700">place with ease</h1>
    <p className="text-sm mt-4 ml-2 w-96 text-slate-500">Sahand Estate will help you find your home fast, easy and comfortable.
    Our expert support are always available.</p>
    <p className="text-base mt-3 ml-2 text-blue-700 font-bold hover:underline"> <Link to="create-estate-listing"> Let's Start now... </Link> </p>
    </div>
    </div>
  
    <main className="bg-white h-screen pt-10">
      <h1 className="text-6xl font-semibold pl-20 pb-12">All Estates</h1>
        <div className="flex flex-wrap gap-5 pl-20 pb-12"> 
        { estates && estates.map((estate)=>(
        <EstateItem estate={estate} home/>          
        ))}
        </div>
    </main>
    </>
  )
};

export default Home;