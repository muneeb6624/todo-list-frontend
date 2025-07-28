// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Cloudinary } from "@cloudinary/url-gen";
// import { setCredentials } from "../features/auth/authSlice";

// function UploadImage() {
//   const [publicId, setPublicId] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadComplete, setUploadComplete] = useState(false);
  
//   const { token, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   const cld = new Cloudinary({ cloud: { cloudName } });

//   // Load Cloudinary script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   // Auto-save profile picture to database when publicId changes
//   useEffect(() => {
//     if (publicId && !uploadComplete) {
//       saveProfilePicture();
//     }
//   }, [publicId]);

//   const saveProfilePicture = async () => {
//     try {
//       setIsUploading(true);
      
//       const profilePictureUrl = cld.image(publicId).toURL();
      
//       // Update user profile in database
//       const response = await fetch('http://localhost:5000/api/auth/users/update-profile', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           profilePicture: profilePictureUrl
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save profile picture');
//       }

//       const updatedUser = await response.json();
      
//       // Update Redux store with new user data
//       dispatch(setCredentials({ user: updatedUser, token }));
      
//       setUploadComplete(true);
//       setIsUploading(false);
      
//       // Auto-navigate to main app after 2 seconds
//       setTimeout(() => {
//         navigate('/home');
//       }, 2000);
      
//     } catch (error) {
//       console.error('Failed to save profile picture:', error);
//       setIsUploading(false);
//       alert('Failed to save profile picture. Please try again.');
//     }
//   };

//   const handleImageUpload = async () => {
//     try {
//       if (!token) {
//         alert("Please register first before uploading profile picture");
//         return;
//       }

//       // Get initial upload parameters
//       const response = await fetch("http://localhost:5000/api/auth/sign-upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to get upload parameters");
//       }

//       const uploadParams = await response.json();
//       console.log('Upload params:', uploadParams);

//       // Use signed upload with dynamic signature
//       if (window.cloudinary) {
//         window.cloudinary.openUploadWidget(
//           {
//             cloudName: uploadParams.cloud_name,
//             apiKey: uploadParams.api_key,
//             folder: uploadParams.folder,
//             publicId: uploadParams.public_id,
//             sources: ["local", "camera"],
//             multiple: false,
//             cropping: true,
//             croppingAspectRatio: 1,
//             croppingDefaultSelectionRatio: 1,
//             croppingShowDimensions: true,
//             clientAllowedFormats: ["png", "jpg", "jpeg"],
//             maxImageFileSize: 2000000, // 2MB
//             maxImageWidth: 1000,
//             maxImageHeight: 1000,
//             // Dynamic signature function
//             uploadSignature: async (callback, paramsToSign) => {
//               try {
//                 const signResponse = await fetch("http://localhost:5000/api/auth/sign-params", {
//                   method: "POST",
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({ params_to_sign: paramsToSign })
//                 });
                
//                 if (!signResponse.ok) {
//                   throw new Error("Failed to sign parameters");
//                 }
                
//                 const { signature } = await signResponse.json();
//                 callback(signature);
//               } catch (error) {
//                 console.error("Signature generation failed:", error);
//                 callback(null);
//               }
//             }
//           },
//           (error, result) => {
//             if (!error && result && result.event === "success") {
//               console.log("Upload success:", result.info);
//               setPublicId(result.info.public_id);
//               // saveProfilePicture will be called automatically via useEffect
//             } else if (error) {
//               console.error("Upload error:", error);
//               alert("Upload failed: " + (error.message || "Unknown error"));
//             }
//           }
//         );
//       } else {
//         alert("Cloudinary widget not loaded. Please refresh and try again.");
//       }
//     } catch (error) {
//       console.error("Upload initialization failed:", error);
//       alert("Failed to initialize upload. Please try again.");
//     }
//   };

//   const skipUpload = () => {
//     navigate('/home');
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//       <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-lg text-white">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Complete Your Profile
//         </h2>
        
//         <div className="text-center mb-6">
//           <p className="text-slate-300 mb-4">
//             Welcome {user?.name}! Add a profile picture to personalize your account.
//           </p>
//         </div>

//         {publicId && (
//           <div className="mb-4 text-center">
//             <img
//               src={cld.image(publicId).resize('w_150,h_150,c_fill').toURL()}
//               alt="Profile Preview"
//               className="mx-auto rounded-full border-4 border-blue-500"
//             />
//           </div>
//         )}

//         {isUploading && (
//           <div className="text-center mb-4">
//             <p className="text-blue-400">Saving profile picture...</p>
//           </div>
//         )}

//         {uploadComplete && (
//           <div className="text-center mb-4">
//             <p className="text-green-400">✅ Profile picture saved! Redirecting...</p>
//           </div>
//         )}

//         <button
//           type="button"
//           onClick={handleImageUpload}
//           className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md mb-4 disabled:opacity-50"
//           disabled={!token || isUploading || uploadComplete}
//         >
//           {!token ? "Please register first" : 
//            isUploading ? "Saving..." :
//            uploadComplete ? "Upload Complete!" :
//            "Upload Profile Picture"}
//         </button>

//         <button
//           type="button"
//           onClick={skipUpload}
//           className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md disabled:opacity-50"
//           disabled={isUploading}
//         >
//           Skip for now
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UploadImage;




// on-boarding/Upload.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { setCredentials } from "../features/auth/authSlice";

function UploadImage() {
  const [publicId, setPublicId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;
  const cld = new Cloudinary({ cloud: { cloudName } });

  // Load widget
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const saveProfilePicture = async (url) => {
    try {
      setIsUploading(true);

      const response = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePicture: url }),
      });

      if (!response.ok) throw new Error("Failed to save profile picture");

      const updatedUser = await response.json();
      dispatch(setCredentials({ user: updatedUser, token }));

      setUploadComplete(true);
      setIsUploading(false);

      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error(err);
      alert("Saving to DB failed.");
      setIsUploading(false);
    }
  };

  const handleImageUpload = () => {
    if (!window.cloudinary) return alert("Cloudinary widget failed to load.");

    console.log("Preset from env:", uploadPreset);

    window.cloudinary.openUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "camera"],
        cropping: true,
        multiple: false,
      },
      (error, result) => {
        if (!error && result.event === "success") {
          const { public_id, secure_url } = result.info;
          setPublicId(public_id);
          saveProfilePicture(secure_url);
        } else if (error) {
          console.error("Upload Error:", error);
        }
      }
    );
  };

  const skipUpload = () => navigate("/home");

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>

        <p className="text-slate-300 mb-6 text-center">
          Welcome {user?.name}! Upload a profile picture to personalize your account.
        </p>

        {publicId && (
          <div className="mb-4 text-center">
            <img
              src={cld.url(publicId, { width: 150, crop: "scale" })}
              alt="Preview"
              className="mx-auto rounded-full border-4 border-blue-500"
            />
          </div>
        )}

        {isUploading && <p className="text-blue-400 mb-4 text-center">Saving profile picture...</p>}
        {uploadComplete && <p className="text-green-400 mb-4 text-center">✅ Saved! Redirecting...</p>}

        <button
          onClick={handleImageUpload}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md mb-4"
          disabled={isUploading || uploadComplete}
        >
          {isUploading ? "Saving..." : uploadComplete ? "Uploaded!" : "Upload Profile Picture"}
        </button>

        <button
          onClick={skipUpload}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md"
          disabled={isUploading}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

export default UploadImage;
