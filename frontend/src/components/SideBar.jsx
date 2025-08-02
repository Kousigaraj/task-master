import styles from './sidebar.module.css';
import Button from 'react-bootstrap/Button';
import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaTasks } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoPersonOutline, IoLogOutOutline  } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useRef, useEffect } from 'react';

export const SideBar = ({isOpen, setIsOpen, isMobile}) => {
    const sidebarRef = useRef();

     useEffect(() => {
        if (!isMobile || !isOpen) return;
        const handleOutsideClick = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen, isMobile, setIsOpen]);

    const handleNavClick = () => {
        if (isMobile) setIsOpen(false);
    };

  return (
    <div ref={sidebarRef} className={`${styles.sidebar} bg-dark p-2 text-light ${isOpen ? styles.open : styles.close}`}>
        <div className='d-flex justify-content-between align-items-center' style={{height: "50px"}}>
            {isOpen &&<h2 className='fs-3'>TaskMaster</h2>}
            {isMobile && (
            <Button variant="dark" onClick={() => setIsOpen(false)}>
                <RxCross2 />
            </Button>
            )}
        </div>
        <div className='mb-5' style={{height: "30px"}}>
            { isOpen && <p>Welcome, kousigaraj!</p> }
        </div>
        <div className={`${styles.linkcontainer} p-2 d-flex flex-column justify-content-between`}>
            <nav className="nav flex-column">
                <NavLink
                to="/app"
                end
                onClick={handleNavClick}
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded  ${isActive ? "bg-secondary" : ""} ${!isOpen ? "text-center" : ""} `
                }
                >
                <LuLayoutDashboard /> 
                <span className='ms-2' style={{whiteSpace: "nowrap"}}>Dashboard</span>
                </NavLink>
                <NavLink
                to="/app/tasks"
                end
                onClick={handleNavClick}
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded  ${isActive ? "bg-secondary" : ""} ${!isOpen ? "text-center" : ""} `
                }
                >
                <FaTasks />  
                <span className='ms-2' style={{whiteSpace: "nowrap"}}>Tasks</span>
                </NavLink>
                <NavLink
                to="/app/trash"
                end
                onClick={handleNavClick}
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded  ${isActive ? "bg-secondary" : ""} ${!isOpen ? "text-center" : ""} `
                }
                >
                <FaRegTrashCan />
                <span className='ms-2' style={{whiteSpace: "nowrap"}}>Trash</span>
                </NavLink>
                <NavLink
                to="/app/profile"
                end
                onClick={handleNavClick}
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded  ${isActive ? "bg-secondary" : ""} ${!isOpen ? "text-center" : ""} `
                }
                >
                <IoPersonOutline />
                <span className='ms-2' style={{whiteSpace: "nowrap"}}>Profile</span>
                </NavLink>
            </nav>
            <button className='btn btn-light'><IoLogOutOutline />
            <span className='ms-2' style={{whiteSpace: "nowrap"}}>Log out</span>
            </button>
        </div>
    </div>
  )
}
