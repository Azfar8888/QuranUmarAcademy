import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from 'path'; // Add this import at the top of the file

// Import routes
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import homeworkRoutes from "./routes/homeworkRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import communicationRoutes from "./routes/communicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import securityMiddleware from "./middleware/securityMiddleware.js";
import importExportRoutes from "./routes/importExportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Create equivalent of __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const __dirname = path.resolve();
const app = express();

// Use environment variables
dotenv.config();

// Middleware setup
app.use(express.json());
app.use(cors({ 
  origin: ["https://quranumaracademy.onrender.com", "https://quranumaracademy.onrender.com"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Serve uploaded files
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/allocation", allocationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(securityMiddleware);
app.use("/api/import-export", importExportRoutes);
app.use("/api/chat", chatRoutes);


// Serve static files from the 'frontend/dist' folder
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Serve the index.html file for all the routes
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});


// Socket.IO Configuration
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "https://quranumaracademy.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group ${groupId}`);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.groupId).emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
