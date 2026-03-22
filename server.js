const express = require("express");
const multer = require("multer");
const AdmZip = require("adm-zip");
const level = require("level");
const nbt = require("prismarine-nbt");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Upload world
app.post("/upload", upload.single("file"), (req, res) => {
    const zip = new AdmZip(req.file.path);
    const worldPath = path.join("worlds", Date.now().toString());

    zip.extractAllTo(worldPath, true);

    res.json({ worldPath });
});

// List chunks
app.get("/chunks", async (req, res) => {
    const db = level(path.join(req.query.worldPath, "db"));

    let chunks = [];
    db.createReadStream()
        .on("data", ({ key, value }) => {
            if (key.length > 8) {
                chunks.push(key.toString("hex"));
            }
        })
        .on("end", () => res.json({ chunks }));
});

// Get chunk data
app.get("/chunk", async (req, res) => {
    const db = level(path.join(req.query.worldPath, "db"));
    const key = Buffer.from(req.query.key, "hex");

    const data = await db.get(key);
    const parsed = await nbt.parse(data);

    res.json(parsed.parsed);
});

// Export world
app.get("/export", (req, res) => {
    const zip = new AdmZip();
    zip.addLocalFolder(req.query.worldPath);

    const file = req.query.worldPath + ".mcworld";
    zip.writeZip(file);

    res.download(file);
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
