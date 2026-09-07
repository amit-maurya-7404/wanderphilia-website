import nodemailer from 'nodemailer'

/**
 * Creates and returns a configured Nodemailer transporter.
 * Specifically configured for Gmail SMTP using Gmail App Passwords.
 */
function createEmailTransporter() {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'wanderphiliaexperiences@gmail.com'
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || ''
  const cleanPass = emailPass.replace(/\s+/g, '').replace(/["']/g, '').trim()

  // 1. If explicit custom SMTP host is configured
  if (process.env.SMTP_HOST) {
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : smtpPort === 465,
      auth: {
        user: emailUser,
        pass: cleanPass,
      },
    })
  }

  // 2. Gmail SMTP configuration using wanderphiliaexperiences@gmail.com and Gmail App Password
  const gmailAuthUser = emailUser.includes('@gmail.com') ? emailUser : 'wanderphiliaexperiences@gmail.com'

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: gmailAuthUser,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'wanderphiliaexperiences@gmail.com'
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || ''
  const cleanPass = emailPass.replace(/\s+/g, '').replace(/["']/g, '').trim()
  const gmailAuthUser = emailUser.includes('@gmail.com') ? emailUser : 'wanderphiliaexperiences@gmail.com'
  const emailFrom = process.env.EMAIL_FROM || `"Wanderphilia Experiences" <${gmailAuthUser}>`

  if (!cleanPass) {
    const error = new Error('EMAIL_PASS (Gmail 16-character App Password) is missing in .env.local')
    console.error('[sendEmail Error]:', error.message)
    return { success: false, error }
  }

  try {
    const transporter = createEmailTransporter()

    const mailOptions = {
      from: emailFrom,
      to,
      subject,
      html,
      replyTo: replyTo || 'experiences@wanderphilia.com',
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[sendEmail Success] Email sent from:', emailFrom, 'to:', to, 'messageId:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('[sendEmail Error]:', error?.message || error)
    return { success: false, error }
  }
}
