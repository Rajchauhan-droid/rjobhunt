import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";

const Dashboard = () => (
  <div className="flex justify-center items-center h-screen text-3xl text-green-600">
    Welcome to Dashboard ✅
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> 

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h2 className="p-6">404: Page not found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
