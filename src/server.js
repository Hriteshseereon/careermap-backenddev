import dns from "dns";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

// Force IPv4 DNS resolution for cloud hosting compatibility (Render, AWS, etc.)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`);
});