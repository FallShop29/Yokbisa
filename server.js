import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve index.html

// ===== KONFIGURASI =====
const ATLANTIC_API_KEY = "L0bajmHNfwPqZTQKKUeFNkqSsyC77x6sZg97IT9KUo1UbkubiktfXRZnIcMrLWHwah2E5R6NtzuIn5cuktRKdLpUSiJKW6wzUzyj"; // ganti dengan API key Atlantic
const BASE_URL = "https://atlantich2h.com";

// === Buat Deposit QRIS ===
app.post("/api/deposit", async (req, res) => {
  try {
    const { amount } = req.body;
    const reff_id = "DEP-" + Date.now(); // unik

    const params = new URLSearchParams();
    params.append("api_key", ATLANTIC_API_KEY);
    params.append("reff_id", reff_id);
    params.append("amount", amount);
    params.append("payment_channel", "qris");

    const resp = await fetch(BASE_URL + "/deposit/create", {
      method: "POST",
      body: params,
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.json(data);
  } catch (err) {
    console.error("Error Deposit:", err);
    res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
});

// === Callback QRIS (opsional, kalau server sudah online) ===
app.post("/Fall", express.json(), (req, res) => {
  console.log("=== CALLBACK DEPOSIT QRIS ===");
  console.log(req.body);
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di http://localhost:" + PORT));
