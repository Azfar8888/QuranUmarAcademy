import React from "react";
import StudentAttendance from "./StudentAttendance";
import SuperAdminAttendance from "./SuperAdminAttendance";
import TeacherAttendance from "./TeacherAttendance"; // For later use

const Attendance = () => {
  const role = localStorage.getItem("role");

  if (role === "Student") {
    return <StudentAttendance />;
  } else if (role === "SuperAdmin") {
    return <SuperAdminAttendance />;
  } else if (role === "Teacher") {
    return <TeacherAttendance />; // This will display teacher's attendance functionality
  } else {
    return <div>You are not authorized to view this page.</div>;
  }
};

export default Attendance;
