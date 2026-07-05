import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import { createServer as createViteServer } from "vite";

const app = express();

export default app; // Export app for Vercel Serverless Functions

async function startServer() {
  let PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Path to store users database
  // We store it in node_modules/users_db.json to prevent workspace file-watchers
  // from restarting the dev server and refreshing the client page.
  const USERS_FILE = path.join(process.cwd(), "node_modules", "users_db.json");
  const DOT_USERS_FILE = path.join(process.cwd(), "node_modules", ".users_db.json");
  const LEGACY_USERS_FILE = path.join(process.cwd(), "users_db.json");

  // In-memory database fallback to prevent read/write crashes on read-only environments like Vercel
  let inMemoryUsersFallback: Record<string, any> = {};

  // Helper to read users from DB
  function readUsers() {
    try {
      // If we are on Vercel, we can use the writable /tmp folder, or just use the in-memory fallback
      const isVercel = !!process.env.VERCEL;
      const targetFile = isVercel ? "/tmp/users_db.json" : USERS_FILE;

      if (isVercel) {
        if (fs.existsSync(targetFile)) {
          try {
            const data = fs.readFileSync(targetFile, "utf-8");
            return JSON.parse(data || "{}");
          } catch (e) {
            console.error("Vercel /tmp read failed, using in-memory fallback:", e);
          }
        }
        return inMemoryUsersFallback;
      }

      // Automatic Import: If a user manually places users_db.json in the root,
      // read it, migrate it to node_modules/users_db.json, and delete the root file
      // to prevent loop reloads.
      if (fs.existsSync(LEGACY_USERS_FILE)) {
        try {
          const rootData = fs.readFileSync(LEGACY_USERS_FILE, "utf-8");
          const parentDir = path.dirname(USERS_FILE);
          if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
          }
          fs.writeFileSync(USERS_FILE, rootData);
          fs.unlinkSync(LEGACY_USERS_FILE); // Safely delete root file after migration
          console.log("⭐ Successfully imported and migrated users_db.json from root directory!");
        } catch (err) {
          console.error("Failed to migrate legacy users file:", err);
        }
      }

      // Migrate .users_db.json to users_db.json inside node_modules if it exists
      if (fs.existsSync(DOT_USERS_FILE)) {
        try {
          const dotData = fs.readFileSync(DOT_USERS_FILE, "utf-8");
          fs.writeFileSync(USERS_FILE, dotData);
          fs.unlinkSync(DOT_USERS_FILE); // Safely delete dot file after migration
          console.log("⭐ Successfully migrated .users_db.json to users_db.json!");
        } catch (err) {
          console.error("Failed to migrate dot users file:", err);
        }
      }

      if (!fs.existsSync(USERS_FILE)) {
        const parentDir = path.dirname(USERS_FILE);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }
        fs.writeFileSync(USERS_FILE, JSON.stringify({}));
      }
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(data || "{}");
      // Keep fallback in sync
      inMemoryUsersFallback = parsed;
      return parsed;
    } catch (e) {
      console.error("Error reading users file, returning in-memory fallback:", e);
      return inMemoryUsersFallback;
    }
  }

  // Helper to write users to DB
  function writeUsers(users: any) {
    inMemoryUsersFallback = users;
    try {
      const isVercel = !!process.env.VERCEL;
      const targetFile = isVercel ? "/tmp/users_db.json" : USERS_FILE;

      const parentDir = path.dirname(targetFile);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(targetFile, JSON.stringify(users, null, 2));
    } catch (e) {
      console.error("Error writing users file (using in-memory fallback):", e);
    }
  }

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API: Register a new trainer account
  app.post("/api/users/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required!" });
    }

    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      return res.status(400).json({ success: false, message: "Username must be between 3 and 20 characters." });
    }

    const users = readUsers();
    if (users[trimmedUsername]) {
      return res.status(400).json({ success: false, message: "Username is already taken by another Trainer!" });
    }

    // Initialize user record
    const newUser = {
      username: username.trim(), // Keep original casing for display
      password: password,
      wins: 0,
      losses: 0,
      stage: 1,
      team: []
    };

    users[trimmedUsername] = newUser;
    writeUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
  });

  // API: Login existing trainer
  app.post("/api/users/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required!" });
    }

    const trimmedUsername = username.trim().toLowerCase();
    const users = readUsers();
    const user = users[trimmedUsername];

    if (!user || user.password !== password) {
      return res.status(400).json({ success: false, message: "Invalid username or password!" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  });

  // API: Update trainer progress (save game state)
  app.post("/api/users/save", (req, res) => {
    const { username, wins, losses, stage, team } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required!" });
    }

    const trimmedUsername = username.trim().toLowerCase();
    const users = readUsers();

    if (!users[trimmedUsername]) {
      return res.status(404).json({ success: false, message: "Trainer account not found!" });
    }

    users[trimmedUsername].wins = wins ?? users[trimmedUsername].wins;
    users[trimmedUsername].losses = losses ?? users[trimmedUsername].losses;
    users[trimmedUsername].stage = stage ?? users[trimmedUsername].stage;
    users[trimmedUsername].team = team ?? users[trimmedUsername].team;

    writeUsers(users);

    const { password: _, ...userWithoutPassword } = users[trimmedUsername];
    res.json({ success: true, user: userWithoutPassword });
  });

  // API: Fetch leaderboards/rankings
  app.get("/api/leaderboard", (req, res) => {
    const users = readUsers();
    const leaderboard = Object.values(users).map((u: any) => ({
      username: u.username,
      wins: u.wins,
      losses: u.losses,
      stage: u.stage
    }))
    .sort((a, b) => {
      if (b.stage !== a.stage) return b.stage - a.stage;
      return b.wins - a.wins;
    })
    .slice(0, 10); // Top 10

    res.json({ success: true, leaderboard });
  });

  const server = http.createServer(app);

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: {
          server: server // Share the Express server's port for Vite's HMR websocket connection
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Function to start server with automatic port recovery if already in use
  const startListening = (port: number) => {
    server.listen(port, "0.0.0.0");
  };

  server.on("listening", () => {
    const address = server.address();
    const actualPort = typeof address === "string" ? address : address?.port;
    console.log(`\n=======================================================`);
    console.log(`🎮 Pokemon Portfolio Server running successfully!`);
    console.log(`🌐 Local URL: http://localhost:${actualPort}`);
    console.log(`=======================================================\n`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`⚠️ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
      PORT++;
      startListening(PORT);
    } else {
      console.error("❌ Server encountered an error:", err);
    }
  });

  // Only start listening if NOT running on Vercel as a Serverless Function
  if (!process.env.VERCEL) {
    startListening(PORT);
  }
}

startServer();
