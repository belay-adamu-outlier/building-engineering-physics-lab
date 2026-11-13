const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Check a contact form body.
 * @param {object} body Raw request body.
 * @returns {{ok: boolean, errors?: object, value?: object}}
 */
export function validateContact(body) {
  const source = body && typeof body === 'object' ? body : {};
  const company = String(source.company || '').trim();
  if (company) {
    return { ok: false, errors: { company: 'Rejected.' } };
  }

  const name = String(source.name || '').trim();
  const email = String(source.email || '').trim();
  const message = String(source.message || '').trim();
  const errors = {};

  if (name.length < 2 || name.length > 80) {
    errors.name = 'Enter a name between 2 and 80 characters.';
  }
  if (!EMAIL.test(email) || email.length > 120) {
    errors.email = 'Enter a valid email address.';
  }
  if (message.length < 10 || message.length > 2000) {
    errors.message =
      'Enter a message between 10 and 2000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      message,
      sentAt: new Date().toISOString(),
    },
  };
}

/**
 * Allow a limited number of hits per key inside a time window.
 * @param {number} max Maximum hits.
 * @param {number} windowMs Window length in milliseconds.
 * @returns {(key: string, now?: number) => boolean}
 */
export function createLimiter(max, windowMs) {
  const hits = new Map();

  return function allow(key, now = Date.now()) {
    const recent = (hits.get(key) || []).filter(
      (time) => now - time < windowMs,
    );
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
  };
}
