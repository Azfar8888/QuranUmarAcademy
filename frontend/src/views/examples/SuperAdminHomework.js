
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// // reactstrap components
// import { Container, Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, Table } from "reactstrap";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";


// // core components
// import Header from "components/Headers/Header.js";

// const SuperAdminHomework = () => {
//     const [teachers, setTeachers] = useState([]);
//     const [students, setStudents] = useState([]);
//     const [selectedTeacher, setSelectedTeacher] = useState("");
//     const [selectedStudent, setSelectedStudent] = useState("");
//     const [selectedDate, setSelectedDate] = useState("");
//     const [homeworkData, setHomeworkData] = useState([]);
//     const [message, setMessage] = useState("");

//     const token = localStorage.getItem("token");

//     const sabaqEditor = useEditor({ extensions: [StarterKit], content: "" });
//     const sabqiEditor = useEditor({ extensions: [StarterKit], content: "" });
//     const manzilEditor = useEditor({ extensions: [StarterKit], content: "" });
//     const commentEditor = useEditor({ extensions: [StarterKit], content: "" });

//     // Fetch Teachers
//     useEffect(() => {
//       axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       }).then(response => {
//         setTeachers(response.data.filter(user => user.role === "Teacher"));
//       }).catch(error => console.error("Error fetching teachers:", error));
//     }, [token]);

//     // Fetch Students Assigned to Selected Teacher
//     useEffect(() => {
//       if (selectedTeacher) {
//         axios.get(`http://localhost:5000/api/users/assigned-students/${selectedTeacher}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }).then(response => {
//           setStudents(response.data || []);
//         }).catch(error => console.error("Error fetching students:", error));
//       }
//     }, [selectedTeacher, token]);

//     // Fetch Homework Data
//     useEffect(() => {
//       fetchHomework();
//     }, []);

//     const fetchHomework = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/homework", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setHomeworkData(response.data);
//       } catch (error) {
//         console.error("Error fetching homework:", error);
//       }
//     };

//     // Save Homework
//     const handleSaveHomework = async () => {
//       try {
//         await axios.post("http://localhost:5000/api/homework/assign", {
//           teacherId: selectedTeacher,
//           studentId: selectedStudent,
//           date: selectedDate,
//           sabaq: sabaqEditor.getHTML(),
//           sabqi: sabqiEditor.getHTML(),
//           manzil: manzilEditor.getHTML(),
//           comment: commentEditor.getHTML(),
//         }, { headers: { Authorization: `Bearer ${token}` } });

//         setMessage("Homework assigned successfully!");
//         sabaqEditor.commands.setContent("");
//         sabqiEditor.commands.setContent("");
//         manzilEditor.commands.setContent("");
//         commentEditor.commands.setContent("");

//         fetchHomework(); // 🔥 Fetch updated homework data after saving
//       } catch (error) {
//         console.error("Error saving homework:", error);
//         setMessage("Failed to save homework.");
//       }
//     };

//   return (
//     <>
//       <Header />
//       {/* Page content */}
//       <Container className="mt--7" fluid>
//         <Row>
//         <Col xl="8">
//           <Card className="shadow">
//             <CardHeader className="border-0">
//               <h3 className="mb-0">Super Admin - Homework Management</h3>
//             </CardHeader>
//             <CardBody>
//               {message && <p>{message}</p>}
//               <Form>
//                 <FormGroup>
//                   <Label>Select Teacher:</Label>
//                   <Input
//                     type="select"
//                     value={selectedTeacher}
//                     onChange={(e) => setSelectedTeacher(e.target.value)}
//                   >
//                     <option value="">-- Select Teacher --</option>
//                     {teachers.map((teacher) => (
//                       <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
//                     ))}
//                   </Input>
//                 </FormGroup>

//                 {selectedTeacher && (
//                   <FormGroup>
//                     <Label>Select Student:</Label>
//                     <Input
//                       type="select"
//                       value={selectedStudent}
//                       onChange={(e) => setSelectedStudent(e.target.value)}
//                     >
//                       <option value="">-- Select Student --</option>
//                       {students.map((student) => (
//                         <option key={student._id} value={student._id}>{student.name}</option>
//                       ))}
//                     </Input>
//                   </FormGroup>
//                 )}

//                 <FormGroup>
//                   <Label>Select Date:</Label>
//                   <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Sabaq:</Label>
//                   <EditorContent editor={sabaqEditor} />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Sabqi:</Label>
//                   <EditorContent editor={sabqiEditor} />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Manzil:</Label>
//                   <EditorContent editor={manzilEditor} />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Comment:</Label>
//                   <EditorContent editor={commentEditor} />
//                 </FormGroup>

//                 <Button color="primary" onClick={handleSaveHomework}>Save Homework</Button>
//               </Form>
//             </CardBody>
//           </Card>

//           {/* ✅ Homework Table */}
//           <Card className="shadow mt-4">
//             <CardHeader className="border-0">
//               <h3 className="mb-0">📋 Homework Records</h3>
//             </CardHeader>
//             <CardBody>
//               {homeworkData.length > 0 ? (
//                 <Table bordered>
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Teacher</th>
//                       <th>Student</th>
//                       <th>Sabaq</th>
//                       <th>Sabqi</th>
//                       <th>Manzil</th>
//                       <th>Comment</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {homeworkData.map((record) => (
//                       <tr key={record._id}>
//                         <td>{new Date(record.date).toLocaleDateString()}</td>
//                         <td>{record.teacher?.name}</td>
//                         <td>{record.student?.name}</td>
//                         <td dangerouslySetInnerHTML={{ __html: record.sabaq }}></td>
//                         <td dangerouslySetInnerHTML={{ __html: record.sabqi }}></td>
//                         <td dangerouslySetInnerHTML={{ __html: record.manzil }}></td>
//                         <td dangerouslySetInnerHTML={{ __html: record.comment }}></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <p>No homework records available.</p>
//               )}
//             </CardBody>
//           </Card>
//         </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SuperAdminHomework;








