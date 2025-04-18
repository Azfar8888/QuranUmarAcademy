// import { useEffect, useState } from "react";
// import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// // nodejs library to set properties for components
// import { PropTypes } from "prop-types";

// // reactstrap components
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   CardTitle,
//   Collapse,
//   DropdownMenu,
//   DropdownItem,
//   UncontrolledDropdown,
//   DropdownToggle,
//   FormGroup,
//   Form,
//   Input,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroup,
//   Media,
//   NavbarBrand,
//   Navbar,
//   NavItem,
//   NavLink,
//   Nav,
//   Progress,
//   Table,
//   Container,
//   Row,
//   Col,
// } from "reactstrap";

// var ps;

// const Sidebar = (props) => {
//   const [collapseOpen, setCollapseOpen] = useState(false);
//   const [userRole, setUserRole] = useState("");

// useEffect(() => {
//   const storedRole = localStorage.getItem("role");  // ✅ Get role directly
//   if (storedRole) {
//     setUserRole(storedRole);
//   } else {
//     setUserRole("");  // Default to empty if no role
//   }
// }, []);

//   // ✅ Define role-based menu items
//   const allRoutes = [
//     { path: "/index", name: "Dashboard", icon: "ni ni-tv-2 text-primary", roles: ["SuperAdmin", "Admin"] },
//     { path: "/assign-students", name: "Student Assigning", icon: "ni ni-pin-3 text-orange", roles: ["SuperAdmin"] },
//     { path: "/user-register", name: "User Register", icon: "ni ni-circle-08 text-pink", roles: ["SuperAdmin", "Admin"] },
//     { path: "/Attendance", name: "Attendance Sheet", icon: "ni ni-check-bold text-orange", roles: ["SuperAdmin", "Admin", "Teacher", "Student"] },
//     { path: "/Homework", name: "Homework Sheet", icon: "ni ni-book-bookmark text-blue", roles: ["SuperAdmin", "Admin", "Teacher", "Student"] },
//     { path: "/user-profile", name: "User Profile", icon: "ni ni-single-02 text-yellow", roles: ["SuperAdmin", "Admin", "Teacher", "Student"] },
//   ];

//   // ✅ Filter routes based on user role
//   const filteredRoutes = allRoutes.filter(route => route.roles.includes(userRole));
//   // const [collapseOpen, setCollapseOpen] = useState();
//   // verifies if routeName is the one active (in browser input)
//   const activeRoute = (routeName) => {
//     return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
//   };
//   // toggles collapse between opened and closed (true/false)
//   const toggleCollapse = () => {
//     setCollapseOpen((data) => !data);
//   };
//   // closes the collapse
//   const closeCollapse = () => {
//     setCollapseOpen(false);
//   };
//   // creates the links that appear in the left menu / Sidebar
//   const createLinks = (routes) => {
//     return routes.map((prop, key) => {
//       return (
//         <NavItem key={key}>
//           <NavLink
//             to={prop.layout + prop.path}
//             tag={NavLinkRRD}
//             onClick={closeCollapse}
//           >
//             <i className={prop.icon} />
//             {prop.name}
//           </NavLink>
//         </NavItem>
//       );
//     });
//   };

//   const { bgColor, routes, logo } = props;
//   let navbarBrandProps;
//   if (logo && logo.innerLink) {
//     navbarBrandProps = {
//       to: logo.innerLink,
//       tag: Link,
//     };
//   } else if (logo && logo.outterLink) {
//     navbarBrandProps = {
//       href: logo.outterLink,
//       target: "_blank",
//     };
//   }


//   return (
//     <Navbar className="navbar-vertical fixed-left navbar-light bg-white" expand="md" id="sidenav-main">
//       <Container fluid>
//         {/* Toggler */}
//         <button className="navbar-toggler" type="button" onClick={() => setCollapseOpen(!collapseOpen)}>
//           <span className="navbar-toggler-icon" />
//         </button>

