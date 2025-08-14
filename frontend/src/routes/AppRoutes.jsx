import { SideBar } from "../components/SideBar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Trash from "../pages/Trash";
import Profile from "../pages/Profile";
import { useState, useEffect, useRef } from "react";
import AppNavbar from "../components/AppNavbar";
import useAuthStore from "../store/auth";
import VerifyAccount from "../components/VerifyAccount";
import FullPageLoader from "../components/FullPageLoader";

const AppRoutes = () => {
    const {userData, getUserDetails} = useAuthStore();
    const getIsMobile = () => window.innerWidth <= 768;
    const [isMobile, setIsMobile] = useState(getIsMobile());
    const [isOpen, setIsOpen] = useState(!getIsMobile());
    const [loading, setLoading] = useState(true);
    const resizeTimeout = useRef();

    useEffect(() => {
        const fetchUser = async () => {
            await getUserDetails();
            setLoading(false);
        };
        fetchUser();

        const handleResize = () => {
            clearTimeout(resizeTimeout.current);
            resizeTimeout.current = setTimeout(() => {
                const mobile = getIsMobile();
                setIsMobile(mobile);
                setIsOpen(!mobile);
            }, 150);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            clearTimeout(resizeTimeout.current);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (loading) {
        return <FullPageLoader />;
    }

    return (
        <div className="d-flex">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile}/>
            <div className="flex-grow-1" style={{marginLeft: isMobile ? "0px" :  "250px", transition: "margin-left 0.3s ease"}}>
                <AppNavbar setIsOpen={setIsOpen} isMobile={isMobile}/>
                <VerifyAccount show={!userData?.isAccountVerified} />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/trash" element={<Trash />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </div>
        </div>
    )
}

export default AppRoutes;