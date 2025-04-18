import React from "react";
import StudentHomework from "./StudentHomework";
import SuperAdminHomework from "./SuperAdminHomework";
import TeacherHomework from "./TeacherHomework"; // optional for later

const Homework = () => {
  const role = localStorage.getItem("role");

  if (role === "Student") {
    return <StudentHomework />;
  } else if (role === "SuperAdmin") {
    return <SuperAdminHomework />;
  } else if (role === "Teacher") {
    return <TeacherHomework />;
  } else {
    return <div>You are not authorized to view this page.</div>;
  }
};

export default Homework;
