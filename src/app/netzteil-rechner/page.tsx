import type { Metadata } from 'next';
import Link from 'next/link';
import { PowerCalculator } from '@/components/PowerCalculator';

export const metadata: Metadata = {
  title: 'Netzteil Rechner – PC Netzteil Watt berechnen',
  description:
    'Netzteil Rechner für PC: Berechne schnell den Watt-Bedarf deines PCs aus CPU, GPU & Komponenten. Inkl. 25 % Reserve-Planung für die Netzteil-Wahl.',
  alternates: {
    canonical: '/netzteil-rechner/',
  },
  openGraph: {
    title: 'Netzteil Rechner – PC Netzteil Watt berechnen | Wattaro',
    description:
      'Berechne den Watt-Bedarf für dein PC-Netzteil. Wattaro ermittelt die passende Netzteil-Größe basierend auf deinen PC-Komponenten.',
    url: 'https://wattaro.vercel.app/netzteil-rechner/',
    siteName: 'Wattaro',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Netzteil Rechner – PC Netzteil Watt berechnen | Wattaro',
    description:
      'Berechne den Watt-Bedarf für dein PC-Netzteil mit dem Wattaro Netzteil Rechner.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://wattaro.vercel.app/#website',
      'url': 'https://wattaro.vercel.app/',
      'name': 'Wattaro',
      'inLanguage': 'de-DE',
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://wattaro.vercel.app/netzteil-rechner/#webapp',
      'url': 'https://wattaro.vercel.app/netzteil-rechner/',
      'name': 'Wattaro Netzteil Rechner',
      'applicationCategory': 'UtilityApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires JavaScript',
      'inLanguage': 'de-DE',
      'description':
        'Online PC-Netzteil-Rechner zur Schätzung des Stromverbrauchs und Ermittlung der passenden Netzteil-Leistung (Watt) für Gaming- und Office-PCs.',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://wattaro.vercel.app/netzteil-rechner/#faq',
      'inLanguage': 'de-DE',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Wie viel Watt braucht mein PC?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'Der Watt-Bedarf hängt von den eingebauten Komponenten ab, insbesondere von Prozessor (CPU) und Grafikkarte (GPU). Ein einfacher Office-PC benötigt oft nur 150 bis 300 Watt, während ein Gaming-PC typischerweise 450 bis 750 Watt und High-End-Systeme bis zu 850 Watt oder mehr benötigen.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Welches Netzteil brauche ich für meinen PC?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'Du benötigst ein Netzteil, dessen Nennleistung den geschätzten Maximalverbrauch deines PCs plus eine Planungsreserve von etwa 20 bis 25 % abdeckt. Wattaro errechnet diesen Planungswert automatisch und rundet auf die nächste handelsübliche Netzteil-Größe auf.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Wie viel Watt braucht eine Gaming-PC-Konfiguration?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'Mittelklasse-Gaming-PCs mit Grafikkarten wie einer RTX 4060 oder RX 7600 kommen meist mit 500 bis 650 Watt aus. Leistungsstarke Gaming-PCs mit Grafikkarten wie einer RTX 4080 / 4090 oder RX 7900 XTX erfordern in der Regel ein Netzteil mit 750 bis 1000 Watt.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Reichen 650 Watt für meinen PC?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'Ein 650-Watt-Netzteil reicht für die meisten Mittelklasse-Gaming-PCs (z. B. Intel Core i5 / AMD Ryzen 5 kombiniert mit RTX 4070 oder RX 7700 XT) problemlos aus. Für High-End-Grafikkarten oder stark übertaktete Systeme sollte jedoch ein 750- bis 850-Watt-Netzteil gewählt werden.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Warum wird ein Leistungsaufschlag berücksichtigt?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'Der 25-%-Planungsaufschlag dient dazu, kurze Lastspitzen (Transient Spikes) von CPU und GPU abzufangen, den Wirkungsgrad des Netzteils im optimalen Auslastungsbereich (ca. 50–80 %) zu halten und Raum für spätere Aufrüstungen zu bieten.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Ist das Ergebnis des Netzteil Rechners exakt?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'Nein, das Ergebnis ist eine fundierte Schätzung basierend auf typischen TDP- und Maximalverbrauchswerten der Komponenten unter Volllast. Es ersetzt keine messtechnische Ermittlung der tatsächlichen Leistungsaufnahme an der Steckdose.',
          },
        },
      ],
    },
  ],
};

