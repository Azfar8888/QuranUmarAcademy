// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardHeader,
//   Table,
//   Container,
//   Row,
//   Spinner,
//   Button,
//   Input,
//   Pagination,
//   PaginationItem,
//   PaginationLink,
// } from "reactstrap";

// const StudentAttendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [attendancePerPage] = useState(30); // Show 30 records per page
//   const [monthFilter, setMonthFilter] = useState(""); // For filtering by month
//   const studentId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/attendance/student`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setAttendance(res.data);
//         setFilteredAttendance(res.data); // Initialize filteredAttendance with all records
//       } catch (error) {
//         console.error("Error fetching attendance:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (studentId && token) {
//       fetchAttendance();
//     } else {
//       console.warn("Student ID or token missing");
//       setLoading(false);
//     }
//   }, [studentId, token]);

//   // Pagination Logic: Get the current records to display on the current page
//   const indexOfLastAttendance = currentPage * attendancePerPage;
//   const indexOfFirstAttendance = indexOfLastAttendance - attendancePerPage;
//   const currentAttendance = filteredAttendance.slice(indexOfFirstAttendance, indexOfLastAttendance);

//   // Handle Page Change
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Filter by Month
//   const handleMonthFilter = (e) => {
//     const selectedMonth = e.target.value;
//     setMonthFilter(selectedMonth);

//     if (selectedMonth) {
//       const filtered = attendance.filter((record) => {
//         const recordMonth = new Date(record.date).getMonth() + 1; // Get the month (1-12)
//         return recordMonth === parseInt(selectedMonth);
//       });
//       setFilteredAttendance(filtered);
//       setCurrentPage(1); // Reset to the first page when a new filter is applied
//     } else {
//       setFilteredAttendance(attendance); // Reset filter
//     }
//   };

//   return (
//     <Container className="mt-4" fluid>
//       <Row>
//         <div className="col">
//           <Card className="shadow">
//             <CardHeader className="border-0">
//               <h3 className="mb-0">My Attendance</h3>
//               <Input
//                 type="select"
//                 value={monthFilter}
//                 onChange={handleMonthFilter}
//                 className="mb-3"
//               >
//                 <option value="">Filter by Month</option>
//                 {[...Array(12).keys()].map((month) => (
//                   <option key={month} value={month + 1}>
//                     {new Date(0, month).toLocaleString("en-US", {
//                       month: "long",
//                     })}
//                   </option>
//                 ))}
//               </Input>
//             </CardHeader>
//             {loading ? (
//               <div className="text-center my-5">
//                 <Spinner color="primary" />
//               </div>
//             ) : (
//               <>
//                 <Table className="align-items-center table-flush" responsive>
//                   <thead className="thead-light">
//                     <tr>
//                       <th>Date</th>
//                       <th>Status</th>
//                       <th>Teacher</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentAttendance.length === 0 ? (
//                       <tr>
//                         <td colSpan="3" className="text-center text-muted">
//                           No attendance records found.
//                         </td>
//                       </tr>
//                     ) : (
//                       currentAttendance.map((record) => (
//                         <tr key={record._id}>
//                           <td>{new Date(record.date).toLocaleDateString()}</td>
//                           <td>{record.status}</td>
//                           <td>{record.teacher?.name || "N/A"}</td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </Table>

//                 {/* Pagination */}
//                 <Pagination aria-label="Page navigation example">
//                   <PaginationItem disabled={currentPage === 1}>
//                     <PaginationLink
//                       previous
//                       onClick={() => paginate(currentPage - 1)}
//                     />
//                   </PaginationItem>
//                   {[...Array(Math.ceil(filteredAttendance.length / attendancePerPage))].map((_, index) => (
//                     <PaginationItem key={index} active={index + 1 === currentPage}>
//                       <PaginationLink onClick={() => paginate(index + 1)}>
//                         {index + 1}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ))}
//                   <PaginationItem
//                     disabled={currentPage === Math.ceil(filteredAttendance.length / attendancePerPage)}
//                   >
//                     <PaginationLink
//                       next
//                       onClick={() => paginate(currentPage + 1)}
//                     />
//                   </PaginationItem>
//                 </Pagination>
//               </>
//             )}
//           </Card>
//         </div>
//       </Row>
//     </Container>
//   );
// };

