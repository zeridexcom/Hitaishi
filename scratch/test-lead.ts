import { appendLead } from "../lib/leadsStore";

async function main() {
  try {
    console.log("Inserting institution-partner lead...");
    const res = await appendLead({
      type: "institution-partner",
      institutionName: "Test School",
      contactPerson: "Principal Test",
      role: "Principal",
      email: "test@example.com",
      phone: "+91 99999 99999",
      city: "Mumbai",
      studentCount: "50-200",
      partnershipModel: "addon",
      message: "Testing lead submission",
      name: "Principal Test"
    });
    console.log("SUCCESS:", res);
  } catch (err: any) {
    console.error("FAILED TO INSERT LEAD:", err);
  }
}

main().then(() => process.exit(0));
