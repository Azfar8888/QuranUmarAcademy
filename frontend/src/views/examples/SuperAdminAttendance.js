// // ✅ Updated SuperAdminAttendance.js to support arrival time & late logging for Present teachers
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   Card, Container, Row, Button, CardHeader, CardBody, Table, Col, Form,
//   FormGroup, Label, Input, Spinner
// } from "reactstrap";

// import Header from "components/Headers/Header.js";

// const SuperAdminAttendance = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [attendanceType, setAttendanceType] = useState("teacher");
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [status, setStatus] = useState("Present");
//   const [message, setMessage] = useState("");
//   const [editingAttendance, setEditingAttendance] = useState(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [arrivalTime, setArrivalTime] = useState("");
//   const [isLate, setIsLate] = useState(false);
//   const [lateByMinutes, setLateByMinutes] = useState(0);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const allUsers = response.data;
//         setTeachers(allUsers.filter((user) => user.role === "Teacher"));
//         setStudents(allUsers.filter((user) => user.role === "Student"));
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       }
//     };
//     fetchUsers();
//   }, [token]);

//   useEffect(() => {
//     const fetchAttendanceRecords = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/attendance", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAttendanceRecords(response.data);
//       } catch (error) {
//         console.error("Error fetching attendance records:", error);
//       }
//     };
//     fetchAttendanceRecords();
//   }, [token]);

//   const fetchStudentsForTeacher = async (teacherId) => {
//     if (!teacherId) return setStudents([]);
//     try {
//       const response = await axios.get(`http://localhost:5000/api/users/assigned-students/${teacherId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStudents(response.data || []);
//     } catch (err) {
//       console.error("Error fetching assigned students:", err);
//       setStudents([]);
//     }
//   };

