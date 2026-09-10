import { PowerCalculator } from '@/components/PowerCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Netzteil Rechner
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Ermitteln Sie den geschätzten Stromverbrauch Ihres PC-Systems und finden Sie die passende Netzteil-Leistung.
          </p>
        </header>

        <PowerCalculator />
      </div>
    </main>
  );
}
