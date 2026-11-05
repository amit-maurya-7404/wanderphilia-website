'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Plus,
  LogOut,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DestinationsManagement } from '@/components/admin/destinations-management';

export default function AdminDestinationsPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#ff5d09] selection:text-white">
      {/* TOP LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5d09] to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/20 cursor-pointer">
              W
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">Wanderphilia Operations</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Destination CMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Logged in as <code className="text-orange-400 font-medium">experiences@wanderphilia.com</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs h-9 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Tour Itineraries
            </Button>
          </Link>

          <Link href="/admin/website-itinerary">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#ff5d09] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs h-9 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" /> + Create New Itinerary (Zoho CRM)
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
            className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs h-9 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
        <DestinationsManagement />
      </main>
    </div>
  );
}
