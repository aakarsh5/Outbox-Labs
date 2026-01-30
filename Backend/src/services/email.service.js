import { prisma } from "../config/db.js";

// create a scheduled email record
export const createEmail = async (data) => {
  return prisma.email.create({
    data: {
      to: data.to,
      subject: data.subject,
      body: data.body,
      scheduledAt: new Date(data.scheduledAt),
      status: "SCHEDULED",
    },
  });
};

// update email status
export const updateEmailStatus = async (id, status, sentAt = null) => {
  return prisma.email.update({
    where: { id },
    data: {
      status,
      sentAt,
    },
  });
};

// get all emails
export const getAllEmails = async () => {
  return prisma.email.findMany({
    orderBy: { createdAt: "desc" },
  });
};
