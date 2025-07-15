
export const isValidURL = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (err) {
    return false;
  }
};

export const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

export const isValidMinutes = (value) => {
  const minutes = parseInt(value, 10);
  return !isNaN(minutes) && minutes > 0;
};
