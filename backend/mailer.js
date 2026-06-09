const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTP(code) {
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  await transporter.sendMail({
    from: `"ממתקי התקווה" <${process.env.EMAIL_USER}>`,
    to,
    subject: `קוד אימות כניסה: ${code}`,
    html: `
      <div dir="rtl" style="font-family:'Segoe UI',Arial,sans-serif;max-width:440px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#567333;padding:20px 28px;">
          <h1 style="color:#fff;margin:0;font-size:18px;font-weight:700;">ממתקי התקווה</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">כניסה לפאנל הניהול</p>
        </div>
        <div style="padding:28px;background:#fff;">
          <p style="color:#374151;margin:0 0 8px;font-size:14px;">שלום,</p>
          <p style="color:#374151;margin:0 0 24px;font-size:14px;">קוד האימות שלך לכניסה למערכת הניהול:</p>
          <div style="background:#f7f8f3;border:2px solid #567333;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#567333;font-family:monospace;">${code}</div>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">הקוד תקף ל-10 דקות בלבד.</p>
          <p style="color:#9ca3af;font-size:12px;margin:0;">אם לא ניסית להתחבר לפאנל הניהול, התעלם מהודעה זו.</p>
        </div>
        <div style="background:#f9fafb;padding:12px 28px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:11px;margin:0;">ממתקי התקווה — מערכת ניהול</p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendOTP };
