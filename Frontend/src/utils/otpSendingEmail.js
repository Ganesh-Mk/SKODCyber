import emailjs from "@emailjs/browser";

const OtpSendEmail = async (templateParams) => {
  const serviceID = "service_nysm5ix"; 
  const templateID = "template_hwq7jqr"; 
  const publicKey = "oEAb6Q3Ml9ZXZCcwA"; 

  try {
    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed. Please try again later.");
  }
};


export default OtpSendEmail;