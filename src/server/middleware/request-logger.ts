import { NextRequest } from "next/server";
import { logger } from "@/server/utils";

export async function requestLogger(req: NextRequest): Promise<void> {
  const start = Date.now();
  const method = req.method;
  const url = req.url;

  logger.info(`${method} ${url}`, "Request");

  (req as NextRequest & { _startTime: number })._startTime = start;
}

export function logResponse(req: NextRequest, status: number): void {
  const start = (req as NextRequest & { _startTime: number })._startTime ?? Date.now();
  const duration = Date.now() - start;
  const method = req.method;
  const url = req.url;

  logger.info(`${method} ${url} ${status} ${duration}ms`, "Response");
}
