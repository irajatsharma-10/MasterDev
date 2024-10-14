const Section = require("../Models/Section")
const Course = require("../Models/Course");
const SubSection = require("../Models/Subsection")

exports.createSection = async(req,res)=>{
    try{
        // data fetch
        // courseId to update the course
        // sectionName to update its entry in Database
        const {sectionName , courseId} = req.body;
        // data validation
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message:'Missing Properties',
            })
        }
        // create section(section ko create kro and Course mein update krdo)
        const newSection = await Section.create({
            sectionName
        })
        // update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent: newSection._id, // courseContent is storing the section id

                }
            },
            {new: true},// to get the updated document into the db
        ).populate({
            path: "courseContent",// courseContent  is the (key) child of Course referencing the Section model path
            populate:{
                path: "subSection"// SubSection is the child of Section
                // no need to provide the path if only want to populate the child model
            },
        }).exec();
        // return response
        return res.status(200).json({
            success: true,
            message:"Section created successfully",
            data: updatedCourseDetails,

        })
    }catch(error){
        console.log("Section not created",error);
        return res.status(500).json({
            success: false,
            message: "Unable to create the section , please try again later"
        })
    }
}

exports.updateSection = async (req,res)=>{
    try{
        // data input
        const {sectionName, sectionId, courseId} = req.body;
        // data validation
        if(!sectionName || !sectionId || !courseId){
            return res.status(401).json({
                success: false,
                message:'Missing Properties',
            })
        }
        // update the data(no need to create the update section inside the course as there's already the section id present inside the course and id update nhi hogi)
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, {sectionName}, {new: true})
        
        // find the course with updated section
        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        // return response
        return res.status(200).json({
            success: true,
            message:"Section updated successfully",
            data: course,
        })

    }catch(error){
        console.log("Error updating section",error);
        return res.status(500).json({
            success: false,
            message: "Unable to update the section , please try again later"
        })
    }
}
exports.deleteSection = async (req, res) => {
    try {
        // Get IDs from request body
        const { sectionId, courseId } = req.body;

        // Validate that both sectionId and courseId are provided
        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'SectionId and CourseId are required',
            });
        }

        // Pull the sectionId from courseContent array in the Course document
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,  // courseContent is storing the section Id
            }
        });

        // Find the section to retrieve its subSections
        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found',
            });
        }

        // Delete all subSections associated with the section
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        // Delete the section
        await Section.findByIdAndDelete(sectionId);

        // Fetch the updated Course document with populated subSections
        const updatedCourse = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        }).exec();

        // Return the response with updated course data
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: updatedCourse,
        });

    } catch (error) {
        console.log("Error deleting section:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete the section, please try again later",
        });
    }
};
