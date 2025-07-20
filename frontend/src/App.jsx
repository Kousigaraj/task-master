import { SideBar } from "./components/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Trash from "./pages/Trash";
import Profile from "./pages/Profile";
import Tost from "./components/Tost";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1" style={{marginLeft: "240px"}}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
      <Tost />
    </BrowserRouter>
  );
}

export default App;
