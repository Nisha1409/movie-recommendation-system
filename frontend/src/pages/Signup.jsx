import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/signup", {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        navigate("/login");
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
        padding: 2,
      }}
    >
      <Typography variant="h4" color="#fff" gutterBottom>
        Signup
      </Typography>
      <Box
        component="form"
        onSubmit={handleSignup}
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
          variant="outlined"
          label="Username"
          required
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ style: { color: "#BBBBBB" } }} // Label Color
          InputProps={{
            style: {
              color: "white", // Text Color
              backgroundColor: "#1E1E1E", // TextField Background
              borderRadius: "5px",
            },
          }}
        />
        <TextField
          variant="outlined"
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: "#BBBBBB" } }} // Label Color
          InputProps={{
            style: {
              color: "white", // Text Color
              backgroundColor: "#1E1E1E", // TextField Background
              borderRadius: "5px",
            },
          }}
        />
        <TextField
          variant="outlined"
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "#BBBBBB" } }} // Label Color
          InputProps={{
            style: {
              color: "white", // Text Color
              backgroundColor: "#1E1E1E", // TextField Background
              borderRadius: "5px",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#D2042D",
            "&:hover": { backgroundColor: "#a10320" },
          }}
        >
          Signup
        </Button>
        <Typography color="#aaa">
          Already have an account?{" "}
          <Button
            onClick={() => navigate("/login")}
            sx={{ color: "#D2042D", textTransform: "none" }}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
