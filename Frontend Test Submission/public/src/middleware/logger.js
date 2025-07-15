
export const logEvent = (message, data = {}) => {
  const timestamp = new Date().toISOString();

  // Create the global log array if it doesn't exist
  if (!window.__LOGS__) {
    window.__LOGS__ = [];
  }

  // Push the event
  window.__LOGS__.push({
    timestamp,
    message,
    data,
  });

 
  console.log(`[LOG] ${message}`, { timestamp, ...data });
};
