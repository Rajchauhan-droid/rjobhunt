import React, { useEffect, useState } from "react";
import axios from "axios";
import ManageUsersTable from "../../components/ManageUsersTable";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  return (
    <div className="space-y-6">
      <ManageUsersTable />
    </div>
  );
};

export default ManageUsers;