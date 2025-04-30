



// ✅ Enhanced TeacherHomework.js with assigned homework table and edit feature
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

const TeacherHomework = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sabaq, setSabaq] = useState("");
  const [sabqi, setSabqi] = useState("");
  const [manzil, setManzil] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [homeworkList, setHomeworkList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHomeworkId, setEditingHomeworkId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  const token = localStorage.getItem("token");
  const teacherId = localStorage.getItem("userId");
  //const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/assigned-students/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        console.error("❌ Failed to load students:", err.response?.data || err.message);
      } finally {
        setLoadingStudents(false);
      }
    };

    const fetchHomework = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/homework/teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHomeworkList(res.data);
      } catch (err) {
        console.error("❌ Failed to load homework:", err.response?.data || err.message);
      }
    };

    if (teacherId && token) {
      fetchStudents();
      fetchHomework();
    }
  }, [teacherId, token, API_URL]);

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedDate("");
    setSabaq("");
    setSabqi("");
    setManzil("");
    setComment("");
    setEditingHomeworkId(null);
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedDate) {
      setMessage("⚠️ Please select student and date");
      return;
    }

    setLoading(true);
    try {
      const payload = { teacherId, studentId: selectedStudent, date: selectedDate, sabaq, sabqi, manzil, comment };

      if (editingHomeworkId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/homework/update/${editingHomeworkId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Homework updated successfully!");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/homework/assign`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Homework submitted successfully!");
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/homework/student/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomeworkList(res.data);
      resetForm();
    } catch (err) {
      console.error("❌ Homework submission error:", err.response?.data || err.message);
      setMessage("❌ Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedStudent(record.student?._id || "");
    setSelectedDate(record.date?.slice(0, 10));
    setSabaq(record.sabaq);
    setSabqi(record.sabqi);
    setManzil(record.manzil);
    setComment(record.comment);
    setEditingHomeworkId(record._id);
  };

  const filteredHomework = homeworkList.filter(
    (hw) =>
      hw.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(hw.date).toLocaleDateString().includes(searchTerm)
  );

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredHomework.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHomework.length / recordsPerPage);

  return (
    <Container className="pt-5" fluid>
      <Row>
        <Col xl="12">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">Teacher - Assign Homework</h3>
            </CardHeader>
            <CardBody>
              {message && <p>{message}</p>}
              <Form>
                <FormGroup>
                  <Label>Select Student:</Label>
                  {loadingStudents ? (
                    <div><Spinner size="sm" color="primary" /> Loading students...</div>
                  ) : (
                    <Input
                      type="select"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                      <option value="">-- Select Student --</option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>{student.name}</option>
                      ))}
                    </Input>
                  )}
                </FormGroup>
                <FormGroup><Label>Date:</Label><Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /></FormGroup>
                <FormGroup><Label>Sabaq:</Label><ReactQuill value={sabaq} onChange={setSabaq} /></FormGroup>
                <FormGroup><Label>Sabqi:</Label><ReactQuill value={sabqi} onChange={setSabqi} /></FormGroup>
                <FormGroup><Label>Manzil:</Label><ReactQuill value={manzil} onChange={setManzil} /></FormGroup>
                <FormGroup><Label>Comment:</Label><ReactQuill value={comment} onChange={setComment} /></FormGroup>
                <Button color="primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : editingHomeworkId ? "Update Homework" : "Submit Homework"}
                </Button>
              </Form>
            </CardBody>
          </Card>

          {/* Assigned Homework Table */}
          <Card className="shadow mt-4">
            <CardHeader>
              <h3 className="mb-0">Assigned Homework Records</h3>
              <Input
                className="mt-2"
                placeholder="Search by student name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Sabaq</th>
                    <th>Sabqi</th>
                    <th>Manzil</th>
                    <th>Comment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((hw) => (
                    <tr key={hw._id}>
                      <td>{new Date(hw.date).toLocaleDateString()}</td>
                      <td>{hw.student?.name}</td>
                      <td dangerouslySetInnerHTML={{ __html: hw.sabaq }} />
                      <td dangerouslySetInnerHTML={{ __html: hw.sabqi }} />
                      <td dangerouslySetInnerHTML={{ __html: hw.manzil }} />
                      <td dangerouslySetInnerHTML={{ __html: hw.comment }} />
                      <td><Button size="sm" color="warning" onClick={() => handleEdit(hw)}>Edit</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i} active={i + 1 === currentPage}>
                    <PaginationLink onClick={() => setCurrentPage(i + 1)}>{i + 1}</PaginationLink>
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

export default TeacherHomework;

