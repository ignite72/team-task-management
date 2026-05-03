// 1. imports
const Task = require("./models/Task");
const auth = require("./middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// 2. create app
const app = express();

// 3. middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 4. routes
app.post("/signup", async (req, res) => {
  console.log("🔥 SIGNUP ROUTE HIT");

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ error: err.message });
  }
});
const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  console.log("🔐 LOGIN ROUTE HIT");

  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Protected data accessed",
    user: req.user,
  });
});

app.post("/tasks", auth, async (req, res) => {
  try {
    const { title, description, assignedTo, project, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    let assignedUserId = null;

    if (assignedTo) {
      const user = await User.findOne({ email: assignedTo });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      assignedUserId = user._id;
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedUserId,
      project,
      dueDate,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.log("ERROR FULL:", err);
    res.status(500).json({ error: err.message });
  }
});

//  Get tasks created by user
app.get("/tasks", auth, async (req, res) => {
  try {
    const { project } = req.query; 

    let filter = { createdBy: req.user.id };

    // 🔥 filter by project if provided
    if (project) {
      filter.project = project;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/my-tasks", auth, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "Admin") {
      // 👇 Admin sees tasks they created
      tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    } else {
      // 👇 Member sees assigned tasks
      tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
app.put("/tasks/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Safety: assignedTo might be null
    const isCreator = task.createdBy?.toString() === req.user.id;
    const isAssignee =
      task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: "Not authorized" });
    }

    
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      return res.status(400).json({
        message: "Deadline passed. Cannot update task.",
      });
    }

    // ✅ Update status
    task.status = status || task.status;

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // only creator can delete
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DB connection
  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" DB Connected"))
  .catch((err) => console.log(" DB ERROR:", err.message));

// 6. start server LAST
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});