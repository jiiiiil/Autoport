import { NextRequest } from "next/server";
import { parseResumePdf } from "@/server/resume";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { getEnv } from "@/server/config/env";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // Increase timeout to 120 seconds for Vercel

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    // Check environment variables
    const env = getEnv();
    if (!env.GROQ_API_KEY) {
      logger.error("GROQ_API_KEY not configured", "API");
      return Response.json(
        errorResponse("Server configuration error: GROQ_API_KEY not set"),
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json(errorResponse("Expected a PDF file upload"), { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json(errorResponse("No file provided"), { status: 400 });
    }

    const fileType = (file.type ?? "").toLowerCase();
    const filename = file.name || "resume.pdf";
    if (fileType !== "application/pdf" && !filename.toLowerCase().endsWith(".pdf")) {
      return Response.json(errorResponse("Only PDF files are supported"), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.byteLength === 0) {
      return Response.json(errorResponse("The uploaded file is empty"), { status: 400 });
    }
    if (buffer.byteLength > MAX_FILE_SIZE) {
      return Response.json(errorResponse("PDF file exceeds the 10MB limit"), { status: 400 });
    }

    logger.info(`Parsing resume PDF: "${filename}" (${buffer.byteLength} bytes)`, "API");

    // Add timeout protection with better error handling
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("PDF parsing timeout after 90 seconds")), 90000);
    });

    try {
      const report = await Promise.race([
        parseResumePdf(buffer, filename, buffer.byteLength),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof parseResumePdf>>;

      const duration = Date.now() - start;
      logger.info(`Resume parsed in ${duration}ms — ${report.resume.experience.length} experiences, ${report.resume.education.length} educations, ${report.resume.skills.length} skill groups`, "API");

      return Response.json(
        successResponse(report, "Resume parsed successfully", { duration }),
        { status: 200 }
      );
    } catch (parseError) {
      logger.error(`PDF parsing failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`, "API", parseError);
      
      // Return more specific error message
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      if (errorMessage.includes("timeout")) {
        return Response.json(
          errorResponse("PDF parsing took too long. Please try with a smaller file or try again later."),
          { status: 504 }
        );
      }
      if (errorMessage.includes("PDF parsing library")) {
        return Response.json(
          errorResponse("PDF parsing service unavailable. Please try again later."),
          { status: 503 }
        );
      }
      throw parseError;
    }
  } catch (error) {
    logger.error(`PDF parse error: ${error instanceof Error ? error.message : String(error)}`, "API", error);
    return handleError(error);
  }
}
