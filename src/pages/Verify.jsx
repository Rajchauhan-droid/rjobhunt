import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/verify?token=${token}`);
        if (res.data.success) {
          toast.success("Your email has been verified successfully! Redirecting to sign in...", {
            position: "top-center",
          });
          setTimeout(() => navigate("/signin"), 2500);
        } else {
          toast.error(res.data.message || "Invalid token or user not found.", { position: "top-center" });
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Verification failed. Please try again.";
        toast.error(msg, { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyUser();
    } else {
      toast.error("No verification token provided!", { position: "top-center" });
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[url('/beach.jpg')] bg-cover flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
        {loading ? (
          <p className="text-gray-700">Verifying your account...</p>
        ) : (
          <p className="text-gray-700">Check the notification above for the result.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Verify;
