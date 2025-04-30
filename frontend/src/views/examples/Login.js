// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   FormGroup,
//   Form,
//   Input,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroup,
//   Col,
// } from "reactstrap";
// import axios from "axios";

// import { GoogleLogin } from 'react-google-login';


// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // ✅ Redirect logged-in users to dashboard
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/admin/index");
//     }
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       console.log("Login API Response:", response.data); // Debug Response

//       //const { token, role, userId } = response.data;  // Destructure the correct data
//       const { token, role, userId, user } = response.data;
//       localStorage.setItem("user", JSON.stringify(user));

//       if (token && role && userId) {
//         localStorage.setItem("token", token);   // Store token
//         localStorage.setItem("role", role);     // Store role
//         localStorage.setItem("userId", userId); // Store userId for homework fetching

//         console.log("Stored Role:", localStorage.getItem("role"));
//         console.log("Stored Token:", localStorage.getItem("token"));
//         console.log("Stored userId:", localStorage.getItem("userId"));

//         navigate("/admin/index"); // Redirect after successful login
//       } else {
//         console.error("Invalid response format:", response.data);
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };
//   const responseGoogle = async (response) => {
//     if (response.tokenId) {
//       try {
//         const { data } = await axios.post(
//           'http://localhost:5000/api/auth/google-login',
//           { tokenId: response.tokenId }
//         );
//         // Save the token in localStorage or handle successful login
//         localStorage.setItem('token', data.token);
//         window.location.href = '/dashboard'; // Redirect to dashboard or desired route
//       } catch (error) {
//         console.error("Google login error", error);
//       }
//     }
//   };

//   return (
//     <Col lg="5" md="7">
//       <Card className="bg-secondary shadow border-0">
//         <CardHeader className="bg-transparent pb-0">
//           <div className="text-muted text-center mt- mb-3">
//             <img
//               src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png"
//               alt="Umar Academy Logo"
//               className="login-logo"
//             />
//             <h2>Login</h2>
//           </div>
//         </CardHeader>
//         <CardBody className="px-lg-5 py-lg-5">
//           <Form onSubmit={handleLogin}>
//             <FormGroup>
//               <InputGroup>
//                 <InputGroupAddon addonType="prepend">
//                   <InputGroupText>
//                     <i className="ni ni-email-83" />
//                   </InputGroupText>
//                 </InputGroupAddon>
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </InputGroup>
//             </FormGroup>
//             <FormGroup>
//               <InputGroup>
//                 <InputGroupAddon addonType="prepend">
//                   <InputGroupText>
//                     <i className="ni ni-lock-circle-open" />
//                   </InputGroupText>
//                 </InputGroupAddon>
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </InputGroup>
//             </FormGroup>
//             {error && <p className="text-danger">{error}</p>}
//             <Button color="primary" type="submit" className="my-4">
//               Sign in
//             </Button>
//           </Form>
//           <div>
//             <GoogleLogin
//               clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
//               buttonText="Login with Google"
//               onSuccess={responseGoogle}
//               onFailure={responseGoogle}
//               cookiePolicy={'single_host_origin'}
//             />
//           </div>
//         </CardBody>
//       </Card>
//     </Col>
//   );
// };

// export default Login;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   FormGroup,
//   Form,
//   Input,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroup,
//   Col,
// } from "reactstrap";
// import axios from "axios";
// import { GoogleLogin } from 'react-google-login';


// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();



// // Initialize Google API client once the component is mounted
// useEffect(() => {
//   const gapi = window.gapi;
//   if (!gapi.auth2.getAuthInstance()) {
//     gapi.load('auth2', function() {
//       gapi.auth2.init({
//         client_id: '217006242261-l4g0h2nj4388sq840tbnpi9trvqk8lls.apps.googleusercontent.com', // Replace with your actual Google Client ID
//       });
//     });
//   }
// }, []);
//   // ✅ Redirect logged-in users to dashboard
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/admin/index");
//     }
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       console.log("Login API Response:", response.data); // Debug Response

//       const { token, role, userId, user } = response.data;
//       localStorage.setItem("user", JSON.stringify(user));

