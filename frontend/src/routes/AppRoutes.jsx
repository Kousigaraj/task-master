import { SideBar } from "../components/SideBar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Trash from "../pages/Trash";
import Profile from "../pages/Profile";
import { ToastContainer} from 'react-toastify';
import { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";

const AppRoutes = () => {
    const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

        useEffect(() => {
        const handleResize = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setIsOpen(!mobile);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
      <div className="d-flex">
        <ToastContainer position="bottom-center" autoClose={3000}/>
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile}/>
        <div className="flex-grow-1" style={{marginLeft: isMobile ? "0px" :  "250px", transition: "margin-left 0.3s ease"}}>
        <AppNavbar setIsOpen={setIsOpen} isMobile={isMobile}/>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
  )
}

export default AppRoutes;