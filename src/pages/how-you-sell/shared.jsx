import { BookingCalendarVisual } from "../../components/effects/BookingCalendarVisual";
import { CreativeFatigueVisual } from "../../components/effects/CreativeFatigueVisual";
import { FunnelLeakVisual } from "../../components/effects/FunnelLeakVisual";
import { SerifEm } from "../../components/ui/SectionHeading";
import { L } from "../../i18n";
import { CALENDAR, CART, QUOTE } from "../../data/buyingModes";
export const buyingModes = [
  {
    ...QUOTE,
    Visual: FunnelLeakVisual,
    headline: L(
      <>
        {"Nobody buys until they "}
        <SerifEm>talk to you.</SerifEm>
      </>,
      <>
        {"Nimeni nu cumpără până nu "}
        <SerifEm>vorbește cu tine.</SerifEm>
      </>,
    ),
    looks: L(
      "Custom price, weeks of deciding, usually more than one person in the room. The buyer is technical, cautious, and used to being sold to badly. This is where Top of Mind started — metal fabrication, laser and waterjet cutting, construction and materials supply.",
      "Prețul se stabilește de la caz la caz, decizia durează săptămâni, iar la discuție stau de obicei mai mulți oameni. Cumpărătorul e tehnic, precaut și sătul de vânzători care nu-i înțeleg meseria. De aici am pornit și noi — confecții metalice, tăiere cu laser și cu jet de apă, construcții și furnizori de materiale.",
    ),
    niches: [
      L("Manufacturing", "Producție"),
      L("Custom metal fabrication", "Confecții metalice la comandă"),
      L("Construction & industrial suppliers", "Furnizori pentru construcții și industrie"),
      L("Pergolas & outdoor structures", "Pergole și structuri exterioare"),
      L("Custom furniture & joinery", "Mobilier și tâmplărie la comandă"),
      L("Automated gates & fences", "Porți și garduri automate"),
      L("Private clinics", "Clinici private"),
      L("Professional services", "Servicii profesionale"),
    ],
    leak: L(
      "Not in the ad spend — in the gap between someone showing interest and someone actually getting on a call. Most sites in this category make the technical buyer do the work: dig through a PDF catalog, guess at pricing, fill out a generic form that goes nowhere fast. The lead who was ready to talk cools off waiting for a human to reply.",
      "Nu în bugetul de reclame — ci între momentul în care cineva se arată interesat și momentul în care chiar ajunge să vorbească cu tine. Majoritatea site-urilor din domeniu îl lasă pe cumpărătorul tehnic să se descurce singur: să răsfoiască un catalog PDF, să ghicească prețurile, să completeze un formular generic la care îi răspunde cineva peste câteva zile. Până atunci, lead-ul care era gata să vorbească s-a răcit.",
    ),
    build: [
      L(
        "A site built to start a qualified conversation fast",
        "Un site care pornește repede o discuție cu omul potrivit",
      ),
      L(
        "Scope questions instead of a blank contact box",
        "Un formular cu câteva întrebări despre proiect, nu unul gol de contact",
      ),
      L(
        "Direct scheduling instead of “we'll get back to you”",
        "Programare directă în calendar, fără „revenim noi”",
      ),
      L(
        "Ads aimed at the triggers that move a technical buyer — not broad awareness",
        "Reclame care vorbesc despre ce îl doare pe un cumpărător tehnic — nu reclame de imagine",
      ),
    ],
    reportNote: L(
      "Not raw form fills, not clicks. We agree upfront on what “qualified” means for your business before a single euro moves.",
      "Formularele completate aiurea și click-urile nu se pun. Ce înseamnă „calificat” pentru afacerea ta stabilim de la început, înainte să cheltuim primul euro.",
    ),
    fee: L("Part of our fee is per qualified lead.", "O parte din tarif e per lead calificat."),
  },
  {
    ...CART,
    Visual: CreativeFatigueVisual,
    headline: L(
      <>
        {"They buy without "}
        <SerifEm>ever speaking to you.</SerifEm>
      </>,
      <>
        {"Cumpără fără să "}
        <SerifEm>vorbească vreodată cu tine.</SerifEm>
      </>,
    ),
    looks: L(
      "Seconds, on a phone, off a fifteen-second video. Nobody here is reading a spec sheet first — they're deciding whether this is the thing that fixes the problem they felt this morning.",
      "Câteva secunde, de pe telefon, după un video de cincisprezece secunde. Aici nimeni nu citește întâi fișa tehnică — oamenii se întreabă doar dacă produsul ăsta le rezolvă problema pe care au simțit-o azi-dimineață.",
    ),
    niches: [
      L("Mattresses & toppers", "Saltele și toppere"),
      L("Ergonomic pillows", "Perne ergonomice"),
      L("Premium bedding", "Lenjerii premium"),
      L("Car seats & strollers", "Scaune auto și cărucioare"),
      L("Cribs & baby monitors", "Pătuțuri și monitoare pentru bebeluși"),
      L("Kids' furniture & textiles", "Mobilier și textile pentru copii"),
      L("Pet", "Produse pentru animale"),
      L("Supplements", "Suplimente"),
    ],
    leak: L(
      "Almost never in targeting — Meta and Google are good enough at finding the right eyes. It leaks in creative fatigue: the same two or three ad angles run until the audience stops responding, and spend keeps flowing to a dead creative because nobody's watching closely enough to catch it in time.",
      "Aproape niciodată în targetare — Meta și Google găsesc destul de bine oamenii potriviți. Se pierd pe reclame obosite: aceleași două-trei idei rulează până nu mai reacționează nimeni, iar bugetul curge mai departe într-o reclamă moartă, pentru că nu se uită nimeni destul de des cât să o oprească la timp.",
    ),
    build: [
      L("A steady pipeline of new creative variations", "Un flux constant de reclame noi"),
      L(
        "Tested fast, killed fast — winners get the budget",
        "Testate repede, oprite repede — bugetul merge la cele care vând",
      ),
      L(
        "A pass on the store and checkout where carts leak",
        "O trecere prin magazin și prin checkout, acolo unde se abandonează coșurile",
      ),
      L(
        "Tracking that separates profitable orders from busy ones",
        "Tracking care separă comenzile profitabile de cele care doar fac volum",
      ),
    ],
    reportNote: L(
      "Cost per acquisition measured against a real margin number you give us — not clicks, not reach.",
      "Costul pe comandă, raportat la marja reală pe care ne-o spui tu — nu click-uri, nu reach.",
    ),
    fee: L(
      "Part of our fee is tied to ad performance.",
      "O parte din tarif depinde de performanța reclamelor.",
    ),
  },
  {
    ...CALENDAR,
    Visual: BookingCalendarVisual,
    headline: L(
      <>
        {"You sell time, and "}
        <SerifEm>tonight's slot is gone for good.</SerifEm>
      </>,
      <>
        {"Vinzi timp, iar "}
        <SerifEm>locul liber din seara asta nu se mai întoarce.</SerifEm>
      </>,
    ),
    looks: L(
      "Nothing here sits in inventory waiting to be sold tomorrow — an empty Tuesday is a Tuesday you never get to sell again. Packed weekends, dead weekdays, and a platform in the middle taking its cut.",
      "Aici nu există stoc care să aștepte să fie vândut mâine — o marți goală e o marți pe care n-o mai vinzi niciodată. Weekendurile sunt pline, zilele din săptămână sunt goale, iar între tine și client stă o platformă care își ia comisionul.",
    ),
    niches: [
      L("Boutique stays", "Cazări boutique"),
      L("Cabins & glamping", "Cabane și glamping"),
      L("Aesthetic clinics", "Clinici de estetică"),
      L("Private schools", "Școli private"),
      L("Paid courses", "Cursuri plătite"),
      L("Studios", "Studiouri"),
    ],
    leak: L(
      "In the mismatch between when people want to book and when you actually have room — and in a booking platform sitting between you and the customer, taking a cut and keeping their contact details for itself instead of for you.",
      "Lumea vrea să rezerve când ești deja plin și nu vine când ai locuri — iar între tine și client stă o platformă de rezervări care ia comision și păstrează datele de contact ale clientului pentru ea, nu pentru tine.",
    ),
    build: [
      L(
        "Demand aimed at your dead periods, not just “more traffic”",
        "Cerere adusă exact în perioadele tale goale, nu „mai mult trafic” la grămadă",
      ),
      L(
        "A direct-booking path on your own site and calendar",
        "Rezervare directă pe site-ul tău, în calendarul tău",
      ),
      L(
        "Reasons for past guests to book direct next time",
        "Motive ca cei care au mai fost să rezerve direct data viitoare",
      ),
      L(
        "Tracking that shows direct vs platform bookings",
        "Tracking care separă rezervările directe de cele prin platforme",
      ),
    ],
    reportNote: L(
      "The number that actually shows whether the platform dependency is shrinking.",
      "Cifra care arată, de fapt, dacă depinzi tot mai puțin de platforme.",
    ),
    fee: L(
      "Part of our fee is tied to direct bookings.",
      "O parte din tarif depinde de rezervările directe.",
    ),
  },
];
