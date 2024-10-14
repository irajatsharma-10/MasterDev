import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "../src/pages/Home"
import Navbar from "./components/common/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import About from "./pages/About"
import Contact from "./pages/Contact"
import VerifyEmail from "./pages/VerifyEmail"
import { Toaster } from 'react-hot-toast';
import OpenRoute from "./components/core/Auth/OpenRoute"
import ForgotPassword from "./pages/forgotPassword"
import UpdatePassword from "./pages/UpdatePassword"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Dashboard from "./pages/Dashboard"
import Settings from "./components/core/Dashboard/Settings/index"
import MyProfile from "./components/core/Dashboard/MyProfile"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import AddCourse from "./components/core/Dashboard/AddCourse"
import EditCourse from "./components/core/Dashboard/EditCourse/index"
import ConfirmationModal from "./components/common/ConfirmationModal"
import Error from "./pages/Error"
import Cart from "./components/core/Dashboard/Cart"
import { ACCOUNT_TYPE } from "./utils/constants"
import { useSelector } from "react-redux"
import MyCourses from "./components/core/Dashboard/MyCourses"
import Catalog from "./pages/Catalog"
import CourseDetails from "./pages/CourseDetails"
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import ViewCourse from "./pages/ViewCourse"
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
function App() {
    const { user } = useSelector((state) => state?.profile || {});
    return (
        <div className="flex min-h-screen flex-col bg-richblack-900 font-inter">
            <Toaster />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/catalog/:catalogName" element={<Catalog />}></Route>
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route
                    path="login"
                    element={
                        <OpenRoute>
                            <Login />
                        </OpenRoute>
                    }
                />
                <Route
                    path="signup"
                    element={
                        <OpenRoute>
                            <Signup />
                        </OpenRoute>
                    }
                />
                <Route
                    path="forgot-password"
                    element={
                        <OpenRoute>
                            <ForgotPassword />
                        </OpenRoute>
                    }
                />

                <Route
                    path="verify-email"
                    element={
                        <OpenRoute>
                            <VerifyEmail />
                        </OpenRoute>
                    }
                />
                <Route
                    path="update-password/:id"
                    element={
                        <OpenRoute>
                            <UpdatePassword />
                        </OpenRoute>
                    }
                />
                <Route
                    path="CM"
                    element={
                        <OpenRoute>
                            <ConfirmationModal />
                        </OpenRoute>
                    }
                />

                <Route
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                >
                    <Route path="dashboard/my-profile" element={<MyProfile />} />

                    <Route path="dashboard/Settings" element={<Settings />} />
                    {
                        user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                                <Route path="dashboard/cart" element={<Cart />} />
                                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                            </>
                        )
                    }
                    {
                        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                            <>
                                <Route path="dashboard/instructor" element={<Instructor />} />
                                <Route path="dashboard/add-course" element={<AddCourse />} />
                                <Route path="dashboard/my-courses" element={<MyCourses />} />
                                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                            </>
                        )
                    }

                </Route>

                <Route
                    element={
                        <PrivateRoute>
                            <ViewCourse />
                        </PrivateRoute>
                    }
                >

                    {
                        user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                                <Route
                                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                                    element={<VideoDetails />}
                                />
                            </>
                        )
                    }

                </Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
                <Route path="*" element={<Error />}></Route>
            </Routes>

        </div>
    )
}

export default App;