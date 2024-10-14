const Section = require('../Models/Section');
const Subsection = require("../Models/Subsection");
const { uploadImageToCloudinary } = require('../Utils/ImageUploader');


// create subsection

exports.createSubSection = async (req, res) => {
    try {
        // Fetch the data from req body
        const { title, description, sectionId } = req.body;
        
        // Check if file is uploaded
        if (!req.files || !req.files.video) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded or file key is incorrect"
            });
        }

        // Extract the file
        const videoFile = req.files.video;

        // Validation
        if (!title || !description || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // File type validation
        const videoType = videoFile.name.split('.').pop().toLowerCase(); // Extract extension
        const supportedTypes = ["mp4", "mov", "avi"]; // Common video file extensions
        if (!supportedTypes.includes(videoType)) {
            return res.status(400).json({
                success: false,
                message: "Not a valid file type"
            });
        }

        // Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);

        // Create a subsection
        const subSectionDetails = await Subsection.create({
            title: title,
            timeDuration: uploadDetails.duration, // Assuming you meant to use the passed duration directly
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Store the subsection id into the section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id
                }
            },
            { new: true }
        ).populate("subSection").exec();

        // Return response
        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.error("Error creating subsection:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create the subsection, please try again later",
            error: error.message,
        });
    }
};

// update subsection

// exports.updateSubSection = async (req, res) => {
//     try {
//         // fetch the data from req body
//         // kuch data milta h and kuch data khud se import krna pdta h
//         const { title, description, sectionId } = req.body;
//         // extract file/video
//         const videoFile = req.files.video;
//         // validation
//         if (!title  || !description || !sectionId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "All fields are required"
//             })
//         }
//         const videoType = videoFile.name.split('.')[1].toLowerCase();
//         const supportedType = [".mv", ".mp3"];
//         if (supportedType.includes(videoType)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Not a valid file type"
//             })
//         }
//         // upload video to cloudinary(response mein secure url mil jayega)
//         const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

//         // no need to create the subsection while updating

//         // // create a subsection
//         // const subSectionDetails = Subsection.create({
//         //     title: title,
//         //     timeDuration: timeDuration,
//         //     description: description,
//         //     videoUrl: uploadDetails.secure_url,
//         // })

//         // store the subsection id into the section
//         const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId },
//             {
//                 title, description, timeDuration, videoUrl: uploadDetails.secure_url
//             }, { new: true }
//         ).populate("subSection").exec();
//         console.log(updatedSection);
//         // return response
//         return res.status(200).json({
//             success: true,
//             message: "Subsection created successfully",
//             updatedSection,
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Unable to create the subsection, please try again later"
//         })
//     }
// }




exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await subSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        console.log("updated section", updatedSection)

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
}
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId
                }
            }
        )
        const subSection = await Subsection.findByIdAndDelete(subSectionId);
        // const subSection = await Subsection.findByIdAndDelete({_id:subSectionId});
        if (!subSection) {
            return res.status(401).json({
                message: 'Missing subsectionId',
                success: false,
            })
        }

        // updated section after deletion

        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the Subsection",
        })
    }
}

