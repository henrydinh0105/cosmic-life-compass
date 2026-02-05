const translations: Record<string, string> = {
  // Start page
  'start.title': 'In welcher Lebensphase befindest du dich gerade?',
  'start.subtitle': 'Entdecke deinen aktuellen Lebensrhythmus durch östliche Weisheit',
  'start.button': 'Beginne Deine Reise',
  
  // Quiz page
  'quiz.back': 'Zurück',
  'quiz.next': 'Weiter',
  'quiz.submit': 'Meine Erkenntnisse Enthüllen',
  'quiz.skip': 'Diese Frage überspringen',
  'quiz.step': 'Schritt',
  'quiz.of': 'von',
  
  // Quiz questions
  'quiz.birthDate': 'Wann begann deine Reise?',
  'quiz.birthTime': 'Um welche Uhrzeit wurdest du geboren?',
  'quiz.gender': 'Wie identifizierst du dich?',
  'quiz.lifeFocus': 'Welcher Lebensbereich ruft dich gerade am meisten?',
  'quiz.currentAttention': 'Was zieht in diesem Moment deine Aufmerksamkeit am meisten an?',
  'quiz.seekClarity': 'Wo suchst du Klarheit?',
  
  // Birth time options
  'quiz.morning': 'Morgen',
  'quiz.morning.desc': '6:00 - 12:00 Uhr',
  'quiz.afternoon': 'Nachmittag',
  'quiz.afternoon.desc': '12:00 - 18:00 Uhr',
  'quiz.evening': 'Abend',
  'quiz.evening.desc': '18:00 - 24:00 Uhr',
  'quiz.night': 'Nacht',
  'quiz.night.desc': '0:00 - 6:00 Uhr',
  'quiz.unknown': 'Ich bin nicht sicher',
  'quiz.unknown.desc': 'Das ist okay, wir arbeiten mit dem was wir haben',
  
  // Birth time - Earthly Branches
  'quiz.time.rat': 'Ratte (23h-1h)',
  'quiz.time.rat.desc': '23:00 - 01:00',
  'quiz.time.ox': 'Ochse (1h-3h)',
  'quiz.time.ox.desc': '01:00 - 03:00',
  'quiz.time.tiger': 'Tiger (3h-5h)',
  'quiz.time.tiger.desc': '03:00 - 05:00',
  'quiz.time.rabbit': 'Hase (5h-7h)',
  'quiz.time.rabbit.desc': '05:00 - 07:00',
  'quiz.time.dragon': 'Drache (7h-9h)',
  'quiz.time.dragon.desc': '07:00 - 09:00',
  'quiz.time.snake': 'Schlange (9h-11h)',
  'quiz.time.snake.desc': '09:00 - 11:00',
  'quiz.time.horse': 'Pferd (11h-13h)',
  'quiz.time.horse.desc': '11:00 - 13:00',
  'quiz.time.goat': 'Ziege (13h-15h)',
  'quiz.time.goat.desc': '13:00 - 15:00',
  'quiz.time.monkey': 'Affe (15h-17h)',
  'quiz.time.monkey.desc': '15:00 - 17:00',
  'quiz.time.rooster': 'Hahn (17h-19h)',
  'quiz.time.rooster.desc': '17:00 - 19:00',
  'quiz.time.dog': 'Hund (19h-21h)',
  'quiz.time.dog.desc': '19:00 - 21:00',
  'quiz.time.pig': 'Schwein (21h-23h)',
  'quiz.time.pig.desc': '21:00 - 23:00',
  'quiz.time.unknown': 'Ich weiß nicht',
  'quiz.time.unknown.desc': 'Das ist in Ordnung',
  'quiz.time.selectPlaceholder': 'Geburtszeit auswählen...',
  'quiz.time.question': 'Wann wurden Sie geboren?',
  'quiz.time.helper': 'Geburtsdatum und -zeit helfen uns, Ihre Lebensmuster zu analysieren',
  
  // Gender options
  'quiz.feminine': 'Feminine Energie',
  'quiz.feminine.desc': 'Yin-orientierte Muster',
  'quiz.masculine': 'Maskuline Energie',
  'quiz.masculine.desc': 'Yang-orientierte Muster',
  'quiz.balanced': 'Ausgeglichen',
  'quiz.balanced.desc': 'Harmonisierte Muster',
  'quiz.preferNot': 'Möchte ich nicht sagen',
  'quiz.preferNot.desc': 'Wir analysieren universell',
  
  // Life focus options
  'quiz.career': 'Karriere & Lebenszweck',
  'quiz.career.desc': 'Berufliches Wachstum und sinnvolle Arbeit',
  'quiz.relationships': 'Beziehungen',
  'quiz.relationships.desc': 'Verbindungen mit geliebten Menschen',
  'quiz.personal': 'Persönliches Wachstum',
  'quiz.personal.desc': 'Selbstentdeckung und innere Entwicklung',
  'quiz.balance': 'Lebensbalance',
  'quiz.balance.desc': 'Harmonie in allen Bereichen',
  
  // Current attention options
  'quiz.stability': 'Stabilität',
  'quiz.stability.desc': 'Sichere Grundlagen aufbauen',
  'quiz.change': 'Veränderung',
  'quiz.change.desc': 'Neue Richtungen annehmen',
  'quiz.growth': 'Wachstum',
  'quiz.growth.desc': 'Deinen Horizont erweitern',
  'quiz.rest': 'Ruhe',
  'quiz.rest.desc': 'Erholung und Erneuerung',
  
  // Seek clarity options
  'quiz.work': 'Arbeit & Karriere',
  'quiz.work.desc': 'Beruflicher Weg und Entscheidungen',
  'quiz.love': 'Liebe & Verbindung',
  'quiz.love.desc': 'Herzensangelegenheiten',
  'quiz.health': 'Gesundheit & Vitalität',
  'quiz.health.desc': 'Körperliches und geistiges Wohlbefinden',
  'quiz.purpose': 'Lebenszweck',
  'quiz.purpose.desc': 'Bedeutung und Richtung',
  
  // Results page
  'results.title': 'Deine Lebenseinblicke',
  'results.personality': 'Persönlichkeitsprofil',
  'results.coreNature': 'Kernwesen',
  'results.coreNature.subtitle': 'Wie du natürlich denkst, reagierst und entscheidest',
  'results.naturalStrength': 'Natürliche Stärke',
  'results.naturalStrength.subtitle': 'Dein einzigartiger Vorteil wenn du im Gleichgewicht bist',
  'results.blindSpot': 'Blinder Fleck',
  'results.blindSpot.subtitle': 'Wo du dich unbewusst selbst einschränkst',
  'results.innerTension': 'Innere Spannung',
  'results.innerTension.subtitle': 'Der innere Konflikt den du oft erlebst',
  'results.growthDirection': 'Wachstumsrichtung',
  'results.growthDirection.subtitle': 'Wie das Gleichgewicht wiederhergestellt wird',
  
  'results.recognition': 'Selbsterkennungs-Punktzahl',
  'results.recognition.subtitle': 'Wie nah diese Reflexion deiner gelebten Erfahrung kommt',
  'results.recognition.20': 'Kaum erkennbar',
  'results.recognition.40': 'Etwas vertraut',
  'results.recognition.60': 'Größtenteils zutreffend',
  'results.recognition.80': 'Sehr nah',
  'results.recognition.100': 'Unangenehm zutreffend',
  'results.recognition.message': 'Wenn diese Reflexion resoniert, kann das Verstehen des richtigen Zeitpunkts genauso wichtig sein wie das Verstehen deiner selbst.',
  
  'results.lifeEnergy': 'Lebensenergie-Karte',
  'results.currentState': 'Aktueller Zustand',
  'results.guidance': 'Orientierung',
  
  'results.achievement': 'Erfolg & Anerkennung',
  'results.achievement.desc': 'Dein Antrieb für Erfolg und Sichtbarkeit',
  'results.connection': 'Beziehungen & Verbindung',
  'results.connection.desc': 'Wie du Bindungen aufbaust und pflegst',
  'results.emotional': 'Emotionales & Inneres Gleichgewicht',
  'results.emotional.desc': 'Deine innere Harmonie und emotionale Stabilität',
  'results.support': 'Unterstützung & Ressourcen',
  'results.support.desc': 'Die Hilfe und Ressourcen die dir zur Verfügung stehen',
  'results.direction': 'Richtung & Zweck',
  'results.direction.desc': 'Dein Sinn für Bedeutung und Lebensweg',
  
  'results.overall': 'Gesamtmuster',
  'results.reflection': 'Reflexionsfrage',
  
  'results.guidance2026': 'Monatliche Orientierung 2026',
  'results.guidance2026.subtitle': 'Erhalte personalisierte Timing-Einblicke jeden Monat',
  'results.email.placeholder': 'Gib deine E-Mail ein',
  'results.email.button': 'Monatliche Einblicke Erhalten',
  'results.email.success': 'Danke! Halte Ausschau nach deinem ersten Einblick.',
  'results.email.privacy': 'Wir respektieren deine Privatsphäre. Jederzeit abmelden.',
  
  'results.startOver': 'Von Vorne Beginnen',
  
  // Balance levels
  'balance.low': 'Niedrig',
  'balance.moderate': 'Mittel',
  'balance.strong': 'Stark',
  
  // Loading
  'loading.title': 'Analysiere deine Muster...',
  'loading.subtitle': 'Konsultiere östliche Weisheit',
  
  // Common
  'common.loading': 'Laden...',
  'common.error': 'Etwas ist schief gelaufen',
};

export default translations;
