import styles from './sidebar.module.css';
import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaTasks, } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoPersonOutline, IoLogOutOutline  } from "react-icons/io5";

export const SideBar = () => {
  return (
    <div className={`${styles.sidebar} bg-dark p-3 text-light`}>
        <h2>TaskMaster</h2>
        <p className='mb-5'>Welcome, kousigaraj!</p>
        <div className={`${styles.linkcontainer} d-flex flex-column justify-content-between`}>
            <nav className="nav flex-column">
                <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded ${isActive ? "bg-secondary" : ""}`
                }
                >
                <LuLayoutDashboard className={styles.icon}/> Dashboard
                </NavLink>
                <NavLink
                to="/tasks"
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded ${isActive ? "bg-secondary" : ""}`
                }
                >
                <FaTasks className={styles.icon}/>  Tasks
                </NavLink>
                <NavLink
                to="/trash"
                end
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded ${isActive ? "bg-secondary" : ""}`
                }
                >
                <FaRegTrashCan className={styles.icon} />Trash
                </NavLink>
                <NavLink
                to="/profile"
                end
                className={({ isActive }) =>
                    `nav-link mb-2 text-white rounded ${isActive ? "bg-secondary" : ""}`
                }
                >
                <IoPersonOutline className={styles.icon}/>    Profile
                </NavLink>
            </nav>
            <button className='btn btn-light'><IoLogOutOutline className={styles.icon}/>Log out</button>
        </div>
    </div>
  )
}
