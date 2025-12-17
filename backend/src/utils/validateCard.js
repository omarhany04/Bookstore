function luhnCheck(numStr) {
  let sum = 0;
  let alt = false;
  for (let i = numStr.length - 1; i >= 0; i--) {
    let n = parseInt(numStr[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function validateExpiryMMYY(mmyy) {
  if (!/^(0[1-9]|1[0-2])\d{2}$/.test(mmyy)) return false;
  const mm = parseInt(mmyy.slice(0,2), 10);
  const yy = parseInt(mmyy.slice(2,4), 10) + 2000;

  const now = new Date();
  const exp = new Date(yy, mm); // first day of next month
  return exp > now;
}

function validateCard(cardNumber, expiryMMYY) {
  const digits = String(cardNumber).replace(/\s+/g, "");
  if (!/^\d{12,19}$/.test(digits)) return { ok: false, reason: "Card number format" };
  if (!luhnCheck(digits)) return { ok: false, reason: "Card number invalid" };
  if (!validateExpiryMMYY(expiryMMYY)) return { ok: false, reason: "Expiry invalid" };
  return { ok: true, last4: digits.slice(-4) };
}

module.exports = { validateCard };
