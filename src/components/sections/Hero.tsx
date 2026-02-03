import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden">
      <div className="relative container mx-auto px-6 h-screen flex flex-col justify-center">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">StepIn</span>
              <br />
              Propulsez votre carrière vers
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> de nouveaux horizons</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl">
              Découvrez une nouvelle ère du recrutement étudiant. StepIn révolutionne la façon dont les talents de demain rencontrent les entreprises visionnaires d'aujourd'hui.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Lancez-vous dans l'aventure
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 px-8 py-6 text-base font-medium rounded-full backdrop-blur-sm transition-all duration-300">
                Explorer la plateforme
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
