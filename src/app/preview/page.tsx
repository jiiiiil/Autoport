import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PreviewWorkspace } from "@/components/preview/preview-workspace";

export default function PreviewPage() {
  return (
    <>
      <Navbar />
      <main>
        <PreviewWorkspace />
      </main>
      <Footer />
    </>
  );
}
