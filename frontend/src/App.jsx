import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";


function App() {

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" autoClose={3000}/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={<PrivateRoute><AppRoutes /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