//       if (token && role && userId) {
//         localStorage.setItem("token", token);   // Store token
//         localStorage.setItem("role", role);     // Store role
//         localStorage.setItem("userId", userId); // Store userId for homework fetching

//         console.log("Stored Role:", localStorage.getItem("role"));
//         console.log("Stored Token:", localStorage.getItem("token"));
//         console.log("Stored userId:", localStorage.getItem("userId"));

//         navigate("/admin/index"); // Redirect after successful login
//       } else {
//         console.error("Invalid response format:", response.data);
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };


//     const responseGoogle = async (response) => {
//     if (response.error) {
//       console.error("Google login error: ", response.error);
//       return;
//     }
//     if (response.tokenId) {
//       try {
//         const { data } = await axios.post(
//           'http://localhost:5000/api/auth/google-login',
//           { tokenId: response.tokenId }
//         );
//         localStorage.setItem('token', data.token);
//         window.location.href = '/admin/index';
//       } catch (error) {
//         console.error("Google login failed", error);
//       }
//     }
//   };

//   // const responseGoogle = async (response) => {
//   //   if (response.tokenId) {
//   //     try {
//   //       const { data } = await axios.post(
//   //         'http://localhost:5000/api/auth/google-login',
//   //         { tokenId: response.tokenId }
//   //       );
//   //       // Save the token in localStorage or handle successful login
//   //       localStorage.setItem('token', data.token);
//   //       window.location.href = '/dashboard'; // Redirect to dashboard or desired route
//   //     } catch (error) {
//   //       console.error("Google login error", error);
//   //     }
//   //   }
//   // };

//   return (
//     <Col lg="5" md="7">
//       <Card className="bg-secondary shadow border-0">
//         <CardHeader className="bg-transparent pb-0">
//           <div className="text-muted text-center mt- mb-3">
//             <img
//               src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png"
//               alt="Umar Academy Logo"
//               className="login-logo"
//             />
//             <h2>Login</h2>
//           </div>
//         </CardHeader>
//         <CardBody className="px-lg-5 py-lg-5">
//           <Form onSubmit={handleLogin}>
//             <FormGroup>
//               <InputGroup>
//                 <InputGroupAddon addonType="prepend">
//                   <InputGroupText>
//                     <i className="ni ni-email-83" />
//                   </InputGroupText>
//                 </InputGroupAddon>
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </InputGroup>
//             </FormGroup>
//             <FormGroup>
//               <InputGroup>
//                 <InputGroupAddon addonType="prepend">
//                   <InputGroupText>
//                     <i className="ni ni-lock-circle-open" />
//                   </InputGroupText>
//                 </InputGroupAddon>
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </InputGroup>
//             </FormGroup>
//             {error && <p className="text-danger">{error}</p>}
//             <Button color="primary" type="submit" className="my-4">
//               Sign in
//             </Button>
//           </Form>

//           {/* Google Sign-In Button */}
//           <div className="text-center my-3">
//             <GoogleLogin
//               clientId="217006242261-l4g0h2nj4388sq840tbnpi9trvqk8lls.apps.googleusercontent.com"
//               buttonText="Login with Google"
//               onSuccess={responseGoogle}
//               onFailure={responseGoogle}
//               cookiePolicy={'single_host_origin'}
//             />
//           </div>
//         </CardBody>
//       </Card>
//     </Col>
//   );
// };

// export default Login;




// Live Uploaded code is from here

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from "reactstrap";
// import axios from "axios";
// import { GoogleLogin } from '@react-oauth/google';
// import jwt_decode from "jwt-decode"; // to decode response.credential if needed
// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const gapi = window.gapi;

//     // Make sure to initialize only once
//     if (!gapi.auth2.getAuthInstance()) {
//       gapi.load('auth2', function () {
//         gapi.auth2.init({
//           client_id: '217006242261-l4g0h2nj4388sq840tbnpi9trvqk8lls.apps.googleusercontent.com',
//         });
//       });
//     }
//   }, []);


