"use client"
import { Search, Calendar, Menu } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';

type FilterStatus = 'all' | 'active' | 'closed' | 'upcoming';

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    status: FilterStatus;
  }) => void;
  userRole?: 'school' | 'company' | 'student' | 'platform_admin' | null | undefined;
}

export default function SearchAndFilters({ onSearch, onFilterChange, userRole }: SearchAndFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    status: FilterStatus;
  }>({
    status: 'all',
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof typeof filters, value: FilterStatus) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Statut */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Calendar className="w-4 h-4" />
          <span>Statut</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.status === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status', 'all')}
            className="rounded-full h-9 px-4 text-sm font-medium transition-all hover:shadow-sm"
          >
            Tous
          </Button>
          <Button
            variant={filters.status === 'active' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status', 'active')}
            className="rounded-full h-9 px-4 text-sm font-medium transition-all hover:shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Actives
          </Button>
          <Button
            variant={filters.status === 'upcoming' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status', 'upcoming')}
            className="rounded-full h-9 px-4 text-sm font-medium transition-all hover:shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
            À venir
          </Button>
          <Button
            variant={filters.status === 'closed' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status', 'closed')}
            className="rounded-full h-9 px-4 text-sm font-medium transition-all hover:shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
            Terminées
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-6 bg-white dark:bg-slate-900/80 shadow-sm rounded-xl border border-gray-100 dark:border-slate-800">
      <div className="space-y-6">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Rechercher une campagne..."
            className="pl-10 pr-4 h-12 text-base border-2 focus:border-purple-500 transition-colors rounded-lg dark:bg-slate-950 dark:text-gray-100 dark:border-slate-800 dark:placeholder:text-gray-500"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Filtres - Desktop */}
        <div className="hidden md:block">
          <FiltersContent />
        </div>

        {/* Filtres - Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] dark:bg-slate-950">
              <FiltersContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Card>
  );
}
