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
      const response = await axios.get("https://quranumaracademy.onrender.com/api/users", {
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

  // ✅ Updated handleAddUser function (Frontend)
const handleAddUser = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "https://quranumaracademy.onrender.com/api/auth/register", // ✅ Use proper registration route
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

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-1">
            <div className="text-muted text-center mt-2 mb-1">
              <img
                src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png"
                alt="Umar Academy Logo"
                className="login-logo"
              />
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
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
