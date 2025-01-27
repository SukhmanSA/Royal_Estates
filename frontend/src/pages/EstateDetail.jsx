import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import { Navigation } from 'swiper/modules'; 

const EstateDetail = () => {
    const [currentEstate, setCurrentEstate] = useState(null);
    const { eid } = useParams();

    useEffect(() => {
        const fetchEstate = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/estates/get-estate/${eid}`);
                if (!res.ok) {
                    throw new Error(`Error: ${res.statusText}`);
                }
                const data = await res.json();
                setCurrentEstate(data);
            } catch (error) {
                console.error('Failed to fetch estate:', error);
            }
        };
        fetchEstate();
    }, [eid]);
    
    console.log("Current Estate", currentEstate)

    if (!currentEstate) {
        return <div>Loading...</div>; 
    }

    return (
        <div>
            <Swiper
                modules={[Navigation]}
                navigation
                slidesPerView={1}
                spaceBetween={50} 
            >
                {currentEstate.imageUrls?.length > 0 ? (
                    currentEstate.imageUrls.map((url, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="h-[450px]"
                                style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                            ></div>
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <div>No images available</div>
                    </SwiperSlide>
                )}
            </Swiper>
            <div className='w-full px-52 pt-12 flex flex-col items-start'>
              <h1 className='flex text-left text-2xl font-semibold mb-2'>
                <pre className=''>{currentEstate.name}</pre>
                { currentEstate.type !== "sale" ? <pre> - / Month</pre> : ""  }    
              </h1>
              <h1 className='flex text-sm gap-2 my-2  text-left' >
                <i class="bi bi-geo-alt-fill"></i>
                <p className='text-slate-500 font-semibold'>{ currentEstate.address}</p>
              </h1>
              <div>
              <button className=' bg-red-800 text-white px-16 py-1.5 rounded-lg'>
              { currentEstate.type !== "sale" ? "For Rent" : "For Sale"  }    
                </button>
              { currentEstate.offer && <button className='ml-5 bg-green-800 text-white px-16 py-1.5 rounded-lg'>${currentEstate.discountPrice} Discount</button>  }
               </div> 
               <p className='mb-3'><p className='mt-2 font-semibold text-lg'>Description - </p>{currentEstate.description}</p>
               <ul class=" mb-10 flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-semibold text-green-900">
                <li class="flex items-center whitespace-nowrap">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" class="text-lg mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"></path></svg>
                  { currentEstate.bedrooms }  Beds
                </li>
                <li class="flex items-center whitespace-nowrap">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="text-lg mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M32,384a95.4,95.4,0,0,0,32,71.09V496a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V480H384v16a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V455.09A95.4,95.4,0,0,0,480,384V336H32ZM496,256H80V69.25a21.26,21.26,0,0,1,36.28-15l19.27,19.26c-13.13,29.88-7.61,59.11,8.62,79.73l-.17.17A16,16,0,0,0,144,176l11.31,11.31a16,16,0,0,0,22.63,0L283.31,81.94a16,16,0,0,0,0-22.63L272,48a16,16,0,0,0-22.62,0l-.17.17c-20.62-16.23-49.83-21.75-79.73-8.62L150.22,20.28A69.25,69.25,0,0,0,32,69.25V256H16A16,16,0,0,0,0,272v16a16,16,0,0,0,16,16H496a16,16,0,0,0,16-16V272A16,16,0,0,0,496,256Z"></path></svg>
                  { currentEstate.bathrooms } Baths
                </li>
                <li class="flex items-center whitespace-nowrap">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="text-lg mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM240 320h-48v48c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h96c52.9 0 96 43.1 96 96s-43.1 96-96 96zm0-128h-48v64h48c17.6 0 32-14.4 32-32s-14.4-32-32-32z"></path></svg>
                  { currentEstate.parking ? "Parking" : "No parking" }
                </li>
                <li class="flex items-center whitespace-nowrap"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="text-lg mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M112 128c0-29.5 16.2-55 40-68.9V256h48V48h48v208h48V59.1c23.8 13.9 40 39.4 40 68.9v128h48V128C384 57.3 326.7 0 256 0h-64C121.3 0 64 57.3 64 128v128h48zm334.3 213.9l-10.7-32c-4.4-13.1-16.6-21.9-30.4-21.9H42.7c-13.8 0-26 8.8-30.4 21.9l-10.7 32C-5.2 362.6 10.2 384 32 384v112c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V384h256v112c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V384c21.8 0 37.2-21.4 30.3-42.1z"></path></svg>
                { currentEstate.furnished ? "Furnished" : "Not Furnished" }
                </li>
                </ul>
            </div>
        </div>
    );
};

export default EstateDetail;
