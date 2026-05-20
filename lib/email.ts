import nodemailer from 'nodemailer'

const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS

if (!emailUser || !emailPass) {
  console.error('Missing EMAIL_USER or EMAIL_PASS environment variables for email sending.')
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!emailUser || !emailPass) {
    const error = new Error('EMAIL_USER and EMAIL_PASS must be configured in production environment variables.')
    console.error('Email sending error:', error)
    return { success: false, error }
  }

  try {
    const mailOptions = {
      from: emailUser,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}
