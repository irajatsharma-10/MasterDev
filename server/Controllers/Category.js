const Category = require('../Models/Category');
const Tag = require('../Models/Category');
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}
// create tag k handler function liko
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        // create the entry in Database
        const CategoryDetails = await Category.create({
            name: name,
            description: description
        })
        console.log(CategoryDetails);
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            CategoryDetails
        })
        // whenever we create the course we'll make sure to update the Category
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// getAll Category
exports.showAllCategories = async (req, res) => {
    try {
        // dont want Category on the basis of any particular entry but make sure to include name and description
        const allCategories = await Category.find({}, { name: true, description: true });
        return res.status(200).json({
            message: "All Category return successfully",
            success: true,
            data: allCategories,
        })
    } catch (error) {
        console.log("Error in showing all categories", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
    try {
        // get category id
        const { categoryId } = req.body;

        // get courses for specified category id
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

        // validation
        if (!selectedCategory) {
            console.log("Selected category not found");
            return res.status(404).json({
                success: false,
                message: "Selected Category not found",
            })
        }
        console.log("Selected Category:", selectedCategory);
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        // ne means not equal

        // Get categories except the selected one
        const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });

        if (categoriesExceptSelected.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No different categories found",
            });
        }

        // Select a random category from categoriesExceptSelected
        const randomCategoryIndex = getRandomInt(categoriesExceptSelected.length);
        const randomCategory = categoriesExceptSelected[randomCategoryIndex];

        // Populate courses for the randomly selected category
        const differentCategory = await Category.findById(randomCategory._id)
            .populate({
                path: "courses",
                // Uncomment if needed to filter published courses
                // match: { status: "Published" },
            })
            .exec();


    


        // get top selling courses
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                // match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}