




// ✅ Everything above remains unchanged...
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Row, Col, Card, CardHeader, CardBody, Form, FormGroup,
  Label, Input, Button, Table, Spinner, Pagination, PaginationItem, PaginationLink
} from "reactstrap";

const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  const token = localStorage.getItem("token");
  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/assigned-students/${teacherId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to load assigned students:", err);
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/attendance/teacher/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendanceRecords(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      }
    };

    fetchAssignedStudents();
    fetchAttendance();
  }, [teacherId, token]);

  const handleMarkAttendance = async () => {
    if (selectedStudents.length === 0) {
      setMessage("Please select at least one student.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/attendance/mark`,
        { studentIds: selectedStudents, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Attendance marked successfully!");
      setSelectedStudents([]);

      const updated = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/attendance/teacher/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceRecords(updated.data);
    } catch (error) {
      console.error("Error marking attendance:", error);
      setMessage("❌ Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/attendance/update/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceRecords((prev) =>
        prev.map((rec) => (rec._id === id ? { ...rec, status: newStatus } : rec))
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Absent":
        return "danger";
      case "Late":
        return "warning";
      case "Excused":
        return "info";
      default:
        return "secondary";
    }
  };

  const filteredRecords = attendanceRecords.filter(
    (rec) =>
      rec.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <Container className="mt-7" fluid>
      {/* Form */}
      <Row>
        <Col xl="12">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Teacher - Mark Attendance</h3>
            </CardHeader>
            <CardBody>
              {message && <p>{message}</p>}
              <Form>
                <FormGroup>
                  <Label>Status</Label>
                  <Input type="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Present">Present ✅</option>
                    <option value="Absent">Absent ❌</option>
                    <option value="Late">Late ⏳</option>
                    <option value="Excused">Excused 📌</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Select Students:</Label>
                  {students.length === 0 ? (
                    <Spinner color="primary" />
                  ) : (
                    <Input
                      type="select"
                      multiple
                      value={selectedStudents}
                      onChange={(e) =>
                        setSelectedStudents(Array.from(e.target.selectedOptions, (o) => o.value))
                      }
                    >
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.name}
                        </option>
                      ))}
                    </Input>
                  )}
                </FormGroup>
                <Button color="primary" onClick={handleMarkAttendance} disabled={loading}>
                  {loading ? "Marking..." : "Mark Attendance"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Row className="pt-25">
        <Col>
          <Card>
            <CardHeader>
              <h3 className="mb-0">Attendance Records</h3>
              <Input
                placeholder="Search by student name or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
            </CardHeader>
            <CardBody>
              {currentRecords.length === 0 ? (
                <p className="text-muted">No records found</p>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((record) => (
                      <tr key={record._id}>
                        <td>{record.student?.name || "Unknown"}</td>
                        <td>
                          <span className={`badge badge-${statusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <Input
                            type="select"
                            value={record.status}
                            onChange={(e) => handleEdit(record._id, e.target.value)}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Late">Late</option>
                            <option value="Excused">Excused</option>
                          </Input>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* Pagination */}
              <Pagination className="pagination justify-content-center mt-3">
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index} active={index + 1 === currentPage}>
                    <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </Pagination>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherAttendance;

