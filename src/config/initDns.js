import dns from "dns";

// Force IPv4 resolution before any network sockets or modules initialize
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

