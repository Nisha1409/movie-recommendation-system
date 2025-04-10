import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/auth/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data)); // Save full user data
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Failed to connect to the server.");
      }
    }
  };


  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        padding: 3,
      }}
    >
      <Typography variant="h4" color="#fff" gutterBottom>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: "90%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#151515",
          padding: 4,
          borderRadius: "8px",
        }}
      >
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          InputLabelProps={{ style: { color: "#BBBBBB" } }} // Label Color
          InputProps={{
            style: {
              color: "white", // Text Color
              backgroundColor: "#1E1E1E", // TextField Background
              borderRadius: "5px",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent", // No border by default
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent", // No border when focused
              },
              "& input": {
                outline: "none !important",
                boxShadow: "none !important",
              },
            },
          }}
        />


        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputLabelProps={{ style: { color: "#BBBBBB" } }} // Label Color
          InputProps={{
            style: {
              color: "white", // Text Color
              backgroundColor: "#1E1E1E", // TextField Background
              borderRadius: "5px",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent", // No border by default
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent", // No border when focused
              },
              "& input": {
                outline: "none !important",
                boxShadow: "none !important",
              },
            },
          }}
        />

        {/* Error Message */}
        {error && (
          <Typography color="error" variant="body2" style={{ marginTop: "10px" }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#D2042D",
            "&:hover": { backgroundColor: "#a10320" },
          }}
        >
          Login
        </Button>
        <Typography color="#aaa">
          Don't have an account?{" "}
          <Button
            onClick={() => navigate("/signup")}
            sx={{ color: "#D2042D", textTransform: "none" }}
          >
            Signup
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
