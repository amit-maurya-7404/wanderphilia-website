import nodemailer from 'nodemailer'

/**
 * Creates and returns a configured Nodemailer transporter.
 * Supports Zoho Mail, Google Workspace, Gmail, or any custom SMTP host.
 */
function createEmailTransporter() {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
  const smtpSecure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : (smtpPort === 465 || !smtpPort)

  if (!emailUser || !emailPass) {
    console.error('Missing EMAIL_USER/SMTP_USER or EMAIL_PASS/SMTP_PASS environment variables for email sending.')
  }

  // 1. If explicit SMTP host is configured
  if (smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort || (smtpSecure ? 465 : 587),
      secure: smtpSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })
  }

  // 2. If email domain is custom/Zoho Mail (e.g. experiences@wanderphilia.com)
  if (emailUser && !emailUser.endsWith('@gmail.com')) {
    // Default to Zoho Mail India / Global SMTP pro for domain emails
    const zohoDomain = process.env.ZOHO_API_DOMAIN?.includes('.com') ? 'smtppro.zoho.com' : 'smtppro.zoho.in'
    return nodemailer.createTransport({
      host: zohoDomain,
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })
  }

  // 3. Default fallback for standard @gmail.com accounts
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
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
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS
  const emailFrom = process.env.EMAIL_FROM || (emailUser ? `"Wanderphilia Experiences" <${emailUser}>` : '"Wanderphilia Experiences" <experiences@wanderphilia.com>')

  if (!emailUser || !emailPass) {
    const error = new Error('EMAIL_USER and EMAIL_PASS must be configured in environment variables (.env.local).')
    console.error('Email sending error:', error)
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
      headers: {
        'Auto-Submitted': 'auto-generated',
        'X-Auto-Response-Loop': 'true',
      },
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[sendEmail Success] Email sent from:', emailFrom, 'to:', to, 'messageId:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('[sendEmail Error]:', error?.message || error)
    return { success: false, error }
  }
}
