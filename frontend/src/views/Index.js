import React, { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import ReactModal from "react-modal";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input
} from "reactstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
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
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("");


  const [view, setView] = useState("users");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
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
  // useEffect(() => {
  //   fetchUsers();
  // }, [token, navigate]);

  // const fetchUsers = async () => {
  //   const token = localStorage.getItem("token");
  
  //   try {
  //     // Fetch current logged-in user
  //     const loggedInUser = JSON.parse(localStorage.getItem("user"));
  //     if (!loggedInUser) return;
  
  //     const response = await axios.get("http://localhost:5000/api/users", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     let filteredUsers = response.data;
  
  //     if (loggedInUser.role === "Teacher") {
  //       // ✅ Show only assigned students for teachers
  //       filteredUsers = loggedInUser.assignedStudents || [];
  //     } else if (loggedInUser.role === "Student") {
  //       // ✅ Show only assigned teachers for students
  //       filteredUsers = response.data.filter((user) => user.assignedStudents?.some((id) => id === loggedInUser._id));
  //     }
  
  //     setUsers(filteredUsers);
  //   } catch (err) {
  //     console.error("Error fetching users:", err);
  //     setError("Failed to fetch users. Please try again.");
  //   }
  // };
  
  useEffect(() => {
    fetchUsers();
  }, [userRole, token, navigate]);

  const filteredUsers = users.filter((user) => {
    return (
      (roleFilter === "" || user.role === roleFilter) &&
      (searchQuery === "" || user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });



  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users",
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
  const openEditModal = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };

  // Update user
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${editUser._id}`,
        { name: editUser.name, email: editUser.email, role: editUser.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u._id === editUser._id ? response.data : u)));
      setEditUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    }
  };
  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setDeleteModalOpen(true);
  };
  // Delete user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== deleteUserId));
      setDeleteUserId(null); // Close modal
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/assign-role",
        { userId, newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((user) => (user._id === userId ? response.data.user : user)));
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role.");
    }
  };

  // Import Users
  const handleImport = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/users/import", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      window.location.reload();
    } catch (err) {
      console.error("Error importing users:", err);
      setError("Failed to import users.");
    }
  };

  // Export Users
  const handleExport = async () => {
    window.open("http://localhost:5000/api/users/export");
  };
  const handleAssignRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/assign-role`,
        { userId, newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI
      setUsers(users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error("Error assigning role:", err.response?.data || err.message);
      setError("Failed to assign role. Please try again.");
    }
  };
  const handleAssignStudents = async () => {
    if (!selectedTeacher || selectedStudents.length === 0) {
      setMessage("Please select a teacher and at least one student.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/assign-students",
        { teacherId: selectedTeacher, studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Students assigned successfully!");
      setSelectedTeacher("");
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error assigning students:", error);
      setMessage("Failed to assign students.");
    }

    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }

    const toggleNavs = (e, index) => {
      e.preventDefault();
      setActiveNav(index);
      setChartExample1Data("data" + index);
    };

  };
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">All Users</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
                  <Row className="mt-3">
                  <Col md="4">
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Search Users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Input
                        type="select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                   {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <th scope="row">{user.name}</th>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleAssignRole(user._id, e.target.value)}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Student">Student</option>
                        </select>
                      </td>
                      <td>
                        <Button color="primary" onClick={() => openEditModal(user)}>Edit</Button>{" "}
                        <Button color="danger" onClick={() => openDeleteModal(user._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>


      {/* <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">All Users</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" size="sm">See all</Button>
                  </div>
                </Row>
                <Row className="mt-3">
                  <Col md="4">
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Search Users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Input
                        type="select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <th scope="row">{user.name}</th>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button color="primary" size="sm" onClick={() => openEditModal(user)}>Edit</Button>{" "}
                        <Button color="danger" size="sm" onClick={() => openDeleteModal(user._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container> */}

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Edit User</ModalHeader>
        <ModalBody>
          {editUser && (
            <Form onSubmit={handleEditUser}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input type="text" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} required />
              </FormGroup>
              <ModalFooter>
                <Button color="primary" type="submit">Save</Button>
                <Button color="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        </ModalBody>
      </Modal>

      <Modal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(!deleteModalOpen)}>
        <ModalHeader toggle={() => setDeleteModalOpen(!deleteModalOpen)}>Confirm Delete</ModalHeader>
        <ModalBody>
          <h5>Are you sure you want to delete this user?</h5>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteUser}>Yes, Delete</Button>
          <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Index;
