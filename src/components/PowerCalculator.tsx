'use client';

import React, { useState } from 'react';
import { CPUS, GPUS, RAM_OPTIONS } from '../data/components';
import { calculatePowerConsumption } from '../lib/calculator';
import { CalculationResult, CoolingType } from '../types/calculator';

export function PowerCalculator() {
  const [cpuId, setCpuId] = useState<string>(CPUS[0].id);
  const [gpuId, setGpuId] = useState<string>(GPUS[0].id);
  const [ramGB, setRamGB] = useState<number>(16);
  const [ssdCount, setSsdCount] = useState<number>(1);
  const [hddCount, setHddCount] = useState<number>(0);
  const [coolingType, setCoolingType] = useState<CoolingType>('air');
  const [fanCount, setFanCount] = useState<number>(3);
  const [isOverclocked, setIsOverclocked] = useState<boolean>(false);

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(true);

  // Reset calculation result when inputs change to prevent displaying stale results
  const resetResultOnInputChange = () => {
    if (result !== null) {
      setResult(null);
    }
    if (errorMsg !== null) {
      setErrorMsg(null);
    }
  };

  const handleCpuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCpuId(e.target.value);
    resetResultOnInputChange();
  };

  const handleGpuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGpuId(e.target.value);
    resetResultOnInputChange();
  };

  const handleRamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRamGB(Number(e.target.value));
    resetResultOnInputChange();
  };

  const handleSsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSsdCount(isNaN(val) ? 0 : val);
    resetResultOnInputChange();
  };

  const handleHddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setHddCount(isNaN(val) ? 0 : val);
    resetResultOnInputChange();
  };

  const handleCoolingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCoolingType(e.target.value as CoolingType);
    resetResultOnInputChange();
  };

  const handleFanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFanCount(isNaN(val) ? 0 : val);
    resetResultOnInputChange();
  };

  const handleOverclockChange = (overclocked: boolean) => {
    setIsOverclocked(overclocked);
    resetResultOnInputChange();
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !Number.isInteger(ssdCount) || ssdCount < 0 || ssdCount > 20 ||
      !Number.isInteger(hddCount) || hddCount < 0 || hddCount > 20 ||
      !Number.isInteger(fanCount) || fanCount < 0 || fanCount > 20
    ) {
      setErrorMsg('Bitte geben Sie für SSD, HDD und Lüfter eine Zahl zwischen 0 und 20 ein.');
      setResult(null);
      return;
    }

    const validCpu = CPUS.some((cpu) => cpu.id === cpuId);
    const validGpu = GPUS.some((gpu) => gpu.id === gpuId);
    const validRam = RAM_OPTIONS.some((ram) => ram.capacityGB === ramGB);

    if (!validCpu || !validGpu || !validRam) {
      setErrorMsg('Ungültige Komponentenauswahl. Bitte überprüfen Sie Ihre Eingaben.');
      setResult(null);
      return;
    }

    setErrorMsg(null);

    const calculatedResult = calculatePowerConsumption({
      cpuId,
      gpuId,
      ramGB,
      ssdCount,
      hddCount,
      coolingType,
      fanCount,
      isOverclocked,
    });

    setResult(calculatedResult);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-8">
      <form onSubmit={handleCalculate} className="space-y-6" noValidate>
        {/* Input Groups */}
        <div className="space-y-6">
          {/* Prozessor (CPU) */}
          <div className="space-y-2">
            <label htmlFor="cpu-select" className="block text-sm font-semibold text-slate-200">
              Prozessor (CPU)
            </label>
            <select
              id="cpu-select"
              value={cpuId}
              onChange={handleCpuChange}
              className="w-full p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            >
              {CPUS.map((cpu) => (
                <option key={cpu.id} value={cpu.id}>
                  {cpu.name} ({cpu.estimatedPowerW} W)
                </option>
              ))}
            </select>
          </div>

          {/* Grafikkarte (GPU) */}
          <div className="space-y-2">
            <label htmlFor="gpu-select" className="block text-sm font-semibold text-slate-200">
              Grafikkarte (GPU)
            </label>
            <select
              id="gpu-select"
              value={gpuId}
              onChange={handleGpuChange}
              className="w-full p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            >
              {GPUS.map((gpu) => (
                <option key={gpu.id} value={gpu.id}>
                  {gpu.name} ({gpu.estimatedPowerW} W)
                </option>
              ))}
            </select>
          </div>

          {/* Arbeitsspeicher (RAM) */}
          <div className="space-y-2">
            <label htmlFor="ram-select" className="block text-sm font-semibold text-slate-200">
              Arbeitsspeicher (RAM)
            </label>
            <select
              id="ram-select"
              value={ramGB}
              onChange={handleRamChange}
              className="w-full p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            >
              {RAM_OPTIONS.map((ram) => (
                <option key={ram.capacityGB} value={ram.capacityGB}>
                  {ram.label}
                </option>
              ))}
            </select>
          </div>

          {/* Speicher (SSD & HDD) */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-200">
              Speicher
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ssd-count" className="block text-xs text-slate-400 mb-1">
                  Anzahl SSDs (M.2 / SATA)
                </label>
                <input
                  id="ssd-count"
                  type="number"
                  min="0"
                  max="20"
                  value={ssdCount}
                  onChange={handleSsdChange}
                  className="w-full p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="hdd-count" className="block text-xs text-slate-400 mb-1">
                  Anzahl Festplatten (HDD)
                </label>
                <input
                  id="hdd-count"
                  type="number"
                  min="0"
                  max="20"
                  value={hddCount}
                  onChange={handleHddChange}
                  className="w-full p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Kühlung */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-200">
              Kühlung
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cooling-select" className="block text-xs text-slate-400 mb-1">
                  Kühlungstyp
                </label>
                <select
                  id="cooling-select"
                  value={coolingType}
                  onChange={handleCoolingChange}
                  className="w-full p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="air">Luftkühlung</option>
                  <option value="aio">AIO-Wasserkühlung</option>
                </select>
              </div>

              <div>
                <label htmlFor="fan-count" className="block text-xs text-slate-400 mb-1">
                  Gehäuselüfter
                </label>
                <input
                  id="fan-count"
                  type="number"
                  min="0"
                  max="20"
                  value={fanCount}
                  onChange={handleFanChange}
                  className="w-full p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Übertaktung */}
          <div className="space-y-2">
            <fieldset>
              <legend className="text-sm font-semibold text-slate-200 mb-2">
                Übertaktung
              </legend>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="overclock"
                    checked={!isOverclocked}
                    onChange={() => handleOverclockChange(false)}
                    className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-slate-200 text-base">Nein</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="overclock"
                    checked={isOverclocked}
                    onChange={() => handleOverclockChange(true)}
                    className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-slate-200 text-base">Ja</span>
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-sm" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Calculate Button */}
        <div>
          <button
            type="submit"
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-600/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.99]"
          >
            Netzteil berechnen
          </button>
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="pt-8 border-t border-slate-800 space-y-8 animate-fadeIn" aria-live="polite">
          {/* Main Results Card */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Berechnungsergebnis
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Geschätzter Verbrauch */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 flex flex-col justify-between text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Geschätzter Verbrauch
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {result.estimatedPowerW} W
                </span>
              </div>

              {/* Empfohlenes Netzteil (Primary Visual Focus) */}
              <div className="bg-gradient-to-b from-blue-900/40 to-blue-950/80 p-6 rounded-2xl border-2 border-blue-500/80 shadow-lg shadow-blue-500/10 flex flex-col justify-between text-center sm:text-left sm:col-span-1 order-first sm:order-none">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">
                  Empfohlenes Netzteil
                </span>
                <div>
                  <span className="text-4xl sm:text-5xl font-black text-blue-400 tracking-tight">
                    {result.standardPsuWattage} W
                  </span>
                </div>
              </div>

              {/* Sicherheitsreserve */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 flex flex-col justify-between text-center sm:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Sicherheitsreserve
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {result.headroomPercent} %
                </span>
              </div>
            </div>
          </div>

          {/* Berechnungsdetails */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100">
                Berechnungsdetails
              </h2>
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 focus:outline-none transition-colors"
                aria-expanded={showBreakdown}
                aria-controls="breakdown-details"
              >
                {showBreakdown ? 'Einklappen' : 'Ausklappen'}
              </button>
            </div>

            {showBreakdown && (
              <div id="breakdown-details" className="pt-2 border-t border-slate-700/50 space-y-2 text-sm text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>CPU</span>
                  <span className="font-mono font-medium text-slate-100">{result.breakdown.cpu} W</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>GPU</span>
                  <span className="font-mono font-medium text-slate-100">{result.breakdown.gpu} W</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>RAM</span>
                  <span className="font-mono font-medium text-slate-100">{result.breakdown.ram} W</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>SSD</span>
                  <span className="font-mono font-medium text-slate-100">{result.breakdown.ssd} W</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>HDD</span>
                  <span className="font-mono font-medium text-slate-100">{result.breakdown.hdd} W</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Kühlung / Lüfter</span>
                  <span className="font-mono font-medium text-slate-100">
                    {result.breakdown.cooling + result.breakdown.fans} W
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Sonstiger Verbrauch</span>
                  <span className="font-mono font-medium text-slate-100">
                    {result.breakdown.misc + result.breakdown.overclockBonus} W
                  </span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-100 text-base">
                  <span>Gesamt</span>
                  <span className="font-mono text-blue-400">{result.estimatedPowerW} W</span>
                </div>
              </div>
            )}
          </div>

          {/* Warum wird dieses Netzteil empfohlen? */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-100">
              Warum wird dieses Netzteil empfohlen?
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-2 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              <p>
                Der Rechner schätzt zunächst den erwarteten Leistungsbedarf deines PC-Systems unter hoher Auslastung ab.
              </p>
              <p>
                Zu dieser geschätzten Gesamtleistung wird eine Sicherheitsreserve von 25 % hinzugerechnet. Dadurch läuft das Netzteil in seinem optimalen Effizienzbereich, fängt kurze Lastspitzen zuverlässig ab und bietet Flexibilität für spätere Aufrüstungen.
              </p>
              <p>
                Abschließend wird der berechnete Wert auf die nächstgrößere handelsübliche Netzteil-Klasse aufgerundet.
              </p>
            </div>
          </div>

          {/* Hinweis zur Berechnung */}
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-400 space-y-1">
            <h2 className="font-semibold text-slate-300">
              Hinweis zur Berechnung
            </h2>
            <p>
              Die angezeigten Werte sind Schätzungen und keine Messungen. Der tatsächliche Stromverbrauch kann je nach Systemkonfiguration, Auslastung und Komponenten variieren.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
