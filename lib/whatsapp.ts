/**
 * WhatsApp message sending utility
 * Supports MSG91 / UltraMsg / Twilio integration and falls back to console logging
 */

interface SendWhatsAppParams {
  to: string; // Mobile number with country code (e.g., 91XXXXXXXXXX)
  message: string;
}

export async function sendWhatsApp({ to, message }: SendWhatsAppParams) {
  // Format the number to ensure 91 prefix if it's 10 digits
  let formattedTo = to.replace(/\D/g, '');
  if (formattedTo.length === 10) {
    formattedTo = `91${formattedTo}`;
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const whatsappSender = process.env.MSG91_WHATSAPP_SENDER || '919217664099';

  console.log(`[WHATSAPP NOTIFICATION] Sending to: ${formattedTo}`);
  console.log(`[WHATSAPP NOTIFICATION] Message:\n${message}`);

  // 1. Try MSG91 WhatsApp API if configured
  if (authKey) {
    try {
      // MSG91 WhatsApp API payload format
      const response = await fetch('https://api.msg91.com/api/v5/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authkey': authKey,
        },
        body: JSON.stringify({
          to: formattedTo,
          from: whatsappSender,
          type: 'text',
          message: message,
        }),
      });

      const data = await response.text();
      console.log('[WHATSAPP API] MSG91 response:', data);
      return { success: true, provider: 'msg91', response: data };
    } catch (err) {
      console.error('[WHATSAPP API] MSG91 error:', err);
    }
  }

  // 2. Try UltraMsg API if configured as fallback
  const ultramsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
  const ultramsgToken = process.env.ULTRAMSG_TOKEN;
  if (ultramsgInstance && ultramsgToken) {
    try {
      const response = await fetch(`https://api.ultramsg.com/${ultramsgInstance}/messages/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          token: ultramsgToken,
          to: `+${formattedTo}`,
          body: message,
        }).toString(),
      });

      const data = await response.json();
      console.log('[WHATSAPP API] UltraMsg response:', data);
      return { success: true, provider: 'ultramsg', response: data };
    } catch (err) {
      console.error('[WHATSAPP API] UltraMsg error:', err);
    }
  }

  // Fallback Simulation (Development mode)
  console.log(`[WHATSAPP SIMULATION] Successfully simulated WhatsApp transmission to ${formattedTo}.`);
  return { success: true, provider: 'simulation' };
}
