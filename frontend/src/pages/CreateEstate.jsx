import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateEstate = () => {
  const { currentUser } = useSelector((state) => state.userState);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const imagesRef = useRef("")
  const handleImageSubmit = () => {
    if (!files.length) {
      alert("Please select images to upload.");
      return;
    }

    const previews = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    if(previews.length > 6){
     setError("You cannot upload more than 6 images")
    }else{

    setError("")

    setUploadedFiles(previews);

    setFormData({
      ...formData,
      imageUrls: previews.map(({ file }) => file),
    });
    }

    imagesRef.current.value = "";

  };

  const handleRemoveImage = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    setFormData({
      ...formData,
      imageUrls: updatedFiles.map(({ file }) => file),
    });
  };

  console.log(formData)

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else if (type === "number" || type === "text" || type === "textarea") {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setUploading(true)
    if (uploadedFiles < 1){
        return setError('You must upload at least one image');        
    }else if(+formData.regularPrice < +formData.discountPrice){
        return setError('Discount price must be lower than regular price');
    }else{
        try{
                const dataFrom = new FormData()
                dataFrom.append("name" , formData.name)
                dataFrom.append("description", formData.description)
                dataFrom.append("address", formData.address)
                dataFrom.append("regularPrice", formData.regularPrice)
                dataFrom.append("discountPrice", formData.discountPrice)
                dataFrom.append("bedrooms", formData.bedrooms)
                dataFrom.append("bathrooms", formData.bathrooms)
                dataFrom.append("furnished", formData.furnished)
                dataFrom.append("parking", formData.parking)
                dataFrom.append("type", formData.type)
                dataFrom.append("offer", formData.offer)
                uploadedFiles.forEach(({ file }) => {
                    dataFrom.append("imageUrls", file);
                  });
                dataFrom.append("userRef", currentUser.userId)
            const res = await fetch("http://localhost:5000/api/estates/create-estate",{
                method:"POST",
                body: dataFrom
            })

            const data = await res.json()
            setError("")
            setUploading(false)
            navigate(`/estate-listing/${currentUser.userId}`)
        }catch(err){
            setError(err)
            console.log("error:",err)
        }
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create an Estate Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          {/* Checkbox Controls */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* Inputs for Numbers */}
          <div className="flex gap-6">
            <div>
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div>
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Images Section */}
        <div className="flex flex-col flex-1 gap-4">
          <p>
            Images: <span>(The first image will be the cover, max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              ref={imagesRef}
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="bg-green-500 p-2 text-white rounded"
            >
              Upload
            </button>
          </div>
          <div>
            {uploadedFiles.map(({ preview }, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={preview}
                  alt="Uploaded Preview"
                  className="w-28 h-20 object-contain"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button className="bg-slate-700 text-white rounded-lg w-80 h-10 mt-1">
            Create Estate
          </button>
          { uploading && <p>Creating...</p>  }
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateEstate;
