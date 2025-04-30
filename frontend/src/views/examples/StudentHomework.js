import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
  Button
} from "reactstrap";

const StudentHomework = () => {
  const [homework, setHomework] = useState([]);
  const [filteredHomework, setFilteredHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [homeworkPerPage] = useState(6); // Show 6 records per page
  const [dateFilter, setDateFilter] = useState(""); // For filtering by date
  const studentId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/homework/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHomework(res.data);
        setFilteredHomework(res.data); // Initialize filteredHomework with all records
      } catch (error) {
        console.error("Error fetching homework:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId && token) {
      fetchHomework();
    } else {
      console.warn("Student ID or token missing");
      setLoading(false);
    }
  }, [studentId, token]);

  // Pagination Logic: Get the current records to display on the current page
  const indexOfLastHomework = currentPage * homeworkPerPage;
  const indexOfFirstHomework = indexOfLastHomework - homeworkPerPage;
  const currentHomework = filteredHomework.slice(indexOfFirstHomework, indexOfLastHomework);

  // Handle Page Change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Date Filter
  const handleDateFilter = (e) => {
    const selectedDate = e.target.value;
    setDateFilter(selectedDate);

    if (selectedDate) {
      const filtered = homework.filter((hw) => {
        const hwDate = new Date(hw.date).toLocaleDateString();
        return hwDate === selectedDate;
      });
      setFilteredHomework(filtered);
      setCurrentPage(1); // Reset to the first page when a new filter is applied
    } else {
      setFilteredHomework(homework); // Reset filter
    }
  };

  return (
    <Container className="mt-4" fluid>
      <Row>
        <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
              <h3 className="mb-0">My Homework</h3>
              <Input
                type="date"
                value={dateFilter}
                onChange={handleDateFilter}
                className="mb-3"
              />
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
                      <th>Sabaq</th>
                      <th>Sabqi</th>
                      <th>Manzil</th>
                      <th>Comment</th>
                      <th>Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentHomework.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No homework found.
                        </td>
                      </tr>
                    ) : (
                      currentHomework.map((hw) => (
                        <tr key={hw._id}>
                          <td>{new Date(hw.date).toLocaleDateString()}</td>
                          <td dangerouslySetInnerHTML={{ __html: hw.sabaq }} />
                          <td dangerouslySetInnerHTML={{ __html: hw.sabqi }} />
                          <td dangerouslySetInnerHTML={{ __html: hw.manzil }} />
                          <td dangerouslySetInnerHTML={{ __html: hw.comment }} />
                          <td>{hw.teacher?.name || "N/A"}</td>
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
                  {[...Array(Math.ceil(filteredHomework.length / homeworkPerPage))].map((_, index) => (
                    <PaginationItem key={index} active={index + 1 === currentPage}>
                      <PaginationLink onClick={() => paginate(index + 1)}>
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem
                    disabled={currentPage === Math.ceil(filteredHomework.length / homeworkPerPage)}
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

export default StudentHomework;

