import { logger } from "@/server/utils";

export interface StreamEvent {
  type: "status" | "chunk" | "done" | "error";
  data: string;
  timestamp: number;
}

export function createStreamEncoder() {
  const encoder = new TextEncoder();

  function encode(event: StreamEvent): Uint8Array {
    return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
  }

  function statusEvent(data: string): Uint8Array {
    return encode({ type: "status", data, timestamp: Date.now() });
  }

  function chunkEvent(data: string): Uint8Array {
    return encode({ type: "chunk", data, timestamp: Date.now() });
  }

  function doneEvent(data: string): Uint8Array {
    return encode({ type: "done", data, timestamp: Date.now() });
  }

  function errorEvent(data: string): Uint8Array {
    return encode({ type: "error", data, timestamp: Date.now() });
  }

  return { encode, statusEvent, chunkEvent, doneEvent, errorEvent };
}

export function createStreamingResponse(
  onStream: (controller: ReadableStreamDefaultController<Uint8Array>) => Promise<void>
): Response {
  const encoder = createStreamEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await onStream(controller);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Stream error";
        logger.error(`Stream error: ${message}`, "StreamingResponse");
        controller.enqueue(encoder.errorEvent(message));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export function sendEvent(
  controller: ReadableStreamDefaultController<Uint8Array>,
  event: Uint8Array
): void {
  controller.enqueue(event);
}
