const translations: Record<string, string> = {
  // Start page
  'start.title': 'Anong yugto ng buhay ka ngayon?',
  'start.subtitle': 'Tuklasin ang kasalukuyang ritmo ng iyong buhay sa pamamagitan ng karunungang Silangan',
  'start.button': 'Simulan ang Iyong Paglalakbay',
  
  // Quiz page
  'quiz.back': 'Bumalik',
  'quiz.next': 'Magpatuloy',
  'quiz.submit': 'Ipakita ang Aking mga Insight',
  'quiz.skip': 'Laktawan ang tanong na ito',
  'quiz.step': 'Hakbang',
  'quiz.of': 'sa',
  
  // Quiz questions
  'quiz.birthDate': 'Kailan nagsimula ang iyong paglalakbay?',
  'quiz.birthTime': 'Anong oras ka ipinanganak?',
  'quiz.gender': 'Paano mo kinikilala ang iyong sarili?',
  'quiz.lifeFocus': 'Anong bahagi ng buhay ang tumatawag sa iyo ngayon?',
  'quiz.currentAttention': 'Ano ang nakakakuha ng iyong atensyon sa sandaling ito?',
  'quiz.seekClarity': 'Saan ka naghahanap ng kalinawan?',
  
  // Birth time options
  'quiz.morning': 'Umaga',
  'quiz.morning.desc': '6:00 AM - 12:00 PM',
  'quiz.afternoon': 'Hapon',
  'quiz.afternoon.desc': '12:00 PM - 6:00 PM',
  'quiz.evening': 'Gabi',
  'quiz.evening.desc': '6:00 PM - 12:00 AM',
  'quiz.night': 'Hatinggabi',
  'quiz.night.desc': '12:00 AM - 6:00 AM',
  'quiz.unknown': 'Hindi ko sigurado',
  'quiz.unknown.desc': 'Okay lang, gagawin natin ang makakaya sa meron tayo',
  
  // Birth time - Earthly Branches
  'quiz.time.rat': 'Daga (23h-1h)',
  'quiz.time.rat.desc': '23:00 - 01:00',
  'quiz.time.ox': 'Kalabaw (1h-3h)',
  'quiz.time.ox.desc': '01:00 - 03:00',
  'quiz.time.tiger': 'Tigre (3h-5h)',
  'quiz.time.tiger.desc': '03:00 - 05:00',
  'quiz.time.rabbit': 'Kuneho (5h-7h)',
  'quiz.time.rabbit.desc': '05:00 - 07:00',
  'quiz.time.dragon': 'Dragon (7h-9h)',
  'quiz.time.dragon.desc': '07:00 - 09:00',
  'quiz.time.snake': 'Ahas (9h-11h)',
  'quiz.time.snake.desc': '09:00 - 11:00',
  'quiz.time.horse': 'Kabayo (11h-13h)',
  'quiz.time.horse.desc': '11:00 - 13:00',
  'quiz.time.goat': 'Kambing (13h-15h)',
  'quiz.time.goat.desc': '13:00 - 15:00',
  'quiz.time.monkey': 'Unggoy (15h-17h)',
  'quiz.time.monkey.desc': '15:00 - 17:00',
  'quiz.time.rooster': 'Manok (17h-19h)',
  'quiz.time.rooster.desc': '17:00 - 19:00',
  'quiz.time.dog': 'Aso (19h-21h)',
  'quiz.time.dog.desc': '19:00 - 21:00',
  'quiz.time.pig': 'Baboy (21h-23h)',
  'quiz.time.pig.desc': '21:00 - 23:00',
  'quiz.time.unknown': 'Hindi ko alam',
  'quiz.time.unknown.desc': 'Okay lang',
  'quiz.time.selectPlaceholder': 'Pumili ng oras ng kapanganakan...',
  'quiz.time.question': 'Anong oras ka ipinanganak?',
  'quiz.time.helper': 'Ang petsa at oras ng kapanganakan ay tumutulong sa amin na suriin ang iyong mga pattern sa buhay',
  
  // Gender options
  'quiz.feminine': 'Pemeneng Enerhiya',
  'quiz.feminine.desc': 'Mga pattern na Yin-oriented',
  'quiz.masculine': 'Panlalaking Enerhiya',
  'quiz.masculine.desc': 'Mga pattern na Yang-oriented',
  'quiz.balanced': 'Balanse',
  'quiz.balanced.desc': 'Mga harmonized na pattern',
  'quiz.preferNot': 'Mas gusto kong hindi sabihin',
  'quiz.preferNot.desc': 'Susuriin namin nang unibersal',
  
  // Life focus options
  'quiz.career': 'Karera at Layunin',
  'quiz.career.desc': 'Propesyonal na paglago at makabuluhang trabaho',
  'quiz.relationships': 'Mga Relasyon',
  'quiz.relationships.desc': 'Mga koneksyon sa mga mahal sa buhay',
  'quiz.personal': 'Personal na Paglago',
  'quiz.personal.desc': 'Pagtuklas sa sarili at panloob na pag-unlad',
  'quiz.balance': 'Balanse sa Buhay',
  'quiz.balance.desc': 'Harmonya sa lahat ng larangan',
  
  // Current attention options
  'quiz.stability': 'Katatagan',
  'quiz.stability.desc': 'Pagtatayo ng matibay na pundasyon',
  'quiz.change': 'Pagbabago',
  'quiz.change.desc': 'Pagtanggap ng mga bagong direksyon',
  'quiz.growth': 'Paglago',
  'quiz.growth.desc': 'Pagpapalawak ng iyong mga abot-tanaw',
  'quiz.rest': 'Pahinga',
  'quiz.rest.desc': 'Pagpapanumbalik at pagpapanibago',
  
  // Seek clarity options
  'quiz.work': 'Trabaho at Karera',
  'quiz.work.desc': 'Propesyonal na landas at mga desisyon',
  'quiz.love': 'Pag-ibig at Koneksyon',
  'quiz.love.desc': 'Mga bagay ng puso',
  'quiz.health': 'Kalusugan at Sigla',
  'quiz.health.desc': 'Pisikal at mental na kabutihan',
  'quiz.purpose': 'Layunin sa Buhay',
  'quiz.purpose.desc': 'Kahulugan at direksyon',
  
  // Results page
  'results.title': 'Ang Iyong Life Insight',
  'results.personality': 'Snapshot ng Personalidad',
  'results.coreNature': 'Pangunahing Kalikasan',
  'results.coreNature.subtitle': 'Kung paano ka natural na nag-iisip, tumutugon, at nagpapasya',
  'results.naturalStrength': 'Natural na Lakas',
  'results.naturalStrength.subtitle': 'Ang iyong natatanging bentahe kapag aligned',
  'results.blindSpot': 'Blind Spot',
  'results.blindSpot.subtitle': 'Kung saan mo hindi alam na nilimitahan ang iyong sarili',
  'results.innerTension': 'Panloob na Tensyon',
  'results.innerTension.subtitle': 'Ang panloob na konfliktong madalas mong nararanasan',
  'results.growthDirection': 'Direksyon ng Paglago',
  'results.growthDirection.subtitle': 'Kung paano naibabalik ang balanse',
  
  'results.recognition': 'Marka ng Pagkilala sa Sarili',
  'results.recognition.subtitle': 'Kung gaano kalapit ang pagmumuni-muni na ito sa iyong nabuhay na karanasan',
  'results.recognition.20': 'Halos hindi tumutugma',
  'results.recognition.40': 'Medyo pamilyar',
  'results.recognition.60': 'Karamihan ay tumpak',
  'results.recognition.80': 'Napakalapit',
  'results.recognition.100': 'Hindi komportableng tumpak',
  'results.recognition.message': 'Kung tumutugma ang pagmumuni-muni na ito, ang pag-unawa sa tamang panahon ay kasinghalaga ng pag-unawa sa iyong sarili.',
  
  'results.lifeEnergy': 'Mapa ng Enerhiya ng Buhay',
  'results.currentState': 'Kasalukuyang Estado',
  'results.guidance': 'Gabay',
  
  'results.achievement': 'Tagumpay at Pagkilala',
  'results.achievement.desc': 'Ang iyong pagnanais para sa tagumpay at pagkakaroon ng visibility',
  'results.connection': 'Mga Relasyon at Koneksyon',
  'results.connection.desc': 'Kung paano ka nagbubuklod at nagpapanatili ng mga relasyon',
  'results.emotional': 'Emosyonal at Panloob na Balanse',
  'results.emotional.desc': 'Ang iyong panloob na harmonya at emosyonal na katatagan',
  'results.support': 'Suporta at Mga Mapagkukunan',
  'results.support.desc': 'Ang tulong at mga mapagkukunan na available sa iyo',
  'results.direction': 'Direksyon at Layunin',
  'results.direction.desc': 'Ang iyong kahulugan at landas sa buhay',
  
  'results.overall': 'Pangkalahatang Pattern',
  'results.reflection': 'Tanong para sa Pagmumuni-muni',
  
  'results.guidance2026': 'Buwanang Gabay 2026',
  'results.guidance2026.subtitle': 'Tumanggap ng personalized na timing insights bawat buwan',
  'results.email.placeholder': 'Ilagay ang iyong email',
  'results.email.button': 'Kumuha ng Buwanang Insights',
  'results.email.success': 'Salamat! Abangan ang iyong unang insight sa lalong madaling panahon.',
  'results.email.privacy': 'Nirerespeto namin ang iyong privacy. Mag-unsubscribe anumang oras.',
  
  'results.startOver': 'Magsimula Muli',
  
  // Balance levels
  'balance.low': 'Mababa',
  'balance.moderate': 'Katamtaman',
  'balance.strong': 'Malakas',
  
  // Loading
  'loading.title': 'Sinusuri ang iyong mga pattern...',
  'loading.subtitle': 'Kumukonsulta sa karunungang Silangan',
  
  // Common
  'common.loading': 'Naglo-load...',
  'common.error': 'May nangyaring mali',
};

export default translations;
