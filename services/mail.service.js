const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: email,
      subject: "رمز إعادة تعيين كلمة المرور - PharmaZone",
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>مرحبا،</p>
          <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. استخدم الكود أدناه لإكمال العملية:</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #2c3e50; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>الكود صالح لمدة 10 دقائق فقط.</p>
          <p style="color: #e74c3c;"><strong>تحذير:</strong> إذا لم تطلب هذا، يرجى تجاهل هذا البريد الإلكتروني.</p>
          <p>شكراً،<br>فريق PharmaZone</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOTPEmail };
