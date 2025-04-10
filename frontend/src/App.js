import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
// import MainHome from "./pages/MainHome";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./components/User/Profile";
import Signup from "./pages/Signup";
import MovieDetails from "./components/Home/MovieDetails";
import SearchResults from "./pages/SearchResults";

function App() {
  const userToken = localStorage.getItem("userToken");
  return (
    <MovieProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={!!userToken} />} />
          {/* <Route path="/" element={<MainHome/>} /> */}

          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Home />} />   {/* Redirect unknown routes to Home */}
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </MovieProvider>
  );
}

export default App;
