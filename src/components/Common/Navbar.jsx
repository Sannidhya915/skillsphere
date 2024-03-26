import React, { useEffect, useState, useRef } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import logo from "../../assets/Logo/Group 9.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";
import { logout } from "../../services/operations/authAPI";
import "./hamburger-menu.css";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const menuToggleRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        open &&
        menuToggleRef.current &&
        !menuToggleRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const handleLinkClick = () => {
    setOpen(false); // Close the menu when a link is clicked
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-[#2C333F] ${
        location.pathname !== "/" ? "bg-[#272727]" : ""
      } transition-all duration-200`}
    >
      {/* Hamburger Menu */}
      <div className="block md:hidden" ref={menuToggleRef}>
        <div id="menuToggle">
          <input type="checkbox" checked={open} onChange={() => setOpen(!open)} />
          <span></span>
          <span></span>
          <span></span>
          <ul id="menu">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} onClick={handleLinkClick}>{link.title}</Link>
              </li>
            ))}
            <li>
              {token === null ? (
                <Link to="/login" onClick={handleLinkClick}>
                  Log in
                </Link>
              ) : (
                <div
                  onClick={() => {
                    dispatch(logout(navigate));
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-x-1 text-[22px]  text-white hover:bg- hover:text-[tomato]"
                >
                  <VscSignOut className="text-lg" />
                  Logout
                </div>
              )}
            </li>
            <li>
              {token === null && (
                <Link to="/signup" onClick={handleLinkClick}>
                  Sign up
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      {/* Logo */}
      <div className="flex w-11/12 max-w-maxContent items-center justify-between max-md:justify-center">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            width={160}
            height={32}
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
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-[#DA23FF]"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-150 p-4 text-white opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-175"
                                  key={i}
                                  onClick={handleLinkClick}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Available</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path} onClick={handleLinkClick}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-[#DA23FF]"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-[#333538] bg-[#303030] px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-[#333538] bg-[#303030] px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
