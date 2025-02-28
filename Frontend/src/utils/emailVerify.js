import emailjs from "@emailjs/browser";

const EmailVerify = async (templateParams) => {
  const serviceID = "service_jhykkdt"; 
  const templateID = "template_lp746gi"; 
  const publicKey = "yjDicdxwBdIyLy7FU"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default EmailVerify;