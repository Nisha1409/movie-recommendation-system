import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const userToken = localStorage.getItem("userToken");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={!!userToken} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Home />} />   {/* Redirect unknown routes to Home */}
      </Routes>
    </Router>
  );
}

export default App;
