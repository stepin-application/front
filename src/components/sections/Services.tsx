import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Brain, Target, Rocket, FileText, ChartBar, MessageSquare } from "lucide-react";

export default function Services() {
  return (
    <section id="services" className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            Nos Formules
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Choisissez votre formule
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Des solutions adaptées à vos besoins, de l'essentiel au premium
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Formule Essentiel */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-2xl text-purple-700">Essentiel</CardTitle>
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-400 to-indigo-400 mt-2" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Rencontre aléatoire basée sur les critères techniques</span>
                </li>
                <li className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Optimisation des filtres de matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Intégration LLM pour le matching intelligent</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Formule Intermédiaire */}
          <Card className="hover:shadow-lg transition-all duration-300 border-purple-200 bg-gradient-to-b from-purple-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-2xl text-purple-700">Intermédiaire</CardTitle>
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-400 to-indigo-400 mt-2" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Suivi d'entretien complet</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Icebreaker et présentation guidée</span>
                </li>
                <li className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Entretien psychotechnique et technique</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Formule Premium */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-2xl text-purple-700">Premium</CardTitle>
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-400 to-indigo-400 mt-2" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Rapport détaillé par IA</span>
                </li>
                <li className="flex items-start gap-3">
                  <ChartBar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">KPI style FIFA avec points positifs/améliorations</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-600">Retranscription avancée sans interprétation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 