"use client"

import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Home, Megaphone, Building, LogIn, UserPlus, Briefcase, Mail, GraduationCap, Sun, Moon } from "lucide-react";
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = (stored === 'dark' || stored === 'light')
      ? stored
      : (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  const getNavItems = () => {
    const baseItems = [
      { 
        name: "Campagnes", 
        href: "/campaigns", 
        icon: Megaphone,
        description: "Découvrez nos campagnes"
      }
    ];

    if (user?.role === 'student') {
      baseItems.push(
        {
          name: "Mes candidatures",
          href: "/students/applications",
          icon: Briefcase,
          description: "Suivez vos candidatures"
        }
      );
    }

    if (user?.role === 'school') {
      baseItems.push({
        name: "Mes campagnes",
        href: "/campaigns/school/me",
        icon: GraduationCap,
        description: "Gérez vos événements"
      });
    }

    if (user?.role === 'company') {
      baseItems.push(
        {
          name: "Mes invitations",
          href: "/campaigns/company/invitations",
          icon: Mail,
          description: "Invitations reçues"
        },
        {
          name: "Mes offres",
          href: "/campaigns/company/me",
          icon: Briefcase,
          description: "Vos offres de recrutement"
        }
      );
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <header className="w-full py-3 bg-white/80 dark:bg-slate-950/70 backdrop-blur-md border-b border-purple-100 dark:border-slate-800 fixed top-0 z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20 group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-indigo-700 dark:from-purple-300 dark:to-indigo-300 transition-all duration-300">
              StepIn
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 font-medium transition-colors duration-200 relative group flex items-center space-x-1"
                title={item.description}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            <div className="flex items-center">
              <div className="h-6 w-px bg-gray-400 dark:bg-gray-700 mx-4"></div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
                  title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{user?.name}</span>
                    <Button
                      onClick={logout}
                      variant="outline"
                      size="sm"
                      className="text-sm"
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-1.5 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200 font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Connexion</span>
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center space-x-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>S'inscrire</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20 hover:from-purple-200 hover:to-indigo-200 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            ) : (
              <Menu className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden absolute left-0 right-0 top-full bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-purple-100 dark:border-slate-800 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="flex flex-col space-y-3 pt-4 border-t border-purple-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 font-medium transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
              </button>
              <Link
                href="/login"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full px-6 py-2 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                <span>S'inscrire</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