//   // ✅ Redirect logged-in users to dashboard
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/admin/index");
//     }
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
//       const { token, role, userId, user } = response.data;
//       localStorage.setItem("user", JSON.stringify(user));

//       if (token && role && userId) {
//         localStorage.setItem("token", token);   // Store token
//         localStorage.setItem("role", role);     // Store role
//         localStorage.setItem("userId", userId); // Store userId for homework fetching
//         navigate("/admin/index"); // Redirect after successful login
//       } else {
//         console.error("Invalid response format:", response.data);
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   const responseGoogle = async (response) => {
//     if (response.tokenId) {
//       try {
//         await axios.post('http://localhost:5000/api/users/google-login', { tokenId });
//         localStorage.setItem('token', data.token);
//         window.location.href = '/dashboard'; // Redirect to dashboard or desired route
//       } catch (error) {
//         console.error("Google login error", error);
//       }
//     }
//   };

//   return (
//     <Col lg="5" md="7">
//       <Card className="bg-secondary shadow border-0">
//         <CardHeader className="bg-transparent pb-0">
//           <div className="text-muted text-center mt- mb-3">
//             <img src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png" alt="Umar Academy Logo" className="login-logo" />
//             <h2>Login</h2>
//           </div>
//         </CardHeader>
//         <CardBody className="px-lg-5 py-lg-5">
//           <Form onSubmit={handleLogin}>
//             <FormGroup>
//               <InputGroup>
//                 <InputGroupAddon addonType="prepend">
//                   <InputGroupText>
//                     <i className="ni ni-email-83" />
//                   </InputGroupText>
//                 </InputGroupAddon>
//                 <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//               </InputGroup>
//             </FormGroup>
//             <FormGroup>
//               <InputGroup>
//                 <InputGroupAddon addonType="prepend">
//                   <InputGroupText>
//                     <i className="ni ni-lock-circle-open" />
//                   </InputGroupText>
//                 </InputGroupAddon>
//                 <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//               </InputGroup>
//             </FormGroup>
//             {error && <p className="text-danger">{error}</p>}
//             <Button color="primary" type="submit" className="my-4">
//               Sign in
//             </Button>
//           </Form>

//           {/* Google Login Button */}
//           {/* <GoogleLogin
//             clientId="217006242261-l4g0h2nj4388sq840tbnpi9trvqk8lls.apps.googleusercontent.com" // Replace with your actual Google Client ID
//             buttonText="Login with Google"
//             onSuccess={responseGoogle}
//             onFailure={responseGoogle}
//             cookiePolicy={'single_host_origin'}
//           /> */}
//           <GoogleLogin
//             onSuccess={async (credentialResponse) => {
//               try {
//                 const tokenId = credentialResponse.credential;
//                 const { data } = await axios.post('http://localhost:5000/api/users/google-login', { tokenId });
//                 localStorage.setItem("token", data.token);
//                 localStorage.setItem("userId", data.userId);
//                 localStorage.setItem("role", data.user.role);
//                 localStorage.setItem("user", JSON.stringify(data.user));
//                 navigate("/admin/index");
//               } catch (error) {
//                 console.error("Google login error", error);
//               }
//             }}
//             onError={() => {
//               console.error("Google Sign-In failed");
//             }}
//           />
//         </CardBody>
//       </Card>
//     </Col>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from "reactstrap";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/index");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, role, userId, user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      navigate("/admin/index");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const { data } = await axios.post("http://localhost:5000/api/users/google-login", { tokenId });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin/index");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardHeader className="bg-transparent pb-0">
          <div className="text-muted text-center mt- mb-3">
            <img src="https://umaracademy.org/wp-content/uploads/2024/05/Test-1.png" alt="Umar Academy Logo" className="login-logo" />
            <h2>Login</h2>
          </div>
        </CardHeader>
        <CardBody className="px-lg-5 py-lg-5">
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </InputGroup>
            </FormGroup>
            {error && <p className="text-danger">{error}</p>}
            <Button color="primary" type="submit" className="my-4">Sign in</Button>
          </Form>

          <div className="text-center mt-3">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.error("Google Sign-In failed")}
            />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Login;
