import "dotenv/config";
import mysql from "mysql2/promise";

// Legacy MySQL source used only by the one-off migration scripts in src/migration/scripts.
// Credentials come from the environment (see .env.example). The password that used to be
// hard-coded here is compromised and must be rotated on the MySQL server.
if (!process.env.MIGRATION_MYSQL_PASSWORD) {
  console.warn("⚠️  MIGRATION_MYSQL_PASSWORD is not set; the migration MySQL connection will fail.");
}

export const mysqlConnection = mysql.createPool({
  host: process.env.MIGRATION_MYSQL_HOST || "localhost",
  user: process.env.MIGRATION_MYSQL_USER || "root",
  password: process.env.MIGRATION_MYSQL_PASSWORD,
  database: process.env.MIGRATION_MYSQL_DATABASE || "careermapbackupdb",
  waitForConnections: true,
  connectionLimit: 10,
});