// export default StudentAttendance;





import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Spinner,
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendancePerPage] = useState(6); // Show 6 records per page
  const [monthFilter, setMonthFilter] = useState(""); // For filtering by month
  const studentId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/attendance/student`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttendance(res.data);
        setFilteredAttendance(res.data); // Initialize filteredAttendance with all records
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId && token) {
      fetchAttendance();
    } else {
      console.warn("Student ID or token missing");
      setLoading(false);
    }
  }, [studentId, token]);

  // Pagination Logic: Get the current records to display on the current page
  const indexOfLastAttendance = currentPage * attendancePerPage;
  const indexOfFirstAttendance = indexOfLastAttendance - attendancePerPage;
  const currentAttendance = filteredAttendance.slice(indexOfFirstAttendance, indexOfLastAttendance);

  // Handle Page Change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter by Month
  const handleMonthFilter = (e) => {
    const selectedMonth = e.target.value;
    setMonthFilter(selectedMonth);

    if (selectedMonth) {
      const filtered = attendance.filter((record) => {
        const recordMonth = new Date(record.date).getMonth() + 1; // Get the month (1-12)
        return recordMonth === parseInt(selectedMonth);
      });
      setFilteredAttendance(filtered);
      setCurrentPage(1); // Reset to the first page when a new filter is applied
    } else {
      setFilteredAttendance(attendance); // Reset filter
    }
  };

  // Function to get class based on status
  const getStatusClass = (status) => {
    if (status === "Present") {
      return "bg-success text-white"; // Green box for Present
    } else if (status === "Absent") {
      return "bg-danger text-white"; // Red box for Absent
    } else if (status === "Late") {
      return "bg-purple text-white"; // Purple box for Late
    }
    return ""; // Default case
  };
  const getStatusStyle = (status) => {
    if (status === "Present") {
      return { backgroundColor: "green", color: "white", padding: "0.5rem", borderRadius: "5px" };
    } else if (status === "Absent") {
      return { backgroundColor: "red", color: "white", padding: "0.5rem", borderRadius: "5px" };
    } else if (status === "Late") {
      return { backgroundColor: "purple", color: "white", padding: "0.5rem", borderRadius: "5px" };
    }
    return {}; // Default case if status is none of the above
  };
  

  return (
    <Container className="mt-4" fluid>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">My Attendance</h3>
              <Input
                type="select"
                value={monthFilter}
                onChange={handleMonthFilter}
                className="mb-3"
              >
                <option value="">Filter by Month</option>
                {[...Array(12).keys()].map((month) => (
                  <option key={month} value={month + 1}>
                    {new Date(0, month).toLocaleString("en-US", {
                      month: "long",
                    })}
                  </option>
                ))}
              </Input>
            </CardHeader>
            {loading ? (
              <div className="text-center my-5">
                <Spinner color="primary" />
              </div>
            ) : (
              <>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAttendance.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          No attendance records found.
                        </td>
                      </tr>
                    ) : (
                      currentAttendance.map((record) => (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
  <div style={getStatusStyle(record.status)}>
    {record.status}
  </div>
</td>
                          <td>{record.teacher?.name || "Admin"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>

                {/* Pagination */}
                <Pagination aria-label="Page navigation example">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink
                      previous
                      onClick={() => paginate(currentPage - 1)}
                    />
                  </PaginationItem>
                  {[...Array(Math.ceil(filteredAttendance.length / attendancePerPage))].map((_, index) => (
                    <PaginationItem key={index} active={index + 1 === currentPage}>
                      <PaginationLink onClick={() => paginate(index + 1)}>
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem
                    disabled={currentPage === Math.ceil(filteredAttendance.length / attendancePerPage)}
                  >
                    <PaginationLink
                      next
                      onClick={() => paginate(currentPage + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              </>
            )}
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default StudentAttendance;
