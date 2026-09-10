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

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (ssdCount < 0 || hddCount < 0 || fanCount < 0) {
      setErrorMsg('Bitte geben Sie gültige Anzahlen (0 oder mehr) ein.');
      return;
    }

    setErrorMsg(null);

    const calculatedResult = calculatePowerConsumption({
      cpuId,
      gpuId,
      ramGB,
      ssdCount: Number(ssdCount) || 0,
      hddCount: Number(hddCount) || 0,
      coolingType,
      fanCount: Number(fanCount) || 0,
      isOverclocked,
    });

    setResult(calculatedResult);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-xl shadow-xl border border-slate-800">
      <form onSubmit={handleCalculate} className="space-y-6" noValidate>
        {/* CPU */}
        <div>
          <label htmlFor="cpu-select" className="block text-sm font-semibold mb-2 text-slate-200">
            CPU
          </label>
          <select
            id="cpu-select"
            value={cpuId}
            onChange={(e) => setCpuId(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-colors"
          >
            {CPUS.map((cpu) => (
              <option key={cpu.id} value={cpu.id}>
                {cpu.name} ({cpu.estimatedPowerW} W)
              </option>
            ))}
          </select>
        </div>

        {/* GPU */}
        <div>
          <label htmlFor="gpu-select" className="block text-sm font-semibold mb-2 text-slate-200">
            Grafikkarte (GPU)
          </label>
          <select
            id="gpu-select"
            value={gpuId}
            onChange={(e) => setGpuId(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-colors"
          >
            {GPUS.map((gpu) => (
              <option key={gpu.id} value={gpu.id}>
                {gpu.name} ({gpu.estimatedPowerW} W)
              </option>
            ))}
          </select>
        </div>

        {/* RAM */}
        <div>
          <label htmlFor="ram-select" className="block text-sm font-semibold mb-2 text-slate-200">
            Arbeitsspeicher (RAM)
          </label>
          <select
            id="ram-select"
            value={ramGB}
            onChange={(e) => setRamGB(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-colors"
          >
            {RAM_OPTIONS.map((ram) => (
              <option key={ram.capacityGB} value={ram.capacityGB}>
                {ram.label}
              </option>
            ))}
          </select>
        </div>

        {/* Storage (SSD & HDD) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ssd-count" className="block text-sm font-semibold mb-2 text-slate-200">
              SSD
            </label>
            <input
              id="ssd-count"
              type="number"
              min="0"
              max="20"
              value={ssdCount}
              onChange={(e) => setSsdCount(parseInt(e.target.value, 10) || 0)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>

          <div>
            <label htmlFor="hdd-count" className="block text-sm font-semibold mb-2 text-slate-200">
              HDD
            </label>
            <input
              id="hdd-count"
              type="number"
              min="0"
              max="20"
              value={hddCount}
              onChange={(e) => setHddCount(parseInt(e.target.value, 10) || 0)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>
        </div>

        {/* Cooling & Fans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cooling-select" className="block text-sm font-semibold mb-2 text-slate-200">
              Kühlung
            </label>
            <select
              id="cooling-select"
              value={coolingType}
              onChange={(e) => setCoolingType(e.target.value as CoolingType)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-colors"
            >
              <option value="air">Luftkühlung</option>
              <option value="aio">AIO-Wasserkühlung</option>
            </select>
          </div>

          <div>
            <label htmlFor="fan-count" className="block text-sm font-semibold mb-2 text-slate-200">
              Gehäuselüfter
            </label>
            <input
              id="fan-count"
              type="number"
              min="0"
              max="20"
              value={fanCount}
              onChange={(e) => setFanCount(parseInt(e.target.value, 10) || 0)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>
        </div>

        {/* Overclocking */}
        <div>
          <fieldset>
            <legend className="text-sm font-semibold mb-2 text-slate-200">
              Übertaktung
            </legend>
            <div className="flex items-center space-x-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="overclock"
                  checked={!isOverclocked}
                  onChange={() => setIsOverclocked(false)}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
                />
                <span className="ml-2 text-slate-200 text-base">Nein</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="overclock"
                  checked={isOverclocked}
                  onChange={() => setIsOverclocked(true)}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
                />
                <span className="ml-2 text-slate-200 text-base">Ja</span>
              </label>
            </div>
          </fieldset>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {/* Calculate Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.99]"
          >
            Netzteil berechnen
          </button>
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 mb-4">
            Berechnungsergebnis
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/80 text-center">
              <span className="block text-xs uppercase tracking-wider font-medium text-slate-400 mb-1">
                Geschätzter Verbrauch
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                {result.estimatedPowerW} W
              </span>
            </div>

            <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-600/50 text-center ring-1 ring-blue-500/20">
              <span className="block text-xs uppercase tracking-wider font-medium text-blue-300 mb-1">
                Empfohlenes Netzteil
              </span>
              <span className="text-3xl sm:text-4xl font-black text-blue-400">
                {result.standardPsuWattage} W
              </span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/80 text-center">
              <span className="block text-xs uppercase tracking-wider font-medium text-slate-400 mb-1">
                Sicherheitsreserve
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                {result.headroomPercent} %
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-sm text-slate-300">
            <p className="font-semibold text-slate-200 mb-1">Hinweis zur Berechnung:</p>
            <p>
              Bei diesem Ergebnis handelt es sich um eine Richtwerte-Schätzung basierend auf typischen Spitzenlasten der ausgewählten Komponenten. Reale Verbrauchswerte können je nach Auslastung und Systemkonfiguration variieren.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
