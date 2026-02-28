import nodemailer from "nodemailer";
import logger from "../config/logger";

const mailSender = async (email: string, title: string, body: string) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "College Decode || By Shubham",
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error) {
    logger.info("Failed to send email!");
    throw new Error("Email sending failed");
  }
};

export default mailSender;