import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// reactstrap components
import { Container, Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, Table } from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

const SuperAdminHomework = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [homeworkData, setHomeworkData] = useState([]);
    const [editingHomeworkId, setEditingHomeworkId] = useState(null);
    const [message, setMessage] = useState("");

    const [sabaq, setSabaq] = useState("");
    const [sabqi, setSabqi] = useState("");
    const [manzil, setManzil] = useState("");
    const [comment, setComment] = useState("");

    const token = localStorage.getItem("token");

    // Fetch Teachers
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTeachers(response.data.filter((user) => user.role === "Teacher"));
            })
            .catch((error) => console.error("Error fetching teachers:", error));
    }, [token]);

    // Fetch Students Assigned to Selected Teacher
    useEffect(() => {
        if (selectedTeacher) {
            axios
                .get(`http://localhost:5000/api/users/assigned-students/${selectedTeacher}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setStudents(response.data || []);
                })
                .catch((error) => console.error("Error fetching students:", error));
        }
    }, [selectedTeacher, token]);

    // Fetch Homework Data
    useEffect(() => {
        fetchHomework();
    }, []);

    const fetchHomework = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/homework", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHomeworkData(response.data);
        } catch (error) {
            console.error("Error fetching homework:", error);
        }
    };

    // Save or Update Homework
    const handleSaveHomework = async () => {
        try {
            if (!selectedTeacher || !selectedStudent || !selectedDate) {
                setMessage("Teacher, Student, and Date are required!");
                return;
            }

            const homeworkPayload = {
                teacherId: selectedTeacher,
                studentId: selectedStudent,
                date: selectedDate,
                sabaq,
                sabqi,
                manzil,
                comment,
            };

            if (editingHomeworkId) {
                // Update Homework
                await axios.put(`http://localhost:5000/api/homework/update/${editingHomeworkId}`, homeworkPayload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessage("Homework updated successfully!");
                setEditingHomeworkId(null);
            } else {
                // Assign New Homework
                await axios.post("http://localhost:5000/api/homework/assign", homeworkPayload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessage("Homework assigned successfully!");
            }

            resetForm();
            fetchHomework();
        } catch (error) {
            console.error("Error saving homework:", error);
            setMessage("Failed to save homework.");
        }
    };

    // Load Data into Form for Editing
    const handleEditHomework = (homework) => {
        setSelectedTeacher(homework.teacher._id);
        setSelectedStudent(homework.student._id);
        setSelectedDate(homework.date);
        setSabaq(homework.sabaq);
        setSabqi(homework.sabqi);
        setManzil(homework.manzil);
        setComment(homework.comment);
        setEditingHomeworkId(homework._id);
    };

    // Reset Form
    const resetForm = () => {
        setSelectedTeacher("");
        setSelectedStudent("");
        setSelectedDate("");
        setSabaq("");
        setSabqi("");
        setManzil("");
        setComment("");
        setEditingHomeworkId(null);
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <Col xl="12">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Super Admin - Homework Management</h3>
                            </CardHeader>
                            <CardBody>
                                {message && <p>{message}</p>}
                                <Form>
                                    <FormGroup>
                                        <Label>Select Teacher:</Label>
                                        <Input type="select" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                                            <option value="">-- Select Teacher --</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher._id} value={teacher._id}>
                                                    {teacher.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Select Student:</Label>
                                        <Input type="select" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                                            <option value="">-- Select Student --</option>
                                            {students.map((student) => (
                                                <option key={student._id} value={student._id}>
                                                    {student.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Select Date:</Label>
                                        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Sabaq:</Label>
                                        <ReactQuill value={sabaq} onChange={setSabaq} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Sabqi:</Label>
                                        <ReactQuill value={sabqi} onChange={setSabqi} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Manzil:</Label>
                                        <ReactQuill value={manzil} onChange={setManzil} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Comment:</Label>
                                        <ReactQuill value={comment} onChange={setComment} />
                                    </FormGroup>

                                    <Button color="primary" onClick={handleSaveHomework}>
                                        {editingHomeworkId ? "Update Homework" : "Save Homework"}
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>

                        {/* Homework Table */}
                        <Card className="shadow mt-4">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">📋 Homework Records</h3>
                            </CardHeader>
                            <CardBody>
                                {/* <Table bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Teacher</th>
                      <th>Student</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeworkData.map((record) => (
                      <tr key={record._id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.teacher?.name}</td>
                        <td>{record.student?.name}</td>
                        <td>
                          <Button color="warning" onClick={() => handleEditHomework(record)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table> */}
                                <Table bordered responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Teacher</th>
                                            <th>Student</th>
                                            <th>Sabaq</th>
                                            <th>Sabqi</th>
                                            <th>Manzil</th>
                                            <th>Comment</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {homeworkData.map((record) => (
                                            <tr key={record._id}>
                                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                                <td>{record.teacher?.name}</td>
                                                <td>{record.student?.name}</td>
                                                <td dangerouslySetInnerHTML={{ __html: record.sabaq }}></td>
                                                <td dangerouslySetInnerHTML={{ __html: record.sabqi }}></td>
                                                <td dangerouslySetInnerHTML={{ __html: record.manzil }}></td>
                                                <td dangerouslySetInnerHTML={{ __html: record.comment }}></td>
                                                <td>
                                                    <Button color="warning" onClick={() => handleEditHomework(record)}>
                                                        Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SuperAdminHomework;
