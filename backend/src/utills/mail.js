import Mailgen from "mailgen"
import * as brevo from '@getbrevo/brevo';
import "dotenv/config"

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async(options) => {
    const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'TubeX',
        link: 'https://tube-x.vercel.app/'
    }
});

const textMail = mailGenerator.generatePlaintext(options.mailgencontent);
const htmlMail = mailGenerator.generate(options.mailgencontent);

try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.sender = { 
      name: "TubeX", 
      email: process.env.SMTP_EMAIL // Use your verified email
    };
    sendSmtpEmail.to = [{ email: options.email }];
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = htmlMail;
    sendSmtpEmail.textContent = textMail;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("✅ Email sent successfully", data);
    return { success: true, data };

  } catch (error) {
    console.error("❌ Brevo email error:", error);
    return { success: false, error: error.message };
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