import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden bg-white border">
     

      <div className="relative container mx-auto px-6 h-screen flex flex-col justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-12">
            <Badge variant="outline" className="mb-8 bg-purple-100/50 text-purple-700 border-purple-200 backdrop-blur-sm px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 inline mr-2" />
              L'innovation au service du recrutement
            </Badge>

            <div>
              <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent [text-shadow:_0_1px_30px_rgb(147_51_234_/_20%)]">
                StepIn
              </h1>
              <p className="mt-8 text-3xl text-gray-700 font-light tracking-wide">
                Une nouvelle approche du recrutement
              </p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
              <p className="text-2xl text-gray-600 leading-relaxed">
                Nous créons des connexions efficaces entre talents et entreprises
              </p>
              <p className="text-xl text-gray-500 font-light">
                Une approche innovante qui optimise la rencontre entre candidats et recruteurs
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 items-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-7 text-lg rounded-full shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 group">
                Découvrir nos services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-7 text-lg rounded-full backdrop-blur-sm transition-colors duration-300">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
