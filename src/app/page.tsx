import { PowerCalculator } from '@/components/PowerCalculator';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <svg className="w-6 h-6 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7v8l10-12h-7L13 2z" />
              </svg>
              WattCalc
            </span>
          </div>
          <nav className="text-sm font-medium text-slate-400">
            <span className="hover:text-slate-200 transition-colors cursor-pointer">
              Netzteil Rechner
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Netzteil Rechner
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-medium">
            Berechne, wie viel Watt dein PC-Netzteil benötigt.
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Konfiguriere deine PC-Komponenten und erhalte eine passende Empfehlung für die Netzteil-Leistung.
          </p>
        </section>

        {/* Calculator Section */}
        <section aria-label="PC Netzteil Rechner">
          <PowerCalculator />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4">
          <p>© {new Date().getFullYear()} WattCalc. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
