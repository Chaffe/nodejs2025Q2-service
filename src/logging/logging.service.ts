import { Injectable } from '@nestjs/common';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
} from 'fs';
import { join } from 'path';

enum LogLevelPriority {
  error = 0,
  warn = 1,
  log = 2,
  debug = 3,
  verbose = 4,
}

@Injectable()
export class LoggingService {
  private readonly logDir = join(process.cwd(), 'logs');
  private readonly logFilePath = join(this.logDir, 'app.log');
  private readonly errorLogFilePath = join(this.logDir, 'error.log');
  private readonly maxFileSizeKB: number;
  private readonly logLevel: number;

  constructor() {
    this.maxFileSizeKB = parseInt(
      process.env.LOG_MAX_FILE_SIZE_KB || '100',
      10,
    );
    this.logLevel = parseInt(process.env.LOG_LEVEL || '2', 10);

    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevelPriority): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} [${level.toUpperCase()}] ${contextStr} ${message}\n`;
  }

  private rotateFileIfNeeded(filePath: string): void {
    if (!existsSync(filePath)) return;

    const stats = statSync(filePath);
    const fileSizeKB = stats.size / 1024;

    if (fileSizeKB >= this.maxFileSizeKB) {
      const timestamp = Date.now();
      const rotatedPath = filePath.replace('.log', `-${timestamp}.log`);
      renameSync(filePath, rotatedPath);
    }
  }

  private writeToFile(filePath: string, message: string): void {
    this.rotateFileIfNeeded(filePath);
    appendFileSync(filePath, message);
  }

  private writeLog(
    level: LogLevelPriority,
    message: string,
    context?: string,
  ): void {
    if (!this.shouldLog(level)) return;

    const levelName = LogLevelPriority[level];
    const formattedMessage = this.formatMessage(levelName, message, context);

    process.stdout.write(formattedMessage);

    this.writeToFile(this.logFilePath, formattedMessage);

    if (level === LogLevelPriority.error) {
      this.writeToFile(this.errorLogFilePath, formattedMessage);
    }
  }

  log(message: string, context?: string): void {
    this.writeLog(LogLevelPriority.log, message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    const fullMessage = trace ? `${message}\nStack: ${trace}` : message;
    this.writeLog(LogLevelPriority.error, fullMessage, context);
  }

  warn(message: string, context?: string): void {
    this.writeLog(LogLevelPriority.warn, message, context);
  }

  debug(message: string, context?: string): void {
    this.writeLog(LogLevelPriority.debug, message, context);
  }

  verbose(message: string, context?: string): void {
    this.writeLog(LogLevelPriority.verbose, message, context);
  }

  private safeStringify(obj: unknown): string {
    try {
      return JSON.stringify(obj);
    } catch {
      return '[Unable to stringify]';
    }
  }

  logRequest(request: {
    url: string;
    method: string;
    query: object;
    body: object;
  }): void {
    const message = `Incoming Request: ${request.method} ${request.url} | Query: ${this.safeStringify(request.query)} | Body: ${this.safeStringify(request.body)}`;
    this.log(message, 'HTTP');
  }

  logResponse(
    request: { url: string; method: string },
    statusCode: number,
    responseTime: number,
  ): void {
    const message = `Response: ${request.method} ${request.url} | Status: ${statusCode} | Time: ${responseTime}ms`;
    this.log(message, 'HTTP');
  }
}
