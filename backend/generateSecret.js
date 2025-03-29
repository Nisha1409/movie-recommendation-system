const bcrypt = require("bcryptjs");

// Create a random secret
const secret = "mySuperSecretString"; // Or use any random string
const saltRounds = 10; // Higher rounds = more secure but slower

bcrypt.hash(secret, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err);
  } else {
    console.log("Your Hashed JWT Secret:", hash);
  }
});
