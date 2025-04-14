"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const companies = [
  {
    name: "Google",
    logo: "/logos/google.png",
    initials: "G",
    description: "Leader en technologie et innovation",
    type: "enterprise"
  },
  {
    name: "Microsoft", 
    logo: "/logos/microsoft.png",
    initials: "M",
    description: "Solutions cloud et entreprise",
    type: "enterprise"
  },
  {
    name: "Amazon",
    logo: "/logos/aws.png", 
    initials: "A",
    description: "Services cloud et e-commerce",
    type: "enterprise"
  },
  {
    name: "Meta",
    logo: "/logos/meta.png",
    initials: "M",
    description: "Réseaux sociaux et métavers",
    type: "enterprise"
  },
  {
    name: "Apple",
    logo: "/logos/apple.png",
    initials: "A", 
    description: "Design et innovation",
    type: "enterprise"
  },
  {
    name: "Netflix",
    logo: "/logos/netflix.png",
    initials: "N",
    description: "Streaming et divertissement",
    type: "enterprise"
  }
];

const schools = [
  {
    name: "42",
    logo: "/logos/42.png",
    initials: "42",
    description: "École d'informatique innovante",
    type: "school"
  },
  {
    name: "HEC Paris",
    logo: "/logos/hec.png",
    initials: "H",
    description: "École de commerce de premier plan",
    type: "school"
  },
  {
    name: "Polytechnique",
    logo: "/logos/polytechnique.png",
    initials: "P",
    description: "Excellence en ingénierie",
    type: "school"
  },
  {
    name: "Sciences Po",
    logo: "/logos/sciencespo.png",
    initials: "SP",
    description: "Institut d'études politiques",
    type: "school"
  },
  {
    name: "Centrale",
    logo: "/logos/centrale.png",
    initials: "C",
    description: "Formation d'ingénieurs d'excellence",
    type: "school"
  },
  {
    name: "ESSEC",
    logo: "/logos/essec.png",
    initials: "E",
    description: "Business school internationale",
    type: "school"
  }
];

export default function Partners() {
  const [activeTab, setActiveTab] = useState<'all' | 'companies' | 'schools'>('all');
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % 200);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const partners = activeTab === 'all' 
    ? [...companies, ...schools]
    : activeTab === 'companies' 
      ? companies 
      : schools;

  return (
    <section id="partners" className="min-h-screen relative overflow-hidden py-24">

      <div className="container relative mx-auto px-4">
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 bg-purple-100/80 text-purple-700 border-purple-200 backdrop-blur-sm">
            Notre Écosystème
          </Badge>
          <h2 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Ils nous font confiance
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Un réseau unique d'entreprises innovantes et d'écoles prestigieuses
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant={activeTab === 'companies' ? 'default' : 'outline'}
              onClick={() => setActiveTab('companies')}
              className="rounded-full"
            >
              Entreprises
            </Button>
            <Button 
              variant={activeTab === 'schools' ? 'default' : 'outline'}
              onClick={() => setActiveTab('schools')}
              className="rounded-full"
            >
              Écoles
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div 
            className="flex gap-8 py-4"
            animate={{
              x: `-${scrollPosition}%`
            }}
            transition={{
              duration: 50,
              ease: "linear",
              repeat: Infinity
            }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <Card 
                key={`${partner.name}-${index}`} 
                className="group relative flex-shrink-0 w-[200px] hover:shadow-xl transition-all duration-300 hover:border-purple-200 backdrop-blur-sm bg-white/80"
              >
                <CardContent className="p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex flex-col items-center">
                    <Avatar className="h-16 w-16 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <AvatarImage src={partner.logo} alt={partner.name} className="object-contain" />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xl">
                        {partner.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{partner.name}</h3>
                    <p className="text-sm text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {partner.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>

        <div className="text-center mt-20">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Rejoindre l'Écosystème
          </Button>
        </div>
      </div>
    </section>
  );
}