//   const handleMarkAttendance = async () => {
//     if (attendanceType === "student" && selectedStudents.length === 0) {
//       setMessage("Please select at least one student.");
//       return;
//     }
//     setLoading(true);
//     let attendanceData = { status };
//     if (attendanceType === "teacher") {
//       attendanceData.teacherId = selectedTeacher;
//       if (status === "Present") {
//         attendanceData.arrivalTime = arrivalTime;
//         attendanceData.late = isLate;
//         attendanceData.lateByMinutes = isLate ? lateByMinutes : 0;
//       }
//     } else {
//       attendanceData.studentIds = selectedStudents;
//     }
//     try {
//       await axios.post("http://localhost:5000/api/attendance/mark", attendanceData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("Attendance marked successfully!");
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setMessage("Failed to mark attendance.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (record) => {
//     setEditingAttendance(record._id);
//     setNewStatus(record.status);
//   };

//   const handleSaveEdit = async (recordId) => {
//     if (!recordId || !newStatus) return;
//     try {
//       await axios.put(
//         `http://localhost:5000/api/attendance/update/${recordId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAttendanceRecords(attendanceRecords.map((r) => r._id === recordId ? { ...r, status: newStatus } : r));
//       setEditingAttendance(null);
//       setNewStatus("");
//     } catch (error) {
//       console.error("Error updating attendance:", error);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <Container className="mt--7" fluid>
//         <Row>
//           <Col xl="12">
//             <Card className="shadow">
//               <CardHeader className="border-0">
//                 <h3 className="mb-0">📌 Super Admin - Attendance Management</h3>
//               </CardHeader>
//               <CardBody>
//                 {message && <p>{message}</p>}
//                 <Form>
//                   <FormGroup>
//                     <Label>Select Attendance Type:</Label>
//                     <Input type="select" value={attendanceType} onChange={(e) => setAttendanceType(e.target.value)}>
//                       <option value="teacher">Teacher</option>
//                       <option value="student">Student</option>
//                     </Input>
//                   </FormGroup>

//                   {attendanceType === "teacher" && (
//                     <>
//                       <FormGroup>
//                         <Label>Select Teacher:</Label>
//                         <Input type="select" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
//                           <option value="">-- Select Teacher --</option>
//                           {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
//                         </Input>
//                       </FormGroup>
//                       {status === "Present" && (
//                         <>
//                           <FormGroup>
//                             <Label>Arrival Time:</Label>
//                             <Input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
//                           </FormGroup>
//                           <FormGroup check>
//                             <Label check>
//                               <Input type="checkbox" checked={isLate} onChange={(e) => setIsLate(e.target.checked)} />{' '}
//                               Mark as Late
//                             </Label>
//                           </FormGroup>
//                           {isLate && (
//                             <FormGroup>
//                               <Label>Late by (minutes):</Label>
//                               <Input type="number" min="1" value={lateByMinutes} onChange={(e) => setLateByMinutes(e.target.value)} />
//                             </FormGroup>
//                           )}
//                         </>
//                       )}
//                     </>
//                   )}

//                   {attendanceType === "student" && (
//                     <>
//                       <FormGroup>
//                         <Label>Select Teacher:</Label>
//                         <Input type="select" value={selectedTeacher} onChange={(e) => {
//                           setSelectedTeacher(e.target.value);
//                           fetchStudentsForTeacher(e.target.value);
//                         }}>
//                           <option value="">-- Select Teacher --</option>
//                           {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
//                         </Input>
//                       </FormGroup>
//                       {selectedTeacher && (
//                         <FormGroup>
//                           <Label>Select Students:</Label>
//                           <Input type="select" multiple value={selectedStudents} onChange={(e) => setSelectedStudents([...e.target.selectedOptions].map((o) => o.value))}>
//                             {students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
//                           </Input>
//                         </FormGroup>
//                       )}
//                     </>
//                   )}

//                   <FormGroup>
//                     <Label>Attendance Status:</Label>
//                     <Input type="select" value={status} onChange={(e) => setStatus(e.target.value)}>
//                       <option value="Present">Present ✅</option>
//                       <option value="Absent">Absent ❌</option>
//                       <option value="Late">Late ⏳</option>
//                       <option value="Excused">Excused 📌</option>
//                     </Input>
//                   </FormGroup>
//                   <Button color="primary" onClick={handleMarkAttendance} disabled={loading}>
//                     {loading ? "Marking..." : "Mark Attendance"}
//                   </Button>
//                 </Form>

//                 <h3 className="mt-4">📋 Attendance Records</h3>
//                 <Table bordered>
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Role</th>
//                       <th>Status</th>
//                       <th>Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {attendanceRecords.map((record) => (
//                       <tr key={record._id}>
//                         <td>{record.teacher?.name || record.student?.name}</td>
//                         <td>{record.teacher ? "Teacher" : "Student"}</td>
//                         <td>
//                           {editingAttendance === record._id ? (
//                             <Input type="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
//                               <option value="Present">Present ✅</option>
//                               <option value="Absent">Absent ❌</option>
//                               <option value="Late">Late ⏳</option>
//                               <option value="Excused">Excused 📌</option>
//                             </Input>
//                           ) : (
//                             record.status
//                           )}
//                         </td>
//                         <td>{new Date(record.date).toLocaleDateString()}</td>
//                         <td>
//                           {editingAttendance === record._id ? (
//                             <Button color="success" onClick={() => handleSaveEdit(record._id)}>Save</Button>
//                           ) : (
//                             <Button color="warning" onClick={() => startEditing(record)}>Edit</Button>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SuperAdminAttendance;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, Container, Row, Button, CardHeader, CardBody, Table, Col, Form,
  FormGroup, Label, Input, Spinner, Nav, NavItem, NavLink, TabContent, TabPane,
  Pagination, PaginationItem, PaginationLink
} from "reactstrap";
import classnames from "classnames";
import Header from "components/Headers/Header.js";

const SuperAdminAttendance = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [attendanceType, setAttendanceType] = useState("teacher");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("");
  const [isLate, setIsLate] = useState(false);
  const [lateByMinutes, setLateByMinutes] = useState(0);
  const [activeTab, setActiveTab] = useState("teacher");
  const [currentPageTeacher, setCurrentPageTeacher] = useState(1);
  const [currentPageStudent, setCurrentPageStudent] = useState(1);
  const recordsPerPage = 5;

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = response.data;
        setTeachers(allUsers.filter((user) => user.role === "Teacher"));
        setStudents(allUsers.filter((user) => user.role === "Student"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  // useEffect(() => {
  //   const fetchAttendanceRecords = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/attendance", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setAttendanceRecords(response.data);
  //     } catch (error) {
  //       console.error("Error fetching attendance records:", error);
  //     }
  //   };
  //   fetchAttendanceRecords();
  // }, [token]);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAttendanceRecords(sorted);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };
    fetchAttendanceRecords();
  }, [token]);




  const fetchStudentsForTeacher = async (teacherId) => {
    if (!teacherId) return setStudents([]);
    try {
      const response = await axios.get(`http://localhost:5000/api/users/assigned-students/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data || []);
    } catch (err) {
      console.error("Error fetching assigned students:", err);
      setStudents([]);
    }
  };

  const handleMarkAttendance = async () => {
    if (attendanceType === "student" && selectedStudents.length === 0) {
      setMessage("Please select at least one student.");
      return;
    }
    setLoading(true);
    let attendanceData = { status };
    if (attendanceType === "teacher") {
      attendanceData.teacherId = selectedTeacher;
      if (status === "Present") {
        attendanceData.arrivalTime = arrivalTime;
        attendanceData.late = isLate;
        attendanceData.lateByMinutes = isLate ? lateByMinutes : 0;
      }
    } else {
      attendanceData.studentIds = selectedStudents;
    }
    try {
      await axios.post("http://localhost:5000/api/attendance/mark", attendanceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
      setMessage("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (record) => {
    setEditingAttendance(record._id);
    setNewStatus(record.status);
  };

  const handleSaveEdit = async (recordId) => {
    if (!recordId || !newStatus) return;
    try {
      await axios.put(
        `http://localhost:5000/api/attendance/update/${recordId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceRecords(attendanceRecords.map((r) => r._id === recordId ? { ...r, status: newStatus } : r));
      setEditingAttendance(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const teacherRecords = attendanceRecords.filter(r => r.teacher);
  const studentRecords = attendanceRecords.filter(r => r.student);

  const paginate = (type, direction) => {
    if (type === 'teacher') {
      setCurrentPageTeacher(prev => prev + direction);
    } else {
      setCurrentPageStudent(prev => prev + direction);
    }
  };

  const getPaginatedData = (data, currentPage) => {
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    return data.slice(indexOfFirst, indexOfLast);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">📌 Super Admin - Attendance Management</h3>
              </CardHeader>
              <CardBody>
                {message && <p>{message}</p>}
                <Form>
                  <FormGroup>
                    <Label>Select Attendance Type:</Label>
                    <Input type="select" value={attendanceType} onChange={(e) => setAttendanceType(e.target.value)}>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </Input>
                  </FormGroup>

                  {attendanceType === "teacher" && (
                    <>
                      <FormGroup>
                        <Label>Select Teacher:</Label>
                        <Input type="select" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                          <option value="">-- Select Teacher --</option>
                          {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </Input>
                      </FormGroup>
                      {status === "Present" && (
                        <>
                          <FormGroup>
                            <Label>Arrival Time:</Label>
                            <Input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" checked={isLate} onChange={(e) => setIsLate(e.target.checked)} />{' '}
                              Mark as Late
                            </Label>
                          </FormGroup>
                          {isLate && (
                            <FormGroup>
                              <Label>Late by (minutes):</Label>
                              <Input type="number" min="1" value={lateByMinutes} onChange={(e) => setLateByMinutes(e.target.value)} />
                            </FormGroup>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {attendanceType === "student" && (
                    <>
                      <FormGroup>
                        <Label>Select Teacher:</Label>
                        <Input type="select" value={selectedTeacher} onChange={(e) => {
                          setSelectedTeacher(e.target.value);
                          fetchStudentsForTeacher(e.target.value);
                        }}>
                          <option value="">-- Select Teacher --</option>
                          {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </Input>
                      </FormGroup>
                      {selectedTeacher && (
                        <FormGroup>
                          <Label>Select Students:</Label>
                          <Input type="select" multiple value={selectedStudents} onChange={(e) => setSelectedStudents([...e.target.selectedOptions].map((o) => o.value))}>
                            {students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                          </Input>
                        </FormGroup>
                      )}
                    </>
                  )}

                  <FormGroup>
                    <Label>Attendance Status:</Label>
                    <Input type="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="Present">Present ✅</option>
                      <option value="Absent">Absent ❌</option>
                      <option value="Late">Late ⏳</option>
                      <option value="Excused">Excused 📌</option>
                    </Input>
                  </FormGroup>
                  <Button color="primary" onClick={handleMarkAttendance} disabled={loading}>
                    {loading ? "Marking..." : "Mark Attendance"}
                  </Button>
                </Form>

                <Nav tabs className="mt-5">
                  <NavItem>
                    <NavLink className={classnames({ active: activeTab === "teacher" })} onClick={() => setActiveTab("teacher")}>
                      Teacher Records
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({ active: activeTab === "student" })} onClick={() => setActiveTab("student")}>
                      Student Records
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="teacher">
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Arrival Time</th>
                          <th>Late</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(teacherRecords, currentPageTeacher).map((record) => (
                          <tr key={record._id}>
                            <td>{record.teacher?.name}</td>
                            <td>{editingAttendance === record._id ? (
                              <Input type="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="Present">Present ✅</option>
                                <option value="Absent">Absent ❌</option>
                                <option value="Late">Late ⏳</option>
                                <option value="Excused">Excused 📌</option>
                              </Input>
                            ) : record.status}</td>
                            <td>{record.arrivalTime || "--"}</td>
                            <td>{record.late ? `Yes (${record.lateByMinutes} min)` : "No"}</td>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>
                              {editingAttendance === record._id ? (
                                <Button color="success" onClick={() => handleSaveEdit(record._id)}>Save</Button>
                              ) : (
                                <Button color="warning" onClick={() => startEditing(record)}>Edit</Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination>
                      <PaginationItem disabled={currentPageTeacher === 1}>
                        <PaginationLink previous onClick={() => paginate('teacher', -1)} />
                      </PaginationItem>
                      <PaginationItem disabled={currentPageTeacher >= Math.ceil(teacherRecords.length / recordsPerPage)}>
                        <PaginationLink next onClick={() => paginate('teacher', 1)} />
                      </PaginationItem>
                    </Pagination>
                  </TabPane>

                  <TabPane tabId="student">
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(studentRecords, currentPageStudent).map((record) => (
                          <tr key={record._id}>
                            <td>{record.student?.name}</td>
                            <td>{editingAttendance === record._id ? (
                              <Input type="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="Present">Present ✅</option>
                                <option value="Absent">Absent ❌</option>
                                <option value="Late">Late ⏳</option>
                                <option value="Excused">Excused 📌</option>
                              </Input>
                            ) : record.status}</td>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>
                              {editingAttendance === record._id ? (
                                <Button color="success" onClick={() => handleSaveEdit(record._id)}>Save</Button>
                              ) : (
                                <Button color="warning" onClick={() => startEditing(record)}>Edit</Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination>
                      <PaginationItem disabled={currentPageStudent === 1}>
                        <PaginationLink previous onClick={() => paginate('student', -1)} />
                      </PaginationItem>
                      <PaginationItem disabled={currentPageStudent >= Math.ceil(studentRecords.length / recordsPerPage)}>
                        <PaginationLink next onClick={() => paginate('student', 1)} />
                      </PaginationItem>
                    </Pagination>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SuperAdminAttendance;






