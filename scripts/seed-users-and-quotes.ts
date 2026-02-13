import { createUsersWithQuotes } from "../tests/helpers";
import { SEED_USERS } from "./fixtures/seed-users";
import "dotenv/config";

async function seedUsersAndQuotes() {
  console.log("🌱 Seeding users and quotes...\n");

  try {
    await createUsersWithQuotes(SEED_USERS);

    console.log("✨ Seeding completed successfully!\n");
    console.log("Summary:");
    console.log(`   Users: ${SEED_USERS.length}`);
    console.log(
      `   Quotes: ${SEED_USERS.reduce((sum, user) => sum + user.quotes.length, 0)}`
    );
    console.log();

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users and quotes:", error);
    process.exit(1);
  }
}

seedUsersAndQuotes();
