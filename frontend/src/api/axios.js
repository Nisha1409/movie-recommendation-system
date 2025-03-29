import axios from "axios";

// Create axios instance with base URL
export default axios.create({
  baseURL: "http://localhost:5000", // Your backend port
});
