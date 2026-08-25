import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">About Autoport</h1>
          
          <div className="space-y-6 text-text-muted">
            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                Autoport is revolutionizing the way professionals showcase their work. We believe everyone deserves a stunning, professional portfolio without the hassle of manual design and coding. Our AI-powered platform transforms your resume into a beautiful, interactive portfolio in minutes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-medium text-text-primary mb-2">1. Upload Your Resume</h3>
                  <p>Simply upload your LinkedIn resume PDF. Our system extracts all your professional information automatically.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-medium text-text-primary mb-2">2. Choose Your Style</h3>
                  <p>Select from our curated themes and animation levels to match your personal brand.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-medium text-text-primary mb-2">3. Get Your Portfolio</h3>
                  <p>Our AI generates a complete, production-ready portfolio that you can customize and export.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Why Autoport?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>No coding required - perfect for non-technical professionals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>AI-powered content generation ensures professional quality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Multiple themes and customization options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Export your portfolio as a complete project</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Fast and easy - get your portfolio in minutes</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Technology</h2>
              <p>
                Built with Next.js, powered by advanced AI models, and designed with modern web technologies. Autoport leverages the latest in AI and web development to deliver exceptional results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Contact Us</h2>
              <p>
                Have questions or feedback? We'd love to hear from you. Reach out to us through our contact channels or join our community.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
