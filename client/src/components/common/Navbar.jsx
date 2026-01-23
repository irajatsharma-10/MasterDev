import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { BsChevronDown, BsHeart } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/Images/masterDevName.jpg";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";

function Navbar() {
    const { token } = useSelector((state) => state?.auth || {});
    const { user } = useSelector((state) => state?.profile || {});
    const { totalItems } = useSelector((state) => state?.cart || {});
    const location = useLocation();
    const navigate = useNavigate();
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                setSubLinks(res?.data?.data || []);
            } catch (error) {
                console.error("Could not fetch Categories.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    // console.log("Sublinks inside the navbar catalog",subLinks);

    const matchRoute = (route) => matchPath({ path: route }, location.pathname);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog/all?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setShowSearch(false);
        }
    };

    return (
        <div
            className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}
        >
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <img
                        src={logo}
                        alt="Logo"
                        width={160}
                        height={32}
                        className="shadow-[2px_2px_10px_10px_rgba(34,120,71)] rounded-full bg-none border-none bg-clip-text"
                        loading="lazy"
                    />
                </Link>

                {/* Navigation links */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <>
                                        <div
                                            className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}
                                        >
                                            <p>{link.title}</p>
                                            <BsChevronDown />
                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                {loading ? (
                                                    <p className="text-center">Loading...</p>
                                                ) : subLinks?.length ? (
                                                    subLinks.map((subLink, i) => (
                                                        <Link
                                                            to={`/catalog/${subLink?.name.split(" ").join("-").toLowerCase()}`}
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 text-richblack-800"
                                                            key={i}
                                                        >
                                                            <p className="text-richblack-800">{subLink?.name}</p>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className="text-center">No Courses Found</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Desktop Search Bar */}
                <form onSubmit={handleSearch} className="hidden lg:flex items-center">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search courses..."
                            className="w-[200px] xl:w-[280px] rounded-lg bg-richblack-700 pl-10 pr-4 py-2 text-sm text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-50 transition-all"
                        />
                        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400" fontSize={18} />
                    </div>
                </form>

                {/* Login / Signup / Dashboard (instructor should not see cart) */}
                <div className="hidden items-center gap-x-4 md:flex">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <>
                            <Link to="/dashboard/wishlist" className="relative group">
                                <BsHeart className="text-xl text-richblack-100 group-hover:text-pink-200 transition-colors" />
                            </Link>
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart className="text-2xl text-richblack-100 hover:text-yellow-50 transition-colors" />
                                {totalItems > 0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-yellow-50 text-center text-xs font-bold text-richblack-900">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}
                    {token === null ? (
                        <>
                            <Link to="/login">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Sign up
                                </button>
                            </Link>
                        </>
                    ) : (
                        <ProfileDropdown />
                    )}
                </div>

                {/* Search and Mobile Menu */}
                <div className="flex items-center gap-x-3 md:hidden">
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="p-2"
                    >
                        <AiOutlineSearch fontSize={24} fill="#AFB2BF" />
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2"
                    >
                        {mobileMenuOpen ? (
                            <AiOutlineClose fontSize={24} fill="#AFB2BF" />
                        ) : (
                            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {showSearch && (
                <div className="md:hidden border-t border-richblack-700 bg-richblack-800 px-4 py-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search courses..."
                            className="flex-1 rounded-lg bg-richblack-700 px-4 py-2 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-yellow-50 px-4 py-2 text-richblack-900 font-medium"
                        >
                            Search
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Slide-in */}
            <div className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-richblack-900 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b border-richblack-700">
                        <span className="text-lg font-semibold text-richblack-5">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <AiOutlineClose fontSize={24} fill="#AFB2BF" />
                        </button>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <ul className="flex flex-col">
                            {NavbarLinks.map((link, index) => (
                                <li key={index}>
                                    {link.title === "Catalog" ? (
                                        <div className="px-4 py-3">
                                            <p className="text-richblack-300 text-sm mb-2">Categories</p>
                                            <div className="flex flex-col gap-1">
                                                {loading ? (
                                                    <p className="text-richblack-400 text-sm">Loading...</p>
                                                ) : subLinks?.length ? (
                                                    subLinks.map((subLink, i) => (
                                                        <Link
                                                            to={`/catalog/${subLink?.name.split(" ").join("-").toLowerCase()}`}
                                                            className="text-richblack-100 py-2 px-3 rounded-lg hover:bg-richblack-700"
                                                            key={i}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {subLink?.name}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className="text-richblack-400 text-sm">No categories</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to={link?.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block px-4 py-3 ${matchRoute(link?.path) ? "text-yellow-50 bg-richblack-800" : "text-richblack-100"}`}
                                        >
                                            {link.title}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Mobile Menu Footer */}
                    <div className="border-t border-richblack-700 p-4">
                        {token === null ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center rounded-lg border border-richblack-700 bg-richblack-800 py-2 text-richblack-100"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center rounded-lg bg-yellow-50 py-2 text-richblack-900 font-medium"
                                >
                                    Sign up
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                                    <>
                                        <Link
                                            to="/dashboard/cart"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-2 text-richblack-100 py-2"
                                        >
                                            <AiOutlineShoppingCart fontSize={20} />
                                            <span>Cart {totalItems > 0 && `(${totalItems})`}</span>
                                        </Link>
                                        <Link
                                            to="/dashboard/wishlist"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-2 text-richblack-100 py-2"
                                        >
                                            <BsHeart fontSize={18} />
                                            <span>Wishlist</span>
                                        </Link>
                                    </>
                                )}
                                <Link
                                    to="/dashboard/my-profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center rounded-lg bg-yellow-50 py-2 text-richblack-900 font-medium"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
