// import React, { useState } from 'react';

// const Upload = ({ name, label, register, setValue, errors, editData }) => {
//     const [preview, setPreview] = useState(editData || null);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         console.log("File selected: ", file); // Debugging check
//         if (file) {
//             setValue(name, file); // Set the file value using react-hook-form
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 console.log("Image data: ", reader.result); // Debugging check
//                 setPreview(reader.result); // Set preview image
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div className="w-full flex flex-col space-y-2">
//             <label className="text-sm text-richblack-5" htmlFor={name}>
//                 {label} <sup className="text-pink-200">*</sup>
//             </label>

//             {/* Hidden file input */}
//             <input
//                 type="file"
//                 id={name}
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden" // Hide input field
//                 {...register(name)}
//             />

//             {/* Display the full image or an upload button */}
//             {preview ? (
//                 <label htmlFor={name} className="cursor-pointer">
//                     {/* Clickable Preview Image */}
//                     <img
//                         src={preview}
//                         alt="Thumbnail Preview"
//                         className="thumbnail-preview"
//                         style={{ width: '100%', maxWidth: '1024px', height: 'auto', border: '2px solid #ddd' }}
//                     />
//                 </label>
//             ) : (
//                 <div className="flex flex-col items-center space-y-2">
//                     <label htmlFor={name} className="cursor-pointer">
//                         <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded">
//                             Upload Image
//                         </button>
//                     </label>

//                     {/* Show existing image (if available) */}
//                     {editData && (
//                         <label htmlFor={name} className="cursor-pointer">
//                             <img
//                                 src={editData}
//                                 alt="Existing Thumbnail"
//                                 className="thumbnail-preview"
//                                 style={{ width: '100%', maxWidth: '1024px', height: 'auto', border: '2px solid #ddd' }}
//                             />
//                         </label>
//                     )}
//                 </div>
//             )}

//             {/* Error message */}
//             {errors[name] && <span className="error-message">{errors[name].message}</span>}
//         </div>
//     );
// };

// export default Upload;








import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
    name,
    label,
    register,
    setValue,
    errors,
    video = false,
    viewData = null,
    editData = null,
}) {
    const { course } = useSelector((state) => state.course)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(
        viewData ? viewData : editData ? editData : ""
    )
    const inputRef = useRef(null)

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            previewFile(file)
            setSelectedFile(file)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: !video
            ? { "image/*": [".jpeg", ".jpg", ".png"] }
            : { "video/*": [".mp4"] },
        onDrop,
    })

    const previewFile = (file) => {
        // console.log(file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    useEffect(() => {
        register(name, { required: true })
        // 
    }, [register])

    useEffect(() => {
        setValue(name, selectedFile)
        // 
    }, [selectedFile, setValue])

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} {!viewData && <sup className="text-pink-200">*</sup>}
            </label>
            <div
                className={`${isDragActive ? "bg-richblack-600" : "bg-richblack-700"
                    } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
            >
                {previewSource ? (
                    <div className="flex w-full flex-col p-6">
                        {!video ? (
                            <img
                                src={previewSource}
                                alt="Preview"
                                className="h-full w-full rounded-md object-cover"
                            />
                        ) : (
                            <Player aspectRatio="16:9" playsInline src={previewSource} />
                        )}
                        {!viewData && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewSource("")
                                    setSelectedFile(null)
                                    setValue(name, null)
                                }}
                                className="mt-3 text-richblack-400 underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        className="flex w-full flex-col items-center p-6"
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} ref={inputRef} />
                        <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                            <FiUploadCloud className="text-2xl text-yellow-50" />
                        </div>
                        <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                            Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                            <span className="font-semibold text-yellow-50">Browse</span> a
                            file
                        </p>
                        <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                            <li>Aspect ratio 16:9</li>
                            <li>Recommended size 1024x576</li>
                        </ul>
                    </div>
                )}
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    )
}
