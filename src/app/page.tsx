import Footer from "@/components/Footer";
import MainContent from "@/components/MainContent";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <section className=" items-center justify-center min-h-screen bg-gray-50">
      <MainContent />
      <Footer />
    </section>
  );
}
