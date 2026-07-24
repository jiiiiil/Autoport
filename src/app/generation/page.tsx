import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GenerationWorkspace } from "@/components/generation/generation-workspace";

export default function GenerationPage() {
  return (
    <>
      <Navbar />
      <main>
        <GenerationWorkspace />
      </main>
      <Footer />
    </>
  );
}
