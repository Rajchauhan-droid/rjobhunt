// src/services/authService.js

export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin@example.com" && password === "admin123") {
        localStorage.setItem("token", "mockToken123");
        resolve({ message: "Login successful" });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
};

export const registerUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Just a basic demo, always resolves
      resolve({ message: "Registration successful" });
    }, 1000);
  });
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
