import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("Mentor@123", 10);

    const mentor = await prisma.user.upsert({
        where: { email: "mentor@gmail.com" },
        update: {},
        create: {
            name: "Main Mentor",
            email: "mentor@gmail.com",
            password,
            role: Role.MENTOR,
        },

        

    })
    console.log("seeded mentor", mentor.email);
}

main()
.catch((e)=>{
    console.error(e)
    process.exit(1)
})
.finally(()=>prisma.$disconnect());