export default function NetzteilRechnerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/netzteil-rechner/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-6 h-6 text-blue-500 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M13 2L3 14h7v8l10-12h-7L13 2z" />
            </svg>
            <span>Wattaro</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <Link
              href="/netzteil-rechner/"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Netzteil Rechner
            </Link>
            <a
              href="#berechnung"
              className="hidden sm:inline-block hover:text-slate-200 transition-colors"
            >
              Berechnung
            </a>
            <a
              href="#faq"
              className="hidden sm:inline-block hover:text-slate-200 transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Netzteil Rechner
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-medium">
            Berechne, wie viel Watt dein PC-Netzteil benötigt.
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Mit unserem verlässlichen Netzteilrechner bestimmst du schnell den geschätzten Leistungsbedarf deines Desktop-PCs. Wähle deine PC-Komponenten aus, um die empfohlene Netzteil-Wattzahl zu ermitteln.
          </p>
        </section>

        {/* Primary Interactive Calculator Component */}
        <section id="rechner" aria-label="PC Netzteil Rechner Interaktives Tool">
          <PowerCalculator />
        </section>

        {/* Methodology & Calculation Explanation Section */}
        <section
          id="berechnung"
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-slate-800 pb-3">
            So funktioniert die Netzteil-Berechnung
          </h2>
          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              Der Wattaro Netzteil Rechner berechnet die erwartete Leistungsaufnahme deines PCs auf Basis der typischen Volllast-Verbrauchswerte aller gewählten Komponenten.
            </p>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4 text-xs sm:text-sm font-mono text-slate-200 space-y-2">
              <div className="text-blue-400 font-semibold mb-1">
                1. Geschätzter Systemverbrauch:
              </div>
              <div>
                Prozessor (CPU) + Grafikkarte (GPU) + Arbeitsspeicher (RAM) + Laufwerke (SSD/HDD) + Mainboard + Kühlung (Lüfter/AIO) + PCIe-Erweiterungskarten + USB/Peripherie = geschätzter Systemverbrauch
              </div>
              <div className="text-blue-400 font-semibold mt-3 mb-1">
                2. Netzteil-Planungswert (Reserve):
              </div>
              <div>
                geschätzter Systemverbrauch × 1,25 (25 % Planungsaufschlag) = empfohlener Planungswert
              </div>
            </div>
            <p>
              Anschließend rundet der Rechner diesen Planungswert auf die nächstgelegene handelsübliche Netzteil-Nennleistung (z. B. 500 W, 550 W, 650 W, 750 W, 850 W, 1000 W oder höher) auf.
            </p>
            <div className="bg-blue-950/40 border border-blue-900/60 rounded-lg p-4 text-slate-300 text-xs sm:text-sm space-y-2">
              <strong className="text-blue-300 font-semibold block">
                Wichtiger Hinweis zur Reserve & Genauigkeit:
              </strong>
              <p>
                Der 25-%-Planungsaufschlag ist ein praktischer Richtwert für die Netzteil-Auswahl. Er dient dazu, kurze Lastspitzen (Transient Spikes) abzufangen, das Netzteil im effizienten Teillastbereich (ca. 50–80 % Auslastung) zu betreiben und Puffer für künftige Aufrüstungen zu schaffen.
              </p>
              <p>
                Dieser Aufschlag stellt keine elektrische Sicherheitsgarantie dar. Ebenso misst der Rechner nicht die tatsächliche Leistungsaufnahme an der Steckdose, sondern liefert eine fundierte Planungshilfe für die Wahl des passenden PC-Netzteils.
              </p>
            </div>
          </div>
        </section>

        {/* Component Influence Explanation Section */}
        <section id="komponenten" className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welche Komponenten beeinflussen den Stromverbrauch?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-slate-100 text-base">
                Prozessor (CPU) & Grafikkarte (GPU)
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                CPU und GPU sind die Hauptverbraucher in jedem PC. Moderne High-End-Grafikkarten können unter Volllast allein 300 bis 450 Watt oder mehr aufnehmen.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-slate-100 text-base">
                Mainboard & Chipsatz
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Standard-Mainboards verbrauchen ca. 25 Watt. Leistungsfähige Enthusiast- und Overclocking-Plattformen benötigen bis zu 50 Watt.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-slate-100 text-base">
                Arbeitsspeicher & Laufwerke
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                RAM-Riegel benötigen je nach Typ ca. 3 bis 5 Watt pro Modul. NVMe-SSDs verbrauchen unter Last ca. 5 bis 7 Watt, mechanische HDDs bis zu 10 Watt.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-slate-100 text-base">
                Kühlung, Lüfter & Peripherie
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Gehäuselüfter benötigen ca. 2–3 Watt pro Stück. AIO-Wasserkühlungen verbrauchen durch Pumpe und Lüfter ca. 15 Watt. Auch USB-Geräte tragen zum Gesamtverbrauch bei.
              </p>
            </div>
          </div>
        </section>

        {/* Search Intent FAQ Section */}
        <section
          id="faq"
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Häufige Fragen zum Netzteil
            </h2>
            <p className="text-slate-400 text-sm">
              Antworten auf die wichtigsten Fragen rund um PC-Netzteile und Leistungsberechnung.
            </p>
          </div>

          <div className="space-y-6 divide-y divide-slate-800/80">
            <div className="pt-4 first:pt-0 space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                1. Wie viel Watt braucht mein PC?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Der genaue Watt-Bedarf hängt von den verbauten Komponenten ab. Ein einfacher Office-PC benötigt meist nur 150 bis 300 Watt. Ein typischer Gaming-PC liegt bei etwa 450 bis 750 Watt, während High-End-Konfigurationen mit modernen Grafikkarten 850 Watt oder mehr benötigen können.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                2. Welches Netzteil brauche ich für meinen PC?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Du benötigst ein Netzteil, dessen Dauerleistung den geschätzten Maximalverbrauch deines PCs zuzüglich einer Planungsreserve von ca. 20–25 % abdeckt. Mit unserem{' '}
                <Link
                  href="/netzteil-rechner/"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Netzteil Rechner
                </Link>{' '}
                kannst du deinen PC-Netzteil-Bedarf direkt berechnen lassen.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                3. Wie viel Watt braucht eine Gaming-PC-Konfiguration?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ein Einsteiger- oder Mittelklasse-Gaming-PC (z. B. mit RTX 4060 oder RX 7600) kommt in der Regel mit einem 500- bis 650-Watt-Netzteil aus. Für anspruchsvolle Systeme mit Grafikkarten der Oberklasse (z. B. RTX 4080 Super oder RX 7900 XTX) wird ein Netzteil von 750 bis 1000 Watt empfohlen.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                4. Reichen 650 Watt für meinen PC?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ein qualitativ hochwertiges 650-Watt-Netzteil reicht für die allermeisten Gaming-PCs mit Mittelklasse- bis gehobenen Komponenten (z. B. Ryzen 7 / Core i7 mit RTX 4070 oder RX 7700 XT) problemlos aus. Für Flaggschiff-Grafikkarten oder stark übertaktete Prozessoren empfiehlt sich ein größeres Netzteil.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                5. Warum wird ein Leistungsaufschlag berücksichtigt?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Der Planungsaufschlag von 25 % fängt plötzliche Verbrauchsspitzen (Spitzenlasten) ab, verhindert eine dauerhafte Überlastung des Netzteils und sorgt dafür, dass das Netzteil in einem effizienten Auslastungsbereich läuft.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                6. Ist das Ergebnis des Netzteil Rechners exakt?
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Das Ergebnis ist eine verlässliche Planungsschätzung basierend auf Spezifikationen und typischen Maximalwerten der Hersteller. Der tatsächliche Verbrauch variiert je nach Anwendung, Last und individuellem Systemzustand.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Link Callout */}
        <section className="text-center pt-4">
          <p className="text-slate-400 text-sm">
            Möchtest du die Netzteil-Leistung für eine andere PC-Konfiguration ermitteln?{' '}
            <a
              href="#rechner"
              className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2"
            >
              Jetzt PC Netzteil Watt berechnen
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-6 text-slate-400 font-medium text-xs">
            <Link href="/netzteil-rechner/" className="hover:text-slate-200 transition-colors">
              Netzteil Rechner
            </Link>
            <a href="#berechnung" className="hover:text-slate-200 transition-colors">
              Berechnungsmethodik
            </a>
            <a href="#faq" className="hover:text-slate-200 transition-colors">
              Häufige Fragen
            </a>
          </div>
          <p>© {new Date().getFullYear()} Wattaro. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
