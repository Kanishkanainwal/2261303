const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

// Token management
let authToken = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYW5pc2thMDYxMEBnbWFpbC5jb20iLCJleHAiOjE3NTI1NjAyOTcsImlhdCI6MTc1MjU1OTM5NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjMyZWY5Y2I1LWUxOGUtNGVkNS04MDIxLTk1ZjJmN2FhNjE5OCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImthbmlzaGthIG5haW53YWwiLCJzdWIiOiIwNWMwZTkxYi0wYjMwLTRmNmUtYTFkZi01ZDQzZDRiMTUwMGYifSwiZW1haWwiOiJrYW5pc2thMDYxMEBnbWFpbC5jb20iLCJuYW1lIjoia2FuaXNoa2EgbmFpbndhbCIsInJvbGxObyI6IjIyNjEzMDMiLCJhY2Nlc3NDb2RlIjoiUUFoRFVyIiwiY2xpZW50SUQiOiIwNWMwZTkxYi0wYjMwLTRmNmUtYTFkZi01ZDQzZDRiMTUwMGYiLCJjbGllbnRTZWNyZXQiOiJ2U1JHWGJBdHZmcnVrTWhUIn0.svc3K0YFLqR3EWJtqVzhkLdtjmiLc7zINURJKzmCEA8", // Your JWT token
  expires: 1752559568 
};

const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const BACKEND_PACKAGES = ["cache", "controller"];
const FRONTEND_PACKAGES = ["component", "hook", "page", "state", "style"];
const COMMON_PACKAGES = ["auth", "config", "middleware", "utils"];

class LoggerMiddleware {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  validateLogEntry(stack, level, packageName) {
    if (!VALID_STACKS.includes(stack)) {
      throw new Error(Invalid stack: ${stack}. Must be one of: ${VALID_STACKS.join(', ')});
    }

    if (!VALID_LEVELS.includes(level)) {
      throw new Error(Invalid level: ${level}. Must be one of: ${VALID_LEVELS.join(', ')});
    }

    const validPackages = [
      ...(stack === 'backend' ? BACKEND_PACKAGES : []),
      ...(stack === 'frontend' ? FRONTEND_PACKAGES : []),
      ...COMMON_PACKAGES
    ];

    if (!validPackages.includes(packageName)) {
      throw new Error(Invalid package for ${stack}: ${packageName}. Valid packages: ${validPackages.join(', ')});
    }
  }


  async sendToServer(logEntry) {
    try {
      const response = await fetch(LOG_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": Bearer ${authToken.token}
        },
        body: JSON.stringify(logEntry)
      });

      if (!response.ok) {
        throw new Error(Log API responded with status ${response.status});
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to send log:", error);
      throw error;
    }
  }

  storeFailedLog(logEntry, error) {
    const failedLogs = JSON.parse(localStorage.getItem('failedLogs') || []);
    failedLogs.push({
      timestamp: new Date().toISOString(),
      logEntry,
      error: error.message
    });
    localStorage.setItem('failedLogs', JSON.stringify(failedLogs));
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const logEntry = this.queue.shift();

    try {
      await this.sendToServer(logEntry);
    } catch (error) {
      this.storeFailedLog(logEntry, error);
    } finally {
      this.isProcessing = false;
      this.processQueue(); 
    }
  }

  async log(stack, level, packageName, message) {
  
    this.validateLogEntry(stack, level, packageName);

    const logEntry = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: packageName.toLowerCase(),
      message,
      timestamp: new Date().toISOString()
    };

    this.queue.push(logEntry);
    this.processQueue();
  }

  async retryFailedLogs() {
    const failedLogs = JSON.parse(localStorage.getItem('failedLogs') || '[]');
    
    if (failedLogs.length > 0) {
      localStorage.removeItem('failedLogs');
      
      for (const failedLog of failedLogs) {
        try {
          await this.sendToServer(failedLog.logEntry);
        } catch (error) {
          this.storeFailedLog(failedLog.logEntry, error);
        }
      }
    }
  }
}


const logger = new LoggerMiddleware();

export const logDebug = (pkg, msg) => logger.log('frontend', 'debug', pkg, msg);
export const logInfo = (pkg, msg) => logger.log('frontend', 'info', pkg, msg);
export const logWarn = (pkg, msg) => logger.log('frontend', 'warn', pkg, msg);
export const logError = (pkg, msg) => logger.log('frontend', 'error', pkg, msg);
export const logFatal = (pkg, msg) => logger.log('frontend', 'fatal', pkg, msg);

logger.retryFailedLogs();
setInterval(() => logger.retryFailedLogs(), 300000); 

export default logger;