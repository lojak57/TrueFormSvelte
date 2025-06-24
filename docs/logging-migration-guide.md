# Logging Migration Guide

This guide explains how to migrate from `console.log` to structured logging using Pino.

## Installation

```bash
npm install pino pino-pretty
```

## Logger Setup

The logger is configured in `src/lib/utils/logger.ts` with:

- Different log levels for development vs production
- Pretty printing in development
- Sensitive data redaction
- Request/response serializers
- Context-specific child loggers

## Migration Pattern

### Before:

```typescript
console.log("Processing request...");
console.error("Error:", error);
console.warn("Warning: API key not configured");
```

### After:

```typescript
import { apiLogger } from "$lib/utils/logger";

const logger = apiLogger.child({ endpoint: "your-endpoint" });

logger.info("Processing request...");
logger.error({ error }, "Error processing request");
logger.warn("API key not configured");
```

## Log Levels

- `logger.debug()` - Detailed debugging information (dev only)
- `logger.info()` - General information
- `logger.warn()` - Warning messages
- `logger.error()` - Error messages
- `logger.fatal()` - Fatal errors that crash the app

## Context-Specific Loggers

Pre-configured loggers are available for different contexts:

```typescript
import {
  apiLogger,
  authLogger,
  dbLogger,
  paymentLogger,
} from "$lib/utils/logger";
```

## Structured Logging

Include metadata as the first argument:

```typescript
// Include metadata
logger.info({ userId: user.id, action: "login" }, "User logged in");

// Log errors with stack traces
logger.error({ err: error, userId: user.id }, "Failed to process payment");

// Log performance metrics
logger.info(
  { duration: endTime - startTime, endpoint: "/api/users" },
  "Request completed"
);
```

## Migration Checklist

1. [ ] Replace `console.log` with `logger.info`
2. [ ] Replace `console.error` with `logger.error`
3. [ ] Replace `console.warn` with `logger.warn`
4. [ ] Add structured metadata where helpful
5. [ ] Use child loggers for context
6. [ ] Test logging output in development
7. [ ] Verify log levels for production

## Files to Migrate

Based on current usage:

- `src/routes/api/verticals/+server.ts` ✅
- `src/routes/api/proposal-catalog/+server.ts`
- `src/routes/api/stripe-webhook/+server.ts`
- `src/routes/api/proposals/[id]/payment-link/+server.ts`

## Environment Configuration

Logging behavior is automatically configured based on the environment:

- **Development**: Debug level, pretty printed, colorized
- **Production**: Info level, JSON format, optimized for log aggregation

No additional configuration needed - it works out of the box!
