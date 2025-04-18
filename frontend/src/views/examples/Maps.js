
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// reactstrap components
import { Card, 
  Container, 
  Row,   
  Button,
  CardHeader,
  CardBody,
  Table,
  Col,
  Form,
  FormGroup,
  Label,
  Input, } from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

const Maps = () => {
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

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://quranumaracademy.onrender.com/api/users",
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
        `https://quranumaracademy.onrender.com/api/users/${editUser._id}`,
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
      await axios.delete(`https://quranumaracademy.onrender.com/api/users/${deleteUserId}`, {
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
        "https://quranumaracademy.onrender.com/api/users/assign-role",
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
      await axios.post("https://quranumaracademy.onrender.com/api/users/import", formData, {
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
    window.open("https://quranumaracademy.onrender.com/api/users/export");
  };
  const handleAssignRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://quranumaracademy.onrender.com/api/users/assign-role`,
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
        "https://quranumaracademy.onrender.com/api/users/assign-students",
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
        <Row>
        <Col xl="8">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Assign Students to Teacher</h3>
            </CardHeader>
            <CardBody>
              {message && <p>{message}</p>}
              <Form>
                <FormGroup>
                  <Label>Select Teacher:</Label>
                  <Input
                    type="select"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label>Select Students:</Label>
                  <Input
                    type="select"
                    multiple
                    value={selectedStudents}
                    onChange={(e) =>
                      setSelectedStudents([...e.target.selectedOptions].map((o) => o.value))
                    }
                  >
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <Button color="primary" onClick={handleAssignStudents}>
                  Assign Students
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
        </Row>
      </Container>
    </>
  );
};

export default Maps;