//         {/* Logo */}
//         <NavbarBrand className="pt-1" tag={Link} to="/">
//           <img src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png" alt="Umar Academy Logo" className="login-logo" />
//         </NavbarBrand>

//         {/* Sidebar Menu */}
//         <Collapse navbar isOpen={collapseOpen}>
//           <Nav navbar>
//             {filteredRoutes.map((route, key) => (
//               <NavItem key={key}>
//                 <NavLink to={route.path} tag={NavLinkRRD}>
//                   <i className={route.icon} />
//                   {route.name}
//                 </NavLink>
//               </NavItem>
//             ))}
//           </Nav>
//         </Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// Sidebar.defaultProps = {
//   routes: [{}],
// };

// Sidebar.propTypes = {
//   // links that will be displayed inside the component
//   routes: PropTypes.arrayOf(PropTypes.object),
//   logo: PropTypes.shape({
//     // innerLink is for links that will direct the user within the app
//     // it will be rendered as <Link to="...">...</Link> tag
//     innerLink: PropTypes.string,
//     // outterLink is for links that will direct the user outside the app
//     // it will be rendered as simple <a href="...">...</a> tag
//     outterLink: PropTypes.string,
//     // the image src of the logo
//     imgSrc: PropTypes.string.isRequired,
//     // the alt for the img
//     imgAlt: PropTypes.string.isRequired,
//   }),
// };

// export default Sidebar;







import { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Nav,
  Collapse,
  Container,
  Button
} from "reactstrap";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");  // ✅ Get role directly from localStorage
    if (storedRole) {
      setUserRole(storedRole);
    } else {
      setUserRole("");  // Default to empty if no role
    }
  }, []);

  // ✅ Define role-based menu items
  const allRoutes = [
    { path: "/index", name: "Dashboard", icon: "ni ni-tv-2 text-primary", roles: ["SuperAdmin", "Admin"] },
    { path: "/assign-students", name: "Student Assigning", icon: "ni ni-pin-3 text-orange", roles: ["SuperAdmin"] },
    { path: "/user-register", name: "User Register", icon: "ni ni-circle-08 text-pink", roles: ["SuperAdmin", "Admin"] },
    { path: "/Attendance", name: "Attendance Sheet", icon: "ni ni-check-bold text-orange", roles: ["SuperAdmin", "Admin", "Teacher", "Student"] },
    { path: "/Homework", name: "Homework Sheet", icon: "ni ni-book-bookmark text-blue", roles: ["SuperAdmin", "Admin", "Teacher", "Student"] },
    { path: "/user-profile", name: "User Profile", icon: "ni ni-single-02 text-yellow", roles: ["SuperAdmin", "Admin", "Teacher", "Student"] },
  ];

  // ✅ Filter routes based on user role
  const filteredRoutes = allRoutes.filter(route => route.roles.includes(userRole));

  return (
    <Navbar className="navbar-vertical fixed-left navbar-light bg-white" expand="md" id="sidenav-main">
      <Container fluid>
        {/* Toggler */}
        <button className="navbar-toggler" type="button" onClick={() => setCollapseOpen(!collapseOpen)}>
          <span className="navbar-toggler-icon" />
        </button>

        {/* Logo */}
        <NavbarBrand className="pt-1" tag={Link} to="/admin/index">
          <img src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png" alt="Umar Academy Logo" className="login-logo" />
        </NavbarBrand>

        {/* Sidebar Menu */}
        <Collapse navbar isOpen={collapseOpen}>
          <Nav navbar>
            {filteredRoutes.map((route, key) => (
              <NavItem key={key}>
                <NavLink to={`/admin${route.path}`} tag={NavLinkRRD}>
                  <i className={route.icon} />
                  {route.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>

        {/* Logout Button */}
        <Button
          color="danger"
          className="mt-3"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/auth/login";
          }}
        >
          Logout
        </Button>
      </Container>
    </Navbar>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
