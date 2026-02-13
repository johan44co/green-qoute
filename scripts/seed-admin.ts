import { ensureAdminUser } from "../tests/helpers";
import "dotenv/config";

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error(
      "Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME must be set in .env file"
    );
  }

  try {
    await ensureAdminUser(adminEmail, adminPassword, adminName);

    console.log("✅ Admin user ready");
    console.log(`   Email: ${adminEmail}`);
    console.log("   Roles: admin, user");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
