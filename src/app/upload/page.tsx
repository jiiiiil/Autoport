import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UploadStudio } from "@/components/upload/upload-studio";

export default function UploadPage() {
  return (
    <>
      <Navbar />
      <main>
        <UploadStudio />
      </main>
      <Footer />
    </>
  );
}
