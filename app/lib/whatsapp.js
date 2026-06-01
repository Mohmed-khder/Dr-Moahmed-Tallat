export function formatWhatsAppUrl(value) {
  if (!value) return null;

  const whatsappValue = String(value).trim();
  if (!whatsappValue) return null;

  if (
    /^https?:\/\//i.test(whatsappValue) ||
    /^whatsapp:\/\//i.test(whatsappValue)
  ) {
    return whatsappValue;
  }

  const phoneNumber = whatsappValue.replace(/\D/g, "");
  return phoneNumber ? `https://wa.me/${phoneNumber}` : null;
}

