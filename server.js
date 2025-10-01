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

// ====== KONFIGURASI ======
const ATLANTIC_API_KEY = "L0bajmHNfwPqZTQKKUeFNkqSsyC77x6sZg97IT9KUo1UbkubiktfXRZnIcMrLWHwah2E5R6NtzuIn5cuktRKdLpUSiJKW6wzUzyj"; // <-- Ganti pakai API Key Atlantic Anda
const BASE_URL = "https://atlantich2h.com";

// === Endpoint Topup ===
app.post("/api/topup", async (req, res) => {
  try {
    const { code, target, note } = req.body;
    const reff_id =
      "REF-" + Math.random().toString(36).slice(2, 10).toUpperCase();

    const params = new URLSearchParams();
    params.append("api_key", ATLANTIC_API_KEY);
    params.append("code", code);
    params.append("reff_id", reff_id);
    params.append("target", target);
    if (note) params.append("note", note);

    const resp = await fetch(BASE_URL + "/transaksi/create", {
      method: "POST",
      body: params,
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Error Topup:", err);
    res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
});

// === Endpoint Deposit QRIS ===
app.post("/api/deposit", async (req, res) => {
  try {
    const { amount } = req.body;
    const reff_id =
      "DEP-" + Math.random().toString(36).slice(2, 10).toUpperCase();

    const params = new URLSearchParams();
    params.append("api_key", ATLANTIC_API_KEY);
    params.append("reff_id", reff_id);
    params.append("amount", amount);
    params.append("payment_channel", "qris"); // sesuai docs Atlantic

    const resp = await fetch(BASE_URL + "/deposit/create", {
      method: "POST",
      body: params,
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Error Deposit:", err);
    res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server running di http://localhost:" + PORT)
);
