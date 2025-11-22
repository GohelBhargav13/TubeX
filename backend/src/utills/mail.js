import nodemailer from "nodemailer"
import mailgen from "mailgen"

export const sendEmail = async(options) => {
    const mailGenerator = new mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

const textMail = mailGenerator.generatePlaintext(options.mailgencontent);
const htmlMail = mailGenerator.generate(options.mailgencontent);


// Send the mail Using Nodemailer
let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOSTNAME || "",
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const MailOptions = {
    from: process.env.SMTP_EMAIL,
    to:options.email,
    subject:options.subject,
    text:textMail,
    html:htmlMail
}

try {

    await transporter.sendMail(MailOptions)
    console.log("Mail Sent.....")
    
} catch (error) {
    console.log("Error in Mail Sending")
}

}

export const verificationEmailTemplate = (username, verifyURL) => {
  return {
    body: {
      name: `${username} !`,
      intro:
        "Thanks for signing up for Mailgen. We're very excited to have you on board.",
      action: {
        instructions:
          "To get started using Mailgen, please confirm your account below:",
        button: {
          color: "#22BC66", // Green like in screenshot
          text: "Confirm your account",
          link: `https://tube-x.vercel.app/user/email-verify/${verifyURL}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};