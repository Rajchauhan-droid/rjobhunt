import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const navigate = useNavigate();

  // Field states
  const [firstName, setFirstName] = useState("Raj");
  const [lastName, setLastName] = useState("Chauhan");
  const [email, setEmail] = useState("raajchauh@gmail.com");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("1999-01-01");
  const [professionalInfo, setProfessionalInfo] = useState("");
  const [address, setAddress] = useState("Toronto, CA");

  // Editing flags
  const [editing, setEditing] = useState({
    name: false,
    email: false,
    phone: false,
    dob: false,
    professional: false,
    address: false,
  });

  const handleCancel = (field) => {
    setEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleSave = (field) => {
    console.log("✅ Saved:", {
      firstName,
      lastName,
      email,
      phone,
      dob,
      professionalInfo,
      address,
    });
    setEditing((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/account-settings")}
            >
              Account
            </span>{" "}
            &gt; Personal info
          </div>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6">Personal info</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            {/* Name */}
            <Section
              title="Your name"
              description="This is the name on your resume."
              editing={editing.name}
              onEdit={() => setEditing({ ...editing, name: true })}
              onCancel={() => handleCancel("name")}
              onSave={() => handleSave("name")}
              fields={
                editing.name ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-600">First name</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last name</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 text-lg">{firstName} {lastName}</p>
                )
              }
            />

            {/* Email */}
            <Section
              title="Email address"
              editing={editing.email}
              onEdit={() => setEditing({ ...editing, email: true })}
              onCancel={() => handleCancel("email")}
              onSave={() => handleSave("email")}
              fields={
                editing.email ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-3 px-4 py-2 border border-gray-300 rounded"
                  />
                ) : (
                  <p className="mt-2 text-gray-600 text-sm">{email}</p>
                )
              }
            />

            {/* Phone */}
            <Section
              title="Phone number"
              editing={editing.phone}
              onEdit={() => setEditing({ ...editing, phone: true })}
              onCancel={() => handleCancel("phone")}
              onSave={() => handleSave("phone")}
              fields={
                editing.phone ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-3 px-4 py-2 border border-gray-300 rounded"
                  />
                ) : (
                  <p className="mt-2 text-gray-600 text-sm">
                    {phone || "Not provided"}
                  </p>
                )
              }
            />

            {/* DOB */}
            <Section
              title="Date of Birth"
              editing={editing.dob}
              onEdit={() => setEditing({ ...editing, dob: true })}
              onCancel={() => handleCancel("dob")}
              onSave={() => handleSave("dob")}
              fields={
                editing.dob ? (
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full mt-3 px-4 py-2 border border-gray-300 rounded"
                  />
                ) : (
                  <p className="mt-2 text-gray-600 text-sm">{dob}</p>
                )
              }
            />

            {/* Professional Info */}
            <Section
              title="Professional information"
              editing={editing.professional}
              onEdit={() => setEditing({ ...editing, professional: true })}
              onCancel={() => handleCancel("professional")}
              onSave={() => handleSave("professional")}
              fields={
                editing.professional ? (
                  <input
                    type="text"
                    value={professionalInfo}
                    onChange={(e) => setProfessionalInfo(e.target.value)}
                    className="w-full mt-3 px-4 py-2 border border-gray-300 rounded"
                  />
                ) : (
                  <p className="mt-2 text-gray-600 text-sm">
                    {professionalInfo || "Not provided"}
                  </p>
                )
              }
            />

            {/* Address */}
            <Section
              title="Address"
              editing={editing.address}
              onEdit={() => setEditing({ ...editing, address: true })}
              onCancel={() => handleCancel("address")}
              onSave={() => handleSave("address")}
              fields={
                editing.address ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full mt-3 px-4 py-2 border border-gray-300 rounded"
                  />
                ) : (
                  <p className="mt-2 text-gray-600 text-sm">
                    {address || "Not provided"}
                  </p>
                )
              }
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-sm text-gray-600 mb-2">Profile Strength</p>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-3" style={{ width: "60%" }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-right">
                60% Profile Strength
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow text-sm text-gray-600">
              <div className="text-xl mb-2">👤</div>
              <p className="font-semibold text-gray-800 mb-1">
                What info is shared with others?
              </p>
              <p>
                Jobscan does not share your data unless you opt-in to be contacted by recruiters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 👇 Reusable Section Component
const Section = ({ title, description, editing, onEdit, onSave, onCancel, fields }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {!editing && (
        <button onClick={onEdit} className="text-blue-600 text-sm hover:underline">
          Edit
        </button>
      )}
    </div>
    <div className="mt-3">{fields}</div>
    {editing && (
      <div className="mt-4">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="ml-4 text-sm text-blue-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    )}
  </div>
);

export default PersonalInfo;
