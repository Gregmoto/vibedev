import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { db } from "../lib/db";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before running the seed.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      name: "VibeDev Admin",
    },
    create: {
      email,
      passwordHash,
      role: UserRole.ADMIN,
      name: "VibeDev Admin",
    },
  });

  console.log(`Admin user seeded: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
