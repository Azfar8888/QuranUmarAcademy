// /*!

// =========================================================
// * Argon Dashboard React - v1.2.4
// =========================================================

// * Product Page: https://www.creative-tim.com/product/argon-dashboard-react
// * Copyright 2024 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

// * Coded by Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */
// import { Link } from "react-router-dom";
// // reactstrap components
// import {
//   DropdownMenu,
//   DropdownItem,
//   UncontrolledDropdown,
//   DropdownToggle,
//   Form,
//   FormGroup,
//   InputGroupAddon,
//   InputGroupText,
//   Input,
//   InputGroup,
//   Navbar,
//   Nav,
//   Container,
//   Media,
// } from "reactstrap";
// import "../../style.css";


// const AdminNavbar = (props) => {

//   return (
//     <>
//       <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
//         <Container fluid>
//           <Link
//             className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
//             to="/"
//           >
//             {props.brandText}
//           </Link>
//           <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
//             <FormGroup className="mb-0">
//               <InputGroup className="input-group-alternative">
//                 <InputGroupAddon addonType="prepend">
//                   <InputGroupText>
//                     <i className="fas fa-search" />
//                   </InputGroupText>
//                 </InputGroupAddon>
//                 <Input placeholder="Search" type="text" />
//               </InputGroup>
//             </FormGroup>
//           </Form>
//           <Nav className="align-items-center d-none d-md-flex" navbar>
//             <UncontrolledDropdown nav>
//               <DropdownToggle className="pr-0" nav>
//                 <Media className="align-items-center">
//                   <span className="avatar avatar-sm rounded-circle">
//                     <img
//                       alt="..."
//                       src={require("../../assets/img/theme/team-4-800x800.jpg")}
//                     />
//                   </span>
//                   <Media className="ml-2 d-none d-lg-block">
//                     <span className="mb-0 text-sm font-weight-bold">
//                       Jessica Jones
//                     </span>
//                   </Media>
//                 </Media>
//               </DropdownToggle>
//               <DropdownMenu className="dropdown-menu-arrow" right>
//                 <DropdownItem className="noti-title" header tag="div">
//                   <h6 className="text-overflow m-0">Welcome!</h6>
//                 </DropdownItem>
//                 <DropdownItem to="/admin/user-profile" tag={Link}>
//                   <i className="ni ni-single-02" />
//                   <span>My profile</span>
//                 </DropdownItem>
//                 <DropdownItem to="/admin/user-profile" tag={Link}>
//                   <i className="ni ni-settings-gear-65" />
//                   <span>Settings</span>
//                 </DropdownItem>
//                 <DropdownItem to="/admin/user-profile" tag={Link}>
//                   <i className="ni ni-calendar-grid-58" />
//                   <span>Activity</span>
//                 </DropdownItem>
//                 <DropdownItem to="/admin/user-profile" tag={Link}>
//                   <i className="ni ni-support-16" />
//                   <span>Support</span>
//                 </DropdownItem>
//                 <DropdownItem divider />
//                 <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
//                   <i className="ni ni-user-run" />
//                   <span>Logout</span>
//                 </DropdownItem>
//               </DropdownMenu>
//             </UncontrolledDropdown>
//           </Nav>
//         </Container>
//       </Navbar>
//     </>
//   );
// };

// export default AdminNavbar;






import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import "../../style.css";

const AdminNavbar = (props) => {
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [userName, setUserName] = useState(""); // ✅ State for storing user name

  // ✅ Fetch the logged-in user's name from localStorage
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const user = JSON.parse(storedUser); // Convert string to object
  //     setUserName(user.name || "User"); // Fallback to "User" if name is missing
  //   }
  // }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove authentication token
    localStorage.removeItem("user"); // Remove user details
    navigate("/auth/login"); // Redirect to login page
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {userName} {/* ✅ Display logged-in user's name */}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome, {userName}!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                {/* ✅ Activated Logout Button */}
                <DropdownItem href="#pablo" onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
