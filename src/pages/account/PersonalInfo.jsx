import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalInfo = () => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    gender: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const user = res.data.data;
        setUserData(user);
        setFormData({
          email: user.email || "",
          gender: user.gender || "",
          phoneNumber: user.phoneNumber || "",
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
          address: user.address || ""
        });
      } catch (err) {
        console.error("Error fetching user info", err);
        toast.error("❌ Failed to load user data");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const invalids = [];

    // Email validation
    if (!formData.email || formData.email.trim() === "") {
      toast.error("❌ Email is required!");
      invalids.push("email");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("❌ Please enter a valid email address!");
        invalids.push("email");
      }
    }

    // Phone number validation
    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      toast.error("❌ Phone number is required!");
      invalids.push("phoneNumber");
    } else {
      const phoneRegex = /^\+?\d{7,15}$/; // basic international phone pattern
      if (!phoneRegex.test(formData.phoneNumber)) {
        toast.error("❌ Please enter a valid phone number!");
        invalids.push("phoneNumber");
      }
    }

    setInvalidFields(invalids);

    if (invalids.length > 0) {
      return; // Prevent submission if validation failed
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUser = res.data?.data;
      const oldEmail = userData.email;
      const newEmail = updatedUser?.email;

      setEditMode(false);
      setInvalidFields([]); // clear error highlights on success

      if (newEmail && oldEmail !== newEmail) {
        toast.success("✅ Email updated. Logging you out...", {
          onClose: () => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("loggedInUser");
            navigate("/signin");
          },
          autoClose: 2000
        });
      } else {
        setUserData(updatedUser);
        toast.success("✅ Changes applied successfully.");
      }
    } catch (err) {
      console.error("❌ Error updating info", err);
      toast.error("❌ Error saving changes.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfd] px-4 py-8 md:px-20 font-inter">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 text-base text-gray-600">
          <span
            onClick={() => navigate("/account-settings")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            ← Back to Account Settings
          </span>
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={() => navigate("/user-dashboard")}
          >
            Dashboard
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Personal info</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-8 space-y-8">
            <InfoField
              label="Email"
              value={formData.email || "Not provided"}
              name="email"
              type="email"
              editMode={editMode}
              handleChange={handleChange}
              invalid={invalidFields.includes("email")}
            />
            <hr className="my-4" />

            <InfoField
              label="Gender"
              value={formData.gender || "Not provided"}
              name="gender"
              type="select"
              options={["Male", "Female"]}
              editMode={editMode}
              handleChange={handleChange}
            />
            <hr className="my-4" />

            <InfoField
              label="Phone number"
              value={formData.phoneNumber || "Not provided"}
              name="phoneNumber"
              type="text"
              editMode={editMode}
              handleChange={handleChange}
              invalid={invalidFields.includes("phoneNumber")}
            />
            <hr className="my-4" />

            <InfoField
              label="Date of Birth"
              value={formData.dateOfBirth || "Not provided"}
              name="dateOfBirth"
              type="date"
              editMode={editMode}
              handleChange={handleChange}
            />
            <hr className="my-4" />

            <InfoField
              label="Address"
              value={formData.address || "Not provided"}
              name="address"
              type="text"
              editMode={editMode}
              handleChange={handleChange}
            />
            <hr className="my-4" />

            <div className="pt-4 flex gap-6">
              {editMode ? (
                <>
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    onClick={handleSave}
                  >
                    Apply Changes
                  </button>
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => {
                      setEditMode(false);
                      setInvalidFields([]);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="text-blue-600 hover:underline text-base font-medium"
                  onClick={() => setEditMode(true)}
                >
                  Edit Info
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Profile Strength
              </p>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-3" style={{ width: "33%" }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-right">
                33% Profile Strength
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-sm text-gray-700">
              <div className="text-2xl mb-2">👤</div>
              <p className="font-semibold text-gray-900 mb-1">
                What info is shared with others?
              </p>
              <p className="text-sm leading-relaxed">
                Jobscan does not share your data unless you opt-in to be
                contacted by recruiters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({
  label,
  value,
  name,
  type,
  options,
  editMode,
  handleChange,
  invalid
}) => (
  <div>
    <p className="text-lg font-semibold text-gray-800 mb-1">{label}</p>
    {editMode ? (
      type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full border px-4 py-3 rounded-lg text-base ${
            invalid ? "border-red-500" : ""
          }`}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          required={name === "email" || name === "phoneNumber"}
          className={`w-full border px-4 py-3 rounded-lg text-base ${
            invalid ? "border-red-500" : ""
          }`}
        />
      )
    ) : (
      <p className="text-gray-700 text-base font-normal">{value}</p>
    )}
  </div>
);

export default PersonalInfo;
