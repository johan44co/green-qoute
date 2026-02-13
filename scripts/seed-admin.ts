import { auth } from "../src/lib/auth";
import prisma from "../src/lib/prisma";
import "dotenv/config";

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@test.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "TestPassword123!";
  const adminName = process.env.ADMIN_NAME || "Admin User";

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log("⚠️  Admin user already exists, updating role...");
      
      // Update role directly via Prisma (seed scripts don't have auth headers)
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: "admin,user" }, // Better Auth stores multiple roles as comma-separated string
      });

      console.log("✅ Admin role updated successfully");
      console.log(`   Email: ${adminEmail}`);
      console.log("   Roles: admin, user");
      process.exit(0);
    }

    // Create admin user
    await auth.api.createUser({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        role: ["admin", "user"],
      },
    });

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("   Roles: admin, user");
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
