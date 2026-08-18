import { NextRequest } from "next/server";
import { parseResumePdf } from "@/server/resume";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // Increase timeout to 120 seconds for Vercel

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
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

    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("PDF parsing timeout")), 90000); // 90 seconds
    });

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
  } catch (error) {
    logger.error(`PDF parse error: ${error instanceof Error ? error.message : String(error)}`, "API", error);
    return handleError(error);
  }
}
