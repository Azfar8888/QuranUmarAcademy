// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Admin", password: "" });
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null); // Track user to delete
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");

  const [view, setView] = useState("users");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      // Fetch all users
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);

      // Separate Teachers/Admins and Students
      const teachersAndAdmins = response.data.filter(
        (user) => user.role === "Teacher" || user.role === "Admin"
      );
      setTeachers(teachersAndAdmins);

      const studentsList = response.data.filter((user) => user.role === "Student");
      setStudents(studentsList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
    }
  };

  // Call fetchUsers when the component mounts
  useEffect(() => {
    fetchUsers();
  }, [token, navigate]);

  // Add new user
  // const handleAddUser = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/users",
  //       newUser,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setUsers([...users, response.data]);
  //     setNewUser({ name: "", email: "", role: "Admin", password: "" });
  //   } catch (err) {
  //     console.error("Error adding user:", err);
  //     setError("Failed to add user. Please try again.");
  //   }
  // };

  // ✅ Updated handleAddUser function (Frontend)
const handleAddUser = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register", // ✅ Use proper registration route
      newUser,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers([...users, response.data]);
    setNewUser({ name: "", email: "", role: "Admin", password: "" });
  } catch (err) {
    console.error("Error adding user:", err);
    setError("Failed to add user. Please try again.");
  }
};


  // Update user
  // const handleEditUser = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/api/users/${editUser._id}`,
  //       { name: editUser.name, email: editUser.email, role: editUser.role },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setUsers(users.map((u) => (u._id === editUser._id ? response.data : u)));
  //     setEditUser(null);
  //   } catch (err) {
  //     console.error("Error updating user:", err);
  //     setError("Failed to update user. Please try again.");
  //   }
  // };

  // // Delete user
  // const handleDeleteUser = async () => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/users/${deleteUserId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUsers(users.filter((user) => user._id !== deleteUserId));
  //     setDeleteUserId(null); // Close modal
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //     setError("Failed to delete user. Please try again.");
  //   }
  // };

  // // Logout function
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("role");
  //   navigate("/login");
  // };

  // const handleRoleChange = async (userId, newRole) => {
  //   try {
  //     const response = await axios.put(
  //       "http://localhost:5000/api/users/assign-role",
  //       { userId, newRole },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setUsers(users.map((user) => (user._id === userId ? response.data.user : user)));
  //   } catch (err) {
  //     console.error("Error updating role:", err);
  //     setError("Failed to update role.");
  //   }
  // };

  // // Import Users
  // const handleImport = async (e) => {
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     await axios.post("http://localhost:5000/api/users/import", formData, {
  //       headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  //     });

  //     window.location.reload();
  //   } catch (err) {
  //     console.error("Error importing users:", err);
  //     setError("Failed to import users.");
  //   }
  // };

  // // Export Users
  // const handleExport = async () => {
  //   window.open("http://localhost:5000/api/users/export");
  // };
  // const handleAssignRole = async (userId, newRole) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     await axios.put(
  //       `http://localhost:5000/api/users/assign-role`,
  //       { userId, newRole },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     // Update UI
  //     setUsers(users.map((user) =>
  //       user._id === userId ? { ...user, role: newRole } : user
  //     ));
  //   } catch (err) {
  //     console.error("Error assigning role:", err.response?.data || err.message);
  //     setError("Failed to assign role. Please try again.");
  //   }
  // };
  // const handleAssignStudents = async () => {
  //   if (!selectedTeacher || selectedStudents.length === 0) {
  //     setMessage("Please select a teacher and at least one student.");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.post(
  //       "http://localhost:5000/api/users/assign-students",
  //       { teacherId: selectedTeacher, studentIds: selectedStudents },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setMessage("Students assigned successfully!");
  //     setSelectedTeacher("");
  //     setSelectedStudents([]);
  //   } catch (error) {
  //     console.error("Error assigning students:", error);
  //     setMessage("Failed to assign students.");
  //   }
  

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-1">
            {/* <div className="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div> */}
            {/* <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/github.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div> */}
            <div className="text-muted text-center mt-2 mb-1">
              <img
                src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png"
                alt="Umar Academy Logo"
                className="login-logo"
              />
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {/* <div className="text-center text-muted mb-4">
              <small>Or sign up with credentials</small>
            </div> */}
            <Form onSubmit={handleAddUser} role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                   type="password"
                   placeholder="Password"
                   value={newUser.password}
                   onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                   required
                  />
                </InputGroup>
              </FormGroup>
              {/* <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row> */}
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Register New User
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
