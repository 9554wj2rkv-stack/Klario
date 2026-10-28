import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Home, Search, LayoutGrid, Star, MoreHorizontal,
  Activity, Droplets, Heart, Microscope, ClipboardList,
  MessageCircle, Siren, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Plus, Info, ShieldCheck, X,
  Gauge, Scale, Stethoscope, Utensils, Puzzle, Pill, Brain, Calculator, GraduationCap, FileText, Folder,
} from "lucide-react";

/* ================================================================== *
 *  KLARIO — Din kliniske lommehjælper  ·  KLARIO HEALTHCARE
 *  Et moderne, roligt klinisk dashboard til danske sundhedselever
 *  og sundhedspersonale. Alt indhold er lokalt i koden.
 * ================================================================== */

const DISCLAIMER =
  "KLARIO er et lærings- og støtteværktøj. Følg altid lokale retningslinjer og kontakt relevant sundhedsfaglig person ved tvivl.";

/* ----------------------------- DATA ------------------------------- */

const DATA = [
  {
    id: "observationer",
    title: "Observationer",
    subtitle: "Systematisk vurdering af borgerens tilstand",
    color: "#2E68E0", g1: "#4F86F4", g2: "#2257D8",
    Icon: Activity,
    cards: [
      { id: "obs-respiration", title: "Respiration", sections: [
        { label: "Hvad skal du kigge efter?", body: "Frekvens (antal vejrtrækninger pr. minut), dybde, rytme og om borgeren bruger ekstra muskler. Lyt efter hvæsen, rallen eller hoste." },
        { label: "Normale tegn", body: "Voksen i hvile: ca. 12–20 vejrtrækninger pr. minut. Rolig, regelmæssig og ubesværet vejrtrækning. Normal hudfarve." },
        { label: "Advarselstegn", body: ["Under 8 eller over 24–25 pr. minut", "Anstrengt vejrtrækning og brug af hjælpemuskler", "Blålige læber (cyanose)", "Uro, forvirring eller hvæsende lyde"] },
        { label: "Hvornår skal du reagere?", body: "Ved tydeligt besvær, høj/lav frekvens, cyanose eller ændret bevidsthed. Tilkald straks sygeplejerske/læge ved akut åndenød." },
      ]},
      { id: "obs-puls", title: "Puls", sections: [
        { label: "Hvad skal du kigge efter?", body: "Frekvens, rytme (regelmæssig/uregelmæssig) og fyldighed (kraftig/svag). Mål typisk på håndleddet (a. radialis)." },
        { label: "Normale tegn", body: "Voksen i hvile: ca. 60–100 slag pr. minut, regelmæssig." },
        { label: "Advarselstegn", body: ["Under 50 eller over 100–110 i hvile", "Meget uregelmæssig puls", "Svag/tynd puls", "Samtidig svimmelhed eller brystsmerter"] },
        { label: "Hvornår skal du reagere?", body: "Ved markant høj/lav puls, uregelmæssighed med symptomer, eller hvis borgeren føler sig dårlig. Kontakt sygeplejerske." },
      ]},
      { id: "obs-blodtryk", title: "Blodtryk", sections: [
        { label: "Hvad skal du kigge efter?", body: "Systolisk (øvre) og diastolisk (nedre) tryk. Notér også om borgeren bliver svimmel ved at rejse sig." },
        { label: "Normale tegn", body: "Ca. 120/80 mmHg er typisk normalt for en voksen. Lidt variation er normalt." },
        { label: "Advarselstegn", body: ["Systolisk under 90 (lavt)", "Meget højt tryk (fx over 180/110)", "Svimmelhed, bleghed, hovedpine eller sløret syn"] },
        { label: "Hvornår skal du reagere?", body: "Ved meget lavt/højt tryk med symptomer. Lavt tryk + svimmelhed/bleghed kan tyde på væskemangel eller akut tilstand — kontakt sygeplejerske." },
      ]},
      { id: "obs-temperatur", title: "Temperatur", sections: [
        { label: "Hvad skal du kigge efter?", body: "Mål med termometer (øre, pande eller rektalt efter lokal retningslinje). Notér hvor og hvordan der er målt." },
        { label: "Normale tegn", body: "Ca. 36,5–37,5 °C." },
        { label: "Advarselstegn", body: ["Feber over 38 °C", "Høj feber over 39–40 °C", "Lav temperatur under 35 °C (hypotermi)", "Kulderystelser og klam hud"] },
        { label: "Hvornår skal du reagere?", body: "Ved feber + dårlig almentilstand, meget høj/lav temperatur eller mistanke om infektion. Kontakt sygeplejerske." },
      ]},
      { id: "obs-bevidsthed", title: "Bevidsthedsniveau", sections: [
        { label: "Hvad skal du kigge efter?", body: "Er borgeren vågen, kontaktbar og orienteret i tid, sted og egne data? Brug evt. AVPU (Alert, Voice, Pain, Unresponsive)." },
        { label: "Normale tegn", body: "Vågen, klar, svarer relevant og er orienteret." },
        { label: "Advarselstegn", body: ["Sløvhed eller svær at vække", "Forvirring", "Reagerer kun på tiltale eller smerte", "Pludselig ændring fra det vante"] },
        { label: "Hvornår skal du reagere?", body: "Ved pludselig ændring i bevidsthed reagér straks — det kan være akut. Kontakt sygeplejerske/læge. Ring 1-1-2 ved bevidstløshed." },
      ]},
      { id: "obs-hudfarve", title: "Hudfarve", sections: [
        { label: "Hvad skal du kigge efter?", body: "Farve (bleg, rød, gul, blålig), temperatur (varm/kold), fugt (tør/klam) og evt. marmorering." },
        { label: "Normale tegn", body: "Jævn, naturlig farve for borgeren. Varm og tør hud." },
        { label: "Advarselstegn", body: ["Bleghed eller klam/kold sved", "Blålige læber/negle (cyanose)", "Gulfarvning (ikterus)", "Marmoreret hud"] },
        { label: "Hvornår skal du reagere?", body: "Cyanose, marmorering eller pludselig bleghed med klam hud kræver hurtig handling. Kontakt sygeplejerske." },
      ]},
      { id: "obs-smerter", title: "Smerter", sections: [
        { label: "Hvad skal du kigge efter?", body: "Hvor, hvor længe, hvilken type (jagende, trykkende, brændende) og styrke på skala 0–10 (VAS/NRS)." },
        { label: "Normale tegn", body: "Smertefri eller velkendte, stabile smerter der er under kontrol." },
        { label: "Advarselstegn", body: ["Nye, kraftige eller pludselige smerter", "Smerter der ændrer karakter", "Brystsmerter", "Mavesmerter med påvirket almentilstand"] },
        { label: "Hvornår skal du reagere?", body: "Ved nye stærke smerter, brystsmerter eller smerter der ikke lindres. Kontakt sygeplejerske; brystsmerter kan være akut." },
      ]},
      { id: "obs-vaeske", title: "Væskeindtag", sections: [
        { label: "Hvad skal du kigge efter?", body: "Hvor meget borgeren drikker over døgnet. Før evt. væskeskema. Vurder tørst og mundtørhed." },
        { label: "Normale tegn", body: "Voksen ca. 1,5–2 liter i døgnet, medmindre andet er ordineret." },
        { label: "Advarselstegn", body: ["Lavt indtag", "Tørre slimhinder og tørst", "Nedsat urinmængde", "Træthed eller forvirring (tegn på dehydrering)"] },
        { label: "Hvornår skal du reagere?", body: "Ved vedvarende lavt indtag eller tegn på dehydrering — særligt hos ældre. Kontakt sygeplejerske." },
      ]},
      { id: "obs-urin", title: "Urin", sections: [
        { label: "Hvad skal du kigge efter?", body: "Mængde, farve, lugt, klarhed og om det svier ved vandladning. Notér toilet-/blebesøg." },
        { label: "Normale tegn", body: "Lysegul, klar, uden stærk lugt og i normal mængde." },
        { label: "Advarselstegn", body: ["Mørk/koncentreret urin", "Blod i urinen", "Uklar eller ildelugtende urin", "Svie, hyppig vandladning eller meget lille/ingen urin"] },
        { label: "Hvornår skal du reagere?", body: "Ved ingen vandladning, blod eller tegn på urinvejsinfektion. Kontakt sygeplejerske." },
      ]},
      { id: "obs-affoering", title: "Afføring", sections: [
        { label: "Hvad skal du kigge efter?", body: "Hyppighed, konsistens (brug evt. Bristol-skala), farve og evt. blod eller slim." },
        { label: "Normale tegn", body: "Regelmæssig for borgeren, blød og formet, brun." },
        { label: "Advarselstegn", body: ["Diarré", "Forstoppelse over flere dage", "Sort/tjæreagtig eller blodig afføring", "Kraftig, unormal lugt"] },
        { label: "Hvornår skal du reagere?", body: "Ved blod, sort afføring, vedvarende diarré (væsketab) eller langvarig forstoppelse. Kontakt sygeplejerske." },
      ]},
      { id: "obs-ernaering", title: "Ernæring", sections: [
        { label: "Hvad skal du kigge efter?", body: "Appetit, hvor meget der spises, vægt, tygge-/synkebesvær og evt. utilsigtet vægttab." },
        { label: "Normale tegn", body: "Spiser tilstrækkeligt, stabil vægt og ingen synkeproblemer." },
        { label: "Advarselstegn", body: ["Nedsat appetit", "Utilsigtet vægttab", "Synkebesvær", "Hoste under måltid (fejlsynkning)"] },
        { label: "Hvornår skal du reagere?", body: "Ved vægttab, dårlig appetit over tid eller synkeproblemer. Kontakt sygeplejerske; overvej ernæringsscreening." },
      ]},
    ],
  },

  {
    id: "hygiejne",
    title: "Hygiejne",
    subtitle: "Bryd smittekæden i hverdagen",
    color: "#0FAE9E", g1: "#2BCBB8", g2: "#0B9488",
    Icon: Droplets,
    cards: [
      { id: "hyg-hand", title: "Håndhygiejne", sections: [
        { label: "Hvornår?", body: ["Før og efter borgerkontakt", "Før rene opgaver og efter urene opgaver", "Efter handsker", "Før/efter måltider og toilet"] },
        { label: "Hvordan?", body: "Hånddesinfektion med sprit på synligt rene hænder — minimum 30 sekunder til hænderne er tørre. Håndvask med vand og sæbe ved synligt snavs eller efter toiletbesøg." },
        { label: "Husk", body: "Korte negle, ingen ringe/ure/smykker og ingen kunstige negle. Sprit alle flader: fingerspidser, tommelfinger og mellem fingrene." },
        { label: "Hvorfor?", body: "Hænder er den hyppigste smittevej. God håndhygiejne er det vigtigste tiltag mod smittespredning." },
      ]},
      { id: "hyg-smittekaede", title: "Smittekæden", sections: [
        { label: "Hvad er det?", body: "En model med 6 led der alle skal være til stede for at smitte spredes: mikroorganisme, smittekilde/reservoir, udgangsport, smittevej, indgangsport og modtagelig vært." },
        { label: "Sådan brydes den", body: "Bryd bare ét led, så stopper smitten. Fx håndhygiejne (smittevej), rengøring (reservoir) eller værnemidler (ind-/udgangsport)." },
        { label: "I praksis", body: "Tænk over hvor smitten kan komme fra, og hvordan den spredes — og sæt ind dér." },
      ]},
      { id: "hyg-vaernemidler", title: "Værnemidler", sections: [
        { label: "Hvad?", body: "Handsker, forklæde/overtrækskittel, maske og evt. øjenværn. Vælges ud fra opgaven og smitterisikoen." },
        { label: "Handsker", body: "Engangs, skiftes mellem opgaver og borgere. Erstatter ikke håndhygiejne." },
        { label: "Rækkefølge", body: ["Tag på: forklæde → maske → øjenværn → handsker", "Tag af: handsker → øjenværn → forklæde → maske", "Hånddesinfektion til sidst"] },
        { label: "Husk", body: "Skift værnemidler mellem ren og uren opgave og mellem borgere." },
      ]},
      { id: "hyg-ren-uren", title: "Ren/uren procedure", sections: [
        { label: "Princip", body: "Arbejd altid fra rent mod urent — aldrig tilbage. Hold rene og urene ting adskilt." },
        { label: "Eksempel", body: "Ved sårpleje og personlig pleje arbejdes fra det reneste område mod det mest urene, så smitte ikke flyttes." },
        { label: "Husk", body: "Skift handsker og udfør håndhygiejne ved overgang fra uren til ren opgave." },
      ]},
      { id: "hyg-isolation", title: "Isolation", sections: [
        { label: "Hvad?", body: "Tiltag der beskytter mod smittespredning ved fx resistente bakterier eller smitsom sygdom." },
        { label: "Typer", body: ["Kontaktsmitte (handsker/forklæde)", "Dråbesmitte (maske)", "Luftsmitte (særlig maske/rum)"] },
        { label: "I praksis", body: "Eget rum/toilet hvis muligt, dedikeret udstyr, ekstra fokus på håndhygiejne og rengøring samt korrekt af-/påklædning af værnemidler. Følg lokal retningslinje." },
      ]},
      { id: "hyg-desinfektion", title: "Desinfektion", sections: [
        { label: "Hvad?", body: "At nedbringe antallet af mikroorganismer på hud, flader eller udstyr." },
        { label: "Hud", body: "Hånddesinfektion med 70–85 % sprit på rene, tørre hænder." },
        { label: "Flader", body: "Rengør først for synligt snavs, derefter desinfektion. Lad det virke (kontakttid) — følg produktets anvisning." },
        { label: "Forskel", body: "Rengøring fjerner snavs; desinfektion dræber/inaktiverer mikroorganismer; sterilisation fjerner alt." },
      ]},
      { id: "hyg-basale", title: "Basale infektionshygiejniske retningslinjer", sections: [
        { label: "Hvad?", body: "Grundreglerne der altid gælder uanset borger og diagnose (de basale forholdsregler)." },
        { label: "Indhold", body: ["Håndhygiejne", "Værnemidler efter behov", "Host-/nyseetikette", "Sikker håndtering af affald, snavsetøj og skarpe genstande", "Rengøring"] },
        { label: "Hvorfor?", body: "Beskytter både borger og personale og forhindrer smittespredning i hverdagen." },
      ]},
    ],
  },

  {
    id: "saarpleje",
    title: "Sårpleje",
    subtitle: "Observation, dokumentation og handling",
    color: "#F2557E", g1: "#FF7E9C", g2: "#E23E6B",
    Icon: Heart,
    cards: [
      { id: "saar-rene", title: "Rene sår", sections: [
        { label: "Hvad ser du?", body: "Et sår uden tegn på infektion. Ren sårrand, lyserødt/rødt væv (granulationsvæv) og evt. let, klar væske." },
        { label: "Hvad dokumenterer du?", body: "Placering, størrelse, udseende, mængde og type væske, sårrand, forbinding og hvornår der er skiftet." },
        { label: "Hvornår kontakter du sygeplejerske/læge?", body: "Ved tegn på infektion (rødme, varme, hævelse, pus, øget smerte, lugt) eller hvis såret ikke heler." },
      ]},
      { id: "saar-inficerede", title: "Inficerede sår", sections: [
        { label: "Hvad ser du?", body: "Rødme omkring såret, varme, hævelse, øget smerte, pus/gul-grøn væske, dårlig lugt og evt. feber." },
        { label: "Hvad dokumenterer du?", body: "Infektionstegn, mængde/farve/lugt af væske, hudens tilstand omkring såret, temperatur og borgerens almentilstand." },
        { label: "Hvornår kontakter du sygeplejerske/læge?", body: "Altid ved mistanke om infektion. Ved feber og påvirket almentilstand: hurtigt." },
      ]},
      { id: "saar-tryksaar", title: "Tryksår", sections: [
        { label: "Hvad ser du?", body: "Hudforandring over knoglefremspring (hæl, hofte, haleben). Fra vedvarende rødme (kategori 1) til åbent sår og dybt vævstab (kategori 2–4)." },
        { label: "Hvad dokumenterer du?", body: "Placering, kategori/dybde, størrelse, hudens farve, om rødmen forsvinder ved tryk, og forebyggende tiltag." },
        { label: "Hvornår kontakter du sygeplejerske/læge?", body: "Ved nyopstået tryksår eller forværring. Forebyggelse med lejring og trykaflastning er afgørende." },
      ]},
      { id: "saar-venoese", title: "Venøse sår", sections: [
        { label: "Hvad ser du?", body: "Typisk på underben/ankel, ofte væskende, med uregelmæssige render, hævede ben og misfarvet hud omkring." },
        { label: "Hvad dokumenterer du?", body: "Placering, størrelse, væske, hudens tilstand, hævelse (ødem) og om der bruges kompression." },
        { label: "Hvornår kontakter du sygeplejerske/læge?", body: "Ved forværring, infektionstegn eller smerter. Kompressionsbehandling skal følges nøje — kontakt ved tvivl." },
      ]},
      { id: "saar-diabetiske", title: "Diabetiske sår", sections: [
        { label: "Hvad ser du?", body: "Ofte under foden/tæer. Kan være dybe og smertefri pga. nedsat følesans. Høj risiko for infektion." },
        { label: "Hvad dokumenterer du?", body: "Placering, dybde, infektionstegn, følesans, fodstatus og blodsukkerkontrol hvis relevant." },
        { label: "Hvornår kontakter du sygeplejerske/læge?", body: "Hurtigt ved alle fodsår hos diabetikere — selv små sår kan blive alvorlige." },
      ]},
      { id: "saar-observation", title: "Observation af sår", sections: [
        { label: "Hvad ser du?", body: "Vurder størrelse, dybde, sårbund (farve), sårrand, væske (mængde/farve/lugt), hud omkring og smerte." },
        { label: "Hvad dokumenterer du?", body: "Alle observationer, ændringer over tid, forbindingstype og borgerens oplevelse. Brug evt. foto efter lokal retningslinje." },
        { label: "Hvornår kontakter du sygeplejerske/læge?", body: "Ved infektionstegn, manglende heling eller forværring." },
      ]},
    ],
  },

  {
    id: "mikrobiologi",
    title: "Bakterier & virus",
    subtitle: "Det vigtigste — enkelt forklaret",
    color: "#7A5AF5", g1: "#9B82FF", g2: "#6743EE",
    Icon: Microscope,
    cards: [
      { id: "mik-bakterier", title: "Hvad er bakterier?", sections: [
        { label: "Forklaring", body: "Bakterier er små levende encellede organismer. De findes overalt — mange er harmløse eller gavnlige (fx i tarmen), men nogle kan gøre os syge." },
        { label: "Vigtigt", body: "Bakterieinfektioner kan ofte behandles med antibiotika. Bakterier kan dele sig hurtigt og spredes via fx hænder og overflader." },
      ]},
      { id: "mik-virus", title: "Hvad er virus?", sections: [
        { label: "Forklaring", body: "Virus er meget mindre end bakterier og kan kun formere sig inde i kroppens celler. De står bag fx forkølelse, influenza og COVID-19." },
        { label: "Vigtigt", body: "Antibiotika virker IKKE mod virus. Kroppens immunforsvar bekæmper typisk virus selv; behandling er ofte lindrende." },
      ]},
      { id: "mik-forskel", title: "Forskellen på bakterier og virus", sections: [
        { label: "Størrelse", body: "Bakterier er større og lever selv. Virus er meget mindre og skal bruge en værtscelle." },
        { label: "Behandling", body: "Bakterier → evt. antibiotika. Virus → antibiotika hjælper ikke." },
        { label: "Fælles", body: "Begge kan smitte og give infektion, og god hygiejne forebygger begge." },
      ]},
      { id: "mik-infektionstegn", title: "Typiske infektionstegn", sections: [
        { label: "Lokalt", body: "Rødme, varme, hævelse, smerte og nedsat funktion i området." },
        { label: "Almene", body: "Feber, træthed, utilpashed, nedsat appetit og evt. forhøjet puls og respiration." },
        { label: "Husk", body: "Hos ældre kan tegnene være utydelige — fx forvirring eller faldtendens kan være eneste tegn på infektion." },
      ]},
      { id: "mik-feber", title: "Feber", sections: [
        { label: "Hvad?", body: "Forhøjet kropstemperatur (over 38 °C), oftest kroppens reaktion på infektion." },
        { label: "Observation", body: "Mål temperatur og vurder almentilstand, væskeindtag og evt. kulderystelser eller klam hud." },
        { label: "Husk", body: "Feber + dårlig almentilstand, åndenød eller forvirring skal tages alvorligt. Sørg for væske og kontakt sygeplejerske ved tvivl." },
      ]},
      { id: "mik-crp", title: "CRP kort forklaret", sections: [
        { label: "Hvad?", body: "CRP (C-reaktivt protein) er et stof i blodet der stiger ved infektion og betændelse. Måles via blodprøve." },
        { label: "Brug", body: "Hjælper med at vurdere om der er en (ofte bakteriel) infektion, og hvor kraftig. Lav CRP taler imod alvorlig bakteriel infektion." },
        { label: "Husk", body: "CRP vurderes altid sammen med symptomer og andre fund — ikke alene." },
      ]},
      { id: "mik-antibiotika", title: "Antibiotika kort forklaret", sections: [
        { label: "Hvad?", body: "Medicin der dræber eller hæmmer bakterier. Virker ikke mod virus." },
        { label: "Vigtigt", body: "Skal tages som ordineret, og kuren skal gøres færdig. Forkert brug kan give resistente bakterier." },
        { label: "Resistens", body: "Når bakterier bliver modstandsdygtige, virker antibiotika dårligere. Derfor bruges antibiotika kun når det er nødvendigt." },
      ]},
      { id: "mik-smitteveje", title: "Smitteveje", sections: [
        { label: "Kontaktsmitte", body: "Via hænder, overflader og udstyr — den hyppigste vej. Brydes med håndhygiejne." },
        { label: "Dråbesmitte", body: "Via dråber fra host/nys over kort afstand. Brydes med afstand og maske." },
        { label: "Luftsmitte", body: "Via meget små partikler der svæver i luften. Kræver særlige tiltag." },
        { label: "Andre", body: "Fækal-oral (mad/hænder) og blodsmitte. God hygiejne forebygger alle." },
      ]},
    ],
  },

  {
    id: "dokumentation",
    title: "Dokumentation",
    subtitle: "Skriv korrekt, relevant og rettidigt",
    color: "#EF9D2B", g1: "#FFBB54", g2: "#E5860F",
    Icon: ClipboardList,
    cards: [
      { id: "dok-hvad", title: "Hvad skal dokumenteres?", sections: [
        { label: "Indhold", body: ["Observationer og ændringer i tilstand", "Udført pleje og behandling", "Borgerens oplevelse", "Aftaler og hvad du har reageret på"] },
        { label: "Princip", body: "Dokumentér det relevante, korrekte og rettidige — så kolleger kan følge forløbet, og borgeren får sikker pleje." },
        { label: "Husk", body: "Skriv objektivt med dato/tid og dit navn/initialer. Det der ikke er dokumenteret, regnes ofte som ikke udført." },
      ]},
      { id: "dok-obj-subj", title: "Objektiv vs. subjektiv dokumentation", sections: [
        { label: "Objektivt", body: "Det du måler og ser. Fx: \u201ETemperatur 38,7 °C. Rød, varm hud på højre læg.\u201C" },
        { label: "Subjektivt", body: "Det borgeren selv fortæller. Fx: \u201EBorger angiver smerter 7/10 i højre ben.\u201C" },
        { label: "Husk", body: "Skriv hvem der har sagt hvad. Undgå at skrive egne tolkninger som var de fakta." },
      ]},
      { id: "dok-eksempel", title: "Eksempel på god dokumentation", sections: [
        { label: "Eksempel", body: "\u201EKl. 09.30: Borger klager over smerter i højre ben (7/10). Obs. rød, varm og hævet læg. Temp. 38,5 °C. Kontaktet sygeplejerske. Afventer vurdering. /AB\u201C" },
        { label: "Hvorfor er den god?", body: "Tidspunkt, objektive + subjektive fund, handling, hvem der er kontaktet, og initialer. Kort, præcis og faktuel." },
      ]},
      { id: "dok-smart", title: "SMART-mål", sections: [
        { label: "Hvad?", body: "En metode til at lave tydelige mål. SMART = Specifikt, Målbart, Attraktivt/accepteret, Realistisk, Tidsbestemt." },
        { label: "Eksempel", body: "\u201EBorger kan gå 50 meter med rollator uden hvil inden 3 uger.\u201C" },
        { label: "Hvorfor?", body: "Gør målet konkret, så indsatsen kan planlægges og evalueres." },
      ]},
      { id: "dok-process", title: "Sygeplejeprocessen", sections: [
        { label: "Dataindsamling", body: "Saml oplysninger om borgeren — observationer, ressourcer og problemer." },
        { label: "Analyse", body: "Vurder hvad data betyder, og identificér problemstillinger og behov." },
        { label: "Mål", body: "Opstil tydelige (gerne SMART) mål sammen med borgeren." },
        { label: "Handling", body: "Planlæg og udfør de konkrete indsatser." },
        { label: "Evaluering", body: "Vurder om målet er nået, og justér om nødvendigt." },
      ]},
      { id: "dok-tavshed", title: "Tavshedspligt", sections: [
        { label: "Hvad?", body: "Du må ikke videregive oplysninger om borgeren til uvedkommende. Gælder også uden for arbejdet og på sociale medier." },
        { label: "I praksis", body: "Tal kun om borgeren med relevante kolleger og kun når det er nødvendigt for plejen. Pas på i offentlige rum." },
        { label: "Husk", body: "Tavshedspligten gælder også efter ansættelsen er ophørt." },
      ]},
      { id: "dok-samtykke", title: "Samtykke", sections: [
        { label: "Hvad?", body: "Borgeren skal som udgangspunkt give tilladelse til pleje, behandling og deling af oplysninger." },
        { label: "I praksis", body: "Informér borgeren, og respektér et nej. Samtykke kan være mundtligt eller skriftligt." },
        { label: "Husk", body: "Borgeren har ret til selvbestemmelse. Ved tvivl om habilitet eller i akutte situationer: følg lokal retningslinje og kontakt ansvarlig." },
      ]},
    ],
  },

  {
    id: "kommunikation",
    title: "Kommunikation",
    subtitle: "Tryg og professionel kontakt",
    color: "#1AA0E6", g1: "#46B8F2", g2: "#0C88D2",
    Icon: MessageCircle,
    cards: [
      { id: "kom-borger", title: "Kommunikation med borger", sections: [
        { label: "Sådan", body: "Tal tydeligt, i øjenhøjde og uden fagsprog. Giv tid, lyt og tjek at borgeren har forstået." },
        { label: "Husk", body: "Respektér borgerens værdighed og selvbestemmelse. Tilpas til hørelse, syn, sprog og kognitiv tilstand." },
      ]},
      { id: "kom-paaroerende", title: "Kommunikation med pårørende", sections: [
        { label: "Sådan", body: "Vær imødekommende og ærlig. Informér inden for rammerne af tavshedspligt og borgerens samtykke." },
        { label: "Husk", body: "Pårørende kan være bekymrede — lyt, anerkend følelser og henvis til rette person ved spørgsmål du ikke må/kan svare på." },
      ]},
      { id: "kom-isbar", title: "ISBAR", sections: [
        { label: "Hvad?", body: "En struktur til sikker mundtlig overlevering — særligt ved kontakt til sygeplejerske/læge." },
        { label: "I-S-B-A-R", body: ["Identifikation: dig + borger", "Situation: hvad er problemet nu", "Baggrund: relevant historik", "Analyse: din vurdering", "Råd: hvad foreslår/ønsker du"] },
        { label: "Hvorfor?", body: "Sikrer at vigtig information gives kort, struktureret og uden at glemme noget." },
      ]},
      { id: "kom-lytning", title: "Aktiv lytning", sections: [
        { label: "Hvad?", body: "At lytte fuldt og vise det — uden at afbryde eller dømme." },
        { label: "Sådan", body: "Øjenkontakt, nik, gentag/opsummer (\u201ESå du oplever…\u201C), still åbne spørgsmål og giv pauser." },
        { label: "Hvorfor?", body: "Skaber tryghed, færre misforståelser og en bedre relation." },
      ]},
      { id: "kom-graenser", title: "Professionelle grænser", sections: [
        { label: "Hvad?", body: "At holde en sund, faglig relation mellem dig og borgeren." },
        { label: "Sådan", body: "Vær venlig men professionel, undgå private relationer og gaver, og hold fokus på borgerens behov — ikke dine egne." },
        { label: "Husk", body: "Grænser beskytter både borger og dig. Ved tvivl: drøft med kolleger eller leder." },
      ]},
      { id: "kom-svaere", title: "Svære samtaler", sections: [
        { label: "Sådan", body: "Find et roligt sted, vær nærværende, tal klart og ærligt, og giv plads til følelser og pauser." },
        { label: "Husk", body: "Du behøver ikke have alle svar. Lyt, anerkend og henvis til rette fagperson. Dokumentér og overlevér det relevante." },
      ]},
    ],
  },

  {
    id: "akut",
    title: "Akut overblik",
    subtitle: "Når det går stærkt — hold hovedet koldt",
    color: "#FB3B43", g1: "#FF6F63", g2: "#ED1C46",
    Icon: Siren,
    cards: [
      { id: "akut-abcde", title: "ABCDE", sections: [
        { label: "Første observation", body: "Systematisk vurdering i rækkefølge: A Airway (luftvej), B Breathing (vejrtrækning), C Circulation (kredsløb), D Disability (bevidsthed), E Exposure (helkrop/temperatur/hud)." },
        { label: "Handling og opfølgning", body: "Vurder ét punkt ad gangen og afhjælp problemer undervejs (frie luftveje, lejring, ilt efter retningslinje). Gå ikke videre før hvert punkt er håndteret." },
        { label: "Hvem kontakter du?", body: "Sygeplejerske/læge straks ved påvirket ABCDE. Ring 1-1-2 ved livstruende tegn." },
        { label: "Hvad dokumenterer du?", body: "Fund ved hvert bogstav, tiltag, tidspunkter og hvem der er kontaktet." },
      ]},
      { id: "akut-fald", title: "Fald", sections: [
        { label: "Første observation", body: "Er borgeren ved bevidsthed? Smerter, synlige skader, hovedslag, kan de bevæge sig? Vurder ABCDE." },
        { label: "Handling og opfølgning", body: "Flyt ikke ved mistanke om alvorlig skade eller nakkeskade. Skab ro, stop evt. blødning, hold borgeren varm og observér." },
        { label: "Hvem kontakter du?", body: "Sygeplejerske. Ring 1-1-2 ved bevidstløshed, mistanke om brud/hovedskade eller kraftig blødning." },
        { label: "Hvad dokumenterer du?", body: "Hvad der skete, fund, evt. hovedslag, smerter, tiltag, kontakt og efterfølgende observationer." },
      ]},
      { id: "akut-feber", title: "Feber", sections: [
        { label: "Første observation", body: "Mål temperatur og vurder ABCDE, almentilstand, væske, hudfarve og bevidsthed." },
        { label: "Handling og opfølgning", body: "Tilbyd væske, sørg for ro og komfort og observér hyppigere. Følg ordineret behandling." },
        { label: "Hvem kontakter du?", body: "Sygeplejerske ved høj feber, dårlig almentilstand, forvirring eller åndenød." },
        { label: "Hvad dokumenterer du?", body: "Temperatur, ledsagesymptomer, væskeindtag, tiltag og kontakt." },
      ]},
      { id: "akut-aandenoed", title: "Åndenød", sections: [
        { label: "Første observation", body: "Respirationsfrekvens, anstrengt vejrtrækning, hudfarve (cyanose), lyde og bevidsthed (ABCDE — A og B)." },
        { label: "Handling og opfølgning", body: "Skab ro, hjælp borgeren op i siddende stilling, løsn stramt tøj og giv ilt efter retningslinje." },
        { label: "Hvem kontakter du?", body: "Sygeplejerske straks. Ring 1-1-2 ved svær åndenød, cyanose eller faldende bevidsthed." },
        { label: "Hvad dokumenterer du?", body: "Respiration, hudfarve, stilling, tiltag, ilt, tidspunkt og kontakt." },
      ]},
      { id: "akut-bryst", title: "Brystsmerter", sections: [
        { label: "Første observation", body: "Hvor og hvordan (trykkende/jagende), udstråling til arm/kæbe, åndenød, klam/bleg hud og kvalme. Vurder ABCDE." },
        { label: "Handling og opfølgning", body: "Skab ro, lad borgeren hvile (ofte siddende), undgå anstrengelse og bliv hos borgeren." },
        { label: "Hvem kontakter du?", body: "Ring 1-1-2 ved mistanke om hjertetilfælde. Kontakt sygeplejerske/læge straks." },
        { label: "Hvad dokumenterer du?", body: "Smertens art, placering og styrke, ledsagesymptomer, tidspunkt, tiltag og kontakt." },
      ]},
      { id: "akut-forvirring", title: "Forvirring", sections: [
        { label: "Første observation", body: "Er forvirringen ny/pludselig? Vurder bevidsthed, orientering, ABCDE, temperatur, væske og blodsukker hvis muligt." },
        { label: "Handling og opfølgning", body: "Skab ro og tryghed, bliv hos borgeren, fjern farer og tilbyd væske. Ny forvirring kan skyldes infektion, dehydrering eller lavt blodsukker." },
        { label: "Hvem kontakter du?", body: "Sygeplejerske ved akut/ny forvirring. Ring 1-1-2 ved faldende bevidsthed." },
        { label: "Hvad dokumenterer du?", body: "Hvornår det startede, ændring fra det normale, mulige årsager, tiltag og kontakt." },
      ]},
      { id: "akut-dehydrering", title: "Mistanke om dehydrering", sections: [
        { label: "Første observation", body: "Tørre slimhinder, tørst, nedsat/mørk urin, træthed, svimmelhed, evt. forvirring og lavt blodtryk." },
        { label: "Handling og opfølgning", body: "Tilbyd væske ofte og i små mængder, registrér væskeindtag og urin, og observér tættere." },
        { label: "Hvem kontakter du?", body: "Sygeplejerske ved tydelige tegn, manglende bedring eller hos svækkede ældre." },
        { label: "Hvad dokumenterer du?", body: "Symptomer, væskeindtag/-skema, urin, tiltag og kontakt." },
      ]},
      { id: "akut-infektion", title: "Mistanke om infektion", sections: [
        { label: "Første observation", body: "Feber, almen utilpashed, lokale tegn (rødme/varme/smerte), åndenød, ændret vandladning og hos ældre evt. forvirring/faldtendens." },
        { label: "Handling og opfølgning", body: "Mål temperatur og øvrige værdier, observér tættere og sørg for væske. Vurder ABCDE." },
        { label: "Hvem kontakter du?", body: "Sygeplejerske. Ved hurtig forværring, åndenød eller påvirket bevidsthed: hurtigt eller 1-1-2." },
        { label: "Hvad dokumenterer du?", body: "Symptomer, temperatur og værdier, mulig infektionskilde, tiltag og kontakt." },
      ]},
    ],
  },

  {
    id: "normalvaerdier",
    title: "Normalværdier",
    subtitle: "Vejledende referenceværdier",
    color: "#1FA971", g1: "#41C98E", g2: "#128A5C",
    Icon: Gauge,
    banner: "Normalværdier er vejledende og skal altid vurderes sammen med borgerens normale niveau, symptomer og lokale retningslinjer.",
    cards: [
      { id: "nv-puls", title: "Puls", sections: [
        { label: "Kort forklaret", body: "Normal hvilepuls hos voksen er ca. 60–100 slag pr. minut." },
        { label: "Hvad skal du observere?", body: "Frekvens, rytme (regelmæssig/uregelmæssig) og fyldighed. Mål i hvile på a. radialis." },
        { label: "Advarselstegn", body: ["Under 50 (bradykardi)", "Over 100 i hvile (takykardi)", "Uregelmæssig puls med symptomer"] },
        { label: "Handling og opfølgning", body: "Sammenhold med borgerens vante værdi. Kontakt sygeplejerske ved afvigelse med symptomer." },
        { label: "Hvad dokumenterer du?", body: "Værdi, måleforhold og evt. afvigelse." },
      ]},
      { id: "nv-bt", title: "Blodtryk", sections: [
        { label: "Kort forklaret", body: "Vejledende normalt voksenblodtryk er ca. 120/80 mmHg." },
        { label: "Hvad skal du observere?", body: "Begge værdier, korrekt manchet, samme arm og i hvile." },
        { label: "Advarselstegn", body: ["Systolisk under 90", "Vedvarende højt (fx >140/90)", "Meget højt >180/110"] },
        { label: "Handling og opfølgning", body: "Gentag målingen, sammenhold med vante værdier og kontakt ved tvivl." },
        { label: "Hvad dokumenterer du?", body: "Værdier, arm/forhold og evt. symptomer." },
      ]},
      { id: "nv-resp", title: "Respiration", sections: [
        { label: "Kort forklaret", body: "Normal voksenfrekvens i hvile er ca. 12–20 pr. minut." },
        { label: "Hvad skal du observere?", body: "Tæl over et helt minut; vurder dybde og besvær." },
        { label: "Advarselstegn", body: ["Under 8 eller over 24", "Anstrengt vejrtrækning", "Cyanose"] },
        { label: "Handling og opfølgning", body: "Skab ro, ilt efter retningslinje og tilkald hjælp ved besvær." },
        { label: "Hvad dokumenterer du?", body: "Frekvens og kvalitet." },
      ]},
      { id: "nv-sat", title: "Saturation", sections: [
        { label: "Kort forklaret", body: "Iltmætning i blodet (SpO₂). Normalt ca. 95–100 %." },
        { label: "Hvad skal du observere?", body: "Mål med pulsoximeter på ren, varm finger uden neglelak." },
        { label: "Advarselstegn", body: ["Under 92 % (eller borgerens grænse)", "Fald sammen med åndenød", "KOL: følg individuel grænse"] },
        { label: "Handling og opfølgning", body: "Tjek målingen, skab ro, ilt efter retningslinje og kontakt ved lav værdi." },
        { label: "Hvad dokumenterer du?", body: "SpO₂, evt. ilttilskud og tiltag." },
      ]},
      { id: "nv-temp", title: "Temperatur", sections: [
        { label: "Kort forklaret", body: "Normal kropstemperatur er ca. 36,5–37,5 °C." },
        { label: "Hvad skal du observere?", body: "Notér målested (øre/pande/rektalt) — værdier varierer lidt." },
        { label: "Advarselstegn", body: ["Over 38 °C (feber)", "Over 40 °C", "Under 35 °C (hypotermi)"] },
        { label: "Handling og opfølgning", body: "Tilbyd væske, observér og kontakt ved høj feber med dårlig tilstand." },
        { label: "Hvad dokumenterer du?", body: "Temperatur og målested." },
      ]},
      { id: "nv-bs", title: "Blodsukker", sections: [
        { label: "Kort forklaret", body: "Vejledende fasteblodsukker er ca. 4–7 mmol/L (varierer). Følg ordineret plan." },
        { label: "Hvad skal du observere?", body: "Mål korrekt; notér om borgeren har spist." },
        { label: "Advarselstegn", body: ["Under 4 (hypoglykæmi)", "Højt vedvarende (fx >15)", "Sved, sløvhed eller forvirring"] },
        { label: "Handling og opfølgning", body: "Følg lokal instruks og ordineret behandlingsplan." },
        { label: "Hvad dokumenterer du?", body: "Værdi, tidspunkt, måltid og tiltag." },
      ]},
      { id: "nv-bmi", title: "BMI", sections: [
        { label: "Kort forklaret", body: "BMI = vægt (kg) / højde² (m). Normalt ca. 18,5–24,9." },
        { label: "Hvad skal du observere?", body: "Vej og mål korrekt; BMI er kun vejledende." },
        { label: "Advarselstegn", body: ["Under 18,5 (undervægt)", "Over 30 (svær overvægt)", "Utilsigtet ændring"] },
        { label: "Handling og opfølgning", body: "Sammenhold med ernæringstilstand; overvej screening ved lavt eller faldende BMI." },
        { label: "Hvad dokumenterer du?", body: "Vægt, højde, BMI og udvikling." },
      ]},
      { id: "nv-vaeske", title: "Væskebehov", sections: [
        { label: "Kort forklaret", body: "Vejledende behov hos voksen er ca. 30 ml/kg/døgn." },
        { label: "Hvad skal du observere?", body: "Tilpas til vægt, feber, varme og tab (sved, diarré)." },
        { label: "Advarselstegn", body: ["Tørst og tørre slimhinder", "Nedsat/mørk urin", "Forvirring eller træthed"] },
        { label: "Handling og opfølgning", body: "Tilbyd væske jævnt over dagen, registrér og kontakt ved tegn på dehydrering." },
        { label: "Hvad dokumenterer du?", body: "Beregnet behov, indtag og afvigelse." },
      ]},
    ],
  },

  {
    id: "love",
    title: "Love & regler",
    subtitle: "Jura i klinisk hverdag",
    color: "#475B8E", g1: "#6275B0", g2: "#374873",
    Icon: Scale,
    cards: [
      { id: "lov-sundhed", title: "Sundhedsloven", sections: [
        { label: "Kort forklaret", body: "Regulerer borgernes adgang til sundhedsydelser og deres rettigheder." },
        { label: "Hvad betyder det i praksis?", body: "Sikrer bl.a. ret til behandling, information og selvbestemmelse." },
        { label: "Eksempel", body: "Borgeren informeres og giver samtykke, før behandling sættes i gang." },
        { label: "Husk", body: "Behandling kræver som udgangspunkt samtykke." },
        { label: "Hvornår spørger du din vejleder?", body: "Ved tvivl om borgerens rettigheder, samtykke eller behandling." },
      ]},
      { id: "lov-service83", title: "Serviceloven §83", sections: [
        { label: "Kort forklaret", body: "Kommunens pligt til personlig og praktisk hjælp samt pleje." },
        { label: "Hvad betyder det i praksis?", body: "Hjælp tildeles ud fra en individuel behovsvurdering (visitation)." },
        { label: "Eksempel", body: "Borger får hjælp til bad, måltider eller rengøring efter visitation." },
        { label: "Husk", body: "Hjælpen skal støtte borgerens egne ressourcer." },
        { label: "Hvornår spørger du din vejleder?", body: "Ved tvivl om hvad borgeren er visiteret til." },
      ]},
      { id: "lov-autorisation", title: "Autorisationsloven", sections: [
        { label: "Kort forklaret", body: "Regulerer autoriserede sundhedspersoners ansvar og virksomhed." },
        { label: "Hvad betyder det i praksis?", body: "Du arbejder inden for dit kompetenceområde og under ansvar." },
        { label: "Eksempel", body: "En opgave uden for dine kompetencer skal delegeres korrekt." },
        { label: "Husk", body: "Du må kun udføre opgaver, du er oplært og delegeret til." },
        { label: "Hvornår spørger du din vejleder?", body: "Hvis du er i tvivl om dine kompetencer eller dit ansvar." },
      ]},
      { id: "lov-samtykke", title: "Samtykke", sections: [
        { label: "Kort forklaret", body: "Borgerens tilladelse til pleje, behandling og deling af oplysninger." },
        { label: "Hvad betyder det i praksis?", body: "Informér, og respektér et nej. Kan være mundtligt eller skriftligt." },
        { label: "Eksempel", body: "Borger siger nej til medicin — det respekteres og dokumenteres." },
        { label: "Husk", body: "Selvbestemmelse gælder; tvang kræver særlige regler." },
        { label: "Hvornår spørger du din vejleder?", body: "Ved nej til nødvendig hjælp eller tvivl om habilitet." },
      ]},
      { id: "lov-tavshed", title: "Tavshedspligt", sections: [
        { label: "Kort forklaret", body: "Pligt til ikke at videregive oplysninger til uvedkommende." },
        { label: "Hvad betyder det i praksis?", body: "Tal kun om borgeren med relevante kolleger og kun ved behov." },
        { label: "Eksempel", body: "Du må ikke fortælle naboen om en borgers sygdom." },
        { label: "Husk", body: "Gælder også uden for arbejdet og efter ansættelsen." },
        { label: "Hvornår spørger du din vejleder?", body: "Ved tvivl om hvad og til hvem du må videregive." },
      ]},
      { id: "lov-magt", title: "Magtanvendelse", sections: [
        { label: "Kort forklaret", body: "Indgreb i selvbestemmelse — kun tilladt efter særlige regler." },
        { label: "Hvad betyder det i praksis?", body: "Kræver hjemmel, dokumentation og indberetning." },
        { label: "Eksempel", body: "Fastholdelse for at undgå skade skal registreres og indberettes." },
        { label: "Husk", body: "Magt er sidste udvej — mindste indgreb i kortest tid." },
        { label: "Hvornår spørger du din vejleder?", body: "ALTID før og efter enhver form for magtanvendelse." },
      ]},
      { id: "lov-uth", title: "Utilsigtede hændelser", sections: [
        { label: "Kort forklaret", body: "Hændelser der skader eller kunne have skadet en borger." },
        { label: "Hvad betyder det i praksis?", body: "Skal rapporteres for at lære og forebygge — ikke for at straffe." },
        { label: "Eksempel", body: "Forkert medicindosis rapporteres som utilsigtet hændelse (UTH)." },
        { label: "Husk", body: "Rapportering er fortrolig og handler om læring." },
        { label: "Hvornår spørger du din vejleder?", body: "Ved tvivl om en hændelse skal rapporteres." },
      ]},
      { id: "lov-delegation", title: "Delegation", sections: [
        { label: "Kort forklaret", body: "Overdragelse af en sundhedsfaglig opgave til en anden." },
        { label: "Hvad betyder det i praksis?", body: "Du må kun udføre opgaver, du er oplært og delegeret til." },
        { label: "Eksempel", body: "Sygeplejerske delegerer medicingivning til dig efter oplæring." },
        { label: "Husk", body: "Ansvaret for korrekt delegation ligger hos den delegerende." },
        { label: "Hvornår spørger du din vejleder?", body: "Hvis en opgave ikke er klart delegeret til dig." },
      ]},
      { id: "lov-patientsikkerhed", title: "Patientsikkerhed", sections: [
        { label: "Kort forklaret", body: "Arbejdet med at forebygge skader i sundhedsvæsenet." },
        { label: "Hvad betyder det i praksis?", body: "Sikker praksis, rapportering og læring af fejl." },
        { label: "Eksempel", body: "Dobbelttjek af medicin øger patientsikkerheden." },
        { label: "Husk", body: "En åben kultur uden skyld fremmer sikkerhed." },
        { label: "Hvornår spørger du din vejleder?", body: "Ved tvivl om sikker praksis eller risiko for skade." },
      ]},
    ],
  },

  {
    id: "diagnoser",
    title: "Diagnoser",
    subtitle: "Hyppige sygdomme kort forklaret",
    color: "#D6336C", g1: "#F25C8E", g2: "#B81E55",
    Icon: Stethoscope,
    cards: [
      { id: "diag-diabetes", title: "Diabetes", sections: [
        { label: "Kort forklaret", body: "Forhøjet blodsukker pga. mangel på eller nedsat virkning af insulin." },
        { label: "Hvad skal du observere?", body: "Blodsukker, kost og symptomer på højt eller lavt blodsukker." },
        { label: "Advarselstegn", body: ["Lavt blodsukker: sved, sløvhed, forvirring", "Meget højt blodsukker", "Fodsår"] },
        { label: "Hvad gør du?", body: "Støt kost og medicin efter plan, observér blodsukker og pas på fødderne." },
        { label: "Hvad dokumenterer du?", body: "Blodsukker, symptomer, kost og tiltag." },
      ]},
      { id: "diag-kol", title: "KOL", sections: [
        { label: "Kort forklaret", body: "Kronisk obstruktiv lungesygdom med vejrtrækningsbesvær." },
        { label: "Hvad skal du observere?", body: "Respiration, saturation (individuel grænse!), hoste og slim." },
        { label: "Advarselstegn", body: ["Forværret åndenød", "Ændret slim/farve", "Lav saturation for borgeren"] },
        { label: "Hvad gør du?", body: "Skab ro, siddende stilling og ilt KUN efter individuel ordination." },
        { label: "Hvad dokumenterer du?", body: "Respiration, saturation, symptomer og tiltag." },
      ]},
      { id: "diag-demens", title: "Demens", sections: [
        { label: "Kort forklaret", body: "Samlebetegnelse for svigtende hukommelse og funktion." },
        { label: "Hvad skal du observere?", body: "Hukommelse, orientering, adfærd og trivsel." },
        { label: "Advarselstegn", body: ["Pludselig forværring (kan være infektion)", "Udadreagerende adfærd"] },
        { label: "Hvad gør du?", body: "Skab ro og struktur, kommunikér enkelt og guid roligt." },
        { label: "Hvad dokumenterer du?", body: "Adfærd, ændringer og trivsel." },
      ]},
      { id: "diag-apopleksi", title: "Apopleksi", sections: [
        { label: "Kort forklaret", body: "Blodprop eller blødning i hjernen (slagtilfælde) — akut!" },
        { label: "Hvad skal du observere?", body: "Pludselige symptomer: ansigt, arm, tale (FAST)." },
        { label: "Advarselstegn", body: ["Pludseligt hængende ansigt", "Lammelse i arm", "Utydelig tale"] },
        { label: "Hvad gør du?", body: "Ring 1-1-2 STRAKS ved mistanke; notér tidspunkt for symptomstart." },
        { label: "Hvad dokumenterer du?", body: "Symptomer, tidspunkt og kontakt." },
      ]},
      { id: "diag-parkinson", title: "Parkinson", sections: [
        { label: "Kort forklaret", body: "Sygdom med rysten, stivhed og langsomme bevægelser." },
        { label: "Hvad skal du observere?", body: "Bevægelse, balance/faldrisiko og medicintidspunkter (vigtige!)." },
        { label: "Advarselstegn", body: ["Øget faldrisiko", "Synkebesvær", "Forværring uden medicin til tiden"] },
        { label: "Hvad gør du?", body: "Giv medicin præcist til tiden, støt mobilitet og forebyg fald." },
        { label: "Hvad dokumenterer du?", body: "Funktion, fald, medicineffekt og tiltag." },
      ]},
      { id: "diag-hjertesvigt", title: "Hjertesvigt", sections: [
        { label: "Kort forklaret", body: "Hjertet pumper ikke effektivt nok." },
        { label: "Hvad skal du observere?", body: "Åndenød, hævede ben (ødem), vægt og træthed." },
        { label: "Advarselstegn", body: ["Tiltagende åndenød", "Hurtig vægtøgning", "Øgede ødemer"] },
        { label: "Hvad gør du?", body: "Observér vægt og ødem, støt hvile/aktivitet og kontakt ved forværring." },
        { label: "Hvad dokumenterer du?", body: "Vægt, ødem, åndenød og tiltag." },
      ]},
      { id: "diag-uvi", title: "UVI", sections: [
        { label: "Kort forklaret", body: "Urinvejsinfektion — hyppig, særligt hos ældre." },
        { label: "Hvad skal du observere?", body: "Svie, hyppig vandladning, uklar/ildelugtende urin; hos ældre forvirring." },
        { label: "Advarselstegn", body: ["Feber", "Forvirring/faldtendens", "Ryg- eller flankesmerter"] },
        { label: "Hvad gør du?", body: "Tilbyd væske, observér og kontakt sygeplejerske; urinprøve efter ordination." },
        { label: "Hvad dokumenterer du?", body: "Symptomer, urin og tiltag." },
      ]},
      { id: "diag-pneumoni", title: "Pneumoni", sections: [
        { label: "Kort forklaret", body: "Lungebetændelse — infektion i lungerne." },
        { label: "Hvad skal du observere?", body: "Hoste, åndenød, feber, saturation og almentilstand." },
        { label: "Advarselstegn", body: ["Åndenød", "Lav saturation", "Forvirring eller dårlig tilstand"] },
        { label: "Hvad gør du?", body: "Observér respiration og saturation, skab ro og kontakt sygeplejerske/læge." },
        { label: "Hvad dokumenterer du?", body: "Respiration, saturation, temperatur og tiltag." },
      ]},
    ],
  },

  {
    id: "ernaering",
    title: "Ernæring & væske",
    subtitle: "Mad, væske og trivsel",
    color: "#0CA5BE", g1: "#2FC5DC", g2: "#0886A0",
    Icon: Utensils,
    cards: [
      { id: "ern-dehydrering", title: "Dehydrering", sections: [
        { label: "Kort forklaret", body: "Væskemangel i kroppen." },
        { label: "Hvad skal du observere?", body: "Tørst, tørre slimhinder, nedsat/mørk urin og træthed." },
        { label: "Advarselstegn", body: ["Forvirring", "Svimmelhed eller lavt blodtryk", "Meget lidt urin"] },
        { label: "Hvad gør du?", body: "Tilbyd væske ofte i små mængder, registrér og kontakt ved tegn." },
        { label: "Hvad dokumenterer du?", body: "Indtag, urin, symptomer og tiltag." },
      ]},
      { id: "ern-underernaering", title: "Underernæring", sections: [
        { label: "Kort forklaret", body: "Utilstrækkeligt indtag af energi og næring." },
        { label: "Hvad skal du observere?", body: "Vægt(tab), appetit, indtag og muskelmasse." },
        { label: "Advarselstegn", body: ["Utilsigtet vægttab", "Lavt indtag over tid", "Træthed og svaghed"] },
        { label: "Hvad gør du?", body: "Tilbyd energirig kost og mellemmåltider; lav ernæringsscreening." },
        { label: "Hvad dokumenterer du?", body: "Vægt, indtag, screening og tiltag." },
      ]},
      { id: "ern-dysfagi", title: "Dysfagi", sections: [
        { label: "Kort forklaret", body: "Synkebesvær med risiko for fejlsynkning." },
        { label: "Hvad skal du observere?", body: "Hoste/harken ved måltid, savl, mad i munden og stemme." },
        { label: "Advarselstegn", body: ["Hoste under måltid", "Fejlsynkning", "Gentagne lungebetændelser"] },
        { label: "Hvad gør du?", body: "Tilpasset konsistens, oprejst stilling og ro ved måltid; kontakt sygeplejerske." },
        { label: "Hvad dokumenterer du?", body: "Synkefunktion, kostform og tiltag." },
      ]},
      { id: "ern-kostformer", title: "Kostformer", sections: [
        { label: "Kort forklaret", body: "Kost tilpasset borgerens behov og funktion." },
        { label: "Hvad skal du observere?", body: "Normalkost, energirig kost, tygge-/synkevenlig kost m.fl." },
        { label: "Advarselstegn", body: ["Forkert konsistens ved dysfagi", "Utilstrækkelig energi"] },
        { label: "Hvad gør du?", body: "Vælg kostform efter behov/ordination og tilpas konsistens." },
        { label: "Hvad dokumenterer du?", body: "Kostform, indtag og evt. ændringer." },
      ]},
      { id: "ern-vaeske", title: "Væskebehov", sections: [
        { label: "Kort forklaret", body: "Vejledende ca. 30 ml/kg/døgn (varierer)." },
        { label: "Hvad skal du observere?", body: "Tilpas til vægt, feber, varme og tab." },
        { label: "Advarselstegn", body: ["Tegn på dehydrering", "Meget lavt indtag"] },
        { label: "Hvad gør du?", body: "Tilbyd væske jævnt og registrér på væskeskema." },
        { label: "Hvad dokumenterer du?", body: "Beregnet behov, indtag og afvigelse." },
      ]},
      { id: "ern-tegn", title: "Tegn på dårlig ernæring", sections: [
        { label: "Kort forklaret", body: "Signaler om at borgeren ikke trives ernæringsmæssigt." },
        { label: "Hvad skal du observere?", body: "Vægttab, nedsat appetit, træthed og dårlig sårheling." },
        { label: "Advarselstegn", body: ["Hurtigt vægttab", "Tab af muskelmasse", "Tryksår der ikke heler"] },
        { label: "Hvad gør du?", body: "Tilbyd tilpasset kost, observér indtag og lav ernæringsscreening." },
        { label: "Hvad dokumenterer du?", body: "Vægt, indtag og fund." },
      ]},
      { id: "ern-screening", title: "Ernæringsscreening", sections: [
        { label: "Kort forklaret", body: "Systematisk vurdering af ernæringsrisiko (fx MNA)." },
        { label: "Hvad skal du observere?", body: "Vægt, BMI, vægttab, indtag og sygdom." },
        { label: "Advarselstegn", body: ["Høj risikoscore", "Utilsigtet vægttab"] },
        { label: "Hvad gør du?", body: "Udfør screening efter lokal retningslinje og lav en handleplan." },
        { label: "Hvad dokumenterer du?", body: "Score, risiko og plan." },
      ]},
      { id: "ern-obstipation", title: "Obstipation", sections: [
        { label: "Observationer", body: "Hvornår borgeren sidst har haft afføring, konsistens (Bristol), mavegener, oppustethed, appetit samt væske-, fiber- og aktivitetsniveau." },
        { label: "Advarselstegn", body: ["Ingen afføring gennem flere dage", "Hård afføring (Bristol 1–2)", "Mavesmerter, kvalme eller oppustet mave"] },
        { label: "Handling og opfølgning", body: "Tilbyd væske, fibre og mobilisering inden for borgerens plan, observér og kontakt ansvarlig ved vedvarende obstipation. Følg lokale retningslinjer." },
        { label: "Dokumentation", body: "Seneste afføring, konsistens, gener, tiltag og kontakt." },
      ]},
    ],
  },

  {
    id: "demens",
    title: "Demens",
    subtitle: "Forståelse og tilgang",
    color: "#A146C9", g1: "#C06FE8", g2: "#8A2FB0",
    Icon: Puzzle,
    cards: [
      { id: "dem-alzheimer", title: "Alzheimer", sections: [
        { label: "Kort forklaret", body: "Hyppigste demensform; snigende hukommelsessvigt." },
        { label: "Hvad skal du observere?", body: "Hukommelse, sprog, orientering og daglige funktioner." },
        { label: "Advarselstegn", body: ["Pludselig forværring (mistænk infektion)", "Vægttab", "Faldrisiko"] },
        { label: "Hvad gør du?", body: "Skab struktur og genkendelighed; kommunikér enkelt og roligt." },
        { label: "Hvad dokumenterer du?", body: "Funktion, adfærd og ændringer." },
      ]},
      { id: "dem-vaskulaer", title: "Vaskulær demens", sections: [
        { label: "Kort forklaret", body: "Demens pga. nedsat blodtilførsel til hjernen." },
        { label: "Hvad skal du observere?", body: "Trinvis forværring, fokale udfald og kredsløbssygdom." },
        { label: "Advarselstegn", body: ["Pludselige ændringer", "Tegn på apopleksi"] },
        { label: "Hvad gør du?", body: "Støt funktion, forebyg fald og observér ved pludselige ændringer." },
        { label: "Hvad dokumenterer du?", body: "Funktion og ændringer." },
      ]},
      { id: "dem-frontotemporal", title: "Frontotemporal demens", sections: [
        { label: "Kort forklaret", body: "Demens med ændret adfærd og personlighed tidligt." },
        { label: "Hvad skal du observere?", body: "Adfærd, hæmningstab, sprog og sociale situationer." },
        { label: "Advarselstegn", body: ["Udadreagerende adfærd", "Manglende sygdomsindsigt"] },
        { label: "Hvad gør du?", body: "Rolig, struktureret tilgang; undgå konfrontation." },
        { label: "Hvad dokumenterer du?", body: "Adfærd og situationer." },
      ]},
      { id: "dem-kommunikation", title: "Kommunikation ved demens", sections: [
        { label: "Kort forklaret", body: "Tilpasset, tryg kommunikation." },
        { label: "Hvad skal du observere?", body: "Forståelse, kropssprog og reaktioner." },
        { label: "Advarselstegn", body: ["For mange valg", "Komplekse beskeder", "Skæld ud eller korrektion"] },
        { label: "Hvad gør du?", body: "Tal enkelt, én besked ad gangen, øjenkontakt, ro og tid." },
        { label: "Hvad dokumenterer du?", body: "Hvad der virker for borgeren." },
      ]},
      { id: "dem-udad", title: "Udadreagerende adfærd", sections: [
        { label: "Kort forklaret", body: "Adfærd der udtrykker et uopfyldt behov eller mistrivsel." },
        { label: "Hvad skal du observere?", body: "Udløsende faktorer (smerte, sult, uro, omgivelser)." },
        { label: "Advarselstegn", body: ["Optrapning", "Risiko for skade på borger eller personale"] },
        { label: "Hvad gør du?", body: "Find årsagen, skab ro, afled, undgå konfrontation og tilkald hjælp." },
        { label: "Hvad dokumenterer du?", body: "Hændelse, mulig årsag og tiltag (evt. UTH)." },
      ]},
      { id: "dem-guidning", title: "Guidning og struktur", sections: [
        { label: "Kort forklaret", body: "Støtte til at klare hverdagen via faste rutiner." },
        { label: "Hvad skal du observere?", body: "Hvad borgeren selv kan, og hvor der er behov for hjælp." },
        { label: "Advarselstegn", body: ["Forvirring ved ændringer", "Mistrivsel uden struktur"] },
        { label: "Hvad gør du?", body: "Guid trin for trin, brug genkendelige rutiner og rolige omgivelser." },
        { label: "Hvad dokumenterer du?", body: "Hvad der støtter borgeren bedst." },
      ]},
      { id: "dem-paaroerende", title: "Pårørende ved demens", sections: [
        { label: "Kort forklaret", body: "Pårørende er ofte vigtige samarbejdspartnere." },
        { label: "Hvad skal du observere?", body: "Deres viden om borgeren, bekymringer og behov." },
        { label: "Advarselstegn", body: ["Overbelastning", "Konflikter", "Sorg over tab af relation"] },
        { label: "Hvad gør du?", body: "Inddrag, lyt, informér inden for tavshedspligt og henvis ved behov." },
        { label: "Hvad dokumenterer du?", body: "Aftaler og relevant viden." },
      ]},
      { id: "dem-delirium", title: "Delirium (akut forvirring)", sections: [
        { label: "Kort forklaret", body: "Delirium er en akut, ofte svingende forvirringstilstand, der opstår over timer til dage — hyppigt udløst af fx infektion, væskemangel, smerter eller medicin." },
        { label: "Hvad observeres?", body: "Pludselig ændring i opmærksomhed og bevidsthed, svingende tilstand over døgnet, uro eller sløvhed og ændret søvn — sammenholdt med borgerens normale niveau." },
        { label: "Advarselstegn", body: ["Akut eller pludselig forvirring", "Svingende bevidsthed over døgnet", "Pludselig ændret adfærd fra det vante"] },
        { label: "Handling og opfølgning", body: "Skab ro og tryghed, bliv hos borgeren, observér tæt og kontakt ansvarlig sygeplejerske. Følg lokale retningslinjer." },
        { label: "Dokumentation", body: "Hvornår det startede, ændring fra normalt, observationer og kontakt." },
      ]},
    ],
  },

  {
    id: "medicin",
    title: "Medicin basics",
    subtitle: "Sikker medicinhåndtering",
    color: "#F2683C", g1: "#FF8A5C", g2: "#DC4E22",
    Icon: Pill,
    cards: [
      { id: "med-5r", title: "De 5 R'er", sections: [
        { label: "Kort forklaret", body: "Sikkerhedstjek før medicingivning." },
        { label: "Hvad skal du observere?", body: "Rigtig borger, rigtige medicin, rigtige dosis, rigtige tidspunkt, rigtige måde." },
        { label: "Advarselstegn", body: ["Tvivl om ét af R'erne", "Uklar ordination"] },
        { label: "Handling og opfølgning", body: "Tjek alle 5 R'er hver gang; ved tvivl — giv ikke, spørg." },
        { label: "Hvad dokumenterer du?", body: "Givet medicin, dosis, tidspunkt og initialer." },
      ]},
      { id: "med-pn", title: "PN medicin", sections: [
        { label: "Kort forklaret", body: "Medicin \u201Epro necessitate\u201C — efter behov." },
        { label: "Hvad skal du observere?", body: "Indikation, maks. dosis pr. døgn og effekt." },
        { label: "Advarselstegn", body: ["Overskridelse af maks.", "Manglende effekt", "Bivirkninger"] },
        { label: "Handling og opfølgning", body: "Giv kun på indikation og inden for ordineret ramme; observér effekt." },
        { label: "Hvad dokumenterer du?", body: "Hvorfor, hvornår, dosis og effekt." },
      ]},
      { id: "med-fejl", title: "Medicinfejl", sections: [
        { label: "Kort forklaret", body: "Fejl i ordination, dispensering eller administration." },
        { label: "Hvad skal du observere?", body: "Afvigelser fra de 5 R'er." },
        { label: "Advarselstegn", body: ["Forkert dosis/borger/tidspunkt", "Glemt eller dobbelt dosis"] },
        { label: "Handling og opfølgning", body: "Stop, vurder borgeren, kontakt sygeplejerske/læge og rapportér som UTH." },
        { label: "Hvad dokumenterer du?", body: "Hvad skete, borgerens tilstand, kontakt og rapportering." },
      ]},
      { id: "med-obs", title: "Observation efter medicin", sections: [
        { label: "Kort forklaret", body: "At følge op på virkning og bivirkning." },
        { label: "Hvad skal du observere?", body: "Ønsket effekt og tegn på bivirkninger." },
        { label: "Advarselstegn", body: ["Manglende effekt", "Allergisk reaktion", "Nye symptomer"] },
        { label: "Handling og opfølgning", body: "Observér efter givning; kontakt ved uventet reaktion." },
        { label: "Hvad dokumenterer du?", body: "Effekt, bivirkninger og tiltag." },
      ]},
      { id: "med-former", title: "Medicinformer", sections: [
        { label: "Kort forklaret", body: "Den måde medicinen gives på." },
        { label: "Hvad skal du observere?", body: "Tablet, kapsel, mikstur, injektion, plaster, suppositorium m.m." },
        { label: "Advarselstegn", body: ["Knusning af tabletter der ikke må knuses", "Forkert form"] },
        { label: "Handling og opfølgning", body: "Giv i ordineret form; tjek om tabletter må deles eller knuses." },
        { label: "Hvad dokumenterer du?", body: "Form, dosis og måde." },
      ]},
      { id: "med-insulin", title: "Insulin basics", sections: [
        { label: "Kort forklaret", body: "Hormon der sænker blodsukkeret. Gives ved diabetes." },
        { label: "Hvad skal du observere?", body: "Blodsukker, tidspunkt ift. måltid og injektionssted (skift!)." },
        { label: "Advarselstegn", body: ["Lavt blodsukker (hypoglykæmi)", "Sprunget måltid efter insulin"] },
        { label: "Handling og opfølgning", body: "Observér blodsukker og borgerens tilstand, dokumentér løbende, og kontakt ansvarlig ved afvigelser. Følg altid gældende delegation, ordination og lokale retningslinjer." },
        { label: "Hvad dokumenterer du?", body: "Blodsukker, dosis, tidspunkt og effekt." },
      ]},
      { id: "med-bivirkninger", title: "Bivirkninger", sections: [
        { label: "Kort forklaret", body: "Uønskede virkninger af medicin." },
        { label: "Hvad skal du observere?", body: "Nye symptomer efter opstart/ændring (fx udslæt, kvalme, sløvhed)." },
        { label: "Advarselstegn", body: ["Allergisk reaktion", "Vejrtrækningsbesvær", "Pludselig forværring"] },
        { label: "Handling og opfølgning", body: "Observér og kontakt sygeplejerske/læge; ring 1-1-2 ved svær reaktion." },
        { label: "Hvad dokumenterer du?", body: "Symptom, tidssammenhæng og tiltag." },
      ]},
      { id: "med-delegation", title: "Delegation af medicin", sections: [
        { label: "Kort forklaret", body: "At få overdraget medicinopgaver fra autoriseret personale." },
        { label: "Hvad skal du observere?", body: "Hvad du er oplært og delegeret til." },
        { label: "Advarselstegn", body: ["Opgave uden for din delegation", "Manglende oplæring"] },
        { label: "Handling og opfølgning", body: "Udfør kun delegerede opgaver; spørg ved tvivl." },
        { label: "Hvad dokumenterer du?", body: "Hvad er givet og af hvem (initialer)." },
      ]},
      { id: "med-opbevaring", title: "Medicinopbevaring", sections: [
        { label: "Original emballage", body: "Opbevar som udgangspunkt medicin i den originale emballage med læsbar mærkat og udløbsdato." },
        { label: "Temperaturkrav", body: "Følg produktets anvisning — fx køleskab (typisk 2–8 °C) for visse præparater som insulin. Undgå direkte varme og sollys." },
        { label: "Sikker opbevaring", body: "Opbevar utilgængeligt for uvedkommende, adskilt pr. borger, og følg lokale retningslinjer for medicinhåndtering." },
      ]},
      { id: "med-antikoag", title: "Antikoagulantia (blodfortyndende)", sections: [
        { label: "Hvad observeres?", body: "Tegn på blødning og blå mærker, og om borgeren har fået stød eller fald. Vær ekstra opmærksom ved sår og procedurer." },
        { label: "Tegn på blødning", body: ["Næseblod eller blødende tandkød", "Blod i urin eller afføring (rød/sort)", "Store eller uforklarlige blå mærker", "Langvarig blødning fra sår"] },
        { label: "Hvornår reageres?", body: "Kontakt ansvarlig sygeplejerske ved tegn på blødning. Ved kraftig blødning eller påvirket tilstand: ring 1-1-2. Følg lokale retningslinjer." },
      ]},
    ],
  },

  {
    id: "psykiatri",
    title: "Psykiatri",
    subtitle: "Psykisk sygdom og støtte",
    color: "#6366F1", g1: "#8488F5", g2: "#4F52D9",
    Icon: Brain,
    cards: [
      { id: "psy-depression", title: "Depression", sections: [
        { label: "Kort forklaret", body: "Vedvarende nedtrykthed og tab af interesse eller energi." },
        { label: "Hvad skal du observere?", body: "Stemningsleje, søvn, appetit, aktivitet og relationer." },
        { label: "Advarselstegn", body: ["Håbløshed", "Tanker om ikke at ville leve", "Stærk tilbagetrækning"] },
        { label: "Hvad gør du?", body: "Vær nærværende og lyttende, støt struktur og kontakt sygeplejerske ved bekymring." },
        { label: "Hvad dokumenterer du?", body: "Observationer, ændringer og kontakt." },
      ]},
      { id: "psy-angst", title: "Angst", sections: [
        { label: "Kort forklaret", body: "Stærk frygt eller uro, ofte med kropslige symptomer." },
        { label: "Hvad skal du observere?", body: "Uro, hjertebanken, vejrtrækning og undgåelsesadfærd." },
        { label: "Advarselstegn", body: ["Panikanfald", "Stærk undgåelse", "Forværring"] },
        { label: "Hvad gør du?", body: "Skab ro og tryghed, bliv hos borgeren og hjælp med rolig vejrtrækning." },
        { label: "Hvad dokumenterer du?", body: "Udløsere, symptomer og tiltag." },
      ]},
      { id: "psy-skizofreni", title: "Skizofreni", sections: [
        { label: "Kort forklaret", body: "Sygdom med bl.a. vrangforestillinger og hallucinationer." },
        { label: "Hvad skal du observere?", body: "Kontakt med virkeligheden, adfærd, medicin og trivsel." },
        { label: "Advarselstegn", body: ["Forværring af symptomer", "Manglende medicin", "Selvskade eller risiko"] },
        { label: "Hvad gør du?", body: "Vær rolig og konkret, modsig ikke vrangforestillinger unødigt og kontakt sygeplejerske." },
        { label: "Hvad dokumenterer du?", body: "Observationer, adfærd og kontakt." },
      ]},
      { id: "psy-bipolar", title: "Bipolar lidelse", sections: [
        { label: "Kort forklaret", body: "Svingninger mellem depression og mani." },
        { label: "Hvad skal du observere?", body: "Stemningsleje, søvn, aktivitetsniveau og medicin." },
        { label: "Advarselstegn", body: ["Manisk adfærd (lidt søvn, høj risiko)", "Dyb depression", "Selvmordstanker"] },
        { label: "Hvad gør du?", body: "Støt struktur og søvn, observér svingninger og kontakt sygeplejerske ved ændringer." },
        { label: "Hvad dokumenterer du?", body: "Stemning, søvn, adfærd og kontakt." },
      ]},
      { id: "psy-selvmord", title: "Selvmordsrisiko", sections: [
        { label: "Kort forklaret", body: "Tegn på at en borger kan være i fare for at skade sig selv." },
        { label: "Hvad skal du observere?", body: "Direkte/indirekte udsagn, håbløshed og tilbagetrækning." },
        { label: "Advarselstegn", body: ["Konkrete udsagn om selvmord", "Pludselig ro efter krise", "Planer"] },
        { label: "Hvad gør du?", body: "Tag det ALTID alvorligt, bliv hos borgeren, lyt og kontakt sygeplejerske/læge straks." },
        { label: "Hvad dokumenterer du?", body: "Hvad blev sagt/observeret, hvornår og hvem der er kontaktet." },
      ]},
      { id: "psy-misbrug", title: "Misbrug", sections: [
        { label: "Kort forklaret", body: "Skadeligt forbrug af fx alkohol eller stoffer." },
        { label: "Hvad skal du observere?", body: "Adfærd, abstinenser, almentilstand og medicininteraktioner." },
        { label: "Advarselstegn", body: ["Abstinenssymptomer", "Påvirket bevidsthed", "Aggression"] },
        { label: "Hvad gør du?", body: "Mød borgeren uden fordømmelse, observér og kontakt sygeplejerske ved abstinenser." },
        { label: "Hvad dokumenterer du?", body: "Observationer og tiltag." },
      ]},
      { id: "psy-konflikt", title: "Konfliktnedtrapning", sections: [
        { label: "Kort forklaret", body: "At dæmpe en optrappet situation roligt og sikkert." },
        { label: "Hvad skal du observere?", body: "Tegn på optrapning, egen sikkerhed og flugtveje." },
        { label: "Advarselstegn", body: ["Trusler eller vold", "Eskalering trods forsøg"] },
        { label: "Hvad gør du?", body: "Hold afstand, tal roligt, lyt, undgå konfrontation og tilkald hjælp." },
        { label: "Hvad dokumenterer du?", body: "Hændelse, tiltag og evt. UTH." },
      ]},
      { id: "psy-konflikttrappen", title: "Konflikttrappen", sections: [
        { label: "Trinvis optrapning af konflikt", body: "Konflikttrappen beskriver, hvordan en konflikt kan optrappe trin for trin — fra uenighed til personangreb og åben fjendtlighed, hvis den ikke håndteres." },
        { label: "Tidlige tegn", body: "Irritation, hævet stemme, anspændt kropssprog, tilbagetrækning eller gentagne klager." },
        { label: "Hvordan konflikter forebygges", body: "Mød borgeren roligt og respektfuldt, lyt aktivt, anerkend følelser og afklar misforståelser tidligt." },
        { label: "Deeskalering", body: "Sænk tempoet, hold afstand og rolig stemme, undgå konfrontation, giv plads og tilkald hjælp ved behov." },
      ]},
    ],
  },

  {
    id: "vaerktoejer",
    title: "Kliniske værktøjer",
    subtitle: "Scorer, skabeloner og tjeklister",
    color: "#0E9488", g1: "#22B8A8", g2: "#0A7A70",
    Icon: Calculator,
    cards: [
      { id: "vt-bmi", title: "BMI beregner", sections: [
        { label: "Formål", body: "Vurdere vægt ift. højde (under-/overvægt)." },
        { label: "Sådan bruges det", body: "BMI = vægt (kg) / højde² (m). Normalt ca. 18,5–24,9." },
        { label: "Vigtige observationer", body: "BMI alene siger ikke alt — se på vægtudvikling og trivsel." },
        { label: "Hvornår skal du reagere?", body: "Ved BMI under 18,5 eller utilsigtet vægttab: overvej screening." },
        { label: "Dokumentation", body: "Vægt, højde, BMI og udvikling." },
      ]},
      { id: "vt-vaeske", title: "Væskebehov beregner", sections: [
        { label: "Formål", body: "Estimere borgerens daglige væskebehov." },
        { label: "Sådan bruges det", body: "Ca. 30 ml/kg/døgn; tilpas ved feber, varme og tab." },
        { label: "Vigtige observationer", body: "Tegn på dehydrering trods 'nok' beregnet væske." },
        { label: "Hvornår skal du reagere?", body: "Ved lavt indtag eller tegn på dehydrering: registrér og kontakt sygeplejerske." },
        { label: "Dokumentation", body: "Beregnet behov, indtag og afvigelse." },
      ]},
      { id: "vt-news2", title: "NEWS2 oversigt", sections: [
        { label: "Formål", body: "Score til tidlig opsporing af forværring (Early Warning Score)." },
        { label: "Sådan bruges det", body: "Pointgiver på respiration, saturation, BT, puls, bevidsthed og temperatur." },
        { label: "Vigtige observationer", body: "Stigende score = stigende risiko." },
        { label: "Hvornår skal du reagere?", body: "Ved forhøjet eller stigende score: kontakt efter lokal optrapningsplan." },
        { label: "Dokumentation", body: "Værdier, samlet score og handling." },
      ]},
      { id: "vt-braden", title: "Braden Score oversigt", sections: [
        { label: "Formål", body: "Vurdere risiko for tryksår." },
        { label: "Sådan bruges det", body: "Vurderer bl.a. mobilitet, fugt, ernæring og friktion." },
        { label: "Vigtige observationer", body: "Lav score = høj risiko for tryksår." },
        { label: "Hvornår skal du reagere?", body: "Ved risiko: iværksæt forebyggelse (lejring, trykaflastning)." },
        { label: "Dokumentation", body: "Score og forebyggende tiltag." },
      ]},
      { id: "vt-mna", title: "MNA ernæringsscreening", sections: [
        { label: "Formål", body: "Screene ældre for ernæringsrisiko (Mini Nutritional Assessment)." },
        { label: "Sådan bruges det", body: "Vurderer vægt, BMI, appetit og indtag." },
        { label: "Vigtige observationer", body: "Lav score = risiko for underernæring." },
        { label: "Hvornår skal du reagere?", body: "Ved risiko: lav ernæringshandleplan og følg op." },
        { label: "Dokumentation", body: "Score, risiko og plan." },
      ]},
      { id: "vt-isbar", title: "ISBAR skabelon", sections: [
        { label: "Formål", body: "Struktur til sikker mundtlig overlevering." },
        { label: "Sådan bruges det", body: "Identifikation – Situation – Baggrund – Analyse – Råd." },
        { label: "Vigtige observationer", body: "Husk dit konkrete forslag eller ønske (R)." },
        { label: "Hvornår skal du reagere?", body: "Brug ved kontakt til sygeplejerske/læge — især ved forværring." },
        { label: "Dokumentation", body: "Hvad du meldte og hvad der blev aftalt." },
      ]},
      { id: "vt-abcde", title: "ABCDE tjekliste", sections: [
        { label: "Formål", body: "Systematisk akut-vurdering." },
        { label: "Sådan bruges det", body: "A luftvej · B vejrtrækning · C kredsløb · D bevidsthed · E helkrop." },
        { label: "Vigtige observationer", body: "Afhjælp problemer undervejs, før du går videre." },
        { label: "Hvornår skal du reagere?", body: "Ved påvirket ABCDE: tilkald hjælp; 1-1-2 ved livsfare." },
        { label: "Dokumentation", body: "Fund ved hvert trin, tiltag og tidspunkter." },
      ]},
      { id: "vt-tobs", title: "TOBS", sections: [
        { label: "Hvad er TOBS?", body: "TOBS (Tidlig Opsporing af Begyndende Sygdom) er et redskab til systematisk at opdage forværring hos borgeren tidligt." },
        { label: "Formål", body: "At fange ændringer i vitale værdier og almentilstand, før borgeren bliver alvorligt syg." },
        { label: "Hvad observeres?", body: "Vitale værdier som respiration, saturation, puls, blodtryk, temperatur og bevidsthed — sammenholdt med borgerens normale niveau." },
        { label: "Husk", body: "Følg lokal TOBS-/optrapningsplan og kontakt ansvarlig ved afvigelser." },
      ]},
      { id: "vt-avpu", title: "AVPU", sections: [
        { label: "Alert", body: "Borgeren er vågen, opmærksom og reagerer spontant." },
        { label: "Voice", body: "Borgeren reagerer kun på tiltale (stemme)." },
        { label: "Pain", body: "Borgeren reagerer kun på smertestimulus." },
        { label: "Unresponsive", body: "Borgeren reagerer ikke på tiltale eller smerte — reagér straks og tilkald hjælp." },
      ]},
      { id: "vt-vasnrs", title: "VAS/NRS", sections: [
        { label: "Smerteskala 0-10", body: "VAS/NRS er en skala fra 0 (ingen smerter) til 10 (værst tænkelige smerter)." },
        { label: "Hvordan bruges den?", body: "Bed borgeren angive sin smerte på skalaen; gentag vurderingen for at følge udvikling og effekt af tiltag, og dokumentér værdien." },
      ]},
      { id: "vt-bristol", title: "Bristol Skala", sections: [
        { label: "Kort forklaring af type 1-7", body: "Bristol-skalaen beskriver afføringens konsistens i 7 typer — fra type 1 (hårde klumper) til type 7 (helt flydende)." },
        { label: "Type 3-4 typisk normal", body: "Type 3–4 (pølseformet og blød) regnes typisk som normal. Type 1–2 tyder på forstoppelse, type 6–7 på diarré." },
      ]},
    ],
  },
];

/* curated "most used" tools (card ids) */
const TOOLS = ["akut-abcde", "kom-isbar", "hyg-hand", "obs-respiration", "saar-tryksaar", "mik-crp"];

/* lookups */
const CARD_INDEX = {};
DATA.forEach((cat) => cat.cards.forEach((card) => { CARD_INDEX[card.id] = { card, cat }; }));

const ALL_CARDS = DATA.flatMap((cat) =>
  cat.cards.map((card) => ({
    card, cat,
    search: (card.title + " " + cat.title + " " +
      card.sections.map((s) => s.label + " " + (Array.isArray(s.body) ? s.body.join(" ") : s.body)).join(" ")).toLowerCase(),
  }))
);

/* ============================ AKUT HJÆLP ============================ *
 *  Central emergency dataset. All phone numbers live here — never inside
 *  UI components. Every entry carries verification fields so a
 *  "Senest kontrolleret" status can be shown later. Region-specific and
 *  future local services are supported by design (see LOCAL_SERVICE_FIELDS).
 * =================================================================== */

const EMERGENCY_REGIONS = [
  { id: "hovedstaden", name: "Region Hovedstaden" },
  { id: "sjaelland", name: "Region Sjælland" },
  { id: "syddanmark", name: "Region Syddanmark" },
  { id: "midtjylland", name: "Region Midtjylland" },
  { id: "nordjylland", name: "Region Nordjylland" },
];

const EMERGENCY_SERVICES = [
  { id: "alarm-112", name: "Alarmcentralen", category: "emergency", phone: "112", region: "national", availability: "Døgnåbent", description: "Ambulance, politi og brandvæsen ved livsfare.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
  { id: "politi-114", name: "Politi – ikke akut", category: "police", phone: "114", region: "national", availability: "Døgnåbent", description: "Kontakt politiet ved ikke-akutte henvendelser.", emergencyFallback: "112", sourceName: "Politi", sourceUrl: "", lastVerified: "", verified: false },
  { id: "giftlinjen", name: "Giftlinjen", category: "poison", phone: "82 12 12 12", region: "national", availability: "Døgnåbent", description: "Rådgivning ved mulig forgiftning.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
  { id: "offerraadgivningen", name: "Offerrådgivningen", category: "victim-support", phone: "116 006", region: "national", availability: "", description: "Hjælp og rådgivning til ofre og vidner efter kriminalitet eller ulykke.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
  { id: "acute-hovedstaden", name: "Akuttelefonen 1813", category: "acute-medical", phone: "1813", region: "hovedstaden", availability: "Døgnåbent", description: "Akut, ikke-livstruende lægehjælp i Region Hovedstaden.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
  { id: "acute-sjaelland", name: "Lægevagten / Akuttelefonen", category: "acute-medical", phone: "1818", region: "sjaelland", availability: "", description: "Akut, ikke-livstruende lægehjælp i Region Sjælland.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
  { id: "acute-syddanmark", name: "Lægevagten", category: "acute-medical", phone: "70 11 07 07", region: "syddanmark", availability: "", description: "Akut, ikke-livstruende lægehjælp i Region Syddanmark.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
  { id: "acute-midtjylland", name: "Lægevagten", category: "acute-medical", phone: "70 11 31 31", region: "midtjylland", availability: "", description: "Akut, ikke-livstruende lægehjælp i Region Midtjylland.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
  { id: "acute-nordjylland", name: "Lægevagten", category: "acute-medical", phone: "70 15 03 00", region: "nordjylland", availability: "", description: "Akut, ikke-livstruende lægehjælp i Region Nordjylland.", emergencyFallback: "112", sourceName: "", sourceUrl: "", lastVerified: "", verified: false },
];

/* Reserved fields for future *verified* local services (not yet populated). */
const LOCAL_SERVICE_FIELDS = ["municipality", "region", "address", "latitude", "longitude", "openingHours", "phone", "website", "requiresReferral", "callBeforeArrival"];
/* Future local categories awaiting verified data: psychiatric ER, sexual-assault
   centres, dental vagt, pharmacies/duty pharmacies, hospitals, municipal acute,
   child emergency services. Architecture ready — intentionally left empty. */
const LOCAL_SERVICES = [];

const svcById = (id) => EMERGENCY_SERVICES.find((s) => s.id === id);
const acuteFor = (regionId) => EMERGENCY_SERVICES.find((s) => s.category === "acute-medical" && s.region === regionId);

const EMERGENCY_CATEGORIES = [
  { id: "sygdom", name: "Akut sygdom eller skade", desc: "Jeg har brug for akut lægehjælp, men situationen er ikke livstruende.", Icon: Stethoscope, kind: "regional" },
  { id: "forgiftning", name: "Forgiftning", desc: "Medicin, kemikalier, planter, svampe, rusmidler eller anden mulig forgiftning.", Icon: Droplets, serviceId: "giftlinjen" },
  { id: "politi", name: "Politi – ikke akut", desc: "Tyveri, hærværk, anmeldelse eller anden politihenvendelse uden akut fare.", Icon: ShieldCheck, serviceId: "politi-114" },
  { id: "psykiatri", name: "Psykiatrisk akut hjælp", desc: "Akut psykisk krise eller behov for psykiatrisk hjælp.", Icon: Brain, kind: "regional", note: "Ved akut psykisk krise kan du kontakte den regionale akuttelefon/lægevagt nedenfor. Dedikerede psykiatriske akuttilbud tilføjes, når data er bekræftet." },
  { id: "overgreb", name: "Seksuelt overgreb", desc: "Hjælp efter voldtægt eller andet seksuelt overgreb.", Icon: Heart, kind: "pending", note: "Centre for voldtægtsofre og lokale tilbud tilføjes, når data er bekræftet. Ved akut behov: kontakt den regionale lægevagt eller ring 112." },
  { id: "tandlaege", name: "Akut tandlæge", desc: "Akut tandpine, tandskade eller behov for tandlægevagt.", Icon: Plus, kind: "pending", note: "Tandlægevagten varierer efter region og tidspunkt. Lokale numre tilføjes, når data er bekræftet." },
  { id: "apotek", name: "Akut medicin / apotek", desc: "Find nærmeste åbne apotek, vagtapotek eller døgnapotek.", Icon: Pill, kind: "pending", note: "Vagt- og døgnapoteker er lokale. Verificerede numre og adresser tilføjes senere." },
  { id: "offer", name: "Offer eller vidne", desc: "Hjælp efter kriminalitet, ulykke eller anden alvorlig hændelse.", Icon: MessageCircle, serviceId: "offerraadgivningen" },
];

/* --------------------- AKUT TELEFONBOG (central) ------------------ *
 *  Single source of truth for the phone book. Every entry carries the
 *  same verification fields; pending: true marks entries that still
 *  need verified local data (not shown as trusted, no number invented).
 * =================================================================== */

const PB_CATS = [
  { id: "politi", label: "Politi og beredskab", Icon: ShieldCheck },
  { id: "laege", label: "Sundhed og akut lægehjælp", Icon: Stethoscope },
  { id: "gift", label: "Forgiftning", Icon: Droplets },
  { id: "psyk", label: "Psykiatrisk akut hjælp", Icon: Brain },
  { id: "tand", label: "Tandlægevagt", Icon: Plus },
  { id: "overgreb", label: "Seksuelle overgreb", Icon: Heart },
  { id: "apotek", label: "Apotek og akut medicin", Icon: Pill },
  { id: "offer", label: "Offer- og krisehjælp", Icon: MessageCircle },
  { id: "andre", label: "Andre vigtige numre", Icon: Info },
];

const PB_BLANK = { municipality: "", website: "", sourceName: "", sourceUrl: "", lastVerified: "", verified: false };

const PHONEBOOK = [
  { ...PB_BLANK, id: "pb-112", name: "Alarmcentralen", phone: "112", category: "politi", shortDescription: "Livsfare, ambulance, brand eller akut politi.", region: "national", openingHours: "Døgnåbent", keywords: "alarm ambulance brand politi livsfare beredskab", core: true, callLabel: "Ring 112" },
  { ...PB_BLANK, id: "pb-114", name: "Politi – ikke akut", phone: "114", category: "politi", shortDescription: "Ikke-akutte henvendelser til politiet.", region: "national", openingHours: "Døgnåbent", keywords: "politi anmeldelse tyveri hærværk", sourceName: "Politi", core: true, callLabel: "Ring 114" },
  { ...PB_BLANK, id: "pb-gift", name: "Giftlinjen", phone: "82 12 12 12", category: "gift", shortDescription: "Rådgivning ved mistanke om forgiftning.", region: "national", openingHours: "Døgnåbent", keywords: "gift forgiftning kemikalier planter svampe medicin rusmidler", core: true, callLabel: "Ring Giftlinjen" },
  { ...PB_BLANK, id: "pb-offer", name: "Offerrådgivningen", phone: "116 006", category: "offer", shortDescription: "Hjælp til ofre, vidner og pårørende.", region: "national", openingHours: "", keywords: "offer vidne pårørende krise kriminalitet rådgivning", core: true, callLabel: "Ring 116 006" },

  { ...PB_BLANK, id: "pb-acute-hovedstaden", name: "Region Hovedstaden – Akuttelefonen 1813", phone: "1813", category: "laege", shortDescription: "Akut, ikke-livstruende lægehjælp.", region: "hovedstaden", openingHours: "Døgnåbent", keywords: "lægevagt akuttelefon hovedstaden", core: true },
  { ...PB_BLANK, id: "pb-acute-sjaelland", name: "Region Sjælland – Lægevagten", phone: "1818", category: "laege", shortDescription: "Akut, ikke-livstruende lægehjælp.", region: "sjaelland", openingHours: "", keywords: "lægevagt akuttelefon sjælland", core: true },
  { ...PB_BLANK, id: "pb-acute-syddanmark", name: "Region Syddanmark – Lægevagten", phone: "70 11 07 07", category: "laege", shortDescription: "Akut, ikke-livstruende lægehjælp.", region: "syddanmark", openingHours: "", keywords: "lægevagt syddanmark fyn", core: true },
  { ...PB_BLANK, id: "pb-acute-midtjylland", name: "Region Midtjylland – Lægevagten", phone: "70 11 31 31", category: "laege", shortDescription: "Akut, ikke-livstruende lægehjælp.", region: "midtjylland", openingHours: "", keywords: "lægevagt midtjylland", core: true },
  { ...PB_BLANK, id: "pb-acute-nordjylland", name: "Region Nordjylland – Lægevagten", phone: "70 15 03 00", category: "laege", shortDescription: "Akut, ikke-livstruende lægehjælp.", region: "nordjylland", openingHours: "", keywords: "lægevagt nordjylland", core: true },

  { ...PB_BLANK, id: "pb-psyk", name: "Psykiatrisk akuthjælp", phone: "", category: "psyk", shortDescription: "Ved akut psykisk krise: kontakt den regionale lægevagt/akuttelefon ovenfor, eller ring 112. Dedikerede psykiatriske numre tilføjes, når data er bekræftet.", region: "national", pending: true, keywords: "psykiatri psykisk krise selvmord angst" },
  { ...PB_BLANK, id: "pb-tand", name: "Tandlægevagt", phone: "", category: "tand", shortDescription: "Tandlægevagten er lokal og varierer efter region og tidspunkt. Verificerede numre tilføjes senere.", region: "national", pending: true, keywords: "tandlæge tandpine tandskade tandlægevagt" },
  { ...PB_BLANK, id: "pb-overgreb", name: "Center for voldtægtsofre", phone: "", category: "overgreb", shortDescription: "Lokale centre for voldtægtsofre tilføjes, når data er bekræftet. Ved akut behov: ring 112 eller kontakt lægevagten.", region: "national", pending: true, keywords: "voldtægt seksuelt overgreb center krisehjælp" },
  { ...PB_BLANK, id: "pb-apotek", name: "Vagtapotek / døgnapotek", phone: "", category: "apotek", shortDescription: "Vagt- og døgnapoteker er lokale. Verificerede numre og adresser tilføjes senere.", region: "national", pending: true, keywords: "apotek vagtapotek døgnapotek medicin" },
];

const PB_VIGTIGSTE = ["pb-112", "pb-114", "pb-gift", "pb-offer"];
const pbById = (id) => PHONEBOOK.find((e) => e.id === id);
const pbCatIcon = (catId) => (PB_CATS.find((c) => c.id === catId) || {}).Icon || Info;
const pbText = (e) => {
  const cat = PB_CATS.find((c) => c.id === e.category);
  const reg = e.region && e.region !== "national" ? (EMERGENCY_REGIONS.find((r) => r.id === e.region) || {}).name || "" : "";
  return (e.name + " " + (cat ? cat.label : "") + " " + e.phone + " " + e.phone.replace(/\s+/g, "") + " " + reg + " " + (e.keywords || "")).toLowerCase();
};

/* ===================== PLEJEPROCEDURER + FAGLIGT SPROG ===================== *
 *  General faglig vejledning. Følg altid borgerens plan, delegation,
 *  ordination og arbejdsstedets lokale instrukser. Indholdet er ikke
 *  lægemiddel-/udstyrsspecifikt og erstatter ikke lokal oplæring.
 * =========================================================================== */

const PLEJE_GENERAL_NOTE = "Dette er generel faglig vejledning. Følg altid borgerens aktuelle plan, delegation, ordination og arbejdsstedets lokale instrukser.";

const PLEJE_PROCS = [
  {
    id: "p-injektioner", title: "Injektioner", desc: "Subkutan, intramuskulær, intravenøs og intradermal injektion — SC, IM, IV, ID. Faglig undervisning, illustrationer, tjekliste og quiz.", Icon: Plus,
    ord: ["t-observation", "t-dokumentation"],
    localNote: "Følg altid lokal instruks, produktresumé og din delegation.",
  },
  {
    id: "p-kateter", title: "Kateterpleje", desc: "Hygiejne, observation og sikker håndtering af kateter.", Icon: Droplets,
    formaal: ["Vedligeholde hygiejne omkring kateteret.", "Nedsætte risiko for komplikationer og infektion.", "Observere kateter, urin og borgerens tilstand."],
    brug: ["Engangshandsker", "Vaskeklude og vand (efter lokal instruks)", "Håndklæde", "Affaldspose"],
    foer: ["Informér borgeren, og indhent samtykke.", "Skab privatliv.", "Inddrag borgerens ressourcer.", "Udfør håndhygiejne.", "Tjek borgerens plan og lokal instruks for kateterpleje."],
    trin: ["Udfør håndhygiejne, og tag handsker på.", "Udfør nedre/intim hygiejne omkring kateteret.", "Arbejd fra rent mod urent, og vask forsigtigt.", "Undgå at trække i kateteret.", "Undgå unødvendig manipulation af kateteret.", "Tjek slangen, og undgå knæk.", "Placér urinposen lavere end blæren, så urin ikke løber tilbage.", "Undgå unødvendig åbning af det lukkede drænagesystem.", "Afslut med håndhygiejne, og hjælp borgeren til rette."],
    hygiejne: ["Håndhygiejne før og efter.", "Handsker ved kontakt med urin/sekret.", "Arbejd fra rent mod urent for at undgå krydskontaminering.", "Hold det lukkede system lukket."],
    observer: ["Urinens farve", "Klarhed", "Lugt", "Sediment (hvis relevant)", "Mængde (hvis relevant)", "Lækage ved kateteret", "Smerte", "Rødme", "Hævelse", "Feber/almen forværring (hvis relevant)"],
    stop: ["Ingen urin i posen trods væskeindtag", "Blod i urinen", "Stærk smerte, feber eller påvirket almentilstand", "Tegn på infektion omkring kateteret"],
    dokText: "Dokumentér objektivt hvad du har observeret — ikke hvad du tror.",
    dokHverdag: "Urinen så lidt underlig ud.", dokFaglig: "Urin fremstår uklar med kraftig lugt. Ingen synlig lækage. Borger angiver ingen smerte.",
    begrundelse: "Et lukket, korrekt placeret drænagesystem og god hygiejne nedsætter risikoen for urinvejsinfektion og komplikationer.",
    ord: ["t-diurese", "t-urin", "t-sediment", "t-hudintegritet", "t-observation", "t-habitualtilstand"],
    localNote: "Følg altid arbejdsstedets lokale instruks for kateterpleje.",
  },
  {
    id: "p-oejendraaber", title: "Øjendråber", desc: "Sikker administration af øjendråber.", Icon: Plus,
    formaal: ["Give øjendråber korrekt og sikkert.", "Sikre rigtig dosis i rigtigt øje."],
    brug: ["Den ordinerede øjendråbe", "Renseserviet/vat (hvis relevant)", "Handsker (hvis relevant)"],
    foer: ["Tjek ordination: rigtig borger, rigtigt præparat, rigtigt øje, rigtig dosis, rigtigt tidspunkt.", "Informér borgeren.", "Udfør håndhygiejne.", "Bring borgeren i god stilling med hovedet let bagover."],
    trin: ["Bed borgeren se opad.", "Træk forsigtigt det nederste øjenlåg lidt ned.", "Dryp den ordinerede dosis i lommen mellem øjet og øjenlåget.", "Undgå at røre øjet eller øjenvipperne med flaskespidsen.", "Bed borgeren lukke øjet blidt bagefter.", "Tør evt. overskydende væske væk.", "Udfør håndhygiejne."],
    hygiejne: ["Håndhygiejne før og efter.", "Flaskespidsen må ikke røre øje, vipper eller hud.", "Én flaske pr. borger efter lokal instruks."],
    observer: ["Om dråben kom i øjet", "Rødme eller irritation", "Svie eller ubehag", "Borgerens reaktion"],
    stop: ["Kraftig rødme, smerte eller synsændring", "Tvivl om præparat, øje, dosis eller ordination"],
    dokText: "Dokumentér givet dråbe, øje og tidspunkt.",
    dokHverdag: "Gav dråber i øjet.", dokFaglig: "Givet 1 dråbe i højre øje kl. 08.00 efter ordination. Ingen synlig irritation.",
    begrundelse: "Korrekt teknik sikrer virkning og forebygger skade samt forurening af flasken.",
    ord: ["t-observation", "t-dokumentation"],
    localNote: "Ved tvivl om præparat, øje, dosis eller ordination: stop og afklar før administration. Lægemiddelspecifik instruks har altid forrang.",
  },
  {
    id: "p-medicin", title: "Medicinadministration", desc: "Sikker medicingivning — kontrol, observation og dokumentation.", Icon: Pill,
    formaal: ["Give medicin sikkert og korrekt.", "Observere virkning og bivirkning.", "Dokumentere korrekt."],
    brug: ["Ordination/medicinkort", "Det ordinerede lægemiddel", "Vand/administrationsremedier (efter behov)", "Handsker (hvis relevant)"],
    foer: ["Tjek ordination.", "Bekræft borgerens identitet.", "Tjek lægemiddel, dosis, administrationsvej og tidspunkt.", "Tjek relevante allergier/oplysninger, hvis tilgængelige."],
    trin: ["Observér borgeren under administrationen.", "Giv medicinen efter instruktion og korrekt administrationsvej.", "Gæt aldrig — stop, hvis noget ikke stemmer.", "Observér borgeren efter administration.", "Vær opmærksom på virkning og evt. bivirkninger.", "Dokumentér givet medicin, dosis, tidspunkt og initialer."],
    hygiejne: ["Håndhygiejne før og efter.", "Handsker hvor relevant."],
    observer: ["Borgerens tilstand under og efter", "Ønsket virkning (hvor relevant)", "Tegn på bivirkning", "Nye symptomer"],
    stop: ["Tvivl om præparat, dosis, ordination, borger eller administrationsmåde", "Uventet reaktion eller forværring"],
    dokText: "Dokumentér givet medicin, dosis, tidspunkt og dine initialer.",
    dokHverdag: "Gav pillerne.", dokFaglig: "Givet tablet efter ordination kl. 08.00. Borger tog medicinen uden problemer. /XX",
    begrundelse: "De rigtige kontroller (borger, lægemiddel, dosis, tidspunkt, administrationsvej, dokumentation) forebygger medicinfejl.",
    ord: ["t-observation", "t-dokumentation", "t-aendring"],
    medicinsikkerhed: ["Rigtig borger", "Rigtigt lægemiddel", "Rigtig dosis", "Rigtigt tidspunkt", "Rigtig administrationsvej", "Relevant dokumentation"],
    stopStrong: "Er du i tvivl om præparat, dosis, ordination, borger eller administrationsmåde, skal du ikke gætte. Stop og kontakt den relevante ansvarlige fagperson.",
    delegationNote: "Du skal kende din kompetence og den delegation/instruks, du arbejder efter.",
    localNote: "Dette erstatter ikke arbejdsstedets lokale medicininstruks.",
  },
  {
    id: "p-nedre", title: "Nedre hygiejne", desc: "Ren og tør hud med respekt for værdighed.", Icon: Droplets,
    formaal: ["Sikre ren og tør hud i intimområdet.", "Bevare værdighed og forebygge hudproblemer."],
    brug: ["Handsker", "Vaskeklude", "Vand og evt. mild sæbe (efter lokal instruks)", "Håndklæde", "Rene kontinensprodukter (hvis relevant)", "Affaldspose"],
    foer: ["Informér borgeren, og indhent samtykke.", "Skab privatliv, og bevar værdighed.", "Inddrag borgerens ressourcer.", "Udfør håndhygiejne, og tag handsker på."],
    trin: ["Arbejd fra rent mod urent.", "Vask forsigtigt, og skift klud/kontaktflade løbende.", "Tør huden omhyggeligt, også i hudfolder.", "Skift kontinensprodukt, hvis relevant.", "Hjælp borgeren til rette.", "Afslut med håndhygiejne."],
    hygiejne: ["Håndhygiejne før og efter.", "Handsker under plejen.", "Fra rent mod urent for at undgå krydskontaminering.", "Skift klud/flade, så snavs ikke flyttes."],
    observer: ["Rødme", "Fugt", "Sår", "Hudskade", "Svampelignende forandringer", "Sekret", "Lugt", "Smerte", "Tryksår", "Ændring fra habitualtilstand"],
    stop: ["Nyopståede sår eller hudskade", "Tegn på tryksår", "Kraftig rødme, sekret eller smerte"],
    dokText: "Dokumentér objektive hudobservationer.",
    dokHverdag: "Huden så lidt rød ud.", dokFaglig: "Huden fremstår rød i lyskefolden, intet synligt sår. Borger angiver let ubehag.",
    begrundelse: "God hygiejne og tør hud forebygger hudinfektion og tryksår. Værdighed er en del af plejen.",
    ord: ["t-hudintegritet", "t-tryksaar", "t-inkontinens", "t-observation", "t-habitualtilstand"],
    anatomyNote: "Tilpas altid plejen til borgerens anatomi og behov.",
    localNote: null,
  },
  {
    id: "p-stoette", title: "Støttestrømper", desc: "Korrekt påtagning og observation af ben og hud.", Icon: Activity,
    formaal: ["Støtte kredsløbet i benene efter ordination.", "Forebygge hævelse (ødem)."],
    brug: ["De ordinerede støttestrømper", "Evt. påtagningshjælpemiddel", "Handsker (hvis relevant)"],
    foer: ["Tjek ordination/instruks/plan.", "Inspicér ben og hud.", "Tjek for sår, rødme, hævelse og smerte.", "Sikr rigtig strømpe til rigtigt ben."],
    trin: ["Bring borgeren i god stilling.", "Tag strømpen på med korrekt teknik.", "Brug ordineret/tilgængeligt påtagningshjælpemiddel.", "Glat strømpen ud — undgå folder.", "Undgå rullekant foroven."],
    hygiejne: ["Håndhygiejne før og efter.", "Ren hud og strømpe."],
    observer: ["Hud og tæer (hvor synligt)", "Folder eller rullekant", "Borgerens komfort", "Farve og følelse i foden"],
    stop: ["Kraftig smerte", "Markant farveændring", "Ny følelsesløshed", "Tydelig forværring"],
    dokText: "Dokumentér påtagning og hudobservationer.",
    dokHverdag: "Tog strømperne på.", dokFaglig: "Støttestrømper påsat begge ben efter ordination. Ingen folder. Tæer varme og normalt farvede.",
    begrundelse: "Korrekt påsatte strømper støtter kredsløbet. Folder eller rullekant kan skade huden og hæmme blodgennemstrømningen.",
    ord: ["t-oedem", "t-hudintegritet", "t-observation"],
    after: ["Strømpen sidder korrekt", "Ingen folder", "Ingen rullekant", "Borgeren er komfortabel", "Tæer/fod ser normale ud, hvor synligt"],
    localNote: null,
  },
  {
    id: "p-sejl-seng-stol", title: "Sejl – seng → stol", desc: "Sikker forflytning med lift og sejl.", Icon: ChevronRight,
    slingNote: "Brug altid det sejl og den lift, der er beskrevet i borgerens forflytningsplan, og følg producentens og arbejdsstedets instruktion.",
    formaal: ["Flytte borgeren sikkert fra seng til stol med lift og sejl.", "Skåne både borger og medarbejder."],
    brug: ["Borgerens forflytningsplan", "Den beskrevne lift", "Det beskrevne sejl i korrekt størrelse"],
    foer: ["Læs borgerens forflytningsplan.", "Vurder borgerens tilstand og ressourcer.", "Informér borgeren.", "Klargør omgivelserne."],
    trin: ["Læs forflytningsplanen.", "Vurder borgerens tilstand og ressourcer.", "Forklar fremgangsmåden.", "Klargør omgivelserne.", "Tjek liften.", "Tjek sejlet.", "Placér borgeren.", "Placér sejlet efter godkendt teknik.", "Fastgør kun efter det specifikke lift-/sejlsystem.", "Kontrollér fastgørelsen.", "Løft minimalt først.", "Udfør sikkerhedstjek.", "Fortsæt forflytningen.", "Placér borgeren korrekt i stolen.", "Sænk sikkert.", "Fjern kun sejlet, hvis planen/instruksen siger det.", "Observér borgeren bagefter."],
    hygiejne: ["Håndhygiejne før og efter.", "Rent sejl efter lokal instruks."],
    observer: ["Borgerens tryghed og smerte under forflytning", "Hud, hvor sejlet har ligget", "Almentilstand bagefter"],
    stop: ["Sejl eller lift virker defekt", "Borgeren får smerter eller bliver utryg", "Tvivl om fastgørelse eller teknik"],
    dokText: "Dokumentér forflytning og observationer efter behov.",
    dokHverdag: "Flyttede ham til stolen.", dokFaglig: "Forflyttet fra seng til stol med lift og sejl efter forflytningsplan. Borger tryg, ingen smerter angivet.",
    begrundelse: "Forskellige lifte og sejl har forskellige instruktioner. Korrekt sejl, størrelse og fastgørelse er afgørende for sikkerheden.",
    ord: ["t-mobilisering", "t-observation", "t-funktionsniveau"],
    safety: ["Rigtigt sejl", "Rigtig størrelse", "Sejlet er intakt", "Korrekte fæstepunkter efter systemet", "Liften fungerer", "Området er frit", "Borgeren er informeret", "Krav om antal medarbejdere er fulgt"],
    ergonomi: ["Arbejd i god arbejdshøjde.", "Brug benene, og hold ryggen i neutral stilling.", "Undgå vrid i ryggen.", "Bed om hjælp ved behov."],
    localNote: "Følg altid borgerens forflytningsplan samt producentens og arbejdsstedets instruktion.",
  },
  {
    id: "p-sejl-stol-seng", title: "Sejl – stol → seng", desc: "Sikker forflytning med lift og sejl.", Icon: ChevronLeft,
    slingNote: "Brug altid det sejl og den lift, der er beskrevet i borgerens forflytningsplan, og følg producentens og arbejdsstedets instruktion.",
    formaal: ["Flytte borgeren sikkert fra stol til seng med lift og sejl.", "Skåne både borger og medarbejder."],
    brug: ["Borgerens forflytningsplan", "Den beskrevne lift", "Det beskrevne sejl i korrekt størrelse"],
    foer: ["Læs borgerens forflytningsplan.", "Vurder borgerens tilstand og ressourcer.", "Informér borgeren.", "Klargør omgivelserne."],
    trin: ["Læs forflytningsplanen.", "Vurder borgerens tilstand og ressourcer.", "Forklar fremgangsmåden.", "Klargør omgivelserne.", "Tjek liften.", "Tjek sejlet.", "Placér borgeren.", "Placér sejlet efter godkendt teknik.", "Fastgør kun efter det specifikke lift-/sejlsystem.", "Kontrollér fastgørelsen.", "Løft minimalt først.", "Udfør sikkerhedstjek.", "Fortsæt forflytningen.", "Placér borgeren korrekt i sengen.", "Sænk sikkert.", "Fjern kun sejlet, hvis planen/instruksen siger det.", "Observér borgeren bagefter."],
    hygiejne: ["Håndhygiejne før og efter.", "Rent sejl efter lokal instruks."],
    observer: ["Borgerens tryghed og smerte under forflytning", "Hud, hvor sejlet har ligget", "Almentilstand og lejring bagefter"],
    stop: ["Sejl eller lift virker defekt", "Borgeren får smerter eller bliver utryg", "Tvivl om fastgørelse eller teknik"],
    dokText: "Dokumentér forflytning og observationer efter behov.",
    dokHverdag: "Lagde ham i seng.", dokFaglig: "Forflyttet fra stol til seng med lift og sejl efter forflytningsplan. Borger tryg og korrekt lejret.",
    begrundelse: "Forskellige lifte og sejl har forskellige instruktioner. Korrekt sejl, størrelse og fastgørelse er afgørende for sikkerheden.",
    ord: ["t-mobilisering", "t-observation", "t-funktionsniveau"],
    safety: ["Rigtigt sejl", "Rigtig størrelse", "Sejlet er intakt", "Korrekte fæstepunkter efter systemet", "Liften fungerer", "Området er frit", "Borgeren er informeret", "Krav om antal medarbejdere er fulgt"],
    ergonomi: ["Arbejd i god arbejdshøjde.", "Brug benene, og hold ryggen i neutral stilling.", "Undgå vrid i ryggen.", "Bed om hjælp ved behov."],
    localNote: "Følg altid borgerens forflytningsplan samt producentens og arbejdsstedets instruktion.",
  },
  {
    id: "p-mund", title: "Tandbørstning / mundpleje", desc: "Ren mund og faglig observation.", Icon: Heart,
    formaal: ["Holde mund og tænder rene.", "Forebygge problemer i mundhulen.", "Observere mundens tilstand."],
    brug: ["Tandbørste og tandpasta", "Evt. protesebørste og bæger", "Krus med vand", "Håndklæde", "Handsker (hvis relevant)"],
    foer: ["Informér borgeren, og inddrag egne ressourcer.", "Udfør håndhygiejne."],
    trin: ["Lad borgeren børste selv, hvis muligt — støt efter behov.", "Børst tænder/proteser grundigt.", "Rengør evt. tunge, og gør munden ren.", "Rengør og opbevar proteser korrekt.", "Afslut med håndhygiejne."],
    hygiejne: ["Håndhygiejne før og efter.", "Rene remedier; protese rengøres separat."],
    observer: ["Tørhed", "Sår", "Blødning", "Smerte", "Belægninger", "Dårlig ånde (hvis relevant)", "Synkebesvær (hvis relevant)", "Tænder, tandkød, tunge og mundslimhinde"],
    stop: ["Blødning, sår eller kraftig smerte", "Synkebesvær", "Tegn på infektion i munden"],
    dokText: "Dokumentér mundstatus og udført pleje.",
    dokHverdag: "Børstede tænder.", dokFaglig: "Mundpleje udført. Tandkød let blødende ved børstning. Ingen sår observeret.",
    begrundelse: "God mundhygiejne forebygger smerter, infektion og problemer med at spise. Udvidet mundpleje kan være nødvendig ved nedsat egenomsorg.",
    ord: ["t-egenomsorg", "t-ernaeringstilstand", "t-observation", "t-habitualtilstand"],
    oralNote: "Skeln mellem almindelig tandbørstning og udvidet mundpleje (fx ved nedsat egenomsorg eller synkebesvær).",
    localNote: null,
  },
  {
    id: "p-barbering", title: "Barbering", desc: "Nænsom barbering med observation af huden.", Icon: Info,
    formaal: ["Hjælpe borgeren med barbering efter ønske.", "Bevare velvære og værdighed."],
    brug: ["Elektrisk eller manuel barbermaskine (efter borgerens ønske)", "Barberskum (hvis manuel)", "Håndklæde", "Handsker (hvis relevant)"],
    foer: ["Spørg om borgerens ønske og vaner.", "Udfør håndhygiejne.", "Tjek huden."],
    trin: ["Barbér forsigtigt efter borgerens ønske.", "Vær nænsom over knogler og hudfolder.", "Tør ansigtet, og hjælp borgeren til rette.", "Rengør udstyret."],
    hygiejne: ["Håndhygiejne før og efter.", "Rent, personligt udstyr; rengør efter brug."],
    observer: ["Hud", "Sår", "Irritation", "Rødme", "Blødning"],
    stop: ["Sår, der bløder meget eller ikke stopper", "Tegn på infektion"],
    dokText: "Dokumentér ved relevante hudfund.",
    dokHverdag: "Barberede ham.", dokFaglig: "Barbering udført efter borgerens ønske. Ingen sår eller irritation observeret.",
    begrundelse: "Personlig pleje er også en anledning til at observere huden.",
    ord: ["t-hudintegritet", "t-observation"],
    bleedNote: "Vær ekstra forsigtig, hvis borgeren har øget blødningsrisiko. Giv ikke medicinspecifik behandlingsrådgivning — kontakt ansvarlig fagperson ved tvivl.",
    localNote: null,
  },
  {
    id: "p-haar", title: "Frisering / hårpleje", desc: "Hårpleje efter ønske med observation af hovedbund.", Icon: Star,
    formaal: ["Hjælpe med hårpleje efter borgerens ønske.", "Bevare værdighed og velvære."],
    brug: ["Kam/børste", "Evt. hårprodukter (efter ønske)", "Håndklæde"],
    foer: ["Spørg om borgerens ønske.", "Inddrag borgerens ressourcer.", "Udfør håndhygiejne."],
    trin: ["Red/frisér håret nænsomt efter ønske.", "Observér hovedbunden undervejs.", "Hjælp borgeren til rette.", "Rengør udstyret."],
    hygiejne: ["Håndhygiejne før og efter.", "Rent, personligt udstyr."],
    observer: ["Hovedbund", "Rødme", "Sår", "Skæl", "Hudforandringer", "Ubehag/smerte"],
    stop: ["Sår, kraftig rødme eller tegn på infektion i hovedbunden"],
    dokText: "Dokumentér ved relevante fund.",
    dokHverdag: "Redte hendes hår.", dokFaglig: "Hårpleje udført efter ønske. Hovedbund uden synlige sår; lette skæl observeret.",
    begrundelse: "Rutinemæssig personlig pleje er også en anledning til faglig observation af hovedbund og hud.",
    ord: ["t-egenomsorg", "t-observation"],
    localNote: null,
  },
];
const procById = (id) => PLEJE_PROCS.find((p) => p.id === id);
const procText = (p) => (p.title + " " + p.desc + " " + (p.ord || []).join(" ")).toLowerCase();

/* -------------------------------- FAGLIGT SPROG -------------------------------- */

const FS_CATS = ["Almen tilstand", "Respiration", "Kredsløb", "Hud", "Ernæring", "Væske", "Udskillelse", "Mobilitet", "Funktionsniveau", "Smerter", "Søvn", "Kognition", "Psykisk tilstand", "Kommunikation", "Personlig pleje", "Egenomsorg", "Rehabilitering", "Forebyggelse", "Dokumentation"];

const TERMS = [
  { id: "t-habitualtilstand", term: "Habitualtilstand", cat: "Almen tilstand", meaning: "Borgerens normale, vanlige tilstand.", observe: "Hvordan borgeren plejer at være (vågenhed, humør, funktion).", doc: "Borger er i habitualtilstand.", syn: ["normal tilstand", "vanlig", "som han plejer"], related: [] },
  { id: "t-observation", term: "Observation", cat: "Dokumentation", meaning: "At iagttage og registrere borgerens tilstand.", observe: "Det du ser, hører, mærker og måler.", doc: "Obs. rød hud på højre hæl.", syn: ["iagttage", "holde øje"], related: [] },
  { id: "t-objektiv", term: "Objektiv observation", cat: "Dokumentation", meaning: "Det du selv måler eller ser.", observe: "Målbare eller synlige fund.", doc: "Temperatur 38,2 °C.", syn: ["fakta", "målt", "det jeg ser"], related: [] },
  { id: "t-subjektiv", term: "Subjektiv oplevelse", cat: "Dokumentation", meaning: "Det borgeren selv oplever og fortæller.", observe: "Borgerens egne udsagn.", doc: "Borger angiver smerter 6/10.", syn: ["borgerens oplevelse", "fortæller selv"], related: [] },
  { id: "t-symptomer", term: "Symptomer", cat: "Almen tilstand", meaning: "Det borgeren mærker eller oplever (subjektivt).", observe: "Fx smerte, kvalme, træthed.", doc: "Borger oplyser kvalme.", syn: ["gener"], related: [] },
  { id: "t-tegn", term: "Tegn", cat: "Almen tilstand", meaning: "Det du kan observere objektivt.", observe: "Fx rødme, hævelse, feber.", doc: "Obs. hævelse omkring ankel.", syn: ["objektive fund"], related: [] },
  { id: "t-ressourcer", term: "Ressourcer", cat: "Funktionsniveau", meaning: "Det borgeren selv kan og magter.", observe: "Hvad borgeren klarer selv.", doc: "Borger kan selv børste tænder.", syn: ["egne evner", "kan selv"], related: [] },
  { id: "t-begraensninger", term: "Begrænsninger", cat: "Funktionsniveau", meaning: "Det borgeren har svært ved eller ikke kan.", observe: "Hvor der er behov for hjælp.", doc: "Behøver hjælp til nedre hygiejne.", syn: ["behov for hjælp"], related: [] },
  { id: "t-funktionsniveau", term: "Funktionsniveau", cat: "Funktionsniveau", meaning: "Hvor meget borgeren kan klare i hverdagen.", observe: "ADL, mobilitet og egenomsorg.", doc: "Nedsat funktionsniveau ift. habitualtilstand.", syn: ["kan klare"], related: ["p-stoette"] },
  { id: "t-egenomsorg", term: "Egenomsorg", cat: "Egenomsorg", meaning: "Borgerens evne til at tage vare på sig selv.", observe: "Personlig pleje, måltider, medicin.", doc: "Nedsat egenomsorg — behøver støtte til mundpleje.", syn: ["klare sig selv"], related: ["p-mund", "p-haar"] },
  { id: "t-rehabilitering", term: "Rehabilitering", cat: "Rehabilitering", meaning: "At genvinde eller bevare funktion og selvstændighed.", observe: "Fremgang i funktion.", doc: "Deltager i genoptræning dagligt.", syn: ["genoptræning"], related: [] },
  { id: "t-sundhedsfremme", term: "Sundhedsfremme", cat: "Forebyggelse", meaning: "At styrke sundhed og trivsel.", observe: "Sunde vaner og trivsel.", doc: "Motiveret til daglige gåture.", syn: ["fremme sundhed"], related: [] },
  { id: "t-forebyggelse", term: "Forebyggelse", cat: "Forebyggelse", meaning: "At forhindre sygdom eller forværring.", observe: "Tiltag der nedsætter risiko.", doc: "Trykaflastning for at forebygge tryksår.", syn: ["forhindre"], related: ["p-nedre"] },
  { id: "t-dokumentation", term: "Dokumentation", cat: "Dokumentation", meaning: "Skriftlig registrering af observationer og pleje.", observe: "Hvad, hvornår og af hvem.", doc: "Se eksempel i den enkelte procedure.", syn: ["journalføring", "skrive ned"], related: [] },
  { id: "t-aendring", term: "Ændring i tilstand", cat: "Almen tilstand", meaning: "Forskel fra borgerens habitualtilstand.", observe: "Noget nyt eller anderledes ift. normalt.", doc: "Ændret ift. habitualtilstand: mere træt end vanligt.", syn: ["forandring", "anderledes"], related: [] },
  { id: "t-mobilisering", term: "Mobilisering", cat: "Mobilitet", meaning: "At hjælpe borgeren i bevægelse.", observe: "Hvordan borgeren bevæger sig.", doc: "Mobiliseret til stol med lift.", syn: ["i bevægelse", "op at stå"], related: ["p-sejl-seng-stol", "p-sejl-stol-seng"] },
  { id: "t-adl", term: "ADL", cat: "Funktionsniveau", meaning: "Almindelige daglige aktiviteter (fx spise, vaske sig).", observe: "Hvad borgeren klarer i dagligdagen.", doc: "Behøver hjælp til flere ADL-opgaver.", syn: ["daglige aktiviteter"], related: [] },
  { id: "t-respiration", term: "Respiration", cat: "Respiration", meaning: "Vejrtrækningen.", observe: "Frekvens, dybde og besvær.", doc: "Rolig, upåvirket respiration.", syn: ["vejrtrækning", "åndedræt"], related: [] },
  { id: "t-dyspnoe", term: "Dyspnø", cat: "Respiration", meaning: "Åndenød / besværet vejrtrækning.", observe: "Anstrengt vejrtrækning, høj frekvens, brug af hjælpemuskler.", doc: "Borger fremstår forpustet i hvile med forhøjet respirationsfrekvens.", syn: ["forpustet", "åndenød", "stakåndet"], related: [] },
  { id: "t-oedem", term: "Ødem", cat: "Kredsløb", meaning: "Væskeophobning i vævet (hævelse).", observe: "Hævede ben/fødder; tryk giver fordybning.", doc: "Ødem på begge underben.", syn: ["hævelse", "hævede ben", "væske i benene"], related: ["p-stoette"] },
  { id: "t-cyanose", term: "Cyanose", cat: "Kredsløb", meaning: "Blålig misfarvning pga. iltmangel.", observe: "Blålige læber, negle eller hud.", doc: "Obs. cyanose omkring læber.", syn: ["blålig", "blå læber"], related: [] },
  { id: "t-obstipation", term: "Obstipation", cat: "Udskillelse", meaning: "Forstoppelse.", observe: "Sjælden, hård afføring; oppustethed.", doc: "Ingen afføring i 3 døgn; oplyser oppustethed.", syn: ["forstoppelse", "hård mave"], related: [] },
  { id: "t-diarre", term: "Diarré", cat: "Udskillelse", meaning: "Hyppig, tynd afføring.", observe: "Løs/vandig afføring og hyppighed.", doc: "3 tynde afføringer siden morgen.", syn: ["tynd mave", "løs afføring"], related: [] },
  { id: "t-inkontinens", term: "Inkontinens", cat: "Udskillelse", meaning: "Ufrivillig vandladning eller afføring.", observe: "Utilsigtet urin/afføring; brug af hjælpemidler.", doc: "Urininkontinens; anvender ble.", syn: ["kan ikke holde på vandet"], related: ["p-nedre"] },
  { id: "t-diurese", term: "Diurese", cat: "Udskillelse", meaning: "Urinproduktion / urinmængde.", observe: "Mængde, farve og hyppighed.", doc: "Nedsat diurese trods væskeindtag.", syn: ["urinmængde", "vandladning"], related: ["p-kateter"] },
  { id: "t-urin", term: "Urin", cat: "Udskillelse", meaning: "Vandladningens indhold og udseende.", observe: "Farve, klarhed, lugt og sediment.", doc: "Urin uklar med kraftig lugt.", syn: ["tis", "vandladning"], related: ["p-kateter"] },
  { id: "t-sediment", term: "Sediment", cat: "Udskillelse", meaning: "Bundfald/partikler i urinen.", observe: "Grumset urin med synlige partikler.", doc: "Synligt sediment i urinen.", syn: ["bundfald", "grums"], related: ["p-kateter"] },
  { id: "t-ernaeringstilstand", term: "Ernæringstilstand", cat: "Ernæring", meaning: "Hvor godt borgeren er ernæret.", observe: "Appetit, vægt og indtag.", doc: "Nedsat appetit; spiser ca. 1/4 af måltider.", syn: ["ernæring", "spiser dårligt"], related: ["p-mund"] },
  { id: "t-dehydrering", term: "Dehydrering", cat: "Væske", meaning: "Væskemangel i kroppen.", observe: "Tørre slimhinder, tørst, nedsat urin.", doc: "Tørre slimhinder og nedsat diurese — obs. dehydrering.", syn: ["væskemangel", "udtørret"], related: [] },
  { id: "t-hudintegritet", term: "Hudintegritet", cat: "Hud", meaning: "Hudens tilstand og hele overflade.", observe: "Rødme, sår, fugt og tryksår.", doc: "Intakt hud uden rødme eller sår.", syn: ["hudens tilstand", "hel hud"], related: ["p-nedre", "p-kateter"] },
  { id: "t-tryksaar", term: "Tryksår", cat: "Hud", meaning: "Skade på hud/væv pga. tryk.", observe: "Vedvarende rødme over knoglefremspring; sår.", doc: "Rødme over haleben, forsvinder ikke ved tryk.", syn: ["liggesår"], related: ["p-nedre"] },
  { id: "t-konfusion", term: "Konfusion", cat: "Kognition", meaning: "Forvirring / nedsat klarhed.", observe: "Desorientering, ændret opmærksomhed.", doc: "Fremstår konfus og desorienteret ift. habitualtilstand.", syn: ["forvirret", "desorienteret"], related: [] },
  { id: "t-kateter", term: "Kateter", cat: "Udskillelse", meaning: "Slange, der dræner urin fra blæren.", observe: "Urin, lækage, smerte og hud omkring.", doc: "Kateter fungerer; urin klar.", syn: ["urinkateter", "kad"], related: ["p-kateter"] },
];
const termById = (id) => TERMS.find((t) => t.id === id);
const termText = (t) => (t.term + " " + t.cat + " " + t.meaning + " " + (t.syn || []).join(" ")).toLowerCase();

const SIG_PAIRS = [
  { bad: "Hun virker mærkelig i dag.", good: "Borgeren fremstår ændret i forhold til habitualtilstand.", better: "Borgeren fremstår mere træt end vanligt og deltager mindre i samtalen." },
  { bad: "Han er forpustet.", good: "Borgeren fremstår dyspnøisk.", better: "Borger er forpustet i hvile med forhøjet respirationsfrekvens." },
  { bad: "Han har ondt.", good: "Borgeren angiver smerter.", better: "Borger angiver smerter 6/10 i højre knæ ved bevægelse." },
  { bad: "Hun spiste næsten ingenting.", good: "Borgeren har nedsat appetit.", better: "Borger spiste ca. 1/4 af morgenmaden; oplyser nedsat appetit." },
  { bad: "Han var forvirret.", good: "Borgeren fremstår konfus.", better: "Borger er desorienteret i tid og sted ift. habitualtilstand." },
  { bad: "Benene var hævede.", good: "Borgeren har ødem.", better: "Ødem på begge underben; tryk efterlader fordybning." },
];

const DOC_TRAINER = {
  see: "Grethe har næsten ikke spist sin morgenmad.",
  steps: ["Hvad observerede jeg?", "Hvad fortalte borgeren?", "Hvad er anderledes end vanligt?", "Hvad gjorde jeg?", "Hvem informerede jeg?", "Hvad skal følges op?"],
  example: "Borgeren spiste ca. 1/4 af morgenmaden. Oplyser nedsat appetit. Relevant medarbejder informeret.",
  note: "Opfind aldrig værdier. Hvis mængde, tid eller værdi ikke er kendt, så skriv det ikke som et tal.",
};


/* ----------------------------- THEME ------------------------------ */

const C = {
  ink: "#15212B",
  inkSoft: "#5B6A73",
  inkFaint: "#97A4AB",
  line: "#ECEFF2",
  surface: "#FFFFFF",
  primary: "#2E68E0",
};
const tint = (hex, a = "16") => hex + a;
const grad = (c) => `linear-gradient(135deg, ${c.g1}, ${c.g2})`;

/* --------------------------- PRIMITIVES --------------------------- */

/* KLARIO mark — a distinctive two-tone stylised "K" (clarity, knowledge, trust). */
function KGlyph({ size = 20, stem = "#FFFFFF", arm = "#2BD9C0" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <line x1="6.6" y1="4.4" x2="6.6" y2="19.6" stroke={stem} strokeWidth="3.4" strokeLinecap="round" />
      <line x1="9.7" y1="12" x2="17.6" y2="4.7" stroke={arm} strokeWidth="3.4" strokeLinecap="round" />
      <line x1="9.7" y1="12" x2="17.6" y2="19.3" stroke={arm} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ size = 22, color = "currentColor", strokeWidth = 2, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M6.6 10.8a11 11 0 0 0 4.6 4.6l1.5-1.5a1 1 0 0 1 1-.25 8 8 0 0 0 2.6.42 1 1 0 0 1 1 1V18a1 1 0 0 1-1 1A13 13 0 0 1 5 6a1 1 0 0 1 1-1h2.7a1 1 0 0 1 1 1 8 8 0 0 0 .42 2.6 1 1 0 0 1-.25 1z" />
    </svg>
  );
}

function Mark({ size = 32 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "linear-gradient(145deg,#1B4868,#0E2A40)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(15,52,77,0.38)", flexShrink: 0 }}>
      <KGlyph size={size * 0.66} stem="#FFFFFF" arm="#2BD9C0" />
    </div>
  );
}

function Chip({ cat, size = 38, radius = 12 }) {
  const Ic = cat.Icon;
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: grad(cat), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${tint(cat.color, "44")}` }}>
      <Ic size={size * 0.52} color="#fff" strokeWidth={2.2} />
    </div>
  );
}

function SectionHead({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 12px" }}>
      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.2 }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 1, color: C.primary, fontSize: 13.5, fontWeight: 600, fontFamily: "inherit" }}>
          {action} <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function Body({ body, color }) {
  if (Array.isArray(body)) {
    return (
      <ul style={{ margin: "7px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
        {body.map((it, i) => (
          <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: color, marginTop: 7, flexShrink: 0 }} />
            <span style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink }}>{it}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.58, color: C.ink }}>{body}</p>;
}

/* expandable clinical card */
function ClinCard({ card, cat, expanded, onToggle, isFav, onFav, showCat, onQuiz, onCase }) {
  return (
    <div id={`card-${card.id}`} style={{ background: C.surface, borderRadius: 20, border: `1px solid ${C.line}`, boxShadow: expanded ? "0 14px 34px rgba(21,33,43,0.10)" : "0 2px 6px rgba(21,33,43,0.04)", overflow: "hidden", transition: "box-shadow .25s ease" }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 12, padding: 13, cursor: "pointer" }}>
        <Chip cat={cat} size={40} radius={13} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {showCat && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color: cat.color, marginBottom: 1 }}>{cat.title}</div>}
          <div style={{ fontSize: 15.5, fontWeight: 600, color: C.ink, lineHeight: 1.25 }}>{card.title}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onFav(); }} aria-label="Favorit" style={{ border: "none", background: "transparent", padding: 6, cursor: "pointer", display: "flex", borderRadius: 10 }}>
          <Star size={19} strokeWidth={2} color={isFav ? "#F5A623" : C.inkFaint} fill={isFav ? "#F5A623" : "none"} />
        </button>
        <ChevronDown size={19} color={C.inkFaint} style={{ transition: "transform .28s ease", transform: expanded ? "rotate(180deg)" : "none", flexShrink: 0 }} />
      </div>
      <div style={{ display: "grid", gridTemplateRows: expanded ? "1fr" : "0fr", transition: "grid-template-rows .3s ease" }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "2px 16px 16px", display: "flex", flexDirection: "column", gap: 13 }}>
            {card.sections.map((s, i) => (
              <div key={i}>
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 0.2, textTransform: "uppercase", color: cat.color, background: tint(cat.color, "14"), padding: "3px 9px", borderRadius: 8 }}>{s.label}</span>
                <Body body={s.body} color={cat.color} />
              </div>
            ))}
            {expanded && <TestButtons topicId={card.id} onQuiz={onQuiz} onCase={onCase} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ card, cat, onClick, fav }) {
  return (
    <button onClick={onClick} style={{ flexShrink: 0, width: 158, textAlign: "left", border: `1px solid ${C.line}`, background: `linear-gradient(160deg, ${tint(cat.color, "12")}, ${tint(cat.color, "06")})`, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, height: 118, justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Chip cat={cat} size={34} radius={11} />
        {fav && <Star size={15} color="#F5A623" fill="#F5A623" />}
      </div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: cat.color, marginBottom: 2 }}>{cat.title}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{card.title}</div>
      </div>
    </button>
  );
}

/* --------------------------- MERE / INFO -------------------------- */

const MORE_MENU = [
  { id: "om", label: "Om KLARIO", Icon: Info, c: "#2BA99A" },
  { id: "privatliv", label: "Privatlivspolitik", Icon: ShieldCheck, c: "#2F6FAE" },
  { id: "vilkaar", label: "Vilkår og betingelser", Icon: Scale, c: "#475B8E" },
  { id: "ansvar", label: "Ansvarsfraskrivelse", Icon: Siren, c: "#D9646A" },
  { id: "kontakt", label: "Kontakt KLARIO", Icon: MessageCircle, c: "#1AA0E6" },
  { id: "version", label: "Version", Icon: Clock, c: "#6B7C93" },
];

/* a labelled prose block for info/legal pages */
function InfoBlock({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 0.2, textTransform: "uppercase", color: C.primary, background: tint(C.primary, "14"), padding: "3px 9px", borderRadius: 8, marginBottom: 7 }}>{label}</span>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: C.ink }}>{children}</div>
    </div>
  );
}

function DisclaimerPill() {
  return (
    <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: tint(C.primary, "0D"), borderRadius: 14 }}>
      <Info size={17} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "#3D5366" }}>{DISCLAIMER}</p>
    </div>
  );
}

/* --- Akut hjælp: emergency palette + reusable components --- */
const RED = "#E5484D";
const digitsOnly = (p) => p.replace(/\s+/g, "");

function CallButton({ phone, onCall, danger }) {
  return (
    <button onClick={() => onCall(phone)} aria-label={`Ring ${phone}`}
      style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px 16px", background: danger ? "linear-gradient(135deg,#F0625E,#C22F2C)" : "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 16, fontWeight: 800, letterSpacing: 0.2, cursor: "pointer", boxShadow: danger ? "0 8px 20px rgba(194,47,44,0.4)" : "0 8px 20px rgba(46,104,224,0.28)", minHeight: 52 }}>
      Ring {phone}
    </button>
  );
}

function EmergencyWarning() {
  return (
    <div role="note" style={{ display: "flex", gap: 10, padding: "12px 14px", background: tint(RED, "12"), border: `1px solid ${tint(RED, "33")}`, borderRadius: 14 }}>
      <Siren size={18} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "#7A2A28", fontWeight: 600 }}>Ved livsfare eller alvorlig akut forværring: Ring 112.</p>
    </div>
  );
}

function EmergencyServiceCard({ service, onCall }) {
  if (!service) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16, boxShadow: "0 2px 6px rgba(21,33,43,0.05)" }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{service.name}</div>
      {service.description && <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 3, lineHeight: 1.45 }}>{service.description}</div>}
      <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: 1, margin: "12px 0 6px", userSelect: "text" }}>{service.phone}</div>
      {service.availability && <div style={{ fontSize: 12.5, color: C.inkFaint, marginBottom: 12 }}>{service.availability}</div>}
      <CallButton phone={service.phone} onCall={onCall} />
      {service.lastVerified ? (
        <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 8, textAlign: "center" }}>Senest kontrolleret: {service.lastVerified}</div>
      ) : null}
    </div>
  );
}

function RegionSelector({ region, onSelect }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16 }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Hvilken region befinder du dig i?</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12 }}>Så viser vi det rigtige akutnummer for din region.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {EMERGENCY_REGIONS.map((r) => {
          const on = region === r.id;
          return (
            <button key={r.id} onClick={() => onSelect(r.id)} aria-pressed={on}
              style={{ textAlign: "left", border: `1.5px solid ${on ? C.primary : C.line}`, background: on ? tint(C.primary, "0E") : C.surface, borderRadius: 12, padding: "13px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 14.5, fontWeight: 600, color: C.ink, minHeight: 48 }}>
              {r.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --- Akut telefonbog: reusable phone entry (icon, name, big number, call) --- */
function EmergencyPhoneEntry({ e, isFav, onFav, onCall, highlight }) {
  const Ic = pbCatIcon(e.category);
  const digits = e.phone.replace(/\s+/g, "");
  const is112 = digits === "112";
  return (
    <div style={{ background: C.surface, border: `1.5px solid ${highlight ? RED : C.line}`, borderRadius: 16, padding: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: e.pending ? tint(C.inkFaint, "1F") : tint(RED, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ic size={20} color={e.pending ? C.inkFaint : RED} strokeWidth={2.1} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{e.name}</span>
            {highlight && <span style={{ fontSize: 10.5, fontWeight: 700, color: RED, background: tint(RED, "14"), padding: "1px 7px", borderRadius: 6 }}>Din region</span>}
          </div>
          {e.shortDescription && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{e.shortDescription}</div>}
        </div>
        {!e.pending && onFav && (
          <button onClick={() => onFav(e.id)} aria-label="Marker som favorit" style={{ border: "none", background: "transparent", padding: 4, cursor: "pointer", display: "flex" }}>
            <Star size={18} strokeWidth={2} color={isFav ? "#E0A03A" : "#AAB6BE"} fill={isFav ? "#E0A03A" : "none"} />
          </button>
        )}
      </div>
      {!e.pending && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <div style={{ flex: 1, fontSize: 26, fontWeight: 800, color: C.ink, letterSpacing: 0.5, userSelect: "text" }}>{e.phone}</div>
          {is112 ? (
            <button onClick={() => onCall(e.phone)} aria-label="Ring 112" style={{ border: "none", borderRadius: 12, padding: "11px 18px", background: "linear-gradient(135deg,#F0625E,#C22F2C)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 46 }}>Ring 112</button>
          ) : (
            <a href={`tel:${digits}`} aria-label={e.callLabel || `Ring ${e.phone}`} style={{ textDecoration: "none", textAlign: "center", borderRadius: 12, padding: "11px 18px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>{e.callLabel || "Ring"}</a>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Plejeprocedurer + Fagligt sprog: components ---------------- */

function Acc({ title, tone, defaultOpen, children }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const headColor = tone === "stop" ? RED : tone === "observer" ? "#2F6FAE" : C.ink;
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", background: C.surface }}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", minHeight: 48 }}>
        <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: headColor }}>{title}</span>
        <ChevronDown size={18} color={C.inkFaint} style={{ transition: "transform .25s ease", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }} />
      </button>
      {open && <div style={{ padding: "0 14px 14px" }}>{children}</div>}
    </div>
  );
}

function Bullets({ items, color }) {
  return (
    <ul style={{ margin: "2px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((x, i) => (
        <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: color || C.inkFaint, marginTop: 7, flexShrink: 0 }} />
          <span style={{ fontSize: 14, lineHeight: 1.45, color: C.ink }}>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function Checks({ items }) {
  return (
    <ul style={{ margin: "2px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((x, i) => (
        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ width: 17, height: 17, borderRadius: 5, border: `1.6px solid ${C.inkFaint}`, marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: 14, lineHeight: 1.45, color: C.ink }}>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function Steps({ items }) {
  return (
    <ol style={{ margin: "2px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((x, i) => (
        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ width: 25, height: 25, borderRadius: 7, background: tint(C.primary, "16"), color: C.primary, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
          <span style={{ fontSize: 14.5, lineHeight: 1.45, color: C.ink }}>{x}</span>
        </li>
      ))}
    </ol>
  );
}

function NoteCard({ icon, color, children }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: tint(color, "10"), border: `1px solid ${tint(color, "2A")}`, borderRadius: 13 }}>
      {icon}
      <div style={{ fontSize: 13, lineHeight: 1.5, color: C.ink }}>{children}</div>
    </div>
  );
}

function ProcCard({ p, onOpen }) {
  const Ic = p.Icon || ClipboardList;
  return (
    <button onClick={() => onOpen(p.id)} aria-label={p.title} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 16, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 62 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: tint(C.primary, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ic size={20} color={C.primary} strokeWidth={2.1} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{p.title}</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2, lineHeight: 1.35 }}>{p.desc}</div>
      </div>
      <ChevronRight size={18} color={C.inkFaint} style={{ flexShrink: 0 }} />
    </button>
  );
}

function TermCard({ t, onOpen }) {
  return (
    <button onClick={() => onOpen(t.id)} aria-label={t.term} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 2px rgba(21,33,43,0.04)", minHeight: 54 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{t.term}</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.meaning}</div>
      </div>
      <ChevronRight size={17} color={C.inkFaint} style={{ flexShrink: 0 }} />
    </button>
  );
}

/* ===== KLARIO Injektioner (undervisningssektion) ========================
 * SC/IM/IV/ID moduler. Procedurespecifik (ingen fælles vinkel/kanyle/aspiration).
 * Vaccinationsvejledning holdes adskilt fra øvrig medicin. Kilder: SSI,
 * Sundhedsstyrelsen, Lægehåndbogen (se kilder). Afventer faglig gennemgang —
 * markeret i UI. Al tekst er ægte UTF-8 (JSX fortolker ikke \u-escapes). */
const INJ = {"modules": [{"id": "sc", "code": "SC", "title": "Subkutan injektion", "color": "#0FAE9E", "g1": "#2BC7B4", "g2": "#0B9488", "short": "I underhuden (fedtlaget). Langsom, jævn optagelse.", "key": [["Vinkel", "45° eller 90° (efter kanyle/fedtlag)"], ["Lag", "Underhud (subcutis/fedt)"], ["Optagelse", "Langsom og jævn"], ["Aspiration", "Normalt ikke"]], "hvad": "Subkutan injektion (SC) gives i underhuden — det løse fedt- og bindevævslag lige under huden og over musklen. Lægemidlet optages langsommere end i muskel, hvilket giver en jævn og forlænget virkning.", "hvor": "Områder med subkutant fedt: maveskindet (ca. 5 cm fra navlen), forside/yderside af låret, bagsiden af overarmen og evt. øvre, ydre balde. Skift (rotér) systematisk mellem stederne for at skåne vævet.", "hvornaar": "Når et lægemiddel skal optages langsomt og jævnt, eller ikke egner sig til muskel eller vene. Bruges ofte til selvadministration i hjemmet.", "laegemidler": ["Insulin", "Lavmolekylært heparin (fx dalteparin, enoxaparin, tinzaparin)", "GLP-1-analoger (fx semaglutid)", "Visse vacciner (fx levende svækkede, MFR) — se vaccinationsafsnittet", "Morfin s.c. i palliativ pleje"], "anatomi": "Rækkefølgen er: hud (epidermis + dermis) → subkutant fedtlag (subcutis) → muskel. SC skal ramme fedtlaget. Hos en tynd person kan man løfte en hudfold og bruge mindre vinkel, så man ikke rammer muskel.", "udstyr": "Kort, tynd kanyle (fx insulinpen eller -sprøjte). Kanylelængden vælges efter personens fedtlag — følg produkt- og lokal instruks. Mange SC-lægemidler leveres i færdige penne eller sprøjter.", "forberedelse": ["Tjek ordination og de rigtige kontroller (borger, præparat, dosis, vej, tidspunkt).", "Udfør håndhygiejne (hånddesinfektion).", "Find og vurdér injektionsstedet; skift sted i forhold til sidst.", "Huden desinficeres normalt ikke, hvis den er synligt ren — følg lokal instruks."], "fremgang": ["Løft evt. en hudfold mellem to fingre.", "Stik kanylen i den vinkel, der passer til kanylelængde og fedtlag — typisk 45° (lang kanyle/tynd person) eller 90° (kort kanyle).", "Injicér langsomt.", "Aspiration er normalt ikke nødvendig ved subkutan injektion.", "Træk kanylen ud, og slip hudfolden.", "Læg kanylen direkte i kanylebøtten."], "obsFoer": ["Injektionsstedet (hud intakt, ingen infektion eller lipohypertrofi)", "Allergier", "Rigtig borger og ordination"], "obsEfter": ["Lokal reaktion (rødme, hævelse, blødning)", "Tegn på allergisk reaktion", "Virkning og bivirkning afhængigt af lægemidlet"], "komplikationer": ["Blødning eller blåt mærke", "Lokal irritation eller infektion", "Lipohypertrofi ved gentagne injektioner samme sted (fx insulin) → rotér", "Utilsigtet intramuskulær injektion (for dyb)"], "dok": ["Dokumentér præparat, dosis, injektionssted, tidspunkt og dine initialer", "Notér og rotér injektionssted, hvor det er relevant", "Patientsikkerhed: de rigtige kontroller og samtykke"]}, {"id": "im", "code": "IM", "title": "Intramuskulær injektion", "color": "#2E68E0", "g1": "#4F86F4", "g2": "#2257D8", "short": "Direkte i en muskel. Hurtigere optagelse end subkutant.", "key": [["Vinkel", "90°"], ["Lag", "Muskel"], ["Optagelse", "Hurtigere"], ["Aspiration", "Vacciner: nej · andre: følg lokal instruks"]], "hvad": "Intramuskulær injektion (IM) gives direkte i en muskel, som har god blodforsyning. Det giver hurtigere optagelse end subkutant og kan rumme lidt større volumen.", "hvor": "Voksne: deltoideus (overarm — bruges til de fleste vacciner), vastus lateralis (lårets yderside) og ventrogluteus (hoften). Spædbørn 0–12 mdr.: vastus lateralis. Brug korrekte anatomiske landemærker, så du undgår nerver og store kar.", "hvornaar": "Når hurtigere virkning ønskes, ved lægemidler der skal i muskel, og til de fleste vacciner til voksne og større børn.", "laegemidler": ["De fleste vacciner (se vaccinationsafsnittet)", "Visse antibiotika", "Vitamin B12 (hydroxocobalamin)", "Depotpræparater (fx visse antipsykotika)", "Adrenalin i.m. ved anafylaksi (anterolateralt på låret)"], "anatomi": "Kanylen passerer hud og subkutant fedt og skal nå ind i muskelvævet. Fedtlagets tykkelse og muskelmassen afgør, hvor lang kanylen skal være. Forkert sted kan ramme en nerve (fx n. radialis ved deltoideus, n. ischiadicus ved ballen) eller et kar.", "udstyr": "Længere kanyle end ved SC, så musklen nås gennem fedtlaget. Kanylelængde og -tykkelse vælges efter alder, muskelmasse og lægemiddel — følg produkt- og lokal instruks.", "forberedelse": ["Tjek ordination og de rigtige kontroller.", "Udfør håndhygiejne.", "Find de korrekte anatomiske landemærker.", "Ved vaccination desinficeres huden normalt ikke, hvis den er synligt ren (SSI). For øvrige lægemidler: følg lokal instruks."], "fremgang": ["Stræk huden over injektionsstedet (evt. Z-track-teknik ved vævsirriterende lægemidler).", "Stik kanylen i 90° ind i musklen.", "Ved vacciner aspireres IKKE (SSI/WHO) — der er ikke store kar på de anbefalede steder.", "For visse andre i.m.-lægemidler kan lokal instruks kræve langsom aspiration — følg den konkrete instruks og produktresuméet.", "Injicér langsomt.", "Træk kanylen ud, og læg den direkte i kanylebøtten."], "obsFoer": ["Korrekt landemærke og sted", "Allergier", "Ordination og borger"], "obsEfter": ["Lokal reaktion (smerte, rødme, hævelse)", "Tegn på allergisk reaktion/anafylaksi — særligt ved vacciner, hvor der observeres efter", "Virkning og bivirkning"], "komplikationer": ["Smerte og ømhed", "Nerveskade ved forkert sted", "Utilsigtet intravasal injektion", "Absces eller infektion", "Blødning/hæmatom"], "dok": ["Dokumentér præparat, dosis, sted (fx h. deltoideus), tidspunkt og initialer", "Ved vacciner: batch-/lotnummer efter lokal instruks", "Observationsperiode efter vaccination efter lokal instruks"]}, {"id": "iv", "code": "IV", "title": "Intravenøs injektion", "color": "#C2410C", "g1": "#F97316", "g2": "#C2410C", "short": "Direkte i en vene. Hurtigst virkende — kræver særlig kompetence.", "key": [["Vinkel", "I venen"], ["Lag", "Vene/blodbane"], ["Optagelse", "Hurtigst"], ["Kompetence", "Kræver særlig delegation"]], "hvad": "Intravenøs injektion (IV) gives direkte i en vene. Virkningen indtræder hurtigst af alle injektionsveje, fordi lægemidlet går direkte i blodbanen.", "hvor": "Perifere vener (fx håndryg eller underarm) via et venekateter (venflon), eller via et centralt venekateter (CVK). Kræver en etableret, kontrolleret adgang.", "hvornaar": "Når hurtig og sikker effekt er nødvendig, ved lægemidler der kun kan gives intravenøst, eller ved væske- og infusionsbehandling.", "laegemidler": ["Mange intravenøse antibiotika", "Intravenøse væsker og infusioner", "Visse smertestillende og akutmedicin", "Kontraststoffer"], "anatomi": "Vene → direkte i blodbanen. Nærheden til arterier og nerver kræver præcis teknik. Hvis lægemidlet ender uden for venen (ekstravasation), kan vævet tage skade.", "udstyr": "Venekateter/venflon, intravenøs adgang og evt. infusionssæt og pumpe. Steril håndtering.", "forberedelse": ["Kræver særlig kompetence og delegation — intravenøs administration er typisk forbeholdt sygeplejerske eller læge og ligger normalt uden for grundlæggende SSA-kompetence.", "Tjek ordination, forligelighed og de rigtige kontroller.", "Håndhygiejne og aseptisk teknik.", "Kontrollér, at adgangen fungerer (tilbageløb/gennemskylning efter lokal instruks)."], "fremgang": ["Følg lokal instruks for intravenøs administration og aseptisk teknik.", "Kontrollér den intravenøse adgang før indgift.", "Giv lægemidlet i den ordinerede hastighed.", "Observér borgeren tæt under og efter indgift.", "Håndtér kanyle og udstyr sikkert i kanylebøtten."], "obsFoer": ["Fungerende intravenøs adgang", "Forligelighed og ordination", "Allergier"], "obsEfter": ["Tegn på ekstravasation (hævelse, smerte, manglende indløb)", "Flebitis (rødme og varme langs venen)", "Hurtig bivirkning eller anafylaksi", "Virkning"], "komplikationer": ["Ekstravasation/infiltration", "Flebitis", "Infektion og i værste fald sepsis", "Luftemboli", "Hurtig og kraftig bivirkning på grund af den hurtige effekt"], "dok": ["Dokumentér præparat, dosis, hastighed, tidspunkt, adgang og initialer", "Observationer under og efter indgift", "Afvigelser og tiltag"]}, {"id": "id", "code": "ID", "title": "Intradermal injektion", "color": "#7A5AF5", "g1": "#9B7DF6", "g2": "#5B37C7", "short": "I selve huden (dermis). Danner en kvaddel. Bruges til tests.", "key": [["Vinkel", "10–15°"], ["Lag", "Hud (dermis)"], ["Optagelse", "Meget langsom"], ["Aspiration", "Nej"]], "hvad": "Intradermal injektion (ID) gives i selve huden (læderhuden/dermis), lige under det yderste hudlag. Der dannes en lille blære (kvaddel). Optagelsen er meget langsom — teknikken bruges til tests og lokal reaktion.", "hvor": "Oftest indersiden af underarmen (volart). Huden skal være sund og uden ar og behåring.", "hvornaar": "Til tuberkulintest (Mantoux), visse allergitests og anlæggelse af en bedøvelseskvaddel. Der gives meget små volumina (ca. 0,1 ml).", "laegemidler": ["Tuberkulin (Mantoux-test)", "Allergener til intrakutantest", "Lokalbedøvelse som kvaddel", "BCG-vaccine (gives intradermalt — se vaccinationsafsnittet)"], "anatomi": "Kanylen lægges næsten fladt i huden, så spidsen bliver i dermis. Rammer man for dybt (subkutant), dannes der ingen kvaddel, og fx en Mantoux-test bliver usikker.", "udstyr": "Meget tynd, kort kanyle og en lille sprøjte med fin gradinddeling. Skråspidsen (bevel) vender opad.", "forberedelse": ["Tjek ordination og indikation.", "Udfør håndhygiejne.", "Vælg et sundt hudområde på volar underarm.", "Følg lokal instruks for hud-desinfektion."], "fremgang": ["Stræk huden let.", "Hold kanylen næsten fladt — ca. 10–15° — med skråspidsen opad.", "Før kanylespidsen ind i huden (dermis).", "Injicér langsomt, indtil der dannes en tydelig kvaddel/blære.", "Træk kanylen ud; undgå at massere stedet.", "Aflæs/markér efter instruks (fx aflæses Mantoux efter 48–72 timer)."], "obsFoer": ["Sund hud uden ar eller infektion", "Allergistatus", "Indikation og ordination"], "obsEfter": ["At der dannes en kvaddel (ellers er injektionen for dyb)", "Lokal reaktion", "Aflæsning på det korrekte tidspunkt (fx Mantoux)"], "komplikationer": ["Ingen kvaddel (for dyb injektion) → usikkert resultat", "Blødning", "Lokal eller allergisk reaktion", "Infektion"], "dok": ["Dokumentér præparat/test, dosis, sted, tidspunkt og initialer", "Aflæsningstidspunkt og -resultat (fx Mantoux i mm)", "Patientsikkerhed og samtykke"]}], "compare": {"cols": ["SC", "IM", "IV", "ID"], "rows": [["Vinkel", "45°/90°", "90°", "I venen", "10–15°"], ["Lag", "Underhud (fedt)", "Muskel", "Vene/blodbane", "Hud (dermis)"], ["Optagelse", "Langsom/jævn", "Hurtigere", "Hurtigst", "Meget langsom"], ["Typiske", "Insulin, heparin", "Vacciner, B12", "I.v.-antibiotika, væske", "Mantoux, allergitest"], ["Aspiration", "Normalt nej", "Vacciner: nej*", "Tilbageløb", "Nej"]], "note": "*Ved ikke-vaccine-lægemidler kan lokal instruks kræve aspiration. Følg altid produktresumé og lokal instruks. Forenklet undervisningsoversigt."}, "checklist": ["Rigtig borger — bekræft identitet med to identifikatorer", "Ordination/recept kontrolleret", "Rigtigt lægemiddel", "Rigtig dosis", "Rigtig administrationsvej", "Rigtigt tidspunkt", "Allergier tjekket", "Samtykke indhentet", "Håndhygiejne udført", "Faglig kompetence og delegation er på plads", "Plan for observation før og efter", "Dokumentation klar"], "equipment": [{"t": "Injektionspenne", "b": ["Færdigfyldte penne med dosisindstilling (fx insulin, GLP-1, heparin).", "Sæt en ny kanyle på hver gang, og fjern den efter brug.", "Kontrollér for luft/flow efter produktinstruks (priming).", "Opbevar efter instruks (fx insulin), og rotér injektionssted."]}, {"t": "Ampuller (glas)", "b": ["Engangsglas der knækkes ved mærket — brug en serviet om halsen.", "Træk op med optræks-/filterkanyle efter lokal instruks.", "Skift til injektionskanyle før injektion.", "Kassér glas i kanylebøtte/glasaffald efter instruks."]}, {"t": "Hætteglas (vials)", "b": ["Desinficér gummimembranen før optræk.", "Træk evt. luft ind svarende til volumen, og træk dosis op.", "Fjern luftbobler før injektion.", "Mærk åbnet glas med dato/tid efter lokal instruks."]}, {"t": "Kanylesikkerhed", "b": ["Brug sikkerhedskanyler, hvor det er muligt.", "Sæt ALDRIG hætten på kanylen igen (recap ikke).", "Aktivér sikkerhedsmekanismen straks efter brug."]}, {"t": "Kanyleaffald (skarpt affald)", "b": ["Læg kanylen direkte i en godkendt kanylebøtte.", "Fyld ikke bøtten over max-stregen, og luk den, når den er fuld.", "Kanyler må aldrig i almindeligt affald (Arbejdstilsynet).", "Ved stikuheld: følg arbejdsstedets stikuheldsinstruks straks."]}], "sources": [{"t": "Statens Serum Institut — Injektionsteknik (subkutan)", "u": "https://www.ssi.dk/vaccinationer/administration-af-vacciner/injektionsteknik/subkutan-injektion", "d": "2026-10-28"}, {"t": "Statens Serum Institut — Intramuskulær injektion (børn og voksne)", "u": "https://www.ssi.dk/vaccinationer/administration-af-vacciner/injektionsteknik/intramuskulaer-injektion-beorn-og-voksne", "d": "2026-10-28"}, {"t": "Statens Serum Institut — Håndtering af vacciner", "u": "https://www.ssi.dk/vaccinationer/haandtering-af-vacciner", "d": "2026-10-28"}, {"t": "Lægehåndbogen (sundhed.dk) — Tuberkulintest (Mantoux)", "u": "https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/lunger/undersoegelser/tuberkulintest-mantoux-test/", "d": "2026-10-28"}, {"t": "Sundhedsstyrelsen (sst.dk) — medicinhåndtering", "u": "https://www.sst.dk", "d": "2026-10-28"}, {"t": "Arbejdstilsynet (at.dk) — kanyler og stikuheld", "u": "https://at.dk", "d": "2026-10-28"}], "review": "Indholdet er udarbejdet til undervisning og bygger på generel dansk vejledning (SSI, Sundhedsstyrelsen, Lægehåndbogen). Det er endnu ikke gennemgået punkt for punkt af en fagperson. Kontrollér altid mod gældende lokal instruks, produktresumé og din delegation, før du handler. Afventer faglig gennemgang — især: kanylelængde/-type, hud-desinfektion og aspiration ved ikke-vaccine-lægemidler afhænger af præparat og lokal instruks.", "vaccineNote": "Vaccinationsspecifik vejledning adskiller sig fra øvrig medicin. SSI anbefaler fx, at der IKKE aspireres ved vacciner, og at huden normalt ikke desinficeres, hvis den er synligt ren. Følg altid SSI's aktuelle vejledning for den konkrete vaccine — bland den ikke sammen med regler for andre injektionslægemidler."};

/* Forenklet undervisningsdiagram: hudlag + injektionsdybder/vinkler */
function InjLayersSVG() {
  const W = 320, H = 210, L = 96;
  const yEpi = 34, yDerm = 50, ySub = 86, yMus = 150;
  return (
    <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", background: C.surface, border: "1px solid " + C.line, borderRadius: 14 }} role="img" aria-label="Forenklet diagram over hudlag og injektionsdybder">
      <rect x={L} y={yEpi} width={W - L - 8} height={yDerm - yEpi} fill="#F4D9C6" />
      <rect x={L} y={yDerm} width={W - L - 8} height={ySub - yDerm} fill="#E7B59A" />
      <rect x={L} y={ySub} width={W - L - 8} height={yMus - ySub} fill="#F7E7A6" />
      <rect x={L} y={yMus} width={W - L - 8} height={H - yMus - 10} fill="#D98A8A" />
      {[["Epidermis", yEpi + 11], ["Dermis (hud)", yDerm + 12], ["Underhud (fedt)", ySub + 22], ["Muskel", yMus + 22]].map((r, i) => (
        <text key={i} x={10} y={r[1]} fontSize="10" fill={C.inkSoft} fontWeight="600">{r[0]}</text>
      ))}
      {/* ID ~10-15° into dermis */}
      <line x1={L + 8} y1={yDerm - 6} x2={L + 62} y2={yDerm + 7} stroke="#5B37C7" strokeWidth="2.4" />
      <text x={L + 20} y={yDerm - 9} fontSize="9" fill="#5B37C7" fontWeight="800">ID 10–15°</text>
      {/* SC 45° into subcutis */}
      <line x1={L + 150} y1={yDerm - 10} x2={L + 180} y2={ySub + 8} stroke="#0B9488" strokeWidth="2.4" />
      <text x={L + 120} y={yDerm - 12} fontSize="9" fill="#0B9488" fontWeight="800">SC 45°</text>
      {/* IM 90° into muscle */}
      <line x1={W - 40} y1={yEpi - 6} x2={W - 40} y2={yMus + 18} stroke="#2257D8" strokeWidth="2.4" />
      <text x={W - 70} y={yEpi - 9} fontSize="9" fill="#2257D8" fontWeight="800">IM 90°</text>
      {/* IV: vein in subcutis */}
      <ellipse cx={L + 96} cy={ySub + 22} rx="22" ry="7" fill="#9CC1F0" stroke="#2257D8" strokeWidth="1" />
      <text x={L + 70} y={ySub + 44} fontSize="9" fill="#C2410C" fontWeight="800">IV (i vene)</text>
    </svg>
  );
}
/* Forenklet kropskort med injektionssteder */
function InjSitesSVG() {
  const W = 320, H = 220;
  const dot = (x, y, c) => <circle cx={x} cy={y} r="5" fill={c} stroke="#fff" strokeWidth="1.4" />;
  return (
    <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", background: C.surface, border: "1px solid " + C.line, borderRadius: 14 }} role="img" aria-label="Forenklet kropskort med injektionssteder">
      {/* very simplified body */}
      <circle cx="160" cy="30" r="16" fill={tint(C.ink, "10")} />
      <rect x="138" y="48" width="44" height="70" rx="14" fill={tint(C.ink, "10")} />
      <rect x="112" y="52" width="20" height="60" rx="9" fill={tint(C.ink, "10")} />
      <rect x="188" y="52" width="20" height="60" rx="9" fill={tint(C.ink, "10")} />
      <rect x="142" y="116" width="16" height="78" rx="8" fill={tint(C.ink, "10")} />
      <rect x="162" y="116" width="16" height="78" rx="8" fill={tint(C.ink, "10")} />
      {dot(126, 60, "#2257D8")}<text x="20" y="62" fontSize="9.5" fill={C.inkSoft}>Deltoideus (IM)</text>
      {dot(150, 86, "#0B9488")}<text x="212" y="88" fontSize="9.5" fill={C.inkSoft}>Maveskind (SC)</text>
      {dot(146, 150, "#2257D8")}<text x="20" y="152" fontSize="9.5" fill={C.inkSoft}>Vastus lateralis (IM)</text>
      {dot(188, 100, "#7A5AF5")}<text x="210" y="118" fontSize="9.5" fill={C.inkSoft}>Volar underarm (ID)</text>
      {dot(176, 120, "#C2410C")}<text x="210" y="150" fontSize="9.5" fill={C.inkSoft}>Ventrogluteus (IM)</text>
    </svg>
  );
}

function InjExpand({ id, title, openSet, toggle, children }) {
  const open = openSet.has(id);
  return (
    <div style={{ border: "1px solid " + C.line, borderRadius: 13, background: C.surface, overflow: "hidden" }}>
      <button onClick={() => toggle(id)} aria-expanded={open} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", padding: "13px 14px", display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: C.ink, lineHeight: 1.3 }}>{title}</span>
        <ChevronDown size={18} color={C.inkFaint} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }} />
      </button>
      {open ? <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 9 }}>{children}</div> : null}
    </div>
  );
}
const InjP = ({ children }) => <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>{children}</div>;
const InjUL = ({ items }) => (<ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>{items.map((x, i) => <li key={i} style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{x}</li>)}</ul>);

function InjReviewBanner() {
  return (
    <div style={{ display: "flex", gap: 9, background: tint("#B7791F", "10"), border: "1px solid " + tint("#B7791F", "33"), borderRadius: 12, padding: "11px 13px" }}>
      <Info size={16} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 12, color: "#7A4E0A", lineHeight: 1.55 }}><b>Undervisning — afventer faglig gennemgang.</b> {INJ.review}</span>
    </div>
  );
}

function Injektioner({ view, setView, onQuiz, isFav, onFav }) {
  const [openSet, setOpenSet] = useState(() => new Set(["s1"]));
  const toggle = (id) => setOpenSet((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const [checks, setChecks] = useState(() => new Set());
  const mod = INJ.modules.find((m) => m.id === view);

  // ----- a single module -----
  if (mod) {
    const sec = (id, title, node) => <InjExpand id={id} title={title} openSet={openSet} toggle={toggle}>{node}</InjExpand>;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 11, paddingBottom: 36 }} className="anim">
        <div style={{ borderRadius: 16, padding: 15, background: "linear-gradient(160deg," + tint(mod.color, "16") + "," + tint(mod.color, "08") + ")", border: "1px solid " + tint(mod.color, "2E") }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: tint(mod.color, "1E"), color: mod.g2, borderRadius: 8, padding: "3px 9px", fontSize: 12, fontWeight: 800 }}>{mod.code}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginTop: 7 }}>{mod.title}</div>
          <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>{mod.short}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {mod.key.map((k, i) => <span key={i} style={{ fontSize: 11, fontWeight: 700, color: mod.g2, background: tint(mod.color, "12"), padding: "3px 8px", borderRadius: 8 }}>{k[0]}: {k[1]}</span>)}
          </div>
        </div>
        <InjReviewBanner />
        {sec("s1", "1. Hvad er det?", <InjP>{mod.hvad}</InjP>)}
        {sec("s2", "2. Hvor i kroppen gives injektionen?", <InjP>{mod.hvor}</InjP>)}
        {sec("s3", "3. Hvornår anvendes den?", <InjP>{mod.hvornaar}</InjP>)}
        {sec("s4", "4. Eksempler på lægemidler", <InjUL items={mod.laegemidler} />)}
        {sec("s5", "5. Relevant anatomi", <><InjP>{mod.anatomi}</InjP><InjLayersSVG /><div style={{ fontSize: 10.5, color: C.inkFaint }}>Forenklet undervisningsdiagram — ikke anatomisk målfast.</div></>)}
        {sec("s6", "6. Udstyr og kanyler", <InjP>{mod.udstyr}</InjP>)}
        {sec("s7", "7. Forberedelse og hygiejne", <InjUL items={mod.forberedelse} />)}
        {sec("s8", "8. Fremgangsmåde — faglig undervisning", <><InjUL items={mod.fremgang} /><div style={{ fontSize: 11, color: "#7A4E0A", background: tint("#B7791F", "0C"), borderRadius: 9, padding: "8px 10px", lineHeight: 1.5 }}>Vinkel, kanyle og aspiration er specifikke for netop denne injektionstype og det konkrete lægemiddel. Følg altid lokal instruks.</div></>)}
        {sec("s9", "9. Observation før og efter", <><div style={{ fontSize: 12.5, fontWeight: 800, color: C.inkSoft }}>Før</div><InjUL items={mod.obsFoer} /><div style={{ fontSize: 12.5, fontWeight: 800, color: C.inkSoft, marginTop: 4 }}>Efter</div><InjUL items={mod.obsEfter} /></>)}
        {sec("s10", "10. Mulige komplikationer", <InjUL items={mod.komplikationer} />)}
        {sec("s11", "11. Dokumentation og patientsikkerhed", <InjUL items={mod.dok} />)}
        <div style={{ border: "1px solid " + C.line, borderRadius: 13, background: C.surface, padding: "13px 14px" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 7 }}>12. Test din viden</div>
          <button onClick={onQuiz} style={{ width: "100%", border: "none", borderRadius: 11, padding: "13px", background: "linear-gradient(135deg," + mod.g1 + "," + mod.g2 + ")", color: "#fff", fontFamily: "inherit", fontSize: 14.5, fontWeight: 800, cursor: "pointer", minHeight: 48 }}>Test din viden om injektioner</button>
        </div>
      </div>
    );
  }

  // ----- checklist -----
  if (view === "checklist") {
    const done = checks.size, total = INJ.checklist.length;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 36 }} className="anim">
        <div><div style={{ fontSize: 19, fontWeight: 800, color: C.ink }}>Tjekliste før injektion</div><div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>Interaktiv huskeliste. Intet gemmes, og listen erstatter ikke lokal instruks.</div></div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft }}>{done}/{total} klaret</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {INJ.checklist.map((c, i) => { const on = checks.has(i); return (
            <button key={i} onClick={() => setChecks((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })} style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 11, border: "1px solid " + (on ? tint("#0FAE9E", "40") : C.line), background: on ? tint("#0FAE9E", "0A") : C.surface, borderRadius: 12, padding: "12px 13px", cursor: "pointer", fontFamily: "inherit" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: "2px solid " + (on ? "#0B9488" : C.inkFaint), background: on ? "#0B9488" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 900 }}>{on ? "✓" : ""}</span>
              <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.4 }}>{c}</span>
            </button>
          ); })}
        </div>
        <button onClick={() => setChecks(new Set())} style={{ border: "1px solid " + C.line, borderRadius: 12, padding: "12px", background: C.surface, color: C.inkSoft, fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Nulstil</button>
        <div style={{ display: "flex", gap: 9, background: tint(C.ink, "05"), border: "1px solid " + C.line, borderRadius: 12, padding: "11px 13px" }}><Info size={15} color={C.inkSoft} style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 11.5, color: C.inkSoft, lineHeight: 1.5 }}>Følg altid din delegation og arbejdsstedets instruks. Ved tvivl: stop og spørg den ansvarlige.</span></div>
      </div>
    );
  }

  // ----- equipment -----
  if (view === "udstyr") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 11, paddingBottom: 36 }} className="anim">
        <div><div style={{ fontSize: 19, fontWeight: 800, color: C.ink }}>Udstyr og skarpt affald</div><div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>Penne, ampuller, hætteglas, kanylesikkerhed og bortskaffelse.</div></div>
        {INJ.equipment.map((e, i) => (
          <div key={i} style={{ border: "1px solid " + C.line, borderRadius: 13, background: C.surface, padding: "13px 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 7 }}>{e.t}</div>
            <InjUL items={e.b} />
          </div>
        ))}
      </div>
    );
  }

  // ----- compare / illustration -----
  if (view === "sammenlign") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 13, paddingBottom: 36 }} className="anim">
        <div><div style={{ fontSize: 19, fontWeight: 800, color: C.ink }}>Sammenlign SC · IM · IV · ID</div><div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>Overblik over lag, vinkel og optagelse.</div></div>
        <InjLayersSVG />
        <InjSitesSVG />
        <div style={{ border: "1px solid " + C.line, borderRadius: 13, overflow: "hidden", background: C.surface }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr 1fr", background: tint(C.ink, "06"), fontSize: 11, fontWeight: 800, color: C.inkSoft }}>
            <div style={{ padding: "8px 8px" }}></div>
            {INJ.compare.cols.map((c) => <div key={c} style={{ padding: "8px 8px", textAlign: "center" }}>{c}</div>)}
          </div>
          {INJ.compare.rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr 1fr", borderTop: "1px solid " + C.line, fontSize: 11 }}>
              <div style={{ padding: "8px 8px", fontWeight: 700, color: C.inkSoft }}>{r[0]}</div>
              {r.slice(1).map((v, j) => <div key={j} style={{ padding: "8px 8px", textAlign: "center", color: C.ink, lineHeight: 1.35 }}>{v}</div>)}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: C.inkFaint, lineHeight: 1.5 }}>{INJ.compare.note}</div>
      </div>
    );
  }

  // ----- overview -----
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13, paddingBottom: 36 }} className="anim">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <p style={{ margin: 0, flex: 1, fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55 }}>Fire injektionstyper med faglig undervisning, illustrationer, tjekliste og quiz. Til SSA-elever og personale.</p>
        <button onClick={onFav} aria-label="Gem som favorit" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, flexShrink: 0 }}><Star size={22} color={isFav ? "#F5A623" : C.inkFaint} fill={isFav ? "#F5A623" : "none"} /></button>
      </div>
      <InjReviewBanner />
      <div style={{ display: "flex", gap: 9, background: tint("#2E68E0", "0A"), border: "1px solid " + tint("#2E68E0", "24"), borderRadius: 12, padding: "11px 13px" }}>
        <ShieldCheck size={16} color="#2257D8" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.55 }}><b>Vacciner:</b> {INJ.vaccineNote}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {INJ.modules.map((m) => (
          <button key={m.id} onClick={() => setView(m.id)} aria-label={m.title} style={{ textAlign: "left", border: "1px solid " + tint(m.color, "2E"), borderRadius: 16, padding: 13, cursor: "pointer", background: "linear-gradient(160deg," + tint(m.color, "14") + "," + tint(m.color, "06") + ")", display: "flex", flexDirection: "column", gap: 8, minHeight: 108 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 12, background: tint(m.color, "1E"), color: m.g2, fontWeight: 900, fontSize: 14 }}>{m.code}</span>
            <div><div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, lineHeight: 1.2 }}>{m.title}</div><div style={{ fontSize: 11, color: C.inkSoft, marginTop: 3, lineHeight: 1.35 }}>{m.short}</div></div>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {[["sammenlign", "Sammenlign & illustrationer", "Hudlag, vinkler og kropskort"], ["checklist", "Tjekliste før injektion", "Interaktiv sikkerhedstjekliste"], ["udstyr", "Udstyr og skarpt affald", "Penne, ampuller, hætteglas, kanyler"]].map((t) => (
          <button key={t[0]} onClick={() => setView(t[0])} style={{ textAlign: "left", border: "1px solid " + C.line, background: C.surface, borderRadius: 14, padding: "13px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, fontFamily: "inherit" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: tint(C.primary, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ClipboardList size={20} color={C.primary} /></div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{t[1]}</div><div style={{ fontSize: 11.5, color: C.inkSoft }}>{t[2]}</div></div>
            <ChevronRight size={18} color={C.inkFaint} />
          </button>
        ))}
      </div>
      <button onClick={onQuiz} style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px", background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Test din viden om injektioner</button>
      <div style={{ border: "1px solid " + C.line, borderRadius: 13, background: tint(C.ink, "04"), padding: "12px 14px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: C.ink, marginBottom: 6 }}>Kilder & revision</div>
        {INJ.sources.map((s, i) => (<a key={i} href={s.u} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ fontSize: 11.5, color: "#2257D8", lineHeight: 1.5, marginBottom: 3 }}>{s.t} · konsulteret {s.d} →</div></a>))}
        <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 5, lineHeight: 1.5 }}>Følg altid gældende lokal instruks, produktresumé og din delegation. KLARIO opfinder ikke kliniske værdier; uverificerede detaljer er markeret til gennemgang.</div>
      </div>
    </div>
  );
}

function ProcDetail({ p, onTerm, onQuiz, onCase }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      <p style={{ margin: 0, fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>{p.desc}</p>
      <NoteCard icon={<Info size={17} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />} color={C.primary}>{p.localNote || PLEJE_GENERAL_NOTE}</NoteCard>
      {p.slingNote && <NoteCard icon={<Siren size={17} color="#B7791F" style={{ flexShrink: 0, marginTop: 1 }} />} color="#B7791F"><b>⚠️ Vær opmærksom.</b> {p.slingNote}</NoteCard>}
      {p.anatomyNote && <NoteCard icon={<Info size={17} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />} color={C.primary}>{p.anatomyNote}</NoteCard>}
      {p.oralNote && <NoteCard icon={<Info size={17} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />} color={C.primary}>{p.oralNote}</NoteCard>}

      <Acc title="Formål">{<Bullets items={p.formaal} color={C.primary} />}</Acc>
      <Acc title="Du skal bruge">{<Checks items={p.brug} />}</Acc>
      <Acc title="Før du starter">{<Bullets items={p.foer} color={C.primary} />}</Acc>

      {p.medicinsikkerhed && (
        <div style={{ border: `1px solid ${tint(C.primary, "33")}`, background: tint(C.primary, "0C"), borderRadius: 14, padding: "13px 14px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: C.primary, marginBottom: 7 }}>MEDICINSIKKERHED</div>
          <Checks items={p.medicinsikkerhed} />
          {p.delegationNote && <p style={{ margin: "9px 0 0", fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>{p.delegationNote}</p>}
          <p style={{ margin: "6px 0 0", fontSize: 11.5, color: C.inkFaint, lineHeight: 1.5 }}>Erstatter ikke arbejdsstedets lokale medicininstruks.</p>
        </div>
      )}

      <Acc title="Trin for trin" defaultOpen>{<Steps items={p.trin} />}</Acc>

      {p.safety && (
        <div style={{ border: `1px solid ${tint("#B7791F", "33")}`, background: tint("#B7791F", "0C"), borderRadius: 14, padding: "13px 14px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "#8A5A0B", marginBottom: 7 }}>🛑 Sikkerhedstjek før løft</div>
          <Checks items={p.safety} />
        </div>
      )}
      {p.ergonomi && <Acc title="Ergonomi for dig">{<Bullets items={p.ergonomi} color={C.primary} />}</Acc>}

      <Acc title="Hygiejne">{<Bullets items={p.hygiejne} color="#0FAE9E" />}</Acc>
      <Acc title="Observér" tone="observer" defaultOpen>{<Checks items={p.observer} />}</Acc>

      {p.after && (
        <div style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: "13px 14px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, marginBottom: 7 }}>Tjek til sidst</div>
          <Checks items={p.after} />
        </div>
      )}

      {p.bleedNote && <NoteCard icon={<Siren size={17} color="#B7791F" style={{ flexShrink: 0, marginTop: 1 }} />} color="#B7791F"><b>⚠️ Vær opmærksom.</b> {p.bleedNote}</NoteCard>}

      <div style={{ border: `1px solid ${tint(RED, "33")}`, background: tint(RED, "0C"), borderRadius: 14, padding: "13px 14px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: RED, marginBottom: 7 }}>🛑 Stop og reagér</div>
        <Bullets items={p.stop} color={RED} />
        {p.stopStrong && <p style={{ margin: "9px 0 0", fontSize: 13, fontWeight: 600, color: "#7A2A28", lineHeight: 1.5 }}>{p.stopStrong}</p>}
        <p style={{ margin: "9px 0 0", fontSize: 11.5, color: C.inkSoft, lineHeight: 1.5 }}>Kontakt relevant ansvarlig fagperson efter arbejdsstedets lokale procedure ved bekymrende fund.</p>
      </div>

      <Acc title="Dokumentation">
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: C.ink }}>{p.dokText}</p>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13.5, color: "#7A2A28", background: tint(RED, "0C"), borderRadius: 10, padding: "9px 11px" }}>❌ {p.dokHverdag}</div>
          <div style={{ fontSize: 13.5, color: "#1F5136", background: tint("#0FAE9E", "12"), borderRadius: 10, padding: "9px 11px" }}>✓ {p.dokFaglig}</div>
        </div>
      </Acc>
      <Acc title="Faglig begrundelse"><p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: C.ink }}>{p.begrundelse}</p></Acc>

      {p.ord && p.ord.length > 0 && (
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, margin: "6px 0 9px" }}>Faglige ord til denne opgave</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {p.ord.map((tid) => { const t = termById(tid); if (!t) return null; return (
              <button key={tid} onClick={() => onTerm(tid)} style={{ border: `1px solid ${C.line}`, background: tint(C.primary, "0C"), color: C.primary, borderRadius: 99, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.term}</button>
            ); })}
          </div>
        </div>
      )}
      <TestButtons topicId={p.id} onQuiz={onQuiz} onCase={onCase} />
    </div>
  );
}

function TermDetail({ t, onProc }) {
  const block = (label, text) => (
    <div style={{ marginBottom: 14 }}>
      <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 0.2, textTransform: "uppercase", color: C.primary, background: tint(C.primary, "14"), padding: "3px 9px", borderRadius: 8, marginBottom: 6 }}>{label}</span>
      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: C.ink }}>{text}</div>
    </div>
  );
  return (
    <div>
      <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: C.inkSoft, background: tint(C.ink, "0A"), padding: "3px 10px", borderRadius: 8, marginBottom: 14 }}>{t.cat}</span>
      {block("Betydning", t.meaning)}
      {block("Hvad kan du observere?", t.observe)}
      <div style={{ marginBottom: 14 }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 0.2, textTransform: "uppercase", color: "#1F5136", background: tint("#0FAE9E", "14"), padding: "3px 9px", borderRadius: 8, marginBottom: 6 }}>Sådan kan du beskrive det fagligt</span>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#1F5136", background: tint("#0FAE9E", "0E"), borderRadius: 10, padding: "10px 12px" }}>{t.doc}</div>
      </div>
      {t.related && t.related.length > 0 && (
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, margin: "4px 0 9px" }}>Se også</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {t.related.map((pid) => { const p = procById(pid); if (!p) return null; return (
              <button key={pid} onClick={() => onProc(pid)} style={{ border: `1px solid ${C.line}`, background: tint(C.primary, "0C"), color: C.primary, borderRadius: 99, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{p.title}</button>
            ); })}
          </div>
        </div>
      )}
    </div>
  );
}


/* ============================== LOMMEREGNERE ============================== *
 *  Rene beregningsfunktioner + UI. Klario er et lærings-/støtteværktøj og
 *  erstatter ikke ordination, delegation, kompetence eller faglig kontrol.
 *  Ingen dosis opfindes; inkompatible enheder konverteres aldrig i det skjulte.
 * ========================================================================= */

const MASS_MG = { mikrogram: 0.001, mg: 1, g: 1000 };
function convertMedicationUnit(value, from, to) {
  if (from === to) return value;
  if (Object.prototype.hasOwnProperty.call(MASS_MG, from) && Object.prototype.hasOwnProperty.call(MASS_MG, to)) return (value * MASS_MG[from]) / MASS_MG[to];
  return null; // inkompatible (fx IE <-> mg)
}
function parseNum(s) {
  if (s == null) return NaN;
  const t = String(s).trim().replace(",", ".");
  if (t === "") return NaN;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}
function fmtNum(n, dec) {
  if (!Number.isFinite(n)) return "";
  let s = n.toFixed(dec == null ? 3 : dec);
  if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s.replace(".", ",");
}
function calculateTabletCount(dose, doseUnit, strength, strengthUnit) {
  if (!(dose > 0)) return { error: "Indtast en gyldig dosis." };
  if (!(strength > 0)) return { error: "Styrken skal være større end 0." };
  const conv = convertMedicationUnit(strength, strengthUnit, doseUnit);
  if (conv == null) return { error: "Kontrollér at dosis og styrke bruger kompatible enheder." };
  return { count: dose / conv, strengthInDoseUnit: conv, doseUnit };
}
function calculateLiquidVolume(dose, doseUnit, conc, concMassUnit) {
  if (!(dose > 0)) return { error: "Indtast en gyldig dosis." };
  if (!(conc > 0)) return { error: "Styrken skal være større end 0." };
  const d = convertMedicationUnit(dose, doseUnit, concMassUnit);
  if (d == null) return { error: "Kontrollér at dosis og styrke bruger kompatible enheder." };
  return { ml: d / conc, doseInConcUnit: d, concMassUnit };
}
function calculateInfusionRate(volume, hours) {
  if (!(volume > 0)) return { error: "Indtast et gyldigt volumen." };
  if (!(hours > 0)) return { error: "Indtast en gyldig infusionstid." };
  return { rate: volume / hours };
}
function calculateInfusionTime(volume, rate) {
  if (!(volume > 0)) return { error: "Indtast et gyldigt volumen." };
  if (!(rate > 0)) return { error: "Infusionshastigheden skal være større end 0." };
  return { hoursTotal: volume / rate };
}
function calculateInfusionVolume(rate, hours) {
  if (!(rate > 0)) return { error: "Infusionshastigheden skal være større end 0." };
  if (!(hours > 0)) return { error: "Indtast en gyldig infusionstid." };
  return { volume: rate * hours };
}
function calculateDropRate(volume, dropFactor, minutes) {
  if (!(volume > 0)) return { error: "Indtast et gyldigt volumen." };
  if (!(dropFactor > 0)) return { error: "Indtast en gyldig dråbefaktor (dråber/ml)." };
  if (!(minutes > 0)) return { error: "Indtast en gyldig tid i minutter." };
  return { drops: (volume * dropFactor) / minutes };
}
function calculateBMI(cm, kg) {
  if (!(cm > 0)) return { error: "Indtast en gyldig højde." };
  if (!(kg > 0)) return { error: "Indtast en gyldig vægt." };
  const m = cm / 100;
  return { bmi: kg / (m * m), m };
}
function hoursToHM(hoursTotal) {
  const totalMin = Math.round(hoursTotal * 60);
  return { h: Math.floor(totalMin / 60), m: totalMin % 60 };
}
function bmiCategory(bmi) {
  if (bmi < 18.5) return "undervægt";
  if (bmi < 25) return "normalområde";
  if (bmi < 30) return "overvægt";
  return "svær overvægt";
}

/* ---- shared calculator UI ---- */
function CField({ label, value, set, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>{label}</div>
      <input value={value} onChange={(e) => set(e.target.value)} inputMode="decimal" placeholder={placeholder || "0"} aria-label={label}
        style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 14px", fontSize: 16, color: C.ink, background: C.surface, fontFamily: "inherit", outline: "none" }} />
    </div>
  );
}
function CSeg({ opts, val, set }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {opts.map((o) => {
        const on = val === o.v;
        return (
          <button key={o.v} onClick={() => set(o.v)} aria-pressed={on}
            style={{ border: `1.5px solid ${on ? C.primary : C.line}`, background: on ? tint(C.primary, "0E") : C.surface, color: on ? C.primary : C.ink, borderRadius: 10, padding: "9px 13px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: 42 }}>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}
function CActions({ onCalc, onReset }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={onCalc} style={{ flex: 2, border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 16, fontWeight: 800, cursor: "pointer", minHeight: 52 }}>Beregn</button>
      <button onClick={onReset} style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 13, padding: "14px", background: C.surface, color: C.ink, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 52 }}>Ryd</button>
    </div>
  );
}
function CResult({ rows, result, unit, note }) {
  return (
    <div style={{ border: `1px solid ${tint(C.primary, "33")}`, background: tint(C.primary, "0A"), borderRadius: 16, padding: 16 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, minWidth: 78 }}>{r.k}</span>
          <span style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.4 }}>{r.v}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${tint(C.primary, "22")}` }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft }}>Resultat</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 2 }}>{result} <span style={{ fontSize: 16, fontWeight: 700, color: C.inkSoft }}>{unit}</span></div>
      </div>
      {note && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#7A4E0A", background: tint("#B7791F", "12"), borderRadius: 10, padding: "9px 11px", lineHeight: 1.45 }}>{note}</p>}
    </div>
  );
}
function CError({ msg }) {
  return (
    <div style={{ display: "flex", gap: 9, background: tint(RED, "10"), border: `1px solid ${tint(RED, "2A")}`, borderRadius: 12, padding: "11px 13px" }}>
      <Info size={17} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#7A2A28", lineHeight: 1.45 }}>{msg}</span>
    </div>
  );
}
function CSafety({ text }) {
  return (
    <div style={{ display: "flex", gap: 10, background: tint(RED, "0C"), border: `1px solid ${tint(RED, "26")}`, borderRadius: 13, padding: "12px 14px" }}>
      <Siren size={18} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink }}><b style={{ color: RED }}>🛑 Ved tvivl – stop.</b> {text}</div>
    </div>
  );
}
const MED_SAFETY = "Kontrollér altid ordination, præparat, styrke, dosis, administrationsvej og lokale medicininstrukser. Brug ikke beregneren som erstatning for faglig vurdering eller dobbeltkontrol. Klario viser ikke en \u201Esikker dosis\u201D.";
const INF_SAFETY = "Infusionsberegninger skal altid kontrolleres mod ordination, pumpeindstillinger, præparatinstruks og lokale procedurer. Resultatet skal verificeres, hvor det kræves.";

const MASS_OPTS = [{ v: "mikrogram", l: "mikrogram" }, { v: "mg", l: "mg" }, { v: "g", l: "g" }, { v: "IE", l: "IE" }];
const CONC_OPTS = [{ v: "mikrogram", l: "mikrogram/ml" }, { v: "mg", l: "mg/ml" }, { v: "g", l: "g/ml" }, { v: "IE", l: "IE/ml" }];

function MedicinBeregner() {
  const [mode, setMode] = useState("fast");
  const [dose, setDose] = useState("");
  const [doseU, setDoseU] = useState("mg");
  const [strength, setStrength] = useState("");
  const [strengthU, setStrengthU] = useState("mg");
  const [conc, setConc] = useState("");
  const [concU, setConcU] = useState("mg");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const reset = () => { setDose(""); setStrength(""); setConc(""); setRes(null); setErr(""); };
  const calc = () => {
    setRes(null); setErr("");
    if (mode === "fast") {
      const r = calculateTabletCount(parseNum(dose), doseU, parseNum(strength), strengthU);
      if (r.error) { setErr(r.error); return; }
      setRes({
        rows: [
          { k: "Værdier", v: `Dosis ${fmtNum(parseNum(dose))} ${doseU} · Styrke ${fmtNum(parseNum(strength))} ${strengthU} pr. stk.` },
          { k: "Formel", v: "Dosis ÷ styrke pr. stk. = antal" },
          { k: "Udregning", v: `${fmtNum(parseNum(dose))} ${doseU} ÷ ${fmtNum(r.strengthInDoseUnit)} ${doseU} = ${fmtNum(r.count)}` },
        ],
        result: fmtNum(r.count), unit: "tabletter/kapsler",
        note: "Kontrollér om den konkrete tablet må deles, og at resultatet stemmer med ordinationen.",
      });
    } else {
      const r = calculateLiquidVolume(parseNum(dose), doseU, parseNum(conc), concU);
      if (r.error) { setErr(r.error); return; }
      setRes({
        rows: [
          { k: "Værdier", v: `Dosis ${fmtNum(parseNum(dose))} ${doseU} · Styrke ${fmtNum(parseNum(conc))} ${concU}/ml` },
          { k: "Formel", v: "Dosis ÷ styrke (pr. ml) = volumen" },
          { k: "Udregning", v: `${fmtNum(r.doseInConcUnit)} ${concU} ÷ ${fmtNum(parseNum(conc))} ${concU}/ml = ${fmtNum(r.ml)} ml` },
        ],
        result: fmtNum(r.ml), unit: "ml",
        note: "Kontrollér resultatet mod ordination og præparatinstruks.",
      });
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <CSeg opts={[{ v: "fast", l: "Faste (tabletter)" }, { v: "flydende", l: "Flydende (ml)" }]} val={mode} set={(m) => { setMode(m); setRes(null); setErr(""); }} />
      <CField label="Ordineret dosis" value={dose} set={setDose} />
      <div><div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>Dosis-enhed</div><CSeg opts={MASS_OPTS} val={doseU} set={setDoseU} /></div>
      {mode === "fast" ? (
        <>
          <CField label="Styrke pr. tablet/kapsel" value={strength} set={setStrength} />
          <div><div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>Styrke-enhed</div><CSeg opts={MASS_OPTS} val={strengthU} set={setStrengthU} /></div>
        </>
      ) : (
        <>
          <CField label="Styrke (koncentration) pr. ml" value={conc} set={setConc} />
          <div><div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>Koncentrations-enhed</div><CSeg opts={CONC_OPTS} val={concU} set={setConcU} /></div>
        </>
      )}
      <CActions onCalc={calc} onReset={reset} />
      {err && <CError msg={err} />}
      {res && <CResult rows={res.rows} result={res.result} unit={res.unit} note={res.note} />}
      <CSafety text={MED_SAFETY} />
    </div>
  );
}

function InfusionsBeregner() {
  const [mode, setMode] = useState("rate");
  const [vol, setVol] = useState("");
  const [timer, setTimer] = useState("");
  const [min, setMin] = useState("");
  const [rate, setRate] = useState("");
  const [drop, setDrop] = useState("");
  const [dmin, setDmin] = useState("");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const reset = () => { setVol(""); setTimer(""); setMin(""); setRate(""); setDrop(""); setDmin(""); setRes(null); setErr(""); };
  const calc = () => {
    setRes(null); setErr("");
    if (mode === "rate") {
      const hrs = (parseNum(timer) || 0) + (parseNum(min) || 0) / 60;
      const r = calculateInfusionRate(parseNum(vol), hrs);
      if (r.error) { setErr(r.error); return; }
      setRes({ rows: [{ k: "Værdier", v: `Volumen ${fmtNum(parseNum(vol))} ml · Tid ${fmtNum(hrs)} timer` }, { k: "Formel", v: "Volumen ÷ tid (timer) = ml/time" }, { k: "Udregning", v: `${fmtNum(parseNum(vol))} ml ÷ ${fmtNum(hrs)} timer = ${fmtNum(r.rate)} ml/time` }], result: fmtNum(r.rate), unit: "ml/time" });
    } else if (mode === "time") {
      const r = calculateInfusionTime(parseNum(vol), parseNum(rate));
      if (r.error) { setErr(r.error); return; }
      const hm = hoursToHM(r.hoursTotal);
      setRes({ rows: [{ k: "Værdier", v: `Volumen ${fmtNum(parseNum(vol))} ml · Hastighed ${fmtNum(parseNum(rate))} ml/time` }, { k: "Formel", v: "Volumen ÷ ml/time = tid" }, { k: "Udregning", v: `${fmtNum(parseNum(vol))} ml ÷ ${fmtNum(parseNum(rate))} ml/time = ${fmtNum(r.hoursTotal)} timer` }], result: hm.m === 0 ? `${hm.h}` : `${hm.h} t ${hm.m} min`, unit: hm.m === 0 ? "timer" : "" });
    } else if (mode === "volume") {
      const hrs = (parseNum(timer) || 0) + (parseNum(min) || 0) / 60;
      const r = calculateInfusionVolume(parseNum(rate), hrs);
      if (r.error) { setErr(r.error); return; }
      setRes({ rows: [{ k: "Værdier", v: `Hastighed ${fmtNum(parseNum(rate))} ml/time · Tid ${fmtNum(hrs)} timer` }, { k: "Formel", v: "ml/time × tid (timer) = volumen" }, { k: "Udregning", v: `${fmtNum(parseNum(rate))} ml/time × ${fmtNum(hrs)} timer = ${fmtNum(r.volume)} ml` }], result: fmtNum(r.volume), unit: "ml" });
    } else {
      const r = calculateDropRate(parseNum(vol), parseNum(drop), parseNum(dmin));
      if (r.error) { setErr(r.error); return; }
      setRes({ rows: [{ k: "Værdier", v: `Volumen ${fmtNum(parseNum(vol))} ml · Dråbefaktor ${fmtNum(parseNum(drop))} dråber/ml · Tid ${fmtNum(parseNum(dmin))} min` }, { k: "Formel", v: "(volumen × dråbefaktor) ÷ tid (min) = dråber/min" }, { k: "Udregning", v: `(${fmtNum(parseNum(vol))} × ${fmtNum(parseNum(drop))}) ÷ ${fmtNum(parseNum(dmin))} = ${fmtNum(r.drops, 1)}` }], result: fmtNum(r.drops, 1), unit: "dråber/min", note: "Dråbefaktor skal aflæses på det konkrete infusionssæt. Kontrollér mod ordination og lokal procedure." });
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <CSeg opts={[{ v: "rate", l: "ml/time" }, { v: "time", l: "Tid" }, { v: "volume", l: "Volumen" }, { v: "drops", l: "Dråber/min" }]} val={mode} set={(m) => { setMode(m); setRes(null); setErr(""); }} />
      {(mode === "rate" || mode === "time" || mode === "drops") && <CField label="Samlet volumen (ml)" value={vol} set={setVol} />}
      {(mode === "time") && <CField label="Hastighed (ml/time)" value={rate} set={setRate} />}
      {(mode === "volume") && <CField label="Hastighed (ml/time)" value={rate} set={setRate} />}
      {(mode === "rate" || mode === "volume") && (
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}><CField label="Timer" value={timer} set={setTimer} /></div>
          <div style={{ flex: 1 }}><CField label="Minutter" value={min} set={setMin} /></div>
        </div>
      )}
      {mode === "drops" && <><CField label="Dråbefaktor (dråber/ml)" value={drop} set={setDrop} /><CField label="Tid (minutter)" value={dmin} set={setDmin} /></>}
      <CActions onCalc={calc} onReset={reset} />
      {err && <CError msg={err} />}
      {res && <CResult rows={res.rows} result={res.result} unit={res.unit} note={res.note} />}
      <CSafety text={INF_SAFETY} />
    </div>
  );
}

function BmiBeregner() {
  const [cm, setCm] = useState("");
  const [kg, setKg] = useState("");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const reset = () => { setCm(""); setKg(""); setRes(null); setErr(""); };
  const calc = () => {
    setRes(null); setErr("");
    const r = calculateBMI(parseNum(cm), parseNum(kg));
    if (r.error) { setErr(r.error); return; }
    setRes({ rows: [{ k: "Værdier", v: `Højde ${fmtNum(parseNum(cm))} cm (${fmtNum(r.m)} m) · Vægt ${fmtNum(parseNum(kg))} kg` }, { k: "Formel", v: "BMI = vægt (kg) ÷ højde² (m)" }, { k: "Udregning", v: `${fmtNum(parseNum(kg))} ÷ (${fmtNum(r.m)} × ${fmtNum(r.m)}) = ${fmtNum(r.bmi, 1)}` }], result: fmtNum(r.bmi, 1), unit: "· " + bmiCategory(r.bmi) });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <CField label="Højde (cm)" value={cm} set={setCm} />
      <CField label="Vægt (kg)" value={kg} set={setKg} />
      <CActions onCalc={calc} onReset={reset} />
      {err && <CError msg={err} />}
      {res && <CResult rows={res.rows} result={"BMI " + res.result} unit={res.unit} />}
      <div style={{ display: "flex", gap: 10, background: tint(C.primary, "0A"), border: `1px solid ${tint(C.primary, "22")}`, borderRadius: 13, padding: "12px 14px" }}>
        <Info size={17} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink }}>BMI beskriver forholdet mellem vægt og højde, men siger ikke direkte noget om muskelmasse, fedtfordeling eller individuel helbredstilstand. Brug det kun som et screenings-/referencemål — ikke som en diagnose.</div>
      </div>
    </div>
  );
}

function calculateBP(rows, method) {
  for (let i = 0; i < 3; i++) {
    const r = rows[i];
    if (!Number.isFinite(r.s) || !Number.isFinite(r.d)) return { error: "Udfyld både systolisk og diastolisk for alle tre målinger." };
    if (!(r.s >= 50 && r.s <= 300)) return { error: "Måling " + (i + 1) + ": systolisk skal være mellem 50 og 300 mmHg." };
    if (!(r.d >= 30 && r.d <= 200)) return { error: "Måling " + (i + 1) + ": diastolisk skal være mellem 30 og 200 mmHg." };
    if (!(r.s > r.d)) return { error: "Måling " + (i + 1) + ": systolisk skal være større end diastolisk." };
  }
  const idx = method === "alle" ? [0, 1, 2] : [1, 2];
  const sysAvg = idx.reduce((a, i) => a + rows[i].s, 0) / idx.length;
  const diaAvg = idx.reduce((a, i) => a + rows[i].d, 0) / idx.length;
  const devSys = Math.abs(rows[1].s - rows[2].s);
  const devDia = Math.abs(rows[1].d - rows[2].d);
  // round ONLY the final result
  return { sysAvg: sysAvg, diaAvg: diaAvg, sysR: Math.round(sysAvg), diaR: Math.round(diaAvg), idx: idx, devSys: devSys, devDia: devDia, warn: devSys > 5 || devDia > 5 };
}

const BT_GUIDE_URL = "https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/undersoegelser-og-proever/kliniske-procedurer/hjertekar/blodtryksmaaling/";
function BlodtryksBeregner() {
  const [s1, setS1] = useState(""); const [d1, setD1] = useState("");
  const [s2, setS2] = useState(""); const [d2, setD2] = useState("");
  const [s3, setS3] = useState(""); const [d3, setD3] = useState("");
  const [method, setMethod] = useState("2og3");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const reset = () => { setS1(""); setD1(""); setS2(""); setD2(""); setS3(""); setD3(""); setMethod("2og3"); setRes(null); setErr(""); };
  const calc = () => {
    setRes(null); setErr("");
    const rows = [{ s: parseNum(s1), d: parseNum(d1) }, { s: parseNum(s2), d: parseNum(d2) }, { s: parseNum(s3), d: parseNum(d3) }];
    const r = calculateBP(rows, method);
    if (r.error) { setErr(r.error); return; }
    const lbl = method === "alle" ? "Gennemsnit af alle tre målinger" : "Gennemsnit af måling 2 og 3 (standard)";
    const sNums = r.idx.map((i) => fmtNum(rows[i].s)).join(" + ");
    const dNums = r.idx.map((i) => fmtNum(rows[i].d)).join(" + ");
    const n = r.idx.length;
    const udregning = "Systolisk: (" + sNums + ") ÷ " + n + " = " + fmtNum(r.sysAvg, 2) + " → afrundet " + r.sysR + ". Diastolisk: (" + dNums + ") ÷ " + n + " = " + fmtNum(r.diaAvg, 2) + " → afrundet " + r.diaR + ".";
    setRes({ method: lbl, udregning: udregning, sysR: r.sysR, diaR: r.diaR, warn: r.warn, devSys: r.devSys, devDia: r.devDia });
  };
  const INP = { width: "100%", boxSizing: "border-box", border: "1px solid " + C.line, borderRadius: 11, padding: "12px 13px", fontSize: 16, color: C.ink, background: C.surface, fontFamily: "inherit", outline: "none" };
  const bpRow = (n, sv, setS, dv, setD, hint) => (
    <div style={{ border: "1px solid " + C.line, borderRadius: 14, padding: "12px 13px", background: C.surface }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Måling {n}</span>
        {hint ? <span style={{ fontSize: 11, color: C.inkFaint }}>{hint}</span> : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>Systolisk (øvre)</div>
          <input value={sv} onChange={(e) => setS(e.target.value)} inputMode="numeric" placeholder="fx 138" aria-label={"Måling " + n + " systolisk"} style={INP} />
        </div>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>Diastolisk (nedre)</div>
          <input value={dv} onChange={(e) => setD(e.target.value)} inputMode="numeric" placeholder="fx 86" aria-label={"Måling " + n + " diastolisk"} style={INP} />
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13, paddingBottom: 90 }}>
      <p style={{ margin: 0, fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Indtast tre blodtryksmålinger. Beregneren viser gennemsnittet i mmHg og runder først det endelige resultat af. Ingen data gemmes.</p>
      {bpRow(1, s1, setS1, d1, setD1, "indgår ikke i standard-gennemsnittet")}
      {bpRow(2, s2, setS2, d2, setD2, "")}
      {bpRow(3, s3, setS3, d3, setD3, "")}

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 7 }}>Beregningsmetode</div>
        <CSeg opts={[{ v: "2og3", l: "Gns. af måling 2 og 3 (standard)" }, { v: "alle", l: "Gns. af alle tre" }]} val={method} set={(v) => { setMethod(v); setRes(null); }} />
      </div>

      <CActions onCalc={calc} onReset={reset} />
      {err && <CError msg={err} />}

      {res && (
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ border: "1px solid " + tint(C.primary, "33"), background: tint(C.primary, "0A"), borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft }}>Gennemsnitsblodtryk</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.ink, letterSpacing: -0.5, marginTop: 2 }}>{res.sysR}/{res.diaR} <span style={{ fontSize: 18, fontWeight: 700, color: C.inkSoft }}>mmHg</span></div>
            <div style={{ marginTop: 11, paddingTop: 11, borderTop: "1px solid " + tint(C.primary, "22") }}>
              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}><b>Metode:</b> {res.method}</div>
              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.55, marginTop: 5 }}><b>Udregning:</b> {res.udregning}</div>
            </div>
          </div>
          {res.warn && (
            <div style={{ display: "flex", gap: 10, background: tint("#B7791F", "12"), border: "1px solid " + tint("#B7791F", "33"), borderRadius: 13, padding: "12px 14px" }}>
              <Info size={18} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "#7A4E0A" }}>Måling 2 og 3 afviger mere end 5 mmHg (systolisk {res.devSys}, diastolisk {res.devDia}). Overvej supplerende målinger efter gældende procedure.</div>
            </div>
          )}
        </div>
      )}

      <a href={BT_GUIDE_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <div style={{ border: "1px solid " + tint(C.primary, "33"), background: tint(C.primary, "0A"), borderRadius: 13, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <Activity size={18} color={C.primary} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.primary }}>Vejledning om blodtryksmåling (Sundhed.dk)</div>
            <div style={{ fontSize: 11.5, color: C.inkSoft }}>Lægehåndbogen · faglig reference</div>
          </div>
          <ChevronRight size={17} color={C.primary} />
        </div>
      </a>

      <div style={{ display: "flex", gap: 10, background: tint(C.primary, "0A"), border: "1px solid " + tint(C.primary, "22"), borderRadius: 13, padding: "12px 14px" }}>
        <Info size={17} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink }}>En fuld hjemmeblodtryksundersøgelse kræver normalt målinger både morgen og aften over flere dage. Denne beregner udregner kun gennemsnittet af én måleserie. Den stiller ikke diagnoser og giver ingen behandlingsforslag — følg altid lokal procedure og faglig vurdering.</div>
      </div>
    </div>
  );
}

const CALC_TOOLS = [
  { id: "medicin", title: "Medicinberegner", sub: "Dosis, styrke og mængde", Icon: Pill, kw: "medicinberegner medicinberegning dosis tabletter kapsler flydende medicin styrke mængde mg ml mikrogram" },
  { id: "infusion", title: "Infusioner", sub: "ml/time, tid og volumen", Icon: Droplets, kw: "infusioner infusionsberegner infusion ml/time tid volumen dråber/minut dråber/min dråbefaktor" },
  { id: "bmi", title: "BMI-beregner", sub: "Højde + vægt → BMI", Icon: Gauge, kw: "bmi bmi-beregner højde vægt body mass index" },
  { id: "blodtryk", title: "Blodtryksberegner", sub: "Gennemsnit af 3 målinger", Icon: Activity, kw: "blodtryk blodtryksberegner systolisk diastolisk mmhg gennemsnit tre maalinger hjemmeblodtryk bt" },
];
const calcSearch = (q) => { const s = (q || "").trim().toLowerCase(); return s ? CALC_TOOLS.filter((c) => (c.title + " " + c.sub + " " + c.kw).toLowerCase().includes(s)) : []; };

/* Pseudo-categories so Fagligt sprog, Plejeprocedurer and Test Viden appear in the
   KLINISKE KATEGORIER grid with the same card design (they keep their own screens). */
/* ===== FAGLIGT SPROG — Anatomi & fysiologi =============================
 *  Dansk → fagligt → latin opslag for SSA-elever og sundhedspersonale.
 *  Latinske betegnelser følger gængs anatomisk nomenklatur (Terminologia
 *  Anatomica). Betegnelser der IKKE kan verificeres sikkert markeres med
 *  flag:true ("Til faglig kontrol") frem for at blive opfundet.
 *  Data er struktureret med stabile id'er, så en interaktiv kropsillustration
 *  senere kan mappe et tryk (bodyKey) direkte til et opslag.
 * ===================================================================== */
const ANAT_SUBS = [
  { id: "alle", label: "Alle" },
  { id: "ydre", label: "Kroppens ydre anatomi" },
  { id: "organer", label: "Organer" },
  { id: "systemer", label: "Organsystemer" },
  { id: "indre", label: "Indre anatomi" },
  { id: "retning", label: "Retningsbegreber" },
  { id: "fysiologi", label: "Fysiologi" },
];
const ANAT_TYPE_LABEL = { region: "Kropsregion", knogle: "Knogle", led: "Led", muskel: "Muskel", organ: "Organ", system: "Organsystem", struktur: "Struktur", retning: "Retningsbegreb" };

const ANAT = [
  /* ---------- Kroppens ydre anatomi: regioner ---------- */
  { id: "a-hoved", sub: "ydre", type: "region", bodyKey: "hoved", daglig: "Hoved", faglig: "Hovedregion", latin: "Caput / Regio capitis", forklaring: "Hele hovedet inkl. kraniet.", placering: "Øverst på kroppen, over halsen.", syn: ["hovede", "cranium region"] },
  { id: "a-ansigt", sub: "ydre", type: "region", bodyKey: "hoved", daglig: "Ansigt", faglig: "Ansigtsregion", latin: "Facies / Regio facialis", forklaring: "Forsiden af hovedet.", placering: "Forreste del af hovedet.", syn: ["fjæs"] },
  { id: "a-hals", sub: "ydre", type: "region", bodyKey: "hals", daglig: "Hals", faglig: "Halsregion", latin: "Collum / Regio cervicalis", forklaring: "For- og sideflade af halsen.", placering: "Mellem hoved og brystkasse.", syn: ["strube"] },
  { id: "a-nakke", sub: "ydre", type: "region", bodyKey: "hals", daglig: "Nakke", faglig: "Nakkeregion", latin: "Nucha / Regio cervicalis posterior", forklaring: "Bagsiden af halsen.", placering: "Bag på halsen.", syn: ["nakken"] },
  { id: "a-skulder", sub: "ydre", type: "region", bodyKey: "skulder", daglig: "Skulder", faglig: "Skulderregion", latin: "Regio deltoidea", forklaring: "Området omkring skulderleddet.", placering: "Øverst på armen, ved kroppen.", syn: ["skuldre"], doc: "Nedsat bevægelighed i højre skulder." },
  { id: "a-brystkasse", sub: "ydre", type: "region", bodyKey: "thorax", daglig: "Brystkasse", faglig: "Brystregion / thorax", latin: "Thorax / Regio thoracica", forklaring: "Brysthulen med ribben, hjerte og lunger.", placering: "Øverste del af kroppen.", syn: ["bryst", "brystkasse", "thorax"] },
  { id: "a-ryg", sub: "ydre", type: "region", bodyKey: "ryg", daglig: "Ryg", faglig: "Rygregion", latin: "Dorsum / Regio dorsalis", forklaring: "Bagsiden af kroppen.", placering: "Bagsiden fra nakke til bækken.", syn: ["ryggen"] },
  { id: "a-abdomen", sub: "ydre", type: "region", bodyKey: "abdomen", daglig: "Mave / abdomen", faglig: "Bugregion / abdomen", latin: "Abdomen / Regio abdominalis", forklaring: "Bughulen med mave-tarm-organer.", placering: "Mellem brystkasse og bækken.", syn: ["mave", "bug", "abdomen"], doc: "Borger angiver smerter i nedre abdomen." },
  { id: "a-baekken", sub: "ydre", type: "region", bodyKey: "baekken", daglig: "Bækken", faglig: "Bækkenregion", latin: "Pelvis / Regio pelvica", forklaring: "Nederste del af bugen med bækkenorganer.", placering: "Mellem mave og lår.", syn: ["pelvis"] },
  { id: "a-balle", sub: "ydre", type: "region", bodyKey: "balle", daglig: "Balle", faglig: "Glutealregion", latin: "Regio glutealis", forklaring: "Bagdelen; området over sædemusklerne.", placering: "Bageste del af bækken-/hofteregionen.", doc: "Der observeres rødme i højre glutealregion.", syn: ["balder", "bagdel", "sæde", "numse", "ende"] },
  { id: "a-overarm", sub: "ydre", type: "region", bodyKey: "overarm", daglig: "Overarm", faglig: "Overarmsregion", latin: "Brachium / Regio brachialis", forklaring: "Armen mellem skulder og albue.", placering: "Øvre del af armen.", syn: ["overarme"] },
  { id: "a-albue", sub: "ydre", type: "region", bodyKey: "albue", daglig: "Albue", faglig: "Albueregion", latin: "Cubitus / Regio cubitalis", forklaring: "Området omkring albueleddet.", placering: "Mellem overarm og underarm.", syn: ["albuer"] },
  { id: "a-underarm", sub: "ydre", type: "region", bodyKey: "underarm", daglig: "Underarm", faglig: "Underarmsregion", latin: "Antebrachium / Regio antebrachialis", forklaring: "Armen mellem albue og håndled.", placering: "Nedre del af armen.", syn: ["underarme"] },
  { id: "a-haand", sub: "ydre", type: "region", bodyKey: "haand", daglig: "Hånd", faglig: "Håndregion", latin: "Manus / Regio manus", forklaring: "Hånden fra håndled til fingerspidser.", placering: "For enden af underarmen.", syn: ["hænder"] },
  { id: "a-fingre", sub: "ydre", type: "region", bodyKey: "haand", daglig: "Fingre", faglig: "Fingre", latin: "Digiti manus", forklaring: "Håndens fingre.", placering: "Yderst på hånden.", syn: ["finger"] },
  { id: "a-hofte", sub: "ydre", type: "region", bodyKey: "hofte", daglig: "Hofte", faglig: "Hofteregion", latin: "Coxa / Regio coxae", forklaring: "Området omkring hofteleddet.", placering: "Mellem bækken og lår.", syn: ["hofter"] },
  { id: "a-laar", sub: "ydre", type: "region", bodyKey: "laar", daglig: "Lår", faglig: "Lårregion", latin: "Femur (region) / Regio femoris", forklaring: "Benet mellem hofte og knæ. OBS: selve lårbenet (knoglen) hedder os femoris.", placering: "Øvre del af benet.", syn: ["lårene"], related: ["a-laarben"] },
  { id: "a-knae", sub: "ydre", type: "region", bodyKey: "knae", daglig: "Knæ", faglig: "Knæregion", latin: "Genu / Regio genus", forklaring: "Området omkring knæleddet.", placering: "Mellem lår og underben.", syn: ["knæene"] },
  { id: "a-underben", sub: "ydre", type: "region", bodyKey: "underben", daglig: "Underben", faglig: "Underbensregion", latin: "Crus / Regio cruris", forklaring: "Benet mellem knæ og ankel.", placering: "Nedre del af benet.", syn: ["skinneben region", "læg"] },
  { id: "a-ankel", sub: "ydre", type: "region", bodyKey: "ankel", daglig: "Ankel", faglig: "Ankelregion", latin: "Regio talocruralis", forklaring: "Området omkring ankelleddet.", placering: "Mellem underben og fod.", syn: ["ankler", "malleol"] },
  { id: "a-fod", sub: "ydre", type: "region", bodyKey: "fod", daglig: "Fod", faglig: "Fodregion", latin: "Pes / Regio pedis", forklaring: "Foden fra ankel til tæer.", placering: "Nederst på benet.", syn: ["fødder"], doc: "Tør, sprukken hud på højre fod." },
  { id: "a-taeer", sub: "ydre", type: "region", bodyKey: "fod", daglig: "Tæer", faglig: "Tæer", latin: "Digiti pedis", forklaring: "Fodens tæer.", placering: "Yderst på foden.", syn: ["tå"] },

  /* ---------- Knogler ---------- */
  { id: "a-kranie", sub: "ydre", type: "knogle", bodyKey: "hoved", daglig: "Kranie", faglig: "Kranium", latin: "Cranium", forklaring: "Knoglerne der beskytter hjernen.", syn: ["hovedskal"] },
  { id: "a-rygsoejle", sub: "ydre", type: "knogle", bodyKey: "ryg", daglig: "Rygsøjle", faglig: "Rygsøjle / ryghvirvler", latin: "Columna vertebralis (Vertebrae)", forklaring: "Søjlen af ryghvirvler; beskytter rygmarven.", syn: ["ryghvirvler", "hvirvler", "rygrad"] },
  { id: "a-brystben", sub: "ydre", type: "knogle", bodyKey: "thorax", daglig: "Brystben", faglig: "Brystben", latin: "Sternum", forklaring: "Fladt ben midt på brystkassen.", syn: ["sternum"] },
  { id: "a-ribben", sub: "ydre", type: "knogle", bodyKey: "thorax", daglig: "Ribben", faglig: "Ribben", latin: "Costae", forklaring: "Buede knogler der danner brystkassen.", syn: ["costae"] },
  { id: "a-kraveben", sub: "ydre", type: "knogle", bodyKey: "skulder", daglig: "Kraveben", faglig: "Kraveben", latin: "Clavicula", forklaring: "Knogle mellem brystben og skulderblad.", syn: ["clavicula"] },
  { id: "a-skulderblad", sub: "ydre", type: "knogle", bodyKey: "skulder", daglig: "Skulderblad", faglig: "Skulderblad", latin: "Scapula", forklaring: "Fladt ben på øvre ryg ved skulderen.", syn: ["scapula"] },
  { id: "a-overarmsknogle", sub: "ydre", type: "knogle", bodyKey: "overarm", daglig: "Overarmsknogle", faglig: "Overarmsknogle", latin: "Humerus", forklaring: "Knoglen i overarmen.", syn: ["humerus"] },
  { id: "a-spoleben", sub: "ydre", type: "knogle", bodyKey: "underarm", daglig: "Spoleben", faglig: "Spoleben", latin: "Radius", forklaring: "Underarmsknogle på tommelfingersiden.", syn: ["radius"] },
  { id: "a-albueben", sub: "ydre", type: "knogle", bodyKey: "underarm", daglig: "Albueben", faglig: "Albueben", latin: "Ulna", forklaring: "Underarmsknogle på lillefingersiden.", syn: ["ulna"] },
  { id: "a-hofteben", sub: "ydre", type: "knogle", bodyKey: "baekken", daglig: "Hofteben", faglig: "Hofteben", latin: "Os coxae", forklaring: "Bækkenknoglen i hver side.", syn: ["os coxae"] },
  { id: "a-laarben", sub: "ydre", type: "knogle", bodyKey: "laar", daglig: "Lårben", faglig: "Lårben", latin: "Femur (Os femoris)", forklaring: "Kroppens største knogle i låret. OBS: adskil fra lår­REGIONEN.", syn: ["femur", "os femoris"] },
  { id: "a-knaeskal", sub: "ydre", type: "knogle", bodyKey: "knae", daglig: "Knæskal", faglig: "Knæskal", latin: "Patella", forklaring: "Lille knogle foran knæleddet.", syn: ["patella"] },
  { id: "a-skinneben", sub: "ydre", type: "knogle", bodyKey: "underben", daglig: "Skinneben", faglig: "Skinneben", latin: "Tibia", forklaring: "Den kraftige underbensknogle foran.", syn: ["tibia"] },
  { id: "a-laegben", sub: "ydre", type: "knogle", bodyKey: "underben", daglig: "Lægben", faglig: "Lægben", latin: "Fibula", forklaring: "Tynd underbensknogle på ydersiden.", syn: ["fibula"] },
  { id: "a-haelben", sub: "ydre", type: "knogle", bodyKey: "fod", daglig: "Hælben", faglig: "Hælben", latin: "Calcaneus", forklaring: "Den store knogle i hælen.", syn: ["calcaneus", "hæl"] },

  /* ---------- Led ---------- */
  { id: "a-skulderled", sub: "ydre", type: "led", bodyKey: "skulder", daglig: "Skulderled", faglig: "Skulderled", latin: "Articulatio humeri", forklaring: "Kugleled mellem overarm og skulderblad.", syn: ["glenohumeralled"] },
  { id: "a-albueled", sub: "ydre", type: "led", bodyKey: "albue", daglig: "Albueled", faglig: "Albueled", latin: "Articulatio cubiti", forklaring: "Led mellem overarm og underarm.", syn: [] },
  { id: "a-hofteled", sub: "ydre", type: "led", bodyKey: "hofte", daglig: "Hofteled", faglig: "Hofteled", latin: "Articulatio coxae", forklaring: "Kugleled mellem lårben og bækken.", syn: [] },
  { id: "a-knaeled", sub: "ydre", type: "led", bodyKey: "knae", daglig: "Knæled", faglig: "Knæled", latin: "Articulatio genus", forklaring: "Hængselled mellem lårben og skinneben.", syn: [] },
  { id: "a-ankelled", sub: "ydre", type: "led", bodyKey: "ankel", daglig: "Ankelled", faglig: "Ankelled", latin: "Articulatio talocruralis", forklaring: "Led mellem underben og fod.", syn: [] },

  /* ---------- Muskler ---------- */
  { id: "a-deltoid", sub: "ydre", type: "muskel", bodyKey: "skulder", daglig: "Skuldermuskel", faglig: "Deltamuskel", latin: "Musculus deltoideus", forklaring: "Løfter armen; almindeligt injektionssted i.m.", syn: ["deltoid", "deltamuskel"] },
  { id: "a-biceps", sub: "ydre", type: "muskel", bodyKey: "overarm", daglig: "Bicepsmuskel", faglig: "Biceps", latin: "Musculus biceps brachii", forklaring: "Bøjer albuen.", syn: ["biceps"] },
  { id: "a-quadriceps", sub: "ydre", type: "muskel", bodyKey: "laar", daglig: "Forlårsmuskel", faglig: "Quadriceps", latin: "Musculus quadriceps femoris", forklaring: "Stor forlårsmuskel; strækker knæet.", syn: ["quadriceps", "forlår"] },
  { id: "a-gluteus", sub: "ydre", type: "muskel", bodyKey: "balle", daglig: "Sædemuskel", faglig: "Store baldemuskel", latin: "Musculus gluteus maximus", forklaring: "Kroppens store baldemuskel; strækker hoften.", syn: ["gluteus", "baldemuskel"] },
  { id: "a-gastrocnemius", sub: "ydre", type: "muskel", bodyKey: "underben", daglig: "Lægmuskel", faglig: "Lægmuskel", latin: "Musculus gastrocnemius", forklaring: "Muskel på bagsiden af underbenet.", syn: ["læg", "lægmuskel"] },

  /* ---------- Organer ---------- */
  { id: "a-hjerte", sub: "organer", type: "organ", bodyKey: "thorax", daglig: "Hjerte", faglig: "Hjerte", latin: "Cor", system: "Kredsløbssystemet", forklaring: "Muskelpumpe der driver blodet rundt i kroppen.", placering: "I brysthulen (thorax), lidt til venstre.", funktion: "Pumper blod gennem det store og det lille kredsløb, så ilt og næring når ud til cellerne.", indre: [{ n: "Højre forkammer", l: "Atrium dextrum" }, { n: "Venstre forkammer", l: "Atrium sinistrum" }, { n: "Højre hjertekammer", l: "Ventriculus dexter" }, { n: "Venstre hjertekammer", l: "Ventriculus sinister" }, { n: "Hjerteklapper", l: "Valvae cordis (mitralis, tricuspidalis, aortae, pulmonalis)" }], begreber: ["Puls", "Blodtryk", "Systole/diastole"], doc: "Regelmæssig puls, 78 pr. min.", catLink: "diagnoser", syn: ["hjertet"] },
  { id: "a-lunger", sub: "organer", type: "organ", bodyKey: "thorax", daglig: "Lunger", faglig: "Lunger", latin: "Pulmones (sg. Pulmo)", system: "Respirationssystemet", forklaring: "To organer der optager ilt og afgiver kuldioxid.", placering: "I brysthulen, på hver side af hjertet.", funktion: "Ilt fra luften optages i blodet, og kuldioxid afgives — gasudveksling i alveolerne.", indre: [{ n: "Lungelapper", l: "Lobi pulmonis" }, { n: "Bronkier", l: "Bronchi" }, { n: "Lungeblærer", l: "Alveoli pulmonis" }], begreber: ["Respiration", "Saturation (SpO₂)", "Dyspnø"], doc: "Rolig, ubesværet respiration 16 pr. min.", catLink: "observationer", syn: ["lunge"] },
  { id: "a-lever", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Lever", faglig: "Lever", latin: "Hepar", system: "Fordøjelsessystemet", forklaring: "Stort stofskifteorgan der bl.a. afgifter og danner galde.", placering: "Øverst til højre i bughulen, under mellemgulvet.", funktion: "Omsætter næringsstoffer, afgifter stoffer og medicin og danner galde til fordøjelsen.", begreber: ["Stofskifte", "Galde", "Afgiftning"], syn: ["leveren"] },
  { id: "a-nyrer", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Nyrer", faglig: "Nyrer", latin: "Ren (pl. Renes)", system: "Urinvejssystemet", forklaring: "To bønneformede organer der filtrerer blodet og danner urin.", placering: "Bagtil i bughulen (retroperitonealt), en i hver side.", funktion: "Filtrerer blodet, danner urin og regulerer væske-, elektrolyt-, syre-base-balance og blodtryk.", indre: [{ n: "Nyrebark", l: "Cortex renalis" }, { n: "Nyremarv", l: "Medulla renalis" }, { n: "Nyrebækken", l: "Pelvis renalis" }, { n: "Urinleder", l: "Ureter" }], begreber: ["Diurese", "Væskebalance", "Elektrolytter"], doc: "Diurese sv.t. indtag; klar, lys urin.", catLink: "normalvaerdier", syn: ["nyre"] },
  { id: "a-urinblaere", sub: "organer", type: "organ", bodyKey: "baekken", daglig: "Urinblære", faglig: "Urinblære", latin: "Vesica urinaria", system: "Urinvejssystemet", forklaring: "Muskelpose der opsamler urin fra nyrerne.", placering: "Nederst i bækkenet.", funktion: "Opsamler og tømmer urin (vandladning).", begreber: ["Vandladning", "Residualurin", "Inkontinens"], syn: ["blære"] },
  { id: "a-mavesaek", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Mavesæk", faglig: "Mavesæk / ventrikel", latin: "Ventriculus (Gaster)", system: "Fordøjelsessystemet", forklaring: "Muskelpose der blander og nedbryder maden.", placering: "Øverst til venstre i bughulen.", funktion: "Opbevarer maden, blander den med mavesyre og starter nedbrydningen af protein.", begreber: ["Mavesyre", "Fordøjelse"], syn: ["mave", "ventrikel"] },
  { id: "a-tyndtarm", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Tyndtarm", faglig: "Tyndtarm", latin: "Intestinum tenue", system: "Fordøjelsessystemet", forklaring: "Lang tarm hvor størstedelen af næringen optages.", placering: "Midt i bughulen.", funktion: "Nedbryder maden videre og optager næringsstoffer til blodet.", indre: [{ n: "Tolvfingertarm", l: "Duodenum" }, { n: "Jejunum", l: "Jejunum" }, { n: "Ileum", l: "Ileum" }], begreber: ["Absorption", "Peristaltik"], syn: [] },
  { id: "a-tyktarm", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Tyktarm", faglig: "Tyktarm", latin: "Intestinum crassum", system: "Fordøjelsessystemet", forklaring: "Tarm der opsuger vand og danner afføring.", placering: "Rammer bughulen som en ramme om tyndtarmen.", funktion: "Optager vand og salte og former afføringen.", indre: [{ n: "Blindtarm", l: "Caecum" }, { n: "Tyktarm", l: "Colon" }, { n: "Endetarm", l: "Rectum" }], begreber: ["Obstipation", "Afføring"], catLink: "ernaering", syn: ["colon"] },
  { id: "a-endetarm", sub: "organer", type: "organ", bodyKey: "baekken", daglig: "Endetarm", faglig: "Endetarm / rectum", latin: "Rectum", system: "Fordøjelsessystemet", forklaring: "Sidste del af tarmen før anus.", placering: "Nederst i bækkenet.", funktion: "Opbevarer afføring indtil tømning.", syn: ["rectum", "endetarmen"] },
  { id: "a-pancreas", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Bugspytkirtel", faglig: "Bugspytkirtel / pankreas", latin: "Pancreas", system: "Fordøjelses- og hormonsystemet", forklaring: "Kirtel der danner fordøjelsesenzymer og hormoner.", placering: "Bag mavesækken.", funktion: "Danner fordøjelsesenzymer til tarmen og hormonerne insulin og glukagon, der styrer blodsukkeret.", begreber: ["Insulin", "Blodsukker", "Enzymer"], catLink: "diagnoser", syn: ["pankreas"] },
  { id: "a-milt", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Milt", faglig: "Milt", latin: "Lien (Splen)", system: "Lymfe- og immunsystemet", forklaring: "Organ der renser blodet og indgår i immunforsvaret.", placering: "Øverst til venstre i bughulen.", funktion: "Nedbryder gamle blodlegemer og hjælper immunforsvaret.", syn: ["milten"] },
  { id: "a-hjerne", sub: "organer", type: "organ", bodyKey: "hoved", daglig: "Hjerne", faglig: "Hjerne", latin: "Encephalon", system: "Nervesystemet", forklaring: "Styrecentral for krop, sanser, tanker og bevægelse.", placering: "Inde i kraniet.", funktion: "Modtager sanseindtryk, styrer bevægelser og regulerer bevidsthed og vitale funktioner.", indre: [{ n: "Storhjerne", l: "Cerebrum" }, { n: "Lillehjerne", l: "Cerebellum" }, { n: "Hjernestamme", l: "Truncus encephali" }], begreber: ["Bevidsthedsniveau", "Neuron"], syn: ["hjernen"] },
  { id: "a-thyroidea", sub: "organer", type: "organ", bodyKey: "hals", daglig: "Skjoldbruskkirtel", faglig: "Skjoldbruskkirtel", latin: "Glandula thyroidea", system: "Hormonsystemet", forklaring: "Hormonkirtel på halsen.", placering: "Foran på halsen, foran luftrøret.", funktion: "Danner stofskiftehormoner, der regulerer kroppens forbrænding.", begreber: ["Stofskifte", "Hormon"], syn: ["thyroidea", "skjoldbrusk"] },
  { id: "a-galdeblaere", sub: "organer", type: "organ", bodyKey: "abdomen", daglig: "Galdeblære", faglig: "Galdeblære", latin: "Vesica biliaris (Vesica fellea)", system: "Fordøjelsessystemet", forklaring: "Lille pose der opbevarer galde.", placering: "Under leveren.", funktion: "Opbevarer og afgiver galde til fordøjelsen af fedt.", syn: ["galde"] },
  { id: "a-spiseroer", sub: "organer", type: "organ", bodyKey: "thorax", daglig: "Spiserør", faglig: "Spiserør / øsofagus", latin: "Oesophagus", system: "Fordøjelsessystemet", forklaring: "Rør der fører maden fra svælg til mavesæk.", placering: "Bag luftrøret gennem brysthulen.", funktion: "Transporterer mad og væske til mavesækken ved peristaltik.", begreber: ["Synkning", "Peristaltik"], syn: ["øsofagus", "spiserøret"] },
  { id: "a-livmoder", sub: "organer", type: "organ", bodyKey: "baekken", daglig: "Livmoder", faglig: "Livmoder", latin: "Uterus", system: "Reproduktionssystemet", forklaring: "Kvindeligt kønsorgan hvor fosteret udvikles.", placering: "I bækkenet.", funktion: "Rummer og ernærer et foster under graviditet.", syn: ["uterus"] },
  { id: "a-aeggestokke", sub: "organer", type: "organ", bodyKey: "baekken", daglig: "Æggestokke", faglig: "Æggestokke / ovarier", latin: "Ovarium (pl. Ovaria)", system: "Reproduktionssystemet", forklaring: "Kvindelige kønskirtler der danner æg og hormoner.", placering: "På hver side af livmoderen.", funktion: "Danner æg og kønshormoner (østrogen/progesteron).", syn: ["ovarier"] },
  { id: "a-testikler", sub: "organer", type: "organ", bodyKey: "baekken", daglig: "Testikler", faglig: "Testikler", latin: "Testis (pl. Testes)", system: "Reproduktionssystemet", forklaring: "Mandlige kønskirtler der danner sæd og hormoner.", placering: "I pungen.", funktion: "Danner sædceller og hormonet testosteron.", syn: ["testis"] },
  { id: "a-prostata", sub: "organer", type: "organ", bodyKey: "baekken", daglig: "Blærehalskirtel", faglig: "Blærehalskirtel / prostata", latin: "Prostata", system: "Reproduktionssystemet", forklaring: "Kirtel omkring urinrøret hos mænd.", placering: "Under urinblæren.", funktion: "Danner en del af sædvæsken.", syn: ["prostata"] },

  /* ---------- Organsystemer ---------- */
  { id: "s-kredsloeb", sub: "systemer", type: "system", daglig: "Kredsløbssystemet", faglig: "Kredsløbssystemet", latin: "Systema cardiovasculare", forklaring: "Transporterer blod med ilt, næring og affaldsstoffer.", funktion: "Hjertet pumper blodet gennem arterier, kapillærer og vener, så cellerne får ilt og næring, og affaldsstoffer føres væk.", organer: ["Hjerte (Cor)", "Blodkar (arterier, vener, kapillærer)", "Blod"], begreber: ["Puls", "Blodtryk", "Iltning"], syn: ["hjerte-kar", "cirkulation"] },
  { id: "s-respiration", sub: "systemer", type: "system", daglig: "Respirationssystemet", faglig: "Respirationssystemet", latin: "Systema respiratorium", forklaring: "Optager ilt og afgiver kuldioxid.", funktion: "Luft føres via næse, svælg, strubehoved, luftrør og bronkier til alveolerne, hvor ilt optages og kuldioxid afgives.", organer: ["Næse og svælg", "Strubehoved (Larynx)", "Luftrør (Trachea)", "Bronkier", "Lunger (Pulmones)"], begreber: ["Respirationsfrekvens", "Saturation", "Dyspnø"], syn: ["vejrtrækning", "åndedræt"] },
  { id: "s-fordoejelse", sub: "systemer", type: "system", daglig: "Fordøjelsessystemet", faglig: "Fordøjelsessystemet", latin: "Systema digestorium", forklaring: "Nedbryder mad og optager næring.", funktion: "Maden nedbrydes fra mund til tarm, næringsstoffer optages, og resten bliver til afføring.", organer: ["Mund og spiserør", "Mavesæk (Ventriculus)", "Tyndtarm", "Tyktarm", "Lever, galdeblære, bugspytkirtel"], begreber: ["Peristaltik", "Absorption", "Obstipation"], syn: ["mave-tarm", "gastrointestinal"] },
  { id: "s-urinveje", sub: "systemer", type: "system", daglig: "Urinvejssystemet", faglig: "Urinvejssystemet", latin: "Systema urinarium", forklaring: "Filtrerer blodet og udskiller urin.", funktion: "Nyrerne filtrerer blodet og danner urin, som via urinledere samles i blæren og tømmes gennem urinrøret.", organer: ["Nyrer (Renes)", "Urinledere (Ureteres)", "Urinblære (Vesica urinaria)", "Urinrør (Urethra)"], begreber: ["Diurese", "Væskebalance", "Inkontinens"], syn: ["urinveje"] },
  { id: "s-nerve", sub: "systemer", type: "system", daglig: "Nervesystemet", faglig: "Nervesystemet", latin: "Systema nervosum", forklaring: "Styrer og koordinerer kroppens funktioner.", funktion: "Modtager, bearbejder og sender signaler, der styrer bevægelse, sanser og bevidsthed.", organer: ["Hjerne (Encephalon)", "Rygmarv (Medulla spinalis)", "Nerver (Nervi)"], begreber: ["Centralnervesystem (CNS)", "Perifert nervesystem (PNS)", "Refleks"], syn: ["nerver"] },
  { id: "s-endokrin", sub: "systemer", type: "system", daglig: "Hormonsystemet", faglig: "Det endokrine system", latin: "Systema endocrinum", forklaring: "Regulerer kroppen via hormoner.", funktion: "Kirtler udskiller hormoner til blodet, der styrer bl.a. blodsukker, stofskifte og væskebalance.", organer: ["Skjoldbruskkirtel", "Bugspytkirtel", "Binyrer", "Hypofyse"], begreber: ["Hormon", "Insulin", "Stofskifte"], syn: ["endokrine system", "hormoner"] },
  { id: "s-bevaege", sub: "systemer", type: "system", daglig: "Bevægeapparatet", faglig: "Bevægeapparatet", latin: "Systema musculoskeletale", forklaring: "Giver støtte, beskyttelse og bevægelse.", funktion: "Knogler danner skelettet, led gør bevægelse mulig, og muskler trækker sig sammen og bevæger kroppen.", organer: ["Knogler (Ossa)", "Led (Articulationes)", "Muskler (Musculi)", "Sener"], begreber: ["Fleksion", "Ekstension", "Mobilitet"], syn: ["muskler og knogler", "skelet"] },
  { id: "s-hud", sub: "systemer", type: "system", daglig: "Hudsystemet", faglig: "Huden", latin: "Integumentum commune", forklaring: "Beskytter kroppen og regulerer temperatur.", funktion: "Huden er en barriere mod smitte, regulerer temperatur og indeholder sanseceller.", organer: ["Overhud (Epidermis)", "Læderhud (Dermis)", "Underhud (Subcutis)"], begreber: ["Tryksår", "Hudpleje", "Sansning"], catLink: "saarpleje", syn: ["hud"] },
  { id: "s-lymfe", sub: "systemer", type: "system", daglig: "Lymfe- og immunsystemet", faglig: "Lymfe- og immunsystemet", latin: "Systema lymphoideum", forklaring: "Forsvarer kroppen mod infektion og styrer væskebalance.", funktion: "Lymfekar og lymfeknuder transporterer lymfevæske og hjælper immunforsvaret med at bekæmpe smitte.", organer: ["Lymfeknuder", "Milt (Lien)", "Thymus", "Lymfekar"], begreber: ["Immunforsvar", "Infektion", "Lymfe"], catLink: "mikrobiologi", syn: ["immunforsvar", "lymfe"] },
  { id: "s-repro", sub: "systemer", type: "system", daglig: "Reproduktionssystemet", faglig: "Forplantningssystemet", latin: "Systema genitale", forklaring: "Står for forplantning.", funktion: "Danner kønsceller og hormoner og muliggør forplantning.", organer: ["Kvinde: livmoder, æggestokke", "Mand: testikler, prostata"], begreber: ["Kønshormoner", "Forplantning"], syn: ["kønsorganer", "forplantning"] },

  /* ---------- Indre anatomi (dybere strukturer) ---------- */
  { id: "i-cortex", sub: "indre", type: "struktur", daglig: "Nyrebark", faglig: "Nyrebark", latin: "Cortex renalis", forklaring: "Nyrens yderste lag, hvor blodet filtreres.", placering: "Yderst i nyren.", syn: ["cortex"] },
  { id: "i-medulla", sub: "indre", type: "struktur", daglig: "Nyremarv", faglig: "Nyremarv", latin: "Medulla renalis", forklaring: "Nyrens indre del med samlerør til urin.", placering: "Inderst i nyren.", syn: ["medulla"] },
  { id: "i-pelvisrenalis", sub: "indre", type: "struktur", daglig: "Nyrebækken", faglig: "Nyrebækken", latin: "Pelvis renalis", forklaring: "Tragtformet rum hvor urinen samles før urinlederen.", placering: "Centralt i nyren.", syn: [] },
  { id: "i-ureter", sub: "indre", type: "struktur", daglig: "Urinleder", faglig: "Urinleder", latin: "Ureter", forklaring: "Rør der leder urin fra nyre til blære.", placering: "Fra nyrebækken til urinblære.", syn: ["ureter"] },
  { id: "i-atrium", sub: "indre", type: "struktur", daglig: "Forkamre", faglig: "Hjertets forkamre", latin: "Atrium dextrum et sinistrum", forklaring: "Hjertets to øverste kamre, der modtager blod.", placering: "Øverst i hjertet.", syn: ["atrier", "forkammer"] },
  { id: "i-ventrikel", sub: "indre", type: "struktur", daglig: "Hjertekamre", faglig: "Hjertets hjertekamre", latin: "Ventriculus dexter et sinister", forklaring: "Hjertets to nederste kamre, der pumper blod ud.", placering: "Nederst i hjertet.", syn: ["ventrikler", "hjertekammer"] },
  { id: "i-alveoler", sub: "indre", type: "struktur", daglig: "Lungeblærer", faglig: "Alveoler", latin: "Alveoli pulmonis", forklaring: "Små blærer i lungerne hvor gasudveksling sker.", placering: "Yderst i lungerne.", syn: ["alveoler"] },

  /* ---------- Anatomiske retningsbegreber ---------- */
  { id: "d-anterior", sub: "retning", type: "retning", daglig: "Anterior", faglig: "Foran / forreste", latin: "Anterior", forklaring: "Foran på kroppen.", eksempel: "Knæskallen sidder anteriort på knæet.", syn: ["foran", "forreste", "ventral"] },
  { id: "d-posterior", sub: "retning", type: "retning", daglig: "Posterior", faglig: "Bagest / bagved", latin: "Posterior", forklaring: "Bagpå kroppen.", eksempel: "Skulderbladet ligger posteriort.", syn: ["bagved", "bagest", "dorsal"] },
  { id: "d-superior", sub: "retning", type: "retning", daglig: "Superior", faglig: "Opad / øverst", latin: "Superior", forklaring: "Nærmere hovedet / opadtil.", eksempel: "Hovedet er superiort for halsen.", syn: ["opad", "øverst", "over"] },
  { id: "d-inferior", sub: "retning", type: "retning", daglig: "Inferior", faglig: "Nedad / nederst", latin: "Inferior", forklaring: "Nærmere fødderne / nedadtil.", eksempel: "Fødderne er inferiort for knæene.", syn: ["nedad", "nederst", "under"] },
  { id: "d-medial", sub: "retning", type: "retning", daglig: "Medial", faglig: "Mod midtlinjen", latin: "Medialis", forklaring: "Tættere på kroppens midtlinje.", eksempel: "Storetåen sidder medialt på foden.", syn: ["mod midten", "indad"] },
  { id: "d-lateral", sub: "retning", type: "retning", daglig: "Lateral", faglig: "Væk fra midtlinjen", latin: "Lateralis", forklaring: "Længere væk fra kroppens midtlinje.", eksempel: "Lilletåen sidder lateralt på foden.", syn: ["udad", "til siden"] },
  { id: "d-proximal", sub: "retning", type: "retning", daglig: "Proksimal", faglig: "Nærmere kroppens centrum", latin: "Proximalis", forklaring: "Tættere på kroppen / udspringet af en lem.", eksempel: "Albuen ligger proksimalt for håndleddet.", syn: ["nærmere kroppen"] },
  { id: "d-distal", sub: "retning", type: "retning", daglig: "Distal", faglig: "Længere væk fra kroppens centrum", latin: "Distalis", forklaring: "Længere væk fra kroppen / yderst på en lem.", eksempel: "Håndleddet ligger distalt for albuen.", syn: ["yderst", "længere ude"] },
  { id: "d-dorsal", sub: "retning", type: "retning", daglig: "Dorsal", faglig: "På rygsiden / bagside", latin: "Dorsalis", forklaring: "På bagsiden (fx håndryggen).", eksempel: "Håndryggen kaldes dorsalsiden.", syn: ["bagside", "rygside"] },
  { id: "d-ventral", sub: "retning", type: "retning", daglig: "Ventral", faglig: "På bugsiden / forside", latin: "Ventralis", forklaring: "På forsiden (bugsiden).", eksempel: "Maven er på ventralsiden.", syn: ["forside", "bugside"] },
];

const anatById = (id) => ANAT.find((a) => a.id === id);
const anatText = (a) => (a.daglig + " " + (a.faglig || "") + " " + (a.latin || "") + " " + (a.forklaring || "") + " " + (a.system || "") + " " + (a.syn || []).join(" ") + " " + (a.indre || []).map((x) => x.n + " " + x.l).join(" ")).toLowerCase();
function anatSearch(q) { const s = (q || "").trim().toLowerCase(); if (!s) return []; return ANAT.filter((a) => anatText(a).indexOf(s) >= 0); }
function anatBySub(sub) { if (sub === "fysiologi") return ANAT.filter((a) => a.funktion); if (!sub || sub === "alle") return ANAT.slice(); return ANAT.filter((a) => a.sub === sub); }

function AnatCard({ a, onOpen }) {
  const sub2 = a.latin && a.latin !== a.daglig ? a.latin : (a.faglig && a.faglig !== a.daglig ? a.faglig : "");
  return (
    <button onClick={() => onOpen(a.id)} aria-label={a.daglig} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 2px rgba(21,33,43,0.04)", minHeight: 54 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{a.daglig}</div>
        {sub2 ? <div style={{ fontSize: 12.5, color: "#0B9488", fontStyle: "italic", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub2}</div> : null}
      </div>
      {a.flag ? <span style={{ fontSize: 10.5, fontWeight: 700, color: "#8A5A0B", background: tint("#B7791F", "18"), padding: "2px 7px", borderRadius: 7, flexShrink: 0 }}>Til kontrol</span> : null}
      <ChevronRight size={17} color={C.inkFaint} style={{ flexShrink: 0 }} />
    </button>
  );
}

function AnatDetail({ a, onCat, onTest }) {
  const badge = ANAT_TYPE_LABEL[a.type] || "";
  const isDir = a.sub === "retning";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          {badge ? <span style={{ fontSize: 11, fontWeight: 800, color: "#0B9488", background: tint("#0FAE9E", "14"), padding: "3px 9px", borderRadius: 8 }}>{badge}</span> : null}
          {a.flag ? <span style={{ fontSize: 11, fontWeight: 800, color: "#8A5A0B", background: tint("#B7791F", "18"), padding: "3px 9px", borderRadius: 8 }}>Til faglig kontrol</span> : null}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>{a.daglig}</div>
        {a.faglig && a.faglig !== a.daglig ? <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 2 }}>{a.faglig}</div> : null}
        {a.latin ? <div style={{ display: "inline-block", fontSize: 13.5, fontWeight: 700, color: "#0B9488", fontStyle: "italic", background: tint("#0FAE9E", "0E"), border: `1px solid ${tint("#0FAE9E", "26")}`, borderRadius: 9, padding: "4px 10px", marginTop: 8 }}>{a.latin}</div> : null}
        {a.system ? <div style={{ fontSize: 12.5, color: C.inkFaint, marginTop: 7 }}>{a.system}</div> : null}
      </div>
      {a.forklaring ? <p style={{ margin: 0, fontSize: 14.5, color: C.ink, lineHeight: 1.55 }}>{a.forklaring}</p> : null}

      {isDir ? (
        a.eksempel ? <div style={{ background: tint(C.primary, "0A"), border: `1px solid ${tint(C.primary, "22")}`, borderRadius: 12, padding: "12px 14px" }}><div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, marginBottom: 3 }}>Eksempel</div><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{a.eksempel}</div></div> : null
      ) : (
        <>
          {a.placering ? <Acc title="Placering"><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.55 }}>{a.placering}</div></Acc> : null}
          {a.funktion ? <Acc title={a.type === "system" ? "Sådan fungerer det" : "Funktion (fysiologi)"}><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.55 }}>{a.funktion}</div></Acc> : null}
          {a.indre && a.indre.length ? <Acc title="Indre anatomi"><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{a.indre.map((x, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderTop: i > 0 ? `1px solid ${C.line}` : "none", paddingTop: i > 0 ? 8 : 0 }}><span style={{ fontSize: 14, color: C.ink }}>{x.n}</span><span style={{ fontSize: 13, color: "#0B9488", fontStyle: "italic", textAlign: "right" }}>{x.l}</span></div>)}</div></Acc> : null}
          {a.organer && a.organer.length ? <Acc title="Organer / dele i systemet"><Bullets items={a.organer} color="#0FAE9E" /></Acc> : null}
          {a.begreber && a.begreber.length ? <Acc title="Faglige begreber"><Bullets items={a.begreber} color={C.primary} /></Acc> : null}
          {a.doc ? <Acc title="Dokumentationseksempel"><div style={{ fontSize: 13.5, color: "#1F5136", background: tint("#0FAE9E", "0E"), borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>{a.doc}</div></Acc> : null}
        </>
      )}

      <Acc title="Relateret viden">
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {a.catLink ? <button onClick={() => onCat(a.catLink)} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}><span style={{ flex: 1 }}>Åbn: {catTitleById(a.catLink)}</span><ChevronRight size={16} color={C.inkFaint} /></button> : null}
          <button onClick={() => onTest("anatomi")} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}><span style={{ flex: 1 }}>Test din viden om anatomi</span><ChevronRight size={16} color={C.inkFaint} /></button>
        </div>
      </Acc>
      <div style={{ display: "flex", gap: 9, background: tint(C.primary, "0A"), border: `1px solid ${tint(C.primary, "22")}`, borderRadius: 12, padding: "10px 12px" }}>
        <Info size={16} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>Klario er et lærings- og opslagsværktøj — ikke en medicinsk lærebog.</span>
      </div>
    </div>
  );
}

/* ===== FARMAKOLOGI — Forstå hvordan lægemidler virker i kroppen =========
 *  LÆRINGSområde for SSA-elever — IKKE behandlings- eller doseringsråd.
 *  Indholdet er generel, lærebogsbaseret farmakologi. LægemiddelSPECIFIKKE
 *  oplysninger (doser, interaktioner, kontraindikationer, knusning/deling)
 *  opfindes ALDRIG her — de skal slås op i en aktuel, godkendt kilde
 *  (pro.medicin.dk / min.medicin.dk) og afhænger af ordination, delegation
 *  og lokale instrukser. Data er struktureret, så en fremtidig
 *  "Hvordan virker denne medicin?"-funktion kan bygges på verificerede data.
 * ===================================================================== */
const FARMA_VERIFY = "Oplysningen er ikke verificeret — kontrollér i officiel lægemiddelkilde (pro.medicin.dk) og følg ordination og lokale instrukser.";
const FARMA_SRC = "https://pro.medicin.dk/";

const FARMA_SECTIONS = [
  { id: "vej", title: "Medicinens vej gennem kroppen", sub: "Følg medicinen trin for trin" },
  { id: "adme", title: "Farmakokinetik (ADME)", sub: "Hvad kroppen gør ved medicinen" },
  { id: "dynamik", title: "Farmakodynamik", sub: "Hvad medicinen gør ved kroppen" },
  { id: "admin", title: "Administrationsveje", sub: "Hvor og hvordan medicin gives" },
  { id: "former", title: "Lægemiddelformer", sub: "Tablet, kapsel, plaster, dråber m.m." },
  { id: "tid", title: "Virkning og virkningstid", sub: "Start, maks, varighed, T½, steady state" },
  { id: "halveringstid", title: "Medicinens halveringstid (T½)", sub: "Forstå T½ + interaktiv beregner" },
  { id: "bivirk", title: "Bivirkninger og interaktioner", sub: "Når medicin gør andet end ønsket" },
  { id: "lever", title: "Lever og medicin", sub: "Metabolisme og first-pass" },
  { id: "nyrer", title: "Nyrer og medicin", sub: "Udskillelse og elimination" },
  { id: "aeldre", title: "Medicin hos ældre", sub: "Hvorfor ældre reagerer anderledes" },
  { id: "sikkerhed", title: "Medicinsikkerhed", sub: "Sikker medicinhåndtering" },
  { id: "obs", title: "Observationer som SSA", sub: "Før · efter · observér · reagér · dokumentér" },
  { id: "furosemid", title: "Læringseksempel: Furosemid", sub: "Følg et lægemiddel fra tablet til virkning" },
  { id: "begreber", title: "Faglige begreber", sub: "Søgbar farmakologisk ordbog" },
  { id: "test", title: "Test din viden", sub: "Quiz om farmakologi" },
];

/* 1 — Medicinens vej gennem kroppen (tablet) */
const FARMA_JOURNEY = [
  { t: "Mund", q: "Tabletten synkes med vand.", m: "Nogle former (fx smeltetabletter eller sublingvale tabletter) begynder allerede i munden, men en almindelig tablet skal videre for at blive optaget." },
  { t: "Spiserør", q: "Tabletten føres ned til mavesækken.", m: "Rigelig vand og oprejst stilling hjælper tabletten ned og mindsker risikoen for, at den sætter sig fast." },
  { t: "Mavesæk", q: "Tabletten begynder at gå i opløsning.", m: "Mavesyren og bevægelserne opløser mange tabletter. Enterotabletter er lavet til IKKE at gå i stykker her, men først i tarmen." },
  { t: "Tarm", q: "Det meste optages gennem tarmvæggen.", m: "Tyndtarmens store overflade er hovedstedet for optagelse (absorption) af de fleste tabletter." },
  { t: "Absorption", q: "Lægemidlet passerer over i blodet.", m: "Hvor meget der optages og hvor hurtigt, afhænger bl.a. af lægemiddelform, mad i maven og lægemidlets egenskaber." },
  { t: "Portåre → lever (first-pass)", q: "Blodet fra tarmen løber først gennem leveren.", m: "Leveren kan omdanne (metabolisere) en del af lægemidlet, før det når det store kredsløb. Det kaldes first-pass metabolisme og betyder, at mindre kan nå ud i kroppen." },
  { t: "Blodbane", q: "Lægemidlet fordeles rundt i kroppen.", m: "Med blodet føres lægemidlet ud til væv og organer (distribution). En del kan være bundet til proteiner i blodet." },
  { t: "Målorgan / receptor", q: "Lægemidlet virker der, hvor det binder.", m: "Effekten sker, hvor lægemidlet binder til sit mål — ofte en receptor på eller i cellerne i et bestemt organ." },
  { t: "Metabolisme", q: "Lægemidlet omdannes — især i leveren.", m: "Leverens enzymer omdanner lægemidlet til stoffer, der lettere kan udskilles. Nogle omdannes til inaktive stoffer, andre til aktive." },
  { t: "Udskillelse", q: "Lægemidlet forlader kroppen — især via nyrerne.", m: "Nyrerne udskiller mange lægemidler og deres nedbrydningsprodukter med urinen. Andre veje kan være galde/afføring, udånding eller sved." },
];

/* 2 — ADME */
const FARMA_ADME = [
  { k: "A", title: "Absorption", q: "Hvordan lægemidlet kommer ind i blodbanen.", m: "Fra fx tarmen optages lægemidlet over i blodet. Administrationsvej og lægemiddelform har stor betydning for, hvor meget og hvor hurtigt der optages. IV gives direkte i blodet og skal ikke absorberes." },
  { k: "D", title: "Distribution", q: "Hvordan lægemidlet fordeles rundt i kroppen.", m: "Med blodet føres lægemidlet ud til væv og organer. Kropssammensætning (væske og fedt) og proteinbinding påvirker fordelingen — det er bl.a. derfor børn og ældre kan reagere anderledes." },
  { k: "M", title: "Metabolisme", q: "Hvordan lægemidlet omdannes/nedbrydes.", m: "Sker især i LEVEREN ved hjælp af enzymer. Lægemidlet omdannes typisk til stoffer, der er lettere at udskille. Nedsat leverfunktion kan påvirke, hvordan visse lægemidler omsættes." },
  { k: "E", title: "Excretion (udskillelse)", q: "Hvordan lægemidlet forlader kroppen.", m: "Sker især via NYRERNE med urinen. Nedsat nyrefunktion kan betyde, at visse lægemidler udskilles langsommere og kan ophobes. Andre veje: galde/afføring, udånding, sved." },
];

/* 3 — Farmakodynamik */
const FARMA_DYN = [
  { term: "Receptor", q: "Et sted på eller i en celle, hvor et lægemiddel kan binde og påvirke cellens aktivitet.", m: "Når et lægemiddel binder til sin receptor, kan cellens funktion øges eller hæmmes. Receptorer er ofte specifikke, så et lægemiddel virker mest bestemte steder." },
  { term: "Agonist", q: "Et stof, der binder til en receptor og udløser en virkning.", m: "Agonisten aktiverer receptoren — lidt som at 'tænde' for cellens respons." },
  { term: "Antagonist", q: "Et stof, der binder til en receptor og blokerer virkningen.", m: "Antagonisten hindrer, at receptoren aktiveres — den 'blokerer' responset." },
  { term: "Ønsket virkning", q: "Den effekt, lægemidlet er givet for at opnå.", m: "Kaldes også den terapeutiske virkning. Det er målet med behandlingen." },
  { term: "Bivirkning", q: "En uønsket virkning ud over den ønskede.", m: "Skyldes ofte, at lægemidlet også påvirker andre steder end målet. Nogle bivirkninger er milde, andre alvorlige." },
  { term: "Dosis-respons", q: "Sammenhængen mellem dosis og effekt.", m: "Op til et vist punkt giver højere dosis ofte større effekt — men også større risiko for bivirkninger. Konkrete doser afhænger altid af ordination." },
  { term: "Terapeutisk interval", q: "Området mellem for lav (uden effekt) og for høj (giftig) koncentration.", m: "Lægemidlet virker bedst inden for dette interval. Nogle lægemidler har et smalt interval og kræver ekstra opmærksomhed. Konkrete grænser slås op i godkendt kilde." },
];

/* 4 — Administrationsveje */
const FARMA_ROUTES = [
  { id: "oral", name: "Oral", full: "Gennem munden (peroralt)", hvor: "Synkes og optages i mave-tarm-kanalen.", hvordan: "Optages typisk i tarmen og passerer leveren (first-pass), før det når blodet.", kar: "Nem og almindelig vej. Virkning kommer typisk gradvist. Mad kan påvirke optagelsen.", obs: ["Kan borgeren synke sikkert?", "Er tabletten taget?", "Virkning og evt. mavegener"], sik: ["Følg ordination og lokale instrukser", "Ved synkebesvær: kontakt ansvarlig — knus/del aldrig uden verificeret info om det konkrete præparat"] },
  { id: "sublingual", name: "Sublingual", full: "Under tungen", hvor: "Lægges under tungen.", hvordan: "Optages gennem slimhinden direkte til blodet og uden om first-pass i leveren.", kar: "Kan give hurtig virkning. Bruges til udvalgte lægemidler.", obs: ["At tabletten ikke synkes", "Hurtig virkning/effekt", "Ubehag i munden"], sik: ["Følg ordination", "Borger bør ikke spise/drikke, mens den opløses"] },
  { id: "buccal", name: "Buccal", full: "Mellem kind og tandkød", hvor: "Placeres i kindslimhinden.", hvordan: "Optages gennem mundslimhinden til blodet.", kar: "Ligner sublingual; optages via mundhulen.", obs: ["Placering fastholdes", "Virkning", "Lokal irritation"], sik: ["Følg ordination og lokale instrukser"] },
  { id: "inhalation", name: "Inhalation", full: "Gennem luftvejene", hvor: "Indåndes til lunger/luftveje.", hvordan: "Optages i luftvejene — virker ofte lokalt i lungerne.", kar: "Hurtig lokal effekt i luftvejene. Korrekt teknik er vigtig for effekten.", obs: ["Inhalationsteknik", "Respiration og effekt", "Mundpleje ved visse inhalationssteroider"], sik: ["Følg ordination", "Oplæring i korrekt device/teknik"] },
  { id: "rektal", name: "Rektal", full: "Gennem endetarmen", hvor: "Føres op i endetarmen (fx stikpille).", hvordan: "Optages gennem slimhinden i endetarmen.", kar: "Kan bruges ved kvalme/opkast eller synkebesvær.", obs: ["At det er givet", "Virkning", "Lokal irritation"], sik: ["Følg ordination og lokale instrukser", "Respekter blufærdighed og samtykke"] },
  { id: "kutan", name: "Kutan", full: "På huden", hvor: "Påføres huden (creme/salve).", hvordan: "Virker oftest lokalt på huden.", kar: "Lokal behandling; ringe optag til resten af kroppen for de fleste.", obs: ["Hudens tilstand", "Lokal effekt/irritation"], sik: ["Følg ordination", "Brug evt. handsker jf. instruks"] },
  { id: "transdermal", name: "Transdermal", full: "Gennem huden (plaster)", hvor: "Plaster klæbes på huden.", hvordan: "Lægemidlet optages langsomt gennem huden til blodet.", kar: "Jævn afgivelse over tid. Skift og placering følger anvisning.", obs: ["At gammelt plaster er fjernet", "Hudreaktion", "At nyt sidder korrekt"], sik: ["Følg ordination og produktanvisning", "Notér skiftested/-tidspunkt jf. instruks"] },
  { id: "sc", name: "Subkutan (SC)", full: "Under huden", hvor: "I underhudens fedtlag.", hvordan: "Optages gradvist fra underhuden til blodet.", kar: "Langsommere, jævn optagelse.", obs: ["Injektionssted (rødme, hævelse)", "Virkning"], sik: ["Kræver kompetence/delegation og lokale instrukser", "Klario giver ikke injektionsteknik"] },
  { id: "im", name: "Intramuskulær (IM)", full: "I en muskel", hvor: "I muskelvæv.", hvordan: "Optages fra musklen til blodet.", kar: "Kan give hurtigere optag end SC pga. god blodforsyning.", obs: ["Injektionssted", "Virkning og evt. reaktion"], sik: ["Kræver kompetence/delegation og lokale instrukser", "Klario giver ikke injektionsteknik"] },
  { id: "iv", name: "Intravenøs (IV)", full: "Direkte i blodbanen", hvor: "I en vene.", hvordan: "Gives direkte i blodet — skal ikke absorberes først.", kar: "Hurtig og fuld biotilgængelighed. Kræver særlig overvågning.", obs: ["Virkning kommer hurtigt", "Indstiksstedet", "Almen tilstand"], sik: ["Kræver kompetence/delegation og lokale instrukser", "Klario giver ikke administrationsteknik"] },
];

/* 5 — Lægemiddelformer */
const FARMA_FORMS = [
  { id: "tablet", name: "Tablet", hvad: "Fast form med aktivt stof + hjælpestoffer.", brug: "Synkes typisk med vand.", frig: "Går i opløsning i mave/tarm og optages derfra.", vig: "Om en konkret tablet må deles/knuses skal ALTID kontrolleres for det enkelte præparat." },
  { id: "depot", name: "Depottablet", hvad: "Tablet der frigiver stoffet langsomt.", brug: "Synkes hel.", frig: "Afgiver lægemidlet gradvist over længere tid.", vig: "Må som udgangspunkt IKKE knuses/deles — det kan give for hurtig frigivelse. Kontrollér altid det konkrete præparat." },
  { id: "entero", name: "Enterotablet", hvad: "Tablet med syrefast overtræk.", brug: "Synkes hel.", frig: "Går først i opløsning i tarmen, ikke i mavesækken.", vig: "Overtrækket beskytter stoffet eller mavesækken — knus/del ikke uden verificeret info." },
  { id: "kapsel", name: "Kapsel", hvad: "Skal med pulver/granulat eller væske.", brug: "Synkes hel.", frig: "Skallen opløses, og indholdet frigives.", vig: "Åbning af kapsler skal kontrolleres for det konkrete præparat." },
  { id: "mikstur", name: "Mikstur", hvad: "Flydende lægemiddel til at drikke.", brug: "Doseres med målebæger/-sprøjte.", frig: "Optages fra mave-tarm.", vig: "Omrystes evt. før brug; mål nøjagtigt jf. ordination." },
  { id: "draaber", name: "Dråber", hvad: "Flydende form doseret i dråber.", brug: "Gives fx oralt.", frig: "Optages fra mave-tarm.", vig: "Antal dråber følger ordination; forveksl ikke øjen-/øredråber med orale dråber." },
  { id: "bruse", name: "Brusetablet", hvad: "Tablet der opløses i vand.", brug: "Opløses helt, drikkes.", frig: "Optages som opløst væske.", vig: "Vent til den er helt opløst; vær opmærksom på indhold (fx natrium) jf. kilde." },
  { id: "smelte", name: "Smeltetablet", hvad: "Tablet der smelter i munden.", brug: "Lægges på tungen.", frig: "Kan begynde optag i munden.", vig: "Skal ikke nødvendigvis synkes med vand — følg produktanvisning." },
  { id: "inhal", name: "Inhalationsmedicin", hvad: "Lægemiddel til indånding.", brug: "Bruges med inhalator/spacer.", frig: "Virker i luftvejene.", vig: "Korrekt teknik er afgørende for effekten." },
  { id: "supp", name: "Suppositorium (stikpille)", hvad: "Fast form til endetarmen.", brug: "Føres op i endetarmen.", frig: "Smelter og optages via slimhinden.", vig: "Følg lokale instrukser; respekter blufærdighed." },
  { id: "creme", name: "Creme", hvad: "Blød, vandholdig form til huden.", brug: "Smøres tyndt på.", frig: "Virker oftest lokalt.", vig: "Følg ordination; trækker hurtigt ind." },
  { id: "salve", name: "Salve", hvad: "Fedtet form til huden.", brug: "Smøres på.", frig: "Virker lokalt; mere fedtet end creme.", vig: "Følg anvisning for mængde og hyppighed." },
  { id: "gel", name: "Gel", hvad: "Geléagtig form til hud/slimhinde.", brug: "Påføres lokalt.", frig: "Virker lokalt.", vig: "Følg produktanvisning." },
  { id: "oejen", name: "Øjendråber", hvad: "Sterile dråber til øjet.", brug: "Dryppes i øjet.", frig: "Virker lokalt i øjet.", vig: "Undgå at røre øjet med spidsen; følg holdbarhed efter åbning." },
  { id: "oere", name: "Øredråber", hvad: "Dråber til øregangen.", brug: "Dryppes i øret.", frig: "Virker lokalt.", vig: "Følg anvisning; forveksl ikke med øjendråber." },
  { id: "naese", name: "Næsespray", hvad: "Spray til næseslimhinden.", brug: "Sprøjtes i næsen.", frig: "Virker lokalt eller optages via slimhinden.", vig: "Følg anvisning for antal pust." },
  { id: "plaster", name: "Plaster (depotplaster)", hvad: "Klæbeplaster med lægemiddel.", brug: "Sættes på huden.", frig: "Afgiver lægemidlet langsomt gennem huden.", vig: "Fjern altid gammelt plaster; skift jf. anvisning." },
  { id: "injektion", name: "Injektion", hvad: "Flydende lægemiddel til indsprøjtning.", brug: "Gives SC/IM/IV.", frig: "Optages hurtigt (IV øjeblikkeligt).", vig: "Kræver kompetence/delegation og lokale instrukser." },
];

/* 6 — Virkning og tid */
const FARMA_TIMING = [
  { term: "Virkningsstart", q: "Hvor lang tid der går, før effekten begynder.", m: "Afhænger bl.a. af administrationsvej og form — IV virker hurtigt, en depottablet langsommere." },
  { term: "Maksimal effekt", q: "Hvornår virkningen typisk er størst.", m: "Koncentrationen i blodet er da på sit højeste for den enkelte dosis." },
  { term: "Virkningsvarighed", q: "Hvor længe effekten varer.", m: "Bestemmer bl.a., hvor ofte et lægemiddel skal gives. Konkret dosering følger altid ordination." },
  { term: "Halveringstid (T½)", q: "Tiden, før koncentrationen er faldet til omtrent det halve.", m: "Et lægemiddel med lang T½ bliver længere i kroppen. T½ kan ændres ved nedsat lever- eller nyrefunktion." },
  { term: "Steady state", q: "Når tilførsel og udskillelse er nogenlunde i balance.", m: "Ved gentagen dosering når koncentrationen et stabilt niveau — typisk efter ca. 4-5 halveringstider." },
];

/* 7 — Bivirkninger og interaktioner */
const FARMA_ADVERSE = [
  { term: "Ønsket virkning", q: "Den effekt, lægemidlet gives for.", m: "Den terapeutiske virkning, der er målet med behandlingen." },
  { term: "Bivirkning", q: "En uønsket virkning ud over den ønskede.", m: "Kan være mild (fx let kvalme) eller kræve handling. Konkrete bivirkninger for et præparat slås op i godkendt kilde." },
  { term: "Alvorlig bivirkning", q: "En bivirkning, der kan være farlig.", m: "Kræver hurtig faglig vurdering. Videregiv observationer efter lokale instrukser/delegation." },
  { term: "Allergisk reaktion", q: "Immunforsvarets reaktion på et lægemiddel.", m: "Kan vise sig som fx udslæt, hævelse eller — sjældnere — vejrtrækningsbesvær. Vejrtrækningsbesvær/hævelse i hals er akut — tilkald hjælp." },
  { term: "Interaktion", q: "Når lægemidler (eller mad) påvirker hinandens virkning.", m: "Ét lægemiddel kan forstærke eller svække et andet. Konkrete interaktioner skal ALTID slås op i godkendt kilde." },
  { term: "Kontraindikation", q: "En tilstand, hvor et lægemiddel ikke bør gives.", m: "Fx bestemte sygdomme eller tilstande. Konkrete kontraindikationer slås op i godkendt kilde." },
  { term: "Forgiftning / overdosering", q: "For høj mængde lægemiddel i kroppen.", m: "Kan give alvorlige symptomer. Ved mistanke: handl efter lokale instrukser og tilkald hjælp." },
];

/* 8/9/10 — organ- og alderssektioner (structured) */
const FARMA_LEVER = {
  quick: "Leveren omdanner (metaboliserer) mange lægemidler, så de bliver lettere at udskille.",
  points: [
    "Leverens enzymer nedbryder/omdanner lægemidler.",
    "First-pass: lægemidler fra tarmen passerer leveren FØR blodbanen — en del omdannes med det samme.",
    "Nogle lægemidler omdannes til inaktive stoffer, andre til aktive.",
    "Nedsat leverfunktion kan påvirke, hvordan visse lægemidler omsættes.",
    "Interaktioner kan opstå, når lægemidler påvirker de samme leverenzymer — slå altid konkrete interaktioner op i godkendt kilde.",
  ],
  anat: "a-lever",
};
const FARMA_NYRER = {
  quick: "Nyrerne filtrerer blodet og udskiller mange lægemidler og deres nedbrydningsprodukter med urinen.",
  points: [
    "Renal udskillelse: lægemidler forlader kroppen via nyrerne med urinen.",
    "Nyrerne filtrerer blodet i nyrebarken (glomeruli).",
    "Mange lægemidler afhænger af en velfungerende nyrefunktion for at blive udskilt.",
    "Nedsat nyrefunktion kan betyde langsommere elimination og risiko for ophobning af visse lægemidler.",
    "Væskebalance og nyrefunktion hænger sammen — se også observationer.",
  ],
  anat: "a-nyrer",
};
const FARMA_AELDRE = {
  quick: "Ældre reagerer ofte anderledes på medicin — bl.a. fordi lever, nyrer og kropssammensætning ændrer sig.",
  hvorfor: [
    "Nyrefunktionen aftager ofte med alderen → langsommere udskillelse.",
    "Leverfunktion og enzymaktivitet kan være ændret → ændret omsætning.",
    "Ændret kropssammensætning (mindre vand, mere fedt) → ændret fordeling.",
    "Væskebalancen er mere sårbar.",
    "Polyfarmaci (mange lægemidler) → større risiko for interaktioner.",
    "Øget følsomhed over for visse lægemidler.",
  ],
  obs: [
    "Ændringer i vågenhed, forvirring eller svimmelhed.",
    "Faldrisiko.",
    "Tegn på dehydrering eller væskeophobning.",
    "Ny eller ændret adfærd efter medicinændring.",
    "Videregiv observationer efter lokale instrukser/delegation.",
  ],
};

/* 11 — Medicinsikkerhed */
const FARMA_SAFETY = [
  { t: "Korrekt borger", d: "Er det den rigtige borger/patient? Identificér jf. lokal instruks." },
  { t: "Korrekt lægemiddel", d: "Stemmer præparatet med ordinationen?" },
  { t: "Korrekt dosis", d: "Er dosis som ordineret? Ved tvivl: spørg." },
  { t: "Korrekt tidspunkt", d: "Gives det på det ordinerede tidspunkt?" },
  { t: "Korrekt administrationsvej", d: "Gives det på den ordinerede måde (fx oralt, kutant)?" },
  { t: "Dokumentation", d: "Registrér, at medicinen er givet, jf. lokal praksis." },
  { t: "Observation af virkning", d: "Fik lægemidlet den forventede effekt?" },
  { t: "Observation af bivirkninger", d: "Er der uønskede virkninger?" },
  { t: "Ved tvivl", d: "Giv ikke — stop op, spørg ansvarlig og følg lokale instrukser." },
  { t: "Delegation og instrukser", d: "Handl inden for din delegation og arbejdsstedets instrukser." },
];

/* 12 — Observationer som SSA */
const FARMA_OBS = [
  { t: "FØR", d: "Hvilke observationer kan være nødvendige før administration? (fx borgerens tilstand, kan borgeren synke, relevante målinger jf. instruks)" },
  { t: "EFTER", d: "Hvilken virkning forventes af lægemidlet?" },
  { t: "OBSERVÉR", d: "Er der ændringer i borgerens tilstand — ønsket effekt eller bivirkninger?" },
  { t: "REAGÉR", d: "Hvornår skal observationer videregives? Følg lokale instrukser og delegation." },
  { t: "DOKUMENTÉR", d: "Hvad er relevant at dokumentere (givet medicin, virkning, observationer)?" },
];

/* 13 — Faglige begreber (søgbar ordbog) */
const FARMA_TERMS = [
  { id: "f-farmakologi", term: "Farmakologi", forklaring: "Læren om lægemidler og deres virkning i kroppen.", eksempel: "Farmakologi dækker både, hvordan kroppen påvirker lægemidlet, og hvordan lægemidlet påvirker kroppen.", related: ["Farmakokinetik", "Farmakodynamik"] },
  { id: "f-farmakokinetik", term: "Farmakokinetik", forklaring: "Hvad kroppen gør ved lægemidlet (ADME).", eksempel: "Absorption, distribution, metabolisme og udskillelse.", related: ["Absorption", "Metabolisme", "Elimination"] },
  { id: "f-farmakodynamik", term: "Farmakodynamik", forklaring: "Hvad lægemidlet gør ved kroppen.", eksempel: "Hvordan et lægemiddel binder til en receptor og påvirker cellen.", related: ["Receptor", "Agonist", "Antagonist"] },
  { id: "f-absorption", term: "Absorption", forklaring: "Optagelsen af lægemidlet i blodbanen.", eksempel: "En tablet optages gennem tarmvæggen.", related: ["Biotilgængelighed"] },
  { id: "f-distribution", term: "Distribution", forklaring: "Fordelingen af lægemidlet rundt i kroppen.", eksempel: "Blodet fører lægemidlet ud til væv og organer.", related: [] },
  { id: "f-metabolisme", term: "Metabolisme", forklaring: "Omdannelsen/nedbrydningen af lægemidlet, især i leveren.", eksempel: "Leverens enzymer omdanner lægemidlet.", related: ["First-pass metabolisme", "Lever"] },
  { id: "f-elimination", term: "Elimination", forklaring: "Den samlede fjernelse af lægemidlet (metabolisme + udskillelse).", eksempel: "Nedsat nyrefunktion kan gøre eliminationen langsommere.", related: ["Ekskretion", "Halveringstid"] },
  { id: "f-ekskretion", term: "Ekskretion", forklaring: "Udskillelsen af lægemidlet fra kroppen, især via nyrerne.", eksempel: "Lægemidlet udskilles med urinen.", related: ["Nyrer", "Elimination"] },
  { id: "f-biotilgaengelighed", term: "Biotilgængelighed", forklaring: "Den andel af en dosis, der når ud i blodbanen uændret.", eksempel: "IV har fuld (100 %) biotilgængelighed; ved tablet kan first-pass reducere den.", related: ["Absorption", "First-pass metabolisme"] },
  { id: "f-halveringstid", term: "Halveringstid (T½)", forklaring: "Tiden, før koncentrationen af lægemidlet er faldet til omtrent det halve.", eksempel: "Lang T½ betyder, at lægemidlet bliver længere i kroppen.", related: ["Steady state", "Elimination"] },
  { id: "f-steadystate", term: "Steady state", forklaring: "Når tilførsel og udskillelse ved gentagen dosering når et nogenlunde stabilt niveau.", eksempel: "Nås typisk efter ca. 4-5 halveringstider.", related: ["Halveringstid"] },
  { id: "f-receptor", term: "Receptor", forklaring: "Et sted på/i en celle, hvor et lægemiddel kan binde og påvirke cellen.", eksempel: "Et lægemiddel binder til sin receptor og ændrer cellens aktivitet.", related: ["Agonist", "Antagonist"] },
  { id: "f-agonist", term: "Agonist", forklaring: "Et stof, der binder til en receptor og udløser en virkning.", eksempel: "Aktiverer receptoren.", related: ["Receptor", "Antagonist"] },
  { id: "f-antagonist", term: "Antagonist", forklaring: "Et stof, der binder til en receptor og blokerer virkningen.", eksempel: "Hindrer, at receptoren aktiveres.", related: ["Receptor", "Agonist"] },
  { id: "f-indikation", term: "Indikation", forklaring: "Den situation/sygdom, et lægemiddel er godkendt til at bruges ved.", eksempel: "Konkret indikation slås op i godkendt kilde.", related: ["Kontraindikation"] },
  { id: "f-kontraindikation", term: "Kontraindikation", forklaring: "En tilstand, hvor et lægemiddel ikke bør gives.", eksempel: "Slås altid op i godkendt kilde.", related: ["Indikation"] },
  { id: "f-interaktion", term: "Interaktion", forklaring: "Når lægemidler (eller mad) påvirker hinandens virkning.", eksempel: "Ét lægemiddel kan forstærke eller svække et andet — slå altid op i godkendt kilde.", related: ["Polyfarmaci"] },
  { id: "f-bivirkning", term: "Bivirkning", forklaring: "En uønsket virkning ud over den ønskede.", eksempel: "Konkrete bivirkninger for et præparat slås op i godkendt kilde.", related: ["Terapeutisk effekt"] },
  { id: "f-terapeutisk", term: "Terapeutisk effekt", forklaring: "Den ønskede, gavnlige virkning af et lægemiddel.", eksempel: "Målet med behandlingen.", related: ["Terapeutisk interval"] },
  { id: "f-tinterval", term: "Terapeutisk interval", forklaring: "Området mellem for lav (uden effekt) og for høj (giftig) koncentration.", eksempel: "Nogle lægemidler har et smalt interval.", related: ["Toksicitet"] },
  { id: "f-toksicitet", term: "Toksicitet", forklaring: "Skadelig/giftig virkning ved for høj koncentration.", eksempel: "Kan ses ved overdosering.", related: ["Terapeutisk interval"] },
  { id: "f-polyfarmaci", term: "Polyfarmaci", forklaring: "Brug af mange lægemidler samtidig.", eksempel: "Almindeligt hos ældre og øger risiko for interaktioner.", related: ["Interaktion", "Medicin hos ældre"] },
  { id: "f-compliance", term: "Compliance / adherence", forklaring: "I hvilken grad borgeren tager medicinen som aftalt.", eksempel: "Manglende adherence kan give dårligere effekt.", related: [] },
  { id: "f-firstpass", term: "First-pass metabolisme", forklaring: "At et oralt lægemiddel passerer leveren og delvist omdannes, før det når blodbanen.", eksempel: "Reducerer den mængde, der når det store kredsløb.", related: ["Metabolisme", "Biotilgængelighed"] },
  { id: "f-aktivtstof", term: "Aktivt stof", forklaring: "Det stof i lægemidlet, der giver virkningen.", eksempel: "Fx det virksomme stof i en tablet.", related: ["Hjælpestof"] },
  { id: "f-hjaelpestof", term: "Hjælpestof", forklaring: "Stof i lægemidlet uden egen behandlingsvirkning (fx bindemiddel).", eksempel: "Hjælper med at forme og stabilisere lægemidlet.", related: ["Aktivt stof"] },
  { id: "f-generisk", term: "Generisk lægemiddel", forklaring: "Lægemiddel med samme aktive stof som et originalpræparat.", eksempel: "Kan hedde noget andet, men indeholde samme aktive stof.", related: ["Aktivt stof"] },
  { id: "f-adme", term: "ADME", forklaring: "Forkortelse for Absorption, Distribution, Metabolisme og Ekskretion.", eksempel: "Beskriver lægemidlets vej gennem kroppen.", related: ["Farmakokinetik"] },
];

/* Furosemid — læringseksempel (generel, verificerbar mekanisme; ingen doser) */
const FARMA_FUROSEMID = {
  navn: "Furosemid (fx Furix)",
  gruppe: "Loop-diuretikum (vanddrivende)",
  chain: ["Furosemid", "Lægemiddelgruppe: loop-diuretikum", "Administration (fx oralt eller IV)", "Absorption / blodbane", "Virker i nyren", "Den opadstigende del af Henles slynge i nefronet", "Ændret håndtering af salte", "Øget udskillelse af natrium og vand", "Øget diurese"],
  hvorfor: "Loop-diuretika bruges bl.a. ved væskeophobning (ødem) og hjertesvigt. Den KONKRETE indikation, dosis og varighed afhænger af ordination — slå op i godkendt kilde.",
  fysiologi: "Furosemid virker i nyrens nefron (den opadstigende del af Henles slynge) og hæmmer genoptagelsen af salte. Når mindre salt genoptages, følger mere vand med ud i urinen — det giver øget diurese.",
  obs: ["Diurese (mængde vandladning)", "Væskebalance (indtag/udskillelse)", "Ødem", "Blodtryk", "Svimmelhed (særligt ved rejsning)", "Tegn på dehydrering", "Relevante elektrolytforstyrrelser jf. plan"],
};

/* ---- helpers ---- */
const farmaTermById = (id) => FARMA_TERMS.find((t) => t.id === id);
const farmaTermText = (t) => (t.term + " " + t.forklaring + " " + t.eksempel + " " + (t.related || []).join(" ")).toLowerCase();
function farmaTermSearch(q) { const s = (q || "").trim().toLowerCase(); if (!s) return []; return FARMA_TERMS.filter((t) => farmaTermText(t).indexOf(s) >= 0); }
// Bred søgning på tværs af farmakologi-indhold (til global søgning): returnerer {kind, id, title, sub}
function farmaSearch(q) {
  const s = (q || "").trim().toLowerCase(); if (!s) return [];
  const hits = [];
  FARMA_TERMS.forEach((t) => { if (farmaTermText(t).indexOf(s) >= 0) hits.push({ kind: "term", id: t.id, title: t.term, sub: t.forklaring }); });
  FARMA_SECTIONS.forEach((sec) => { if ((sec.title + " " + sec.sub).toLowerCase().indexOf(s) >= 0) hits.push({ kind: "sec", id: sec.id, title: sec.title, sub: sec.sub }); });
  return hits;
}

/* Two-level card: kort forklaring + "Forstå det bedre" */
function FarmaTwo({ quick, more }) {
  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 14.5, color: C.ink, lineHeight: 1.55 }}>{quick}</p>
      {more ? <Acc title="Forstå det bedre"><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.55 }}>{more}</div></Acc> : null}
    </div>
  );
}

/* Lodret flow med pile (bruges til 'medicinens vej' og Furosemid) */
function FarmaFlow({ steps, accent }) {
  const col = accent || "#7A5AF5";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0 }}>
      {steps.map((st, i) => (
        <div key={i}>
          <div style={{ border: `1px solid ${tint(col, "33")}`, background: tint(col, "0A"), borderRadius: 12, padding: "11px 13px", fontSize: 14, fontWeight: 700, color: C.ink }}>{typeof st === "string" ? st : st.t}</div>
          {i < steps.length - 1 ? <div style={{ textAlign: "center", color: col, fontSize: 16, lineHeight: "18px", padding: "3px 0" }}>↓</div> : null}
        </div>
      ))}
    </div>
  );
}

/* ===== FARMAKOLOGI — Medicinens halveringstid (T½) =====================
 *  Læringsområde + interaktiv beregner. IKKE til patientspecifikke
 *  kliniske beslutninger. Beregneren bruger en forenklet
 *  førsteordens-model (remaining = 0.5^(tid/T½)). Lægemiddelspecifikke
 *  T½-værdier opfindes ALDRIG — de slås op i pro.medicin.dk og vises kun
 *  her hvis de er verificeret med kilde og dato (HALFLIFE_DB).
 * ===================================================================== */
const hlParse = (v) => { if (v == null) return NaN; const s = String(v).trim().replace(/\s/g, "").replace(",", "."); if (s === "") return NaN; const n = Number(s); return isFinite(n) ? n : NaN; };
const hlFmt = (n, dec) => { if (!isFinite(n)) return "–"; const d = dec == null ? 2 : dec; let s = n.toFixed(d); if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, ""); return s.replace(".", ","); };

/* Verificeret T½-database — TOM indtil værdier er bekræftet med kilde + dato.
 * Struktur klar til fremtidige verificerede opslag:
 * { substans:"", aktivt:"", tHalf:"", range:"", kilde:"", kildeUrl:"", lastVerified:"", verified:true } */
const MED_SEED = {"meta":{"schemaVersion":"1.0","datasetVersion":"2026.10.08-3","publishedAt":"2026-10-08","recordCount":10,"verifiedHalfLifeCount":10,"substanceCount":152,"indexCount":319,"halfLifeSources":["StatPearls (NCBI Bookshelf) — Furosemide","Produktresumé (HPRA, Irland) — Paracetamol","FDA-produktinformation — Metoprolol","FDA-produktinformation — Amlodipin","FDA-produktinformation — Lanoxin (digoxin)","FDA-produktinformation — Metformin","FDA-produktinformation — Altace (ramipril)","FDA-produktinformation — Protonix (pantoprazol)","Produktinformation (Pfizer) — Morphine","FDA-produktinformation — Eliquis (apixaban)"],"nameIndexSource":"Klario kurateret. Officielt dansk indeks fra Lægemiddelstyrelsen kan importeres med kildeangivelse (se tools/import_dkma_index.py).","attribution":"Halveringstider: se pr. post. Navne-indeks: Klario kurateret; ved officielt import angives Lægemiddelstyrelsen som kilde."},"records":[{"atcCode":null,"brands":["Furix","Diural"],"verificationStatus":"verified","reviewRequired":false,"id":"furosemid","substanceName":"Furosemid","halfLife":{"value":2,"minimum":null,"maximum":null,"unit":"hours","measurementType":"terminal","route":null,"formulation":null,"population":"adults","clinicalQualifications":["Forlænges ved kronisk nyresygdom","Øget ophobningsrisiko ved svært nedsat nyrefunktion"]},"source":{"name":"StatPearls (NCBI Bookshelf) — Furosemide","url":"https://www.ncbi.nlm.nih.gov/books/NBK499921/","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"ca. 2 timer","calcOptions":[{"label":"","h":2}],"range":"Terminal halveringstid ca. 2 timer ved normal nyrefunktion; forlænges ved kronisk nyresygdom.","effekt":"Vanddrivende effekt varer typisk 6–8 timer.","faktorer":"Nedsat nyrefunktion forlænger halveringstiden.","klinisk":"Øget risiko for ophobning ved svært nedsat nyrefunktion."}},{"atcCode":null,"brands":["Panodil","Pinex","Pamol"],"verificationStatus":"verified","reviewRequired":false,"id":"paracetamol","substanceName":"Paracetamol","halfLife":{"value":null,"minimum":1,"maximum":4,"unit":"hours","measurementType":"plasma elimination","route":null,"formulation":null,"population":"adults","clinicalQualifications":["Ved overdosering eller betydelig leverpåvirkning kan forholdene afvige"]},"source":{"name":"Produktresumé (HPRA, Irland) — Paracetamol","url":"https://assets.hpra.ie/products/Human/17261/LicenseSPC_PA0408-004-002_29032006142741.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"1–4 timer","calcOptions":[{"label":"Lav (1 t)","h":1},{"label":"Høj (4 t)","h":4}],"range":"Plasmahalveringstid 1–4 timer ved terapeutiske doser.","effekt":"","faktorer":"Omsættes i leveren.","klinisk":"Ved overdosering eller betydelig leverpåvirkning kan forholdene afvige — slå op i godkendt kilde."}},{"atcCode":null,"brands":["Selo-Zok","Metoprolol"],"verificationStatus":"verified","reviewRequired":false,"id":"metoprolol","substanceName":"Metoprolol","halfLife":{"value":null,"minimum":3,"maximum":7,"unit":"hours","measurementType":"plasma elimination","route":null,"formulation":null,"population":"adults","clinicalQualifications":["Ikke klinisk betydende ændret ved nyresvigt","Depotform (metoprololsuccinat) giver længere virkningsvarighed end plasmahalveringstiden"]},"source":{"name":"FDA-produktinformation — Metoprolol","url":"https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/019962s036lbl.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"3–7 timer","calcOptions":[{"label":"Lav (3 t)","h":3},{"label":"Høj (7 t)","h":7}],"range":"Plasmahalveringstid ca. 3–7 timer.","effekt":"Depotform (metoprololsuccinat) giver længere virkningsvarighed end plasmahalveringstiden.","faktorer":"Omsættes hovedsagelig i leveren (CYP2D6). Ikke klinisk betydende ændret ved nyresvigt.","klinisk":""}},{"atcCode":null,"brands":["Norvasc"],"verificationStatus":"verified","reviewRequired":false,"id":"amlodipin","substanceName":"Amlodipin","halfLife":{"value":null,"minimum":30,"maximum":50,"unit":"hours","measurementType":"terminal","route":null,"formulation":null,"population":"adults","clinicalQualifications":["Ca. 56 timer ved nedsat leverfunktion","Nedsat clearance (øget eksponering) hos ældre og ved nedsat leverfunktion"]},"source":{"name":"FDA-produktinformation — Amlodipin","url":"https://www.accessdata.fda.gov/drugsatfda_docs/label/2005/019787s037lbl.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"30–50 timer","calcOptions":[{"label":"Lav (30 t)","h":30},{"label":"Høj (50 t)","h":50}],"range":"Terminal plasmahalveringstid ca. 30–50 timer; ca. 56 timer ved nedsat leverfunktion.","effekt":"","faktorer":"Nedsat clearance (øget eksponering) hos ældre og ved nedsat leverfunktion.","klinisk":"Lang halveringstid — steady state nås over flere dage."}},{"atcCode":null,"brands":["Lanoxin"],"verificationStatus":"verified","reviewRequired":false,"id":"digoxin","substanceName":"Digoxin","halfLife":{"value":null,"minimum":1.5,"maximum":2,"unit":"days","measurementType":"elimination","route":null,"formulation":null,"population":"adults (normal renal function)","clinicalQualifications":["Forlænget til 3,5–5 døgn ved anuri","Udskilles renalt; nedsat nyrefunktion forlænger halveringstiden","Smalt terapeutisk interval"]},"source":{"name":"FDA-produktinformation — Lanoxin (digoxin)","url":"https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/009330Orig1s036lbl.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"1,5–2 døgn","calcOptions":[{"label":"Lav (36 t)","h":36},{"label":"Høj (48 t)","h":48}],"range":"Halveringstid 1,5–2 døgn ved normal nyrefunktion; forlænget til 3,5–5 døgn ved anuri.","effekt":"","faktorer":"Udskilles renalt; nedsat nyrefunktion forlænger halveringstiden.","klinisk":"Smalt terapeutisk interval — vær opmærksom på ophobning ved nedsat nyrefunktion."}},{"atcCode":null,"brands":["Glucophage"],"verificationStatus":"verified","reviewRequired":false,"id":"metformin","substanceName":"Metformin","halfLife":{"value":6.2,"minimum":null,"maximum":null,"unit":"hours","measurementType":"plasma elimination","route":null,"formulation":null,"population":"adults","clinicalQualifications":["I blod ca. 17,6 timer","Forlænget ved nedsat nyrefunktion; nedsat renal clearance"]},"source":{"name":"FDA-produktinformation — Metformin","url":"https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/020357s031,021202s016lbl.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"plasma ca. 6 timer","calcOptions":[{"label":"Plasma (6,2 t)","h":6.2},{"label":"Blod (17,6 t)","h":17.6}],"range":"Plasma-halveringstid ca. 6,2 timer; i blod ca. 17,6 timer.","effekt":"","faktorer":"Udskilles renalt; nedsat nyrefunktion forlænger halveringstiden og nedsætter clearance.","klinisk":"Risiko for ophobning ved nedsat nyrefunktion."}},{"atcCode":null,"brands":["Triatec"],"verificationStatus":"verified","reviewRequired":false,"id":"ramipril","substanceName":"Ramipril","halfLife":{"value":null,"minimum":13,"maximum":17,"unit":"hours","measurementType":"ramiprilat, therapeutic range","route":null,"formulation":null,"population":"adults (multiple dosing)","clinicalQualifications":["Terminal fase har meget lang halveringstid (>50 timer), som ikke bidrager til ophobning","Eksponering 3–4× øget ved nedsat nyrefunktion","Ramipril er en prodrug, der omdannes til ramiprilat"]},"source":{"name":"FDA-produktinformation — Altace (ramipril)","url":"https://www.accessdata.fda.gov/drugsatfda_docs/label/2011/022021s007lbl.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"13–17 timer","calcOptions":[{"label":"Lav (13 t)","h":13},{"label":"Høj (17 t)","h":17}],"range":"Ramiprilat: halveringstid 13–17 timer inden for terapeutisk område. En terminal fase har meget lang halveringstid (>50 timer), som ikke bidrager til ophobning.","effekt":"","faktorer":"Eksponering 3–4× øget ved nedsat nyrefunktion.","klinisk":"Ramipril er en prodrug, der omdannes til ramiprilat."}},{"atcCode":null,"brands":["Pantoloc"],"verificationStatus":"verified","reviewRequired":false,"id":"pantoprazol","substanceName":"Pantoprazol","halfLife":{"value":1,"minimum":null,"maximum":null,"unit":"hours","measurementType":"terminal","route":null,"formulation":null,"population":"adults","clinicalQualifications":["7–9 timer ved nedsat leverfunktion","3,5–10 timer hos CYP2C19 poor metabolizers","Syrehæmmende effekt varer >24 timer trods kort halveringstid"]},"source":{"name":"FDA-produktinformation — Protonix (pantoprazol)","url":"https://www.accessdata.fda.gov/drugsatfda_docs/label/2001/20988s003lbl.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"ca. 1 time","calcOptions":[{"label":"","h":1}],"range":"Terminal plasmahalveringstid ca. 1 time; 7–9 timer ved nedsat leverfunktion; 3,5–10 timer hos CYP2C19 poor metabolizers.","effekt":"Syrehæmmende effekt varer >24 timer trods kort halveringstid (irreversibel binding til protonpumpen).","faktorer":"Nedsat leverfunktion og CYP2C19-status forlænger halveringstiden.","klinisk":"Godt eksempel på, at virkningsvarighed ikke følger halveringstiden."}},{"atcCode":null,"brands":["Contalgin","Oramorph"],"verificationStatus":"verified","reviewRequired":false,"id":"morfin","substanceName":"Morfin","halfLife":{"value":null,"minimum":1.5,"maximum":2,"unit":"hours","measurementType":"elimination","route":null,"formulation":null,"population":"adults (normal subjects)","clinicalQualifications":["Terminalt rapporteret 1,5–4,5 timer","Metabolitter (M3G, M6G) kan ophobes ved nyresvigt","Depotform har længere virkningsvarighed end plasmahalveringstiden"]},"source":{"name":"Produktinformation (Pfizer) — Morphine","url":"https://pfizermedicalinformation.com/morphine/clinical-pharmacology","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"1,5–2 timer","calcOptions":[{"label":"Lav (1,5 t)","h":1.5},{"label":"Høj (2 t)","h":2}],"range":"Eliminationshalveringstid 1,5–2 timer (terminalt rapporteret 1,5–4,5 timer).","effekt":"Depotform (fx Contalgin) har længere virkningsvarighed end plasmahalveringstiden.","faktorer":"Metabolitter (M3G, M6G) kan ophobes ved nyresvigt.","klinisk":"Vær opmærksom ved nedsat nyrefunktion."}},{"atcCode":null,"brands":["Eliquis"],"verificationStatus":"verified","reviewRequired":false,"id":"apixaban","substanceName":"Apixaban","halfLife":{"value":12,"minimum":null,"maximum":null,"unit":"hours","measurementType":"apparent","route":"oral","formulation":null,"population":"adults","clinicalQualifications":["Kan være påvirket ved nedsat nyre- eller leverfunktion"]},"source":{"name":"FDA-produktinformation — Eliquis (apixaban)","url":"https://www.accessdata.fda.gov/drugsatfda_docs/label/2014/202155s000lbl.pdf","documentVersion":null,"accessedAt":"2026-10-08","verifiedAt":"2026-10-08"},"ui":{"display":"ca. 12 timer","calcOptions":[{"label":"","h":12}],"range":"Tilsyneladende halveringstid ca. 12 timer efter oral indgift.","effekt":"","faktorer":"Kan være påvirket ved nedsat nyre- eller leverfunktion.","klinisk":"DOAK (direkte faktor Xa-hæmmer) — slå konkrete forhold op i godkendt kilde."}}],"index":[{"q":"furix","subId":"furosemid","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"diural","subId":"furosemid","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"furosemid","subId":"furosemid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"lasix","subId":"furosemid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"panodil","subId":"paracetamol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"pinex","subId":"paracetamol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"pamol","subId":"paracetamol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"paracetamol","subId":"paracetamol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"lanoxin","subId":"digoxin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"digoxin","subId":"digoxin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"metformin","subId":"metformin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"glucophage","subId":"metformin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"metoprolol","subId":"metoprolol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"selo-zok","subId":"metoprolol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"selozok","subId":"metoprolol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"bisoprolol","subId":"bisoprolol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"emconcor","subId":"bisoprolol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"amlodipin","subId":"amlodipin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"norvasc","subId":"amlodipin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"simvastatin","subId":"simvastatin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zocor","subId":"simvastatin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"atorvastatin","subId":"atorvastatin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"lipitor","subId":"atorvastatin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"warfarin","subId":"warfarin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"marevan","subId":"warfarin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"citalopram","subId":"citalopram","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cipramil","subId":"citalopram","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"sertralin","subId":"sertralin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zoloft","subId":"sertralin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"omeprazol","subId":"omeprazol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"losec","subId":"omeprazol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"pantoprazol","subId":"pantoprazol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"pantoloc","subId":"pantoprazol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"levothyroxin","subId":"levothyroxin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"eltroxin","subId":"levothyroxin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"euthyrox","subId":"levothyroxin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"morfin","subId":"morfin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"contalgin","subId":"morfin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"oramorph","subId":"morfin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"oxycodon","subId":"oxycodon","type":"substance","region":null,"source":"Klario kurateret"},{"q":"oxynorm","subId":"oxycodon","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"oxycontin","subId":"oxycodon","type":"brand","region":null,"source":"Klario kurateret"},{"q":"targin","subId":"oxycodon","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"tramadol","subId":"tramadol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"dolol","subId":"tramadol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"mandolgin","subId":"tramadol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"nobligan","subId":"tramadol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"ramipril","subId":"ramipril","type":"substance","region":null,"source":"Klario kurateret"},{"q":"triatec","subId":"ramipril","type":"brand","region":null,"source":"Klario kurateret"},{"q":"enalapril","subId":"enalapril","type":"substance","region":null,"source":"Klario kurateret"},{"q":"renitec","subId":"enalapril","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"losartan","subId":"losartan","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cozaar","subId":"losartan","type":"brand","region":null,"source":"Klario kurateret"},{"q":"apixaban","subId":"apixaban","type":"substance","region":null,"source":"Klario kurateret"},{"q":"eliquis","subId":"apixaban","type":"brand","region":null,"source":"Klario kurateret"},{"q":"rivaroxaban","subId":"rivaroxaban","type":"substance","region":null,"source":"Klario kurateret"},{"q":"xarelto","subId":"rivaroxaban","type":"brand","region":null,"source":"Klario kurateret"},{"q":"amoxicillin","subId":"amoxicillin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"imacillin","subId":"amoxicillin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"penicillin","subId":"penicillin","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"primcillin","subId":"penicillin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"prednisolon","subId":"prednisolon","type":"substance","region":null,"source":"Klario kurateret"},{"q":"diazepam","subId":"diazepam","type":"substance","region":null,"source":"Klario kurateret"},{"q":"stesolid","subId":"diazepam","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"valium","subId":"diazepam","type":"brand","region":null,"source":"Klario kurateret"},{"q":"oxazepam","subId":"oxazepam","type":"substance","region":null,"source":"Klario kurateret"},{"q":"alopam","subId":"oxazepam","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"insulin","subId":"insulin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"novorapid","subId":"insulin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"levemir","subId":"insulin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"lantus","subId":"insulin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"tresiba","subId":"insulin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"actrapid","subId":"insulin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"acetylsalicylsyre","subId":"acetylsalicylsyre","type":"substance","region":null,"source":"Klario kurateret"},{"q":"hjertemagnyl","subId":"acetylsalicylsyre","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"magnyl","subId":"acetylsalicylsyre","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"aspirin","subId":"acetylsalicylsyre","type":"brand","region":null,"source":"Klario kurateret"},{"q":"ibuprofen","subId":"ibuprofen","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ipren","subId":"ibuprofen","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"brufen","subId":"ibuprofen","type":"brand","region":null,"source":"Klario kurateret"},{"q":"kaliumklorid","subId":"kaliumklorid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"kaleorid","subId":"kaliumklorid","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"isosorbidmononitrat","subId":"isosorbidmononitrat","type":"substance","region":null,"source":"Klario kurateret"},{"q":"imdur","subId":"isosorbidmononitrat","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"isosorbid","subId":"isosorbidmononitrat","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"carvedilol","subId":"carvedilol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"atenolol","subId":"atenolol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"verapamil","subId":"verapamil","type":"substance","region":null,"source":"Klario kurateret"},{"q":"isoptin","subId":"verapamil","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"diltiazem","subId":"diltiazem","type":"substance","region":null,"source":"Klario kurateret"},{"q":"nifedipin","subId":"nifedipin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"adalat","subId":"nifedipin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"felodipin","subId":"felodipin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"plendil","subId":"felodipin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"candesartan","subId":"candesartan","type":"substance","region":null,"source":"Klario kurateret"},{"q":"atacand","subId":"candesartan","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"valsartan","subId":"valsartan","type":"substance","region":null,"source":"Klario kurateret"},{"q":"diovan","subId":"valsartan","type":"brand","region":null,"source":"Klario kurateret"},{"q":"telmisartan","subId":"telmisartan","type":"substance","region":null,"source":"Klario kurateret"},{"q":"micardis","subId":"telmisartan","type":"brand","region":null,"source":"Klario kurateret"},{"q":"lercanidipin","subId":"lercanidipin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zanidip","subId":"lercanidipin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"bendroflumethiazid","subId":"bendroflumethiazid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"centyl","subId":"bendroflumethiazid","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"hydrochlorthiazid","subId":"hydrochlorthiazid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"hydrochlorothiazid","subId":"hydrochlorthiazid","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"clopidogrel","subId":"clopidogrel","type":"substance","region":null,"source":"Klario kurateret"},{"q":"plavix","subId":"clopidogrel","type":"brand","region":null,"source":"Klario kurateret"},{"q":"amiodaron","subId":"amiodaron","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cordarone","subId":"amiodaron","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"sotalol","subId":"sotalol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"dabigatran","subId":"dabigatran","type":"substance","region":null,"source":"Klario kurateret"},{"q":"pradaxa","subId":"dabigatran","type":"brand","region":null,"source":"Klario kurateret"},{"q":"edoxaban","subId":"edoxaban","type":"substance","region":null,"source":"Klario kurateret"},{"q":"lixiana","subId":"edoxaban","type":"brand","region":null,"source":"Klario kurateret"},{"q":"rosuvastatin","subId":"rosuvastatin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"crestor","subId":"rosuvastatin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"pravastatin","subId":"pravastatin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ezetimibe","subId":"ezetimibe","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ezetrol","subId":"ezetimibe","type":"brand","region":null,"source":"Klario kurateret"},{"q":"spironolacton","subId":"spironolacton","type":"substance","region":null,"source":"Klario kurateret"},{"q":"spiron","subId":"spironolacton","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"bumetanid","subId":"bumetanid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"burinex","subId":"bumetanid","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"nitroglycerin","subId":"nitroglycerin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"glyceryltrinitrat","subId":"nitroglycerin","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"nitrolingual","subId":"nitroglycerin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"dipyridamol","subId":"dipyridamol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"persantin","subId":"dipyridamol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"asasantin","subId":"dipyridamol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"empagliflozin","subId":"empagliflozin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"jardiance","subId":"empagliflozin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"dapagliflozin","subId":"dapagliflozin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"forxiga","subId":"dapagliflozin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"sitagliptin","subId":"sitagliptin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"januvia","subId":"sitagliptin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"gliclazid","subId":"gliclazid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"diamicron","subId":"gliclazid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"glimepirid","subId":"glimepirid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"amaryl","subId":"glimepirid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"liraglutid","subId":"liraglutid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"victoza","subId":"liraglutid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"saxenda","subId":"liraglutid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"semaglutid","subId":"semaglutid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ozempic","subId":"semaglutid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"rybelsus","subId":"semaglutid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"wegovy","subId":"semaglutid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"esomeprazol","subId":"esomeprazol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"nexium","subId":"esomeprazol","type":"brand","region":null,"source":"Klario kurateret"},{"q":"lansoprazol","subId":"lansoprazol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"laktulose","subId":"laktulose","type":"substance","region":null,"source":"Klario kurateret"},{"q":"duphalac","subId":"laktulose","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"macrogol","subId":"macrogol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"movicol","subId":"macrogol","type":"brand","region":null,"source":"Klario kurateret"},{"q":"loperamid","subId":"loperamid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"imodium","subId":"loperamid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"metoclopramid","subId":"metoclopramid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"primperan","subId":"metoclopramid","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"ondansetron","subId":"ondansetron","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zofran","subId":"ondansetron","type":"brand","region":null,"source":"Klario kurateret"},{"q":"domperidon","subId":"domperidon","type":"substance","region":null,"source":"Klario kurateret"},{"q":"motilium","subId":"domperidon","type":"brand","region":null,"source":"Klario kurateret"},{"q":"salbutamol","subId":"salbutamol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ventoline","subId":"salbutamol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"airomir","subId":"salbutamol","type":"brand","region":null,"source":"Klario kurateret"},{"q":"terbutalin","subId":"terbutalin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"bricanyl","subId":"terbutalin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"ipratropium","subId":"ipratropium","type":"substance","region":null,"source":"Klario kurateret"},{"q":"atrovent","subId":"ipratropium","type":"brand","region":null,"source":"Klario kurateret"},{"q":"tiotropium","subId":"tiotropium","type":"substance","region":null,"source":"Klario kurateret"},{"q":"spiriva","subId":"tiotropium","type":"brand","region":null,"source":"Klario kurateret"},{"q":"budesonid","subId":"budesonid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"pulmicort","subId":"budesonid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"montelukast","subId":"montelukast","type":"substance","region":null,"source":"Klario kurateret"},{"q":"singulair","subId":"montelukast","type":"brand","region":null,"source":"Klario kurateret"},{"q":"formoterol","subId":"formoterol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"oxis","subId":"formoterol","type":"brand","region":null,"source":"Klario kurateret"},{"q":"mirtazapin","subId":"mirtazapin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"remeron","subId":"mirtazapin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"venlafaxin","subId":"venlafaxin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"efexor","subId":"venlafaxin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"duloxetin","subId":"duloxetin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cymbalta","subId":"duloxetin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"escitalopram","subId":"escitalopram","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cipralex","subId":"escitalopram","type":"brand","region":null,"source":"Klario kurateret"},{"q":"quetiapin","subId":"quetiapin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"seroquel","subId":"quetiapin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"olanzapin","subId":"olanzapin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zyprexa","subId":"olanzapin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"risperidon","subId":"risperidon","type":"substance","region":null,"source":"Klario kurateret"},{"q":"risperdal","subId":"risperidon","type":"brand","region":null,"source":"Klario kurateret"},{"q":"haloperidol","subId":"haloperidol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"serenase","subId":"haloperidol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"lorazepam","subId":"lorazepam","type":"substance","region":null,"source":"Klario kurateret"},{"q":"temesta","subId":"lorazepam","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"zopiclon","subId":"zopiclon","type":"substance","region":null,"source":"Klario kurateret"},{"q":"imovane","subId":"zopiclon","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"zolpidem","subId":"zolpidem","type":"substance","region":null,"source":"Klario kurateret"},{"q":"stilnoct","subId":"zolpidem","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"melatonin","subId":"melatonin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"circadin","subId":"melatonin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"pregabalin","subId":"pregabalin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"lyrica","subId":"pregabalin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"gabapentin","subId":"gabapentin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"neurontin","subId":"gabapentin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"donepezil","subId":"donepezil","type":"substance","region":null,"source":"Klario kurateret"},{"q":"aricept","subId":"donepezil","type":"brand","region":null,"source":"Klario kurateret"},{"q":"memantin","subId":"memantin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ebixa","subId":"memantin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"lamotrigin","subId":"lamotrigin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"lamictal","subId":"lamotrigin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"diclofenac","subId":"diclofenac","type":"substance","region":null,"source":"Klario kurateret"},{"q":"voltaren","subId":"diclofenac","type":"brand","region":null,"source":"Klario kurateret"},{"q":"naproxen","subId":"naproxen","type":"substance","region":null,"source":"Klario kurateret"},{"q":"fentanyl","subId":"fentanyl","type":"substance","region":null,"source":"Klario kurateret"},{"q":"durogesic","subId":"fentanyl","type":"brand","region":null,"source":"Klario kurateret"},{"q":"matrifen","subId":"fentanyl","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"buprenorfin","subId":"buprenorfin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"norspan","subId":"buprenorfin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"codein","subId":"codein","type":"substance","region":null,"source":"Klario kurateret"},{"q":"kodimagnyl","subId":"codein","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"enoxaparin","subId":"enoxaparin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"klexane","subId":"enoxaparin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"dalteparin","subId":"dalteparin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"fragmin","subId":"dalteparin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"tinzaparin","subId":"tinzaparin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"innohep","subId":"tinzaparin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"dicloxacillin","subId":"dicloxacillin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"diclocil","subId":"dicloxacillin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"pivmecillinam","subId":"pivmecillinam","type":"substance","region":null,"source":"Klario kurateret"},{"q":"selexid","subId":"pivmecillinam","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"nitrofurantoin","subId":"nitrofurantoin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"sulfamethizol","subId":"sulfamethizol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"primazol","subId":"sulfamethizol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"metronidazol","subId":"metronidazol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"flagyl","subId":"metronidazol","type":"brand","region":null,"source":"Klario kurateret"},{"q":"ciprofloxacin","subId":"ciprofloxacin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ciproxin","subId":"ciprofloxacin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"clarithromycin","subId":"clarithromycin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"klacid","subId":"clarithromycin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"alendronat","subId":"alendronat","type":"substance","region":null,"source":"Klario kurateret"},{"q":"fosamax","subId":"alendronat","type":"brand","region":null,"source":"Klario kurateret"},{"q":"allopurinol","subId":"allopurinol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zyloric","subId":"allopurinol","type":"brand","region":null,"source":"Klario kurateret"},{"q":"calciumcarbonat","subId":"calciumcarbonat","type":"substance","region":null,"source":"Klario kurateret"},{"q":"calcichew","subId":"calciumcarbonat","type":"brand","region":null,"source":"Klario kurateret"},{"q":"colecalciferol","subId":"colecalciferol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"d-vitamin","subId":"colecalciferol","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"hydrocortison","subId":"hydrocortison","type":"substance","region":null,"source":"Klario kurateret"},{"q":"solu-cortef","subId":"hydrocortison","type":"brand","region":null,"source":"Klario kurateret"},{"q":"levomepromazin","subId":"levomepromazin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"nozinan","subId":"levomepromazin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"chlorprothixen","subId":"chlorprothixen","type":"substance","region":null,"source":"Klario kurateret"},{"q":"truxal","subId":"chlorprothixen","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"zuclopenthixol","subId":"zuclopenthixol","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cisordinol","subId":"zuclopenthixol","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"clonazepam","subId":"clonazepam","type":"substance","region":null,"source":"Klario kurateret"},{"q":"rivotril","subId":"clonazepam","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"carbamazepin","subId":"carbamazepin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"tegretol","subId":"carbamazepin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"acetylcystein","subId":"acetylcystein","type":"substance","region":null,"source":"Klario kurateret"},{"q":"mucomyst","subId":"acetylcystein","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"nac","subId":"acetylcystein","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"tranexamsyre","subId":"tranexamsyre","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cyklokapron","subId":"tranexamsyre","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"cetirizin","subId":"cetirizin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zyrtec","subId":"cetirizin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"loratadin","subId":"loratadin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"clarityn","subId":"loratadin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"desloratadin","subId":"desloratadin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"aerius","subId":"desloratadin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"promethazin","subId":"promethazin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"phenergan","subId":"promethazin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"natriumpicosulfat","subId":"natriumpicosulfat","type":"substance","region":null,"source":"Klario kurateret"},{"q":"laxoberal","subId":"natriumpicosulfat","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"magnesiumhydroxid","subId":"magnesiumhydroxid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"magnesia","subId":"magnesiumhydroxid","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"tamsulosin","subId":"tamsulosin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"omnic","subId":"tamsulosin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"finasterid","subId":"finasterid","type":"substance","region":null,"source":"Klario kurateret"},{"q":"proscar","subId":"finasterid","type":"brand","region":null,"source":"Klario kurateret"},{"q":"solifenacin","subId":"solifenacin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"vesicare","subId":"solifenacin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"tolterodin","subId":"tolterodin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"detrusitol","subId":"tolterodin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"mirabegron","subId":"mirabegron","type":"substance","region":null,"source":"Klario kurateret"},{"q":"betmiga","subId":"mirabegron","type":"brand","region":null,"source":"Klario kurateret"},{"q":"latanoprost","subId":"latanoprost","type":"substance","region":null,"source":"Klario kurateret"},{"q":"xalatan","subId":"latanoprost","type":"brand","region":null,"source":"Klario kurateret"},{"q":"baclofen","subId":"baclofen","type":"substance","region":null,"source":"Klario kurateret"},{"q":"lioresal","subId":"baclofen","type":"brand","region":null,"source":"Klario kurateret"},{"q":"tizanidin","subId":"tizanidin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"sirdalud","subId":"tizanidin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"sildenafil","subId":"sildenafil","type":"substance","region":null,"source":"Klario kurateret"},{"q":"viagra","subId":"sildenafil","type":"brand","region":null,"source":"Klario kurateret"},{"q":"revatio","subId":"sildenafil","type":"brand","region":null,"source":"Klario kurateret"},{"q":"mometason","subId":"mometason","type":"substance","region":null,"source":"Klario kurateret"},{"q":"nasonex","subId":"mometason","type":"brand","region":null,"source":"Klario kurateret"},{"q":"fluticason","subId":"fluticason","type":"substance","region":null,"source":"Klario kurateret"},{"q":"flutide","subId":"fluticason","type":"brand","region":null,"source":"Klario kurateret"},{"q":"methotrexat","subId":"methotrexat","type":"substance","region":null,"source":"Klario kurateret"},{"q":"azathioprin","subId":"azathioprin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"imurel","subId":"azathioprin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"colchicin","subId":"colchicin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"clindamycin","subId":"clindamycin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"dalacin","subId":"clindamycin","type":"brand","region":null,"source":"Klario kurateret"},{"q":"erythromycin","subId":"erythromycin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"abboticin","subId":"erythromycin","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"flucloxacillin","subId":"flucloxacillin","type":"substance","region":null,"source":"Klario kurateret"},{"q":"cefuroxim","subId":"cefuroxim","type":"substance","region":null,"source":"Klario kurateret"},{"q":"zinnat","subId":"cefuroxim","type":"brand","region":null,"source":"Klario kurateret"},{"q":"trimethoprim","subId":"trimethoprim","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ferrosulfat","subId":"ferrosulfat","type":"substance","region":null,"source":"Klario kurateret"},{"q":"ferro duretter","subId":"ferrosulfat","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"ferroduretter","subId":"ferrosulfat","type":"brand","region":"DK","source":"Klario kurateret"},{"q":"folsyre","subId":"folsyre","type":"substance","region":null,"source":"Klario kurateret"},{"q":"folinsyre","subId":"folsyre","type":"synonym","region":null,"source":"Klario kurateret"},{"q":"dexamethason","subId":"dexamethason","type":"substance","region":null,"source":"Klario kurateret"},{"q":"digitoxin","subId":"digitoxin","type":"substance","region":null,"source":"Klario kurateret"}],"substances":{"furosemid":"Furosemid","paracetamol":"Paracetamol","digoxin":"Digoxin","metformin":"Metformin","metoprolol":"Metoprolol","bisoprolol":"Bisoprolol","amlodipin":"Amlodipin","simvastatin":"Simvastatin","atorvastatin":"Atorvastatin","warfarin":"Warfarin","citalopram":"Citalopram","sertralin":"Sertralin","omeprazol":"Omeprazol","pantoprazol":"Pantoprazol","levothyroxin":"Levothyroxin","morfin":"Morfin","oxycodon":"Oxycodon","tramadol":"Tramadol","ramipril":"Ramipril","enalapril":"Enalapril","losartan":"Losartan","apixaban":"Apixaban","rivaroxaban":"Rivaroxaban","amoxicillin":"Amoxicillin","penicillin":"Phenoxymethylpenicillin","prednisolon":"Prednisolon","diazepam":"Diazepam","oxazepam":"Oxazepam","insulin":"Insulin","acetylsalicylsyre":"Acetylsalicylsyre","ibuprofen":"Ibuprofen","kaliumklorid":"Kaliumklorid","isosorbidmononitrat":"Isosorbidmononitrat","carvedilol":"Carvedilol","atenolol":"Atenolol","verapamil":"Verapamil","diltiazem":"Diltiazem","nifedipin":"Nifedipin","felodipin":"Felodipin","candesartan":"Candesartan","valsartan":"Valsartan","telmisartan":"Telmisartan","lercanidipin":"Lercanidipin","bendroflumethiazid":"Bendroflumethiazid","hydrochlorthiazid":"Hydrochlorthiazid","clopidogrel":"Clopidogrel","amiodaron":"Amiodaron","sotalol":"Sotalol","dabigatran":"Dabigatran","edoxaban":"Edoxaban","rosuvastatin":"Rosuvastatin","pravastatin":"Pravastatin","ezetimibe":"Ezetimibe","spironolacton":"Spironolacton","bumetanid":"Bumetanid","nitroglycerin":"Nitroglycerin (glyceryltrinitrat)","dipyridamol":"Dipyridamol","empagliflozin":"Empagliflozin","dapagliflozin":"Dapagliflozin","sitagliptin":"Sitagliptin","gliclazid":"Gliclazid","glimepirid":"Glimepirid","liraglutid":"Liraglutid","semaglutid":"Semaglutid","esomeprazol":"Esomeprazol","lansoprazol":"Lansoprazol","laktulose":"Laktulose","macrogol":"Macrogol","loperamid":"Loperamid","metoclopramid":"Metoclopramid","ondansetron":"Ondansetron","domperidon":"Domperidon","salbutamol":"Salbutamol","terbutalin":"Terbutalin","ipratropium":"Ipratropium","tiotropium":"Tiotropium","budesonid":"Budesonid","montelukast":"Montelukast","formoterol":"Formoterol","mirtazapin":"Mirtazapin","venlafaxin":"Venlafaxin","duloxetin":"Duloxetin","escitalopram":"Escitalopram","quetiapin":"Quetiapin","olanzapin":"Olanzapin","risperidon":"Risperidon","haloperidol":"Haloperidol","lorazepam":"Lorazepam","zopiclon":"Zopiclon","zolpidem":"Zolpidem","melatonin":"Melatonin","pregabalin":"Pregabalin","gabapentin":"Gabapentin","donepezil":"Donepezil","memantin":"Memantin","lamotrigin":"Lamotrigin","diclofenac":"Diclofenac","naproxen":"Naproxen","fentanyl":"Fentanyl","buprenorfin":"Buprenorfin","codein":"Codein","enoxaparin":"Enoxaparin","dalteparin":"Dalteparin","tinzaparin":"Tinzaparin","dicloxacillin":"Dicloxacillin","pivmecillinam":"Pivmecillinam","nitrofurantoin":"Nitrofurantoin","sulfamethizol":"Sulfamethizol","metronidazol":"Metronidazol","ciprofloxacin":"Ciprofloxacin","clarithromycin":"Clarithromycin","alendronat":"Alendronat","allopurinol":"Allopurinol","calciumcarbonat":"Calciumcarbonat","colecalciferol":"Colecalciferol (D-vitamin)","hydrocortison":"Hydrocortison","levomepromazin":"Levomepromazin","chlorprothixen":"Chlorprothixen","zuclopenthixol":"Zuclopenthixol","clonazepam":"Clonazepam","carbamazepin":"Carbamazepin","acetylcystein":"Acetylcystein","tranexamsyre":"Tranexamsyre","cetirizin":"Cetirizin","loratadin":"Loratadin","desloratadin":"Desloratadin","promethazin":"Promethazin","natriumpicosulfat":"Natriumpicosulfat","magnesiumhydroxid":"Magnesiumhydroxid","tamsulosin":"Tamsulosin","finasterid":"Finasterid","solifenacin":"Solifenacin","tolterodin":"Tolterodin","mirabegron":"Mirabegron","latanoprost":"Latanoprost","baclofen":"Baclofen","tizanidin":"Tizanidin","sildenafil":"Sildenafil","mometason":"Mometason","fluticason":"Fluticason","methotrexat":"Methotrexat","azathioprin":"Azathioprin","colchicin":"Colchicin","clindamycin":"Clindamycin","erythromycin":"Erythromycin","flucloxacillin":"Flucloxacillin","cefuroxim":"Cefuroxim","trimethoprim":"Trimethoprim","ferrosulfat":"Ferrosulfat","folsyre":"Folsyre","dexamethason":"Dexamethason","digitoxin":"Digitoxin"}};
/* ===== KLARIO medication data layer (Option A1, Phase 1) ================
 * Scalable, versioned, source-verifiable. Data lives in a separate versioned
 * JSON (data/klario-halflife.v1.json + data/klario-medication-index.v1.json),
 * loaded at runtime and cached; an inlined MED_SEED (above) is the offline
 * floor so the app always works even if the fetch/update fails. Nothing is
 * invented. Option B (online source) is prepared but DISABLED. */
const MED_SCHEMA_MAJOR = "1";
const MED_ONLINE = false;                         // Option B — kept OFF
const MED_ONLINE_URL = "";                        // set by a future approved phase
const MED_FILE_HALFLIFE = "data/klario-halflife.v1.json";
const MED_FILE_INDEX = "data/klario-medication-index.v1.json";       // PRODUCTION name index (curated, redistribution-safe)
const MED_FILE_INDEX_DEV = "data/klario-medication-index.dev.json";  // DEV-ONLY Lægemiddelstyrelsen index — must NOT be deployed to public builds
const MED_DS_CACHE_KEY = "klario_med_ds_v1";
const MED_DS_CACHE_KEY_DEV = "klario_med_ds_dev_v1";                 // dev dataset cached under a separate key so it can never surface in production
/* Dev gate (requirement 1): the full imported Danish dataset is kept out of
 * public production builds by TWO independent gates — (a) this environment flag
 * is false on the deployed host, and (b) the dev index file is not shipped, so
 * even if the flag were forced on, the fetch 404s and we fall back to curated. */
function medDevEnabled() {
  try {
    var h = (typeof location !== "undefined" && location.hostname) || "";
    var isLocal = h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h === "";
    var qp = (typeof location !== "undefined" && (location.search || "").indexOf("devmed=1") >= 0);
    var ls = false; try { ls = localStorage.getItem("klario_dev_med") === "1"; } catch (e) {}
    return !!(isLocal || qp || ls);
  } catch (e) { return false; }
}
const hlNorm = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");
const MED_MEAS = { "terminal": "Terminal halveringstid", "elimination": "Eliminationshalveringstid", "plasma elimination": "Plasmahalveringstid (elimination)", "apparent": "Tilsyneladende halveringstid", "biological": "Biologisk halveringstid" };
const medMeasLabel = (m) => MED_MEAS[m] || (m ? m.charAt(0).toUpperCase() + m.slice(1) : "Halveringstid");

/* schema version compatibility (major must match) */
const medVerMajor = (v) => String(v || "").split(".")[0];
const medSchemaCompatible = (ds) => !!(ds && ds.meta && medVerMajor(ds.meta.schemaVersion) === MED_SCHEMA_MAJOR);

/* validator — rejects incomplete/corrupt datasets */
function validateMedDataset(ds) {
  const err = [];
  if (!ds || typeof ds !== "object") return { ok: false, errors: ["dataset mangler"] };
  if (!ds.meta || !ds.meta.schemaVersion) err.push("meta/schemaVersion mangler");
  else if (!medSchemaCompatible(ds)) err.push("skema-version ikke kompatibel (" + ds.meta.schemaVersion + ")");
  if (!Array.isArray(ds.records)) err.push("records er ikke en liste");
  if (!Array.isArray(ds.index)) err.push("index er ikke en liste");
  if (Array.isArray(ds.records)) ds.records.forEach((r, i) => { if (!r || !r.id || !r.substanceName || !r.halfLife || !r.source || !r.verificationStatus) err.push("record " + i + " mangler felter"); });
  if (Array.isArray(ds.index) && ds.index.length) ds.index.forEach((x, i) => { if (!x || !x.q || !x.subId) err.push("index " + i + " mangler felter"); });
  return { ok: err.length === 0, errors: err };
}

/* build fast runtime structures (alias index + autocomplete).
 * _alias entries are {k, id, e}: k = normalised search key, id = substance id,
 * e = the source index entry (carries combo/subs/review/atc) or null for aliases
 * derived from verified records / substance names. */
const MED_SUGGEST_CAP = 1800; // keep the autocomplete datalist light on mobile
function medBuildRuntime(ds) {
  const d = Object.assign({}, ds);
  d.substances = d.substances || {};
  const recById = {}; (d.records || []).forEach((r) => { recById[r.id] = r; });
  d._recById = recById;
  const ai = []; const seen = {};
  const push = (k, id, e) => { if (!k || !id) return; if (seen[k]) { return; } seen[k] = 1; ai.push({ k: k, id: id, e: e || null }); };
  // verified records: id, substance name, brands
  (d.records || []).forEach((r) => { push(r.id, r.id, null); push(hlNorm(r.substanceName), r.id, null); (r.brands || []).forEach((b) => push(hlNorm(b), r.id, null)); });
  // substance ids + display names
  Object.keys(d.substances).forEach((k) => { push(k, k, null); push(hlNorm(d.substances[k]), k, null); });
  // provided index (brand/substance names) + ATC codes (requirement 6: ATC search)
  (d.index || []).forEach((x) => { push(hlNorm(x.q), x.subId, x); if (x.atc) push(hlNorm(x.atc), x.subId, x); });
  d._alias = ai;
  // map normalised name/atc -> best index entry (prefer brand entries carrying combo/review)
  const eByQ = {}; (d.index || []).forEach((x) => { const k = hlNorm(x.q); const cur = eByQ[k]; if (!cur || (x.type === "brand" && cur.type !== "brand")) eByQ[k] = x; if (x.atc) { const ak = hlNorm(x.atc); if (!eByQ[ak]) eByQ[ak] = x; } });
  d._entryByQ = eByQ;
  // autocomplete suggestions (capped): substance display names first, then record brands, then index names
  const sg = {}; const order = [];
  const addSg = (name) => { if (name && !sg[name]) { sg[name] = 1; order.push(name); } };
  Object.keys(d.substances).forEach((k) => addSg(d.substances[k]));
  (d.records || []).forEach((r) => { addSg(r.substanceName); (r.brands || []).forEach((b) => addSg(b)); });
  for (let i = 0; i < (d.index || []).length && order.length < MED_SUGGEST_CAP; i++) { const x = d.index[i]; addSg(x.q.charAt(0).toUpperCase() + x.q.slice(1)); }
  d.suggest = order.sort().slice(0, MED_SUGGEST_CAP);
  return d;
}

/* dataset cache (last known good) */
function medCacheRead(key) { try { const o = JSON.parse(localStorage.getItem(key || MED_DS_CACHE_KEY) || "null"); return o && o.ds ? o : null; } catch (e) { return null; } }
function medCacheWrite(ds, key) { try { localStorage.setItem(key || MED_DS_CACHE_KEY, JSON.stringify({ ds: ds, savedAt: Date.now() })); } catch (e) {} }

/* loader: online(disabled) → verified half-life file + name index → cache → seed.
 * The name index is the curated production file by default; the full
 * Lægemiddelstyrelsen index loads ONLY when medDevEnabled() AND the dev file is
 * actually present (both gates). Dev datasets cache under a separate key so they
 * can never resurface in a production build. Half-life records always come from
 * the verified half-life file — the name index never carries half-life values. */
async function loadMedicationData() {
  if (MED_ONLINE && MED_ONLINE_URL) { /* Option B — future approved phase */ }
  const dev = medDevEnabled();
  const cacheKey = dev ? MED_DS_CACHE_KEY_DEV : MED_DS_CACHE_KEY;
  try {
    const hRes = await fetch(MED_FILE_HALFLIFE, { cache: "no-cache" });
    // choose index source: dev (only if gated + present) else curated production
    let idx = null, idxDev = false;
    if (dev) {
      try { const dRes = await fetch(MED_FILE_INDEX_DEV, { cache: "no-cache" }); if (dRes.ok) { const dj = await dRes.json(); if (dj && Array.isArray(dj.index)) { idx = dj; idxDev = true; } } } catch (e) {}
    }
    if (!idx) { const iRes = await fetch(MED_FILE_INDEX, { cache: "no-cache" }); if (iRes.ok) idx = await iRes.json(); }
    if (hRes.ok && idx) {
      const h = await hRes.json();
      const subs = Object.assign({}, h.substances || {}, idx.substances || {});
      const meta = Object.assign({}, h.meta, {
        nameIndexVersion: (idx.meta && idx.meta.datasetVersion) || null,
        nameIndexSourceName: (idx.meta && idx.meta.nameSource) || "Klario kurateret",
        nameIndexAttribution: (idx.meta && idx.meta.attribution) || null,
        nameIndexRedistribution: (idx.meta && idx.meta.redistribution) || null,
        nameIndexDev: idxDev,
      });
      const ds = { meta: meta, records: h.records, substances: subs, index: idx.index || [] };
      if (validateMedDataset(ds).ok) {
        medCacheWrite(ds, cacheKey);
        return { ds: medBuildRuntime(ds), origin: idxDev ? "dev" : "network", meta: ds.meta };
      }
    }
  } catch (e) { /* offline or missing — fall through */ }
  const c = medCacheRead(cacheKey);
  if (c && validateMedDataset(c.ds).ok) return { ds: medBuildRuntime(c.ds), origin: "cache", meta: c.ds.meta };
  return { ds: medBuildRuntime(MED_SEED), origin: "seed", meta: MED_SEED.meta };
}

/* resolve / match / get */
const medSubName = (ds, id) => { const r = ds._recById && ds._recById[id]; return (r && r.substanceName) || (ds.substances && ds.substances[id]) || id; };
function medResolve(ds, q) { const s = hlNorm(q); if (!s) return null; const A = ds._alias || []; let a = A.find((x) => x.k === s); if (!a && s.length >= 3) a = A.find((x) => x.k.length >= 3 && (x.k.indexOf(s) === 0 || s.indexOf(x.k) === 0)); if (!a && s.length >= 4) a = A.find((x) => x.k.length >= 4 && (x.k.indexOf(s) >= 0 || s.indexOf(x.k) >= 0)); return a ? a.id : null; }
/* returns one match per substance id, carrying the best index entry (combo/review).
 * Min key length on prefix/substring matches stops short ids (e.g. a 1-char slug)
 * from falsely matching unrelated queries. */
function medMatches(ds, q) {
  const s = hlNorm(q); if (!s) return [];
  const best = {}; // subId -> {score, e}
  const score = (k) => (k === s ? 3 : (s.length >= 3 && k.length >= 3 && (k.indexOf(s) === 0 || s.indexOf(k) === 0)) ? 2 : (s.length >= 4 && k.length >= 4 && (k.indexOf(s) >= 0 || s.indexOf(k) >= 0)) ? 1 : 0);
  (ds._alias || []).forEach((x) => {
    const sc = score(x.k); if (!sc) return;
    const rich = x.e ? (x.e.combo ? 3 : (x.e.type === "brand" ? 2 : 1)) : 0;
    const cur = best[x.id];
    if (!cur || sc > cur.score || (sc === cur.score && rich > cur.rich)) best[x.id] = { score: sc, rich: rich, e: x.e || (cur && cur.e) || null };
  });
  return Object.keys(best).sort((a, b) => best[b].score - best[a].score).map((id) => { const r = ds._recById[id]; const e = best[id].e; return { subId: id, subName: medSubName(ds, id), verified: !!(r && r.verificationStatus === "verified"), entry: e || null, combo: !!(e && e.combo), subs: (e && e.subs) || null, atc: (e && e.atc) || (r && r.atcCode) || null, review: !!(e && e.review) }; });
}
/* best index entry for a free-text query (used to carry combo/review into the single-match view) */
function medEntryForQuery(ds, q) { const s = hlNorm(q); if (!s) return null; const E = ds._entryByQ || {}; if (E[s]) return E[s]; let hit = null; const keys = Object.keys(E); for (let i = 0; i < keys.length; i++) { const k = keys[i]; if (s.length >= 3 && (k.indexOf(s) === 0 || s.indexOf(k) === 0)) { hit = E[k]; break; } } return hit; }
const MED_STALE_MONTHS = 12;
function medStale(dateStr) { const t = Date.parse(dateStr); if (isNaN(t)) return false; return (Date.now() - t) / (1000 * 60 * 60 * 24 * 30.44) > MED_STALE_MONTHS; }
/* status: verified | previously-verified | unverified | not-documented | unavailable */
function medGet(ds, subId) {
  const r = ds._recById && ds._recById[subId];
  const subName = medSubName(ds, subId);
  if (!r) return { status: "unavailable", subId: subId, subName: subName };
  if (r.notDocumented || (r.halfLife && r.halfLife.notDocumented)) return { status: "not-documented", record: r, subId: subId, subName: subName };
  if (r.verificationStatus === "verified") return { status: medStale(r.source && r.source.verifiedAt) ? "previously-verified" : "verified", record: r, subId: subId, subName: subName };
  return { status: "unverified", record: r, subId: subId, subName: subName };
}
/* map a record → the card shape the UI renders */
function medToCard(r) {
  const u = r.ui || {};
  const hl = r.halfLife || {};
  return { substans: r.substanceName, aktivt: (u.aktivt || r.substanceName), brands: r.brands || [], display: u.display || "", measLabel: medMeasLabel(hl.measurementType), range: u.range || "", effekt: u.effekt || "", faktorer: u.faktorer || "", klinisk: u.klinisk || "", quals: hl.clinicalQualifications || [], calcOptions: u.calcOptions || [], kilde: (r.source && r.source.name) || "", kildeUrl: (r.source && r.source.url) || "", lastVerified: (r.source && r.source.verifiedAt) || "" };
}
/* Option B-ready interface (kept for future online phase) */
async function getHalfLife(ds, subId) { return medGet(ds, subId); }
async function resolveMedication(ds, query) { return medMatches(ds, query); }

/* recents cache (per-viewer convenience) */
const HL_CACHE_KEY = "klario_hl_cache_v1";
function hlCacheRead() { try { return JSON.parse(localStorage.getItem(HL_CACHE_KEY) || "{}") || {}; } catch (e) { return {}; } }
function hlCacheWrite(o) { try { localStorage.setItem(HL_CACHE_KEY, JSON.stringify(o)); } catch (e) {} }
/* manuelt indtastede (ikke-verificerede) halveringstider — pr. stof */
const HL_MANUAL_KEY = "klario_hl_manual_v1";
function hlManualRead() { try { return JSON.parse(localStorage.getItem(HL_MANUAL_KEY) || "{}") || {}; } catch (e) { return {}; } }
function hlManualWrite(o) { try { localStorage.setItem(HL_MANUAL_KEY, JSON.stringify(o)); } catch (e) {} }


const HALFLIFE_EDU = [
  { t: "Hvad er halveringstid (T½)?", q: "Halveringstiden er den tid, det tager, før koncentrationen af et lægemiddel i kroppen (plasma) er faldet til omtrent det halve.", m: "T½ er et kinetisk mål. Et lægemiddel med lang T½ bliver længere i kroppen end et med kort T½. Den konkrete T½ for et præparat slås op i en godkendt kilde." },
  { t: "Hvordan falder koncentrationen over tid?", q: "For hver halveringstid falder mængden til ca. det halve: 100 % → 50 % → 25 % → 12,5 % → 6,25 % → 3,125 %.", m: "Dette er en forenklet førsteordens-model. Efter ca. 5 halveringstider er omtrent 96,875 % udskilt, og lægemidlet regnes typisk som næsten elimineret. Det er en tommelfingerregel til forståelse — ikke en universel klinisk regel for alle lægemidler." },
  { t: "Halveringstid vs. virkningsvarighed vs. elimination", q: "De tre ting er ikke det samme.", m: "Halveringstid er, hvor hurtigt koncentrationen halveres. Virkningsvarighed er, hvor længe effekten mærkes — den afhænger også af dosis, bindingsstyrke m.m. Elimination er den samlede fjernelse af lægemidlet (metabolisme + udskillelse)." },
  { t: "Lever, nyrer og T½", q: "Lever og nyrer bestemmer i høj grad, hvor hurtigt et lægemiddel forlader kroppen.", m: "Nedsat lever- eller nyrefunktion kan forlænge halveringstiden, så lægemidlet bliver længere i kroppen og lettere kan ophobes. Mange lægemidler kræver derfor ekstra opmærksomhed ved nedsat organfunktion." },
  { t: "Ophobning ved gentagen dosering", q: "Gives en ny dosis, før den forrige er elimineret, kan lægemidlet ophobes i kroppen.", m: "Doseringsintervallet hænger sammen med halveringstiden. Er T½ forlænget (fx hos ældre eller ved nedsat organfunktion), stiger risikoen for ophobning og dermed for bivirkninger." },
  { t: "Halveringstid og steady state", q: "Ved gentagen dosering når koncentrationen et nogenlunde stabilt niveau (steady state) — typisk efter ca. 4–5 halveringstider.", m: "Ved steady state er det, der tilføres, nogenlunde lig med det, der udskilles. Jo længere T½, jo længere tid tager det at nå steady state." },
  { t: "Hvorfor kræver ældre ekstra opmærksomhed?", q: "Ældre har ofte nedsat nyre- og leverfunktion og ændret kropssammensætning.", m: "Det kan forlænge halveringstiden, så lægemidler virker længere og lettere ophobes. Sammen med polyfarmaci øger det risikoen for bivirkninger og interaktioner — observér og følg lokale instrukser." },
];

/* Halveringstider-tabel (fast, matematisk — ikke lægemiddelspecifik) */
const HL_TABLE = [1, 2, 3, 4, 5, 6].map((n) => ({ n, remaining: Math.pow(0.5, n) * 100, eliminated: 100 - Math.pow(0.5, n) * 100 }));

/* ===== KLARIO Medicinbibliotek (V1) =====================================
 * Searchable medication library. IDENTITY (navn, aktivt stof, ATC, form,
 * markedsføring) verified against Lægemiddelstyrelsens register. Verified
 * half-lives reused from the source-verified dataset; others show "Ikke
 * verificeret". Deeper clinical sections are pending faglig gennemgang with NO
 * fabricated content. Favorites + recently-viewed persist in localStorage.
 * All UI strings use real UTF-8 (JSX does not interpret \u escapes). */
const MEDLIB = [{"id": "amlodipin", "brandName": "Amlodipin", "activeSubstance": "Amlodipin", "activeSubstanceRaw": "amlodipinbesilat", "alternativeNames": ["Amlodipinbesilat", "Norvasc"], "medicationGroup": "Calciumantagonist", "clinicalCategories": ["Hjerte og kredsløb"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "C08CA01", "forms": ["oral suspension", "tabletter"], "indicationShort": "Calciumantagonist (blodtryk)", "halfLife": {"status": "verified", "display": "30–50 timer", "measLabel": "Terminal halveringstid", "source": "FDA-produktinformation — Amlodipin", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2005/019787s037lbl.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "FDA-produktinformation — Amlodipin", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2005/019787s037lbl.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "citalopram", "brandName": "Citalopram", "activeSubstance": "Citalopram", "activeSubstanceRaw": "citalopramhydrobromid", "alternativeNames": ["Citalopramhydrobromid", "Cipramil"], "medicationGroup": "SSRI", "clinicalCategories": ["Psykofarmaka"], "careSettings": ["Psykiatri", "Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N06AB04", "forms": ["filmovertrukne tabletter"], "indicationShort": "Antidepressivum (SSRI)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "digoxin", "brandName": "Digoxin", "activeSubstance": "Digoxin", "activeSubstanceRaw": "digoxin", "alternativeNames": ["Lanoxin"], "medicationGroup": "Hjerteglykosid", "clinicalCategories": ["Hjerte og kredsløb"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "C01AA05", "forms": ["injektionsvæske, opløsning", "tabletter"], "indicationShort": "Hjerteglykosid (snævert terapeutisk indeks)", "halfLife": {"status": "verified", "display": "1,5–2 døgn", "measLabel": "Eliminationshalveringstid", "source": "FDA-produktinformation — Lanoxin (digoxin)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/009330Orig1s036lbl.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "FDA-produktinformation — Lanoxin (digoxin)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/009330Orig1s036lbl.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "eliquis", "brandName": "Eliquis", "activeSubstance": "Apixaban", "activeSubstanceRaw": "apixaban", "alternativeNames": ["Apixaban"], "medicationGroup": "Faktor Xa-hæmmer (DOAK)", "clinicalCategories": ["Blodfortyndende medicin"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "B01AF02", "forms": ["filmovertrukne tabletter", "granulat i brev", "granulat i kapsler til åbning"], "indicationShort": "Blodfortyndende (DOAK)", "halfLife": {"status": "verified", "display": "ca. 12 timer", "measLabel": "Halveringstid", "source": "FDA-produktinformation — Eliquis (apixaban)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2014/202155s000lbl.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "FDA-produktinformation — Eliquis (apixaban)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2014/202155s000lbl.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "eltroxin", "brandName": "Eltroxin", "activeSubstance": "Levothyroxin", "activeSubstanceRaw": "levothyroxinnatrium", "alternativeNames": ["Levothyroxinnatrium"], "medicationGroup": "Thyreoideahormon", "clinicalCategories": ["Hormoner"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "H03AA01", "forms": ["tabletter"], "indicationShort": "Stofskiftehormon (thyroidea)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "fucidin", "brandName": "Fucidin", "activeSubstance": "Fusidinsyre", "activeSubstanceRaw": "fusidinsyre", "alternativeNames": ["Natriumfusidat"], "medicationGroup": "Antibiotikum (fusidinsyre)", "clinicalCategories": ["Infektioner"], "careSettings": ["Hjemmepleje", "Hospital"], "atc": "D06AX01", "forms": ["creme", "oral suspension", "salve"], "indicationShort": "Antibiotikum", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "furix", "brandName": "Furix", "activeSubstance": "Furosemid", "activeSubstanceRaw": "furosemid", "alternativeNames": ["Furosemid", "Diural"], "medicationGroup": "Loop-diuretikum", "clinicalCategories": ["Vanddrivende medicin", "Hjerte og kredsløb"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "C03CA01", "forms": ["tabletter"], "indicationShort": "Vanddrivende (loop-diuretikum)", "halfLife": {"status": "verified", "display": "ca. 2 timer", "measLabel": "Terminal halveringstid", "source": "StatPearls (NCBI Bookshelf) — Furosemide", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499921/", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "StatPearls (NCBI Bookshelf) — Furosemide", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499921/", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "hjertemagnyl", "brandName": "Hjertemagnyl", "activeSubstance": "Acetylsalicylsyre", "activeSubstanceRaw": "acetylsalicylsyre", "alternativeNames": ["Acetylsalicylsyre", "Magnyl", "ASA"], "medicationGroup": "Trombocythæmmer", "clinicalCategories": ["Blodfortyndende medicin"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "B01AC06", "forms": ["filmovertrukne tabletter"], "indicationShort": "Trombocythæmmer (lavdosis ASA)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "ipren", "brandName": "Ipren", "activeSubstance": "Ibuprofen", "activeSubstanceRaw": "ibuprofen", "alternativeNames": ["Ibuprofen", "Brufen", "Ibumetin"], "medicationGroup": "NSAID", "clinicalCategories": ["Smertestillende"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "M01AE01", "forms": ["filmovertrukne tabletter"], "indicationShort": "Smertestillende (NSAID)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "jardiance", "brandName": "Jardiance", "activeSubstance": "Empagliflozin", "activeSubstanceRaw": "empagliflozin", "alternativeNames": ["Empagliflozin"], "medicationGroup": "SGLT2-hæmmer", "clinicalCategories": ["Diabetes", "Hjerte og kredsløb"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "A10BK03", "forms": ["filmovertrukne tabletter"], "indicationShort": "Diabetesmiddel (SGLT2-hæmmer)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "lantus", "brandName": "Lantus", "activeSubstance": "Insulin glargin", "activeSubstanceRaw": "insulin glargin", "alternativeNames": ["Insulin glargin", "Abasaglar"], "medicationGroup": "Langtidsvirkende insulinanalog", "clinicalCategories": ["Diabetes"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "A10AE04", "forms": ["injektionsvæske, opløsning", "injektionsvæske, opløsning i cylinderampul"], "indicationShort": "Langtidsvirkende insulin", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "marevan", "brandName": "Marevan", "activeSubstance": "Warfarin", "activeSubstanceRaw": "warfarinnatrium", "alternativeNames": ["Warfarinnatrium"], "medicationGroup": "Vitamin K-antagonist", "clinicalCategories": ["Blodfortyndende medicin"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "B01AA03", "forms": ["tabletter"], "indicationShort": "Blodfortyndende (VKA, INR-styret)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "metformin", "brandName": "Metformin", "activeSubstance": "Metformin", "activeSubstanceRaw": "metforminhydrochlorid", "alternativeNames": ["Metforminhydrochlorid", "Glucophage"], "medicationGroup": "Biguanid", "clinicalCategories": ["Diabetes"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "A10BA02", "forms": ["depottabletter", "filmovertrukne tabletter"], "indicationShort": "Diabetesmiddel (biguanid)", "halfLife": {"status": "verified", "display": "plasma ca. 6 timer", "measLabel": "Halveringstid", "source": "FDA-produktinformation — Metformin", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/020357s031,021202s016lbl.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "FDA-produktinformation — Metformin", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/020357s031,021202s016lbl.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "metoprolol", "brandName": "Metoprolol", "activeSubstance": "Metoprolol", "activeSubstanceRaw": "metoprololsuccinat", "alternativeNames": ["Metoprololsuccinat", "Metoprololtartrat", "Selo-Zok"], "medicationGroup": "Selektiv beta-blokker", "clinicalCategories": ["Hjerte og kredsløb"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "C07AB02", "forms": ["depottabletter"], "indicationShort": "Beta-blokker (hjerte/kredsløb)", "halfLife": {"status": "verified", "display": "3–7 timer", "measLabel": "Halveringstid", "source": "FDA-produktinformation — Metoprolol", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/019962s036lbl.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "FDA-produktinformation — Metoprolol", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2008/019962s036lbl.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "morfin", "brandName": "Morfin", "activeSubstance": "Morfin", "activeSubstanceRaw": "morphinhydrochloridtrihydrat", "alternativeNames": ["Morphin", "Contalgin"], "medicationGroup": "Opioid", "clinicalCategories": ["Smertestillende"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N02AA01", "forms": ["injektionsvæske", "injektionsvæske, opløsning", "suppositorier", "tabletter"], "indicationShort": "Stærkt smertestillende (opioid)", "halfLife": {"status": "verified", "display": "1,5–2 timer", "measLabel": "Eliminationshalveringstid", "source": "Produktinformation (Pfizer) — Morphine", "url": "https://pfizermedicalinformation.com/morphine/clinical-pharmacology", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "Produktinformation (Pfizer) — Morphine", "url": "https://pfizermedicalinformation.com/morphine/clinical-pharmacology", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "movicol", "brandName": "Movicol", "activeSubstance": "Macrogol (kombination)", "activeSubstanceRaw": "kaliumchlorid, macrogol 3350, natriumchlorid, natriumhydrogencarbonat", "alternativeNames": ["Macrogol 3350", "Macrogol"], "medicationGroup": "Osmotisk laksativ", "clinicalCategories": ["Mave og tarm"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "A06AD65", "forms": ["pulver til oral opløsning, enkeltdosisbeholder"], "indicationShort": "Afføringsmiddel (osmotisk laksativ)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "novorapid", "brandName": "NovoRapid", "activeSubstance": "Insulin aspart", "activeSubstanceRaw": "insulin aspart", "alternativeNames": ["Insulin aspart"], "medicationGroup": "Hurtigvirkende insulinanalog", "clinicalCategories": ["Diabetes"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "A10AB05", "forms": ["injektionsvæske, opløsning"], "indicationShort": "Hurtigvirkende insulin", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "olanzapin", "brandName": "Olanzapin", "activeSubstance": "Olanzapin", "activeSubstanceRaw": "olanzapin", "alternativeNames": ["Zyprexa"], "medicationGroup": "Atypisk antipsykotikum", "clinicalCategories": ["Psykofarmaka"], "careSettings": ["Psykiatri", "Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N05AH03", "forms": ["filmovertrukne tabletter", "smeltetabletter"], "indicationShort": "Antipsykotikum", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "oxazepam", "brandName": "Oxazepam", "activeSubstance": "Oxazepam", "activeSubstanceRaw": "oxazepam", "alternativeNames": ["Alopam"], "medicationGroup": "Benzodiazepin", "clinicalCategories": ["Psykofarmaka"], "careSettings": ["Psykiatri", "Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N05BA04", "forms": ["tabletter"], "indicationShort": "Angstdæmpende/beroligende (benzodiazepin)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "panodil", "brandName": "Panodil", "activeSubstance": "Paracetamol", "activeSubstanceRaw": "paracetamol", "alternativeNames": ["Paracetamol", "Pinex", "Pamol"], "medicationGroup": "Analgetikum / antipyretikum", "clinicalCategories": ["Smertestillende"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital", "Psykiatri"], "atc": "N02BE01", "forms": ["filmovertrukne tabletter", "tabletter med modificeret udløsning"], "indicationShort": "Smertestillende/febernedsættende", "halfLife": {"status": "verified", "display": "1–4 timer", "measLabel": "Halveringstid", "source": "Produktresumé (HPRA, Irland) — Paracetamol", "url": "https://assets.hpra.ie/products/Human/17261/LicenseSPC_PA0408-004-002_29032006142741.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "Produktresumé (HPRA, Irland) — Paracetamol", "url": "https://assets.hpra.ie/products/Human/17261/LicenseSPC_PA0408-004-002_29032006142741.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "pantoprazol", "brandName": "Pantoprazol", "activeSubstance": "Pantoprazol", "activeSubstanceRaw": "pantoprazolnatriumsesquihydrat", "alternativeNames": ["Pantoprazolnatrium", "Pantoloc"], "medicationGroup": "Protonpumpehæmmer", "clinicalCategories": ["Mave og tarm"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital", "Psykiatri"], "atc": "A02BC02", "forms": ["enterotabletter", "pulver til injektionsvæske, opløsning"], "indicationShort": "Syrehæmmende (PPI)", "halfLife": {"status": "verified", "display": "ca. 1 time", "measLabel": "Terminal halveringstid", "source": "FDA-produktinformation — Protonix (pantoprazol)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2001/20988s003lbl.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "FDA-produktinformation — Protonix (pantoprazol)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2001/20988s003lbl.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "quetiapin", "brandName": "Quetiapin", "activeSubstance": "Quetiapin", "activeSubstanceRaw": "quetiapin fumarat", "alternativeNames": ["Quetiapinfumarat", "Seroquel"], "medicationGroup": "Atypisk antipsykotikum", "clinicalCategories": ["Psykofarmaka"], "careSettings": ["Psykiatri", "Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N05AH04", "forms": ["depottabletter", "filmovertrukne tabletter"], "indicationShort": "Antipsykotikum", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "ramipril", "brandName": "Ramipril", "activeSubstance": "Ramipril", "activeSubstanceRaw": "ramipril", "alternativeNames": ["Triatec"], "medicationGroup": "ACE-hæmmer", "clinicalCategories": ["Hjerte og kredsløb"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "C09AA05", "forms": ["tabletter"], "indicationShort": "ACE-hæmmer (blodtryk/hjerte)", "halfLife": {"status": "verified", "display": "13–17 timer", "measLabel": "Halveringstid", "source": "FDA-produktinformation — Altace (ramipril)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2011/022021s007lbl.pdf", "verifiedAt": "2026-10-08"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}, {"title": "FDA-produktinformation — Altace (ramipril)", "url": "https://www.accessdata.fda.gov/drugsatfda_docs/label/2011/022021s007lbl.pdf", "verifiedAt": "2026-10-08", "scope": "halveringstid"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "risperidon", "brandName": "Risperidon", "activeSubstance": "Risperidon", "activeSubstanceRaw": "risperidon", "alternativeNames": ["Risperdal"], "medicationGroup": "Atypisk antipsykotikum", "clinicalCategories": ["Psykofarmaka"], "careSettings": ["Psykiatri", "Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N05AX08", "forms": ["filmovertrukne tabletter", "smeltetabletter"], "indicationShort": "Antipsykotikum", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "sertralin", "brandName": "Sertralin", "activeSubstance": "Sertralin", "activeSubstanceRaw": "sertralinhydrochlorid", "alternativeNames": ["Sertralinhydrochlorid", "Zoloft"], "medicationGroup": "SSRI", "clinicalCategories": ["Psykofarmaka"], "careSettings": ["Psykiatri", "Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N06AB06", "forms": ["filmovertrukne tabletter"], "indicationShort": "Antidepressivum (SSRI)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "spiriva", "brandName": "Spiriva", "activeSubstance": "Tiotropium", "activeSubstanceRaw": "tiotropiumbromidmonohydrat", "alternativeNames": ["Tiotropiumbromid"], "medicationGroup": "Langtidsvirkende antikolinergikum (LAMA)", "clinicalCategories": ["Luftvejssygdomme"], "careSettings": ["Hjemmepleje", "Hospital"], "atc": "R03BB04", "forms": ["inhalationspulver, hård kapsel"], "indicationShort": "Luftvejsudvidende (LAMA)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "spironolacton", "brandName": "Spironolacton", "activeSubstance": "Spironolakton", "activeSubstanceRaw": "spironolacton", "alternativeNames": ["Spiron"], "medicationGroup": "Aldosteronantagonist (kaliumbesparende diuretikum)", "clinicalCategories": ["Vanddrivende medicin", "Hjerte og kredsløb"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "C03DA01", "forms": ["filmovertrukne tabletter"], "indicationShort": "Kaliumbesparende diuretikum", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "tramadol", "brandName": "Tramadol", "activeSubstance": "Tramadol", "activeSubstanceRaw": "tramadolhydrochlorid", "alternativeNames": ["Tramadolhydrochlorid", "Dolol", "Mandolgin"], "medicationGroup": "Opioid (svagt) / monoaminerg", "clinicalCategories": ["Smertestillende"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "N02AX02", "forms": ["depottabletter", "kapsler, hårde", "tabletter"], "indicationShort": "Smertestillende (svagt opioid)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "ventoline", "brandName": "Ventoline", "activeSubstance": "Salbutamol", "activeSubstanceRaw": "salbutamolsulfat", "alternativeNames": ["Salbutamolsulfat", "Airomir"], "medicationGroup": "Korttidsvirkende beta2-agonist (SABA)", "clinicalCategories": ["Luftvejssygdomme"], "careSettings": ["Hjemmepleje", "Hospital"], "atc": "R03AC02", "forms": ["inhalationspulver, afdelt", "inhalationsspray, suspension", "inhalationsvæske til nebulisator, opløsning", "injektionsvæske", "koncentrat til infusionsvæske, opløsning", "oral opløsning"], "indicationShort": "Luftvejsudvidende (SABA)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}, {"id": "xarelto", "brandName": "Xarelto", "activeSubstance": "Rivaroxaban", "activeSubstanceRaw": "rivaroxaban", "alternativeNames": ["Rivaroxaban"], "medicationGroup": "Faktor Xa-hæmmer (DOAK)", "clinicalCategories": ["Blodfortyndende medicin"], "careSettings": ["Ældrepleje", "Hjemmepleje", "Hospital"], "atc": "B01AF01", "forms": ["filmovertrukne tabletter", "granulat til oral suspension"], "indicationShort": "Blodfortyndende (DOAK)", "halfLife": {"status": "unverified"}, "sources": [{"title": "Lægemiddelstyrelsen — Liste over godkendte lægemidler", "url": "https://laegemiddelstyrelsen.dk/da/bivirkninger/find-medicin/lister-med-medicin/", "verifiedAt": "2026-10-10", "scope": "identitet (navn, aktivt stof, ATC, form, markedsføring)"}], "clinicalStatus": "pending_review", "lastReviewed": "2026-10-10"}];
const MEDLIB_CATS = ["Alle", "Hjerte og kredsløb", "Vanddrivende medicin", "Blodfortyndende medicin", "Diabetes", "Smertestillende", "Psykofarmaka", "Luftvejssygdomme", "Mave og tarm", "Infektioner", "Hormoner", "Neurologi"];
const MEDLIB_SETTINGS = ["Alle", "Ældrepleje", "Hjemmepleje", "Hospital", "Psykiatri"];
const ML_FAV_KEY = "klario_medlib_fav_v1";
const ML_RECENT_KEY = "klario_medlib_recent_v1";
function mlRead(k) { try { return JSON.parse(localStorage.getItem(k) || "[]") || []; } catch (e) { return []; } }
function mlWrite(k, a) { try { localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }
const mlNorm = (s) => (s == null ? "" : String(s)).toLowerCase().trim();
function mlMatch(m, q) {
  const s = mlNorm(q); if (!s) return true;
  const hay = [m.brandName, m.activeSubstance, m.activeSubstanceRaw, m.medicationGroup, m.indicationShort].concat(m.alternativeNames || []).concat(m.clinicalCategories || []);
  return hay.some((x) => mlNorm(x).indexOf(s) >= 0);
}

/* collapsible section; compact "Ikke verificeret" tag in header (no repeated boxes) */
function MedLibSec({ id, title, openSet, toggle, status, children }) {
  const open = openSet.has(id);
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, overflow: "hidden" }}>
      <button onClick={() => toggle(id)} aria-expanded={open} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", padding: "14px 15px", display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ flex: 1, fontSize: 15.5, fontWeight: 800, color: C.ink, lineHeight: 1.3 }}>{title}</span>
        {status === "verified" ? <span style={{ fontSize: 10, fontWeight: 800, color: "#0B7A6E", background: tint("#0FAE9E", "18"), padding: "2px 7px", borderRadius: 6, flexShrink: 0 }}>Verificeret</span>
          : status === "unverified" ? <span style={{ fontSize: 10, fontWeight: 800, color: "#8A5A0B", background: tint("#B7791F", "16"), padding: "2px 7px", borderRadius: 6, flexShrink: 0 }}>Ikke verificeret</span> : null}
        <ChevronDown size={18} color={C.inkFaint} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }} />
      </button>
      {open ? <div style={{ padding: "0 15px 15px", display: "flex", flexDirection: "column", gap: 10 }}>{children}</div> : null}
    </div>
  );
}
/* short muted "pending" line (not a big repeated warning box) */
function MedLibPendingLine({ children }) {
  return <div style={{ fontSize: 12.5, color: "#7A4E0A", background: tint("#B7791F", "0C"), borderRadius: 9, padding: "9px 11px", lineHeight: 1.5 }}>{children || "Ikke verificeret – afventer faglig gennemgang. Må ikke bruges som handlingsanvisning. Slå op i en godkendt kilde."}</div>;
}

function MedicinBibliotek({ sel, setSel, onTest }) {
  const [q, setQ] = useState("");
  const [fa, setFa] = useState("Alle");
  const [fb, setFb] = useState("Alle");
  const [favs, setFavs] = useState(mlRead(ML_FAV_KEY));
  const [recents, setRecents] = useState(mlRead(ML_RECENT_KEY));
  const [openSet, setOpenSet] = useState(() => new Set(["s1", "s2"]));
  const toggle = (id) => setOpenSet((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const isFav = (id) => favs.indexOf(id) >= 0;
  const toggleFav = (id) => { const n = isFav(id) ? favs.filter((x) => x !== id) : [id].concat(favs); setFavs(n); mlWrite(ML_FAV_KEY, n); };
  const byId = (id) => MEDLIB.find((m) => m.id === id);
  const open = (id) => { setSel(id); const n = [id].concat(recents.filter((x) => x !== id)).slice(0, 8); setRecents(n); mlWrite(ML_RECENT_KEY, n); setOpenSet(new Set(["s1", "s2"])); try { window.scrollTo(0, 0); } catch (e) {} };

  // ---------- DETAIL ----------
  if (sel) {
    const m = byId(sel);
    if (!m) { setSel(null); return null; }
    const hl = m.halfLife || {};
    const verHL = hl.status === "verified";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 11, paddingBottom: 32 }} className="anim">
        {/* identity header */}
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, background: C.surface, padding: 15 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: tint("#7A5AF5", "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Pill size={21} color="#5B37C7" strokeWidth={2.1} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, lineHeight: 1.15 }}>{m.brandName}</div>
              <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 3 }}>Aktivt stof: <b>{m.activeSubstance}</b></div>
              <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 1 }}>{m.medicationGroup}</div>
            </div>
            <button onClick={() => toggleFav(m.id)} aria-label="Favorit" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, flexShrink: 0 }}><Star size={21} color={isFav(m.id) ? "#E8A72E" : C.inkFaint} fill={isFav(m.id) ? "#E8A72E" : "none"} /></button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 11 }}>
            {m.atc ? <span style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, background: tint(C.ink, "07"), padding: "3px 8px", borderRadius: 7 }}>ATC {m.atc}</span> : null}
            {(m.clinicalCategories || []).map((c) => <span key={c} style={{ fontSize: 11, fontWeight: 700, color: "#5B37C7", background: tint("#7A5AF5", "12"), padding: "3px 8px", borderRadius: 7 }}>{c}</span>)}
          </div>
          {/* ONE compact verification status */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, background: tint("#2E68E0", "0A"), border: `1px solid ${tint("#2E68E0", "24")}`, borderRadius: 10, padding: "9px 11px" }}>
            <ShieldCheck size={15} color="#2257D8" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: C.ink, lineHeight: 1.45 }}>Identitet <b>verificeret</b> (Lægemiddelstyrelsen). {verHL ? "Halveringstid verificeret. " : ""}Øvrige kliniske afsnit <b>afventer faglig gennemgang</b> – ikke handlingsanvisende.</span>
          </div>
        </div>

        {/* 1 */}
        <MedLibSec id="s1" title="1. Hvad er medicinen?" openSet={openSet} toggle={toggle}>
          <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.55 }}>{m.brandName} indeholder det aktive stof <b>{m.activeSubstance}</b> og hører til gruppen <b>{m.medicationGroup.toLowerCase()}</b>.</div>
          <div style={{ fontSize: 12, color: C.inkFaint }}>Klassifikation: ATC {m.atc || "–"} (WHO/Lægemiddelstyrelsen).</div>
        </MedLibSec>

        {/* 2 */}
        <MedLibSec id="s2" title="2. Hvad bruges den til?" openSet={openSet} toggle={toggle} status="unverified">
          <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>Overordnet lægemiddelgruppe: <b>{m.indicationShort}</b>.</div>
          <MedLibPendingLine>De konkrete indikationer (hvornår og hvorfor præparatet gives) er ikke verificeret i V1. Slå op i pro.medicin.dk eller produktresumé.</MedLibPendingLine>
        </MedLibSec>

        {/* 3 */}
        <MedLibSec id="s3" title="3. Hvad skal jeg observere som SSA?" openSet={openSet} toggle={toggle} status="unverified">
          <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>Rutineobservationer vs. akutte advarselstegn, relevante vitalværdier, væskebalance og dokumentation:</div>
          <MedLibPendingLine />
        </MedLibSec>

        {/* 4 */}
        <MedLibSec id="s4" title="4. Medicin der kan anvendes sammen" openSet={openSet} toggle={toggle} status="unverified">
          <MedLibPendingLine>Vises kun når en verificeret klinisk indikation eller retningslinje understøtter det. KLARIO antyder aldrig, at endnu et præparat automatisk er nødvendigt. Ingen verificerede relationer i V1.</MedLibPendingLine>
        </MedLibSec>

        {/* 5 */}
        <MedLibSec id="s5" title="5. Bivirkninger og interaktioner" openSet={openSet} toggle={toggle} status="unverified">
          <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>Almindelige og alvorlige bivirkninger, symptomer der kræver hurtig handling, samt klinisk vigtige interaktioner:</div>
          <MedLibPendingLine>Ikke verificeret i V1. Brug en godkendt kilde for bivirkninger og interaktioner.</MedLibPendingLine>
          <a href="https://pro.medicin.dk/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#5B37C7", display: "flex", alignItems: "center", gap: 6 }}><Pill size={15} color="#7A5AF5" />Tjek interaktioner på Pro.medicin.dk <ChevronRight size={14} color="#5B37C7" /></div></a>
        </MedLibSec>

        {/* 6 */}
        <MedLibSec id="s6" title="6. Farmakologi" openSet={openSet} toggle={toggle} status={verHL ? "verified" : "unverified"}>
          {verHL ? (
            <div style={{ border: `1px solid ${tint("#0FAE9E", "40")}`, background: tint("#0FAE9E", "08"), borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 13.5, color: C.ink }}>{hl.measLabel || "Halveringstid"} (T½): <b style={{ color: "#0B7A6E" }}>{hl.display}</b></div>
              <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 4 }}>Kilde: {hl.source} · kontrolleret {hl.verifiedAt}</div>
            </div>
          ) : (
            <div style={{ fontSize: 13.5, color: C.ink }}>Halveringstid (T½): <b style={{ color: "#8A5A0B" }}>Ikke verificeret</b></div>
          )}
          <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}><b>Formuleringer i DK:</b> {(m.forms && m.forms.length) ? m.forms.join(", ") : "–"}. Depot/IR/plaster/injektion kan have forskellig kinetik og sidestilles ikke.</div>
          <MedLibPendingLine>Farmakodynamik, absorption, fordeling, metabolisme, udskillelse, virkningsstart og -varighed er ikke verificeret. KLARIO opfinder ikke farmakologiske værdier.</MedLibPendingLine>
        </MedLibSec>

        {/* 7 */}
        <MedLibSec id="s7" title="7. Test din viden" openSet={openSet} toggle={toggle}>
          <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>Medicin-specifikke spørgsmål bygges kun på verificeret indhold. Indtil da kan du teste din generelle viden.</div>
          <button onClick={() => onTest && onTest()} style={{ width: "100%", border: "none", borderRadius: 11, padding: "13px", background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", fontFamily: "inherit", fontSize: 14.5, fontWeight: 800, cursor: "pointer", minHeight: 48 }}>Test din viden om denne medicin</button>
        </MedLibSec>

        {/* 8 */}
        <MedLibSec id="s8" title="8. Officielle kilder" openSet={openSet} toggle={toggle}>
          <a href="https://pro.medicin.dk/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ border: `1px solid ${tint("#7A5AF5", "33")}`, background: tint("#7A5AF5", "0A"), borderRadius: 11, padding: "12px 13px", display: "flex", alignItems: "center", gap: 10 }}><Pill size={17} color="#7A5AF5" /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 800, color: "#5B37C7" }}>Åbn på Pro.medicin.dk</div><div style={{ fontSize: 11, color: C.inkSoft }}>Åbner forsiden – søg selv præparatet</div></div><ChevronRight size={17} color="#7A5AF5" /></div></a>
          <a href="https://min.medicin.dk/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ border: `1px solid ${tint("#0FAE9E", "33")}`, background: tint("#0FAE9E", "0A"), borderRadius: 11, padding: "12px 13px", display: "flex", alignItems: "center", gap: 10 }}><Info size={17} color="#0B9488" /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 800, color: "#0B7A6E" }}>Åbn på Min.medicin.dk</div><div style={{ fontSize: 11, color: C.inkSoft }}>Åbner forsiden – borgervenlig information</div></div><ChevronRight size={17} color="#0B9488" /></div></a>
          <div style={{ fontSize: 11, color: C.inkFaint, lineHeight: 1.5, marginTop: 2 }}>Forsider åbnes, da verificerede dyb-links ikke er bekræftet. Kilder:</div>
          {(m.sources || []).map((s, i) => (<div key={i} style={{ fontSize: 11, color: C.inkSoft, lineHeight: 1.5 }}>• {s.title}{s.scope ? " (" + s.scope + ")" : ""}{s.verifiedAt ? " · " + s.verifiedAt : ""}</div>))}
          <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 4 }}>Sidst gennemgået: {m.lastReviewed}. Status: pending_review (klinisk indhold).</div>
        </MedLibSec>
      </div>
    );
  }

  // ---------- LIBRARY HOME ----------
  const list = MEDLIB.filter((m) => mlMatch(m, q) && (fa === "Alle" || (m.careSettings || []).indexOf(fa) >= 0) && (fb === "Alle" || (m.clinicalCategories || []).indexOf(fb) >= 0)).sort((a, b) => a.brandName.toLowerCase() < b.brandName.toLowerCase() ? -1 : 1);
  const favList = favs.map(byId).filter(Boolean);
  const recentList = recents.map(byId).filter(Boolean);
  const Card = ({ m }) => (
    <div style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "11px 12px", display: "flex", alignItems: "center", gap: 10 }}>
      <button onClick={() => open(m.id)} aria-label={m.brandName} style={{ flex: 1, minWidth: 0, textAlign: "left", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.brandName}</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.activeSubstance} · {m.medicationGroup}</div>
        <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.indicationShort}</div>
      </button>
      <button onClick={() => toggleFav(m.id)} aria-label="Favorit" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, flexShrink: 0 }}><Star size={18} color={isFav(m.id) ? "#E8A72E" : C.inkFaint} fill={isFav(m.id) ? "#E8A72E" : "none"} /></button>
      <button onClick={() => open(m.id)} aria-label="Åbn" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, flexShrink: 0 }}><ChevronRight size={19} color={C.inkFaint} /></button>
    </div>
  );
  const Pills = ({ opts, val, set }) => (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 3, paddingRight: 18, WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
        {opts.map((o) => <button key={o} onClick={() => set(o)} style={{ whiteSpace: "nowrap", border: `1px solid ${val === o ? "#5B37C7" : C.line}`, background: val === o ? tint("#7A5AF5", "14") : C.surface, color: val === o ? "#5B37C7" : C.inkSoft, borderRadius: 99, padding: "7px 13px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, minHeight: 36 }}>{o}</button>)}
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 3, width: 24, pointerEvents: "none", background: `linear-gradient(90deg, rgba(255,255,255,0), ${C.bg || "#fff"})` }} />
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13, paddingBottom: 32 }} className="anim">
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.3 }}>KLARIO Medicinbibliotek</h2>
        <p style={{ margin: "5px 0 0", fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>Find medicin, forstå virkningen og lær, hvad du skal observere i praksis.</p>
      </div>
      {/* ONE compact status line (no repeated boxes) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: tint("#2E68E0", "0A"), border: `1px solid ${tint("#2E68E0", "22")}`, borderRadius: 10, padding: "8px 11px" }}>
        <ShieldCheck size={14} color="#2257D8" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 11.5, color: C.ink, lineHeight: 1.45 }}>Uddannelses- og opslagsværktøj. Identitet verificeret; kliniske afsnit markeret <b>Ikke verificeret</b> er ikke handlingsanvisende.</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, border: `1px solid ${C.line}`, borderRadius: 12, background: C.surface, padding: "12px 13px" }}>
        <Search size={18} color={C.inkFaint} style={{ flexShrink: 0 }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Søg efter medicin, aktivt stof eller lægemiddelgruppe…" aria-label="Søg medicin" autoCapitalize="none" autoComplete="off" style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontSize: 16, color: C.ink, fontFamily: "inherit" }} />
        {q ? <button onClick={() => setQ("")} aria-label="Ryd" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, flexShrink: 0 }}><X size={17} color={C.inkFaint} /></button> : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.inkFaint, letterSpacing: 0.3 }}>ARBEJDSOMRÅDE</div>
        <Pills opts={MEDLIB_SETTINGS} val={fa} set={setFa} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.inkFaint, letterSpacing: 0.3 }}>MEDICINSK KATEGORI</div>
        <Pills opts={MEDLIB_CATS} val={fb} set={setFb} />
      </div>

      {(q === "" && fa === "Alle" && fb === "Alle" && favList.length) ? (
        <div><SectionHead title="Favoritter" /><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{favList.map((m) => <Card key={m.id} m={m} />)}</div></div>
      ) : null}
      {(q === "" && fa === "Alle" && fb === "Alle" && recentList.length) ? (
        <div><SectionHead title="Senest set" /><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{recentList.map((m) => <Card key={m.id} m={m} />)}</div></div>
      ) : null}

      <div>
        <SectionHead title={"Alle lægemidler (" + list.length + ")"} />
        {list.length === 0 ? (
          <p style={{ fontSize: 13.5, color: C.inkFaint, margin: "4px 0 0" }}>Ingen match. Prøv et andet søgeord eller nulstil filtrene.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{list.map((m) => <Card key={m.id} m={m} />)}</div>
        )}
      </div>

      <div style={{ fontSize: 10.5, color: C.inkFaint, textAlign: "center", lineHeight: 1.6 }}>
        {MEDLIB.length} lægemidler · identitet verificeret mod Lægemiddelstyrelsen · {MEDLIB.filter((m) => m.halfLife && m.halfLife.status === "verified").length} med verificeret T½.<br/>careSettings er redaktionelle navigations-tags, ikke klinisk vejledning.
      </div>
    </div>
  );
}

function HalfLifeView({ onTest }) {
  const [medDS, setMedDS] = useState(() => medBuildRuntime(MED_SEED));
  const [medMeta, setMedMeta] = useState(MED_SEED.meta);
  const [medOrigin, setMedOrigin] = useState("seed");
  useEffect(() => { let on = true; loadMedicationData().then((r) => { if (on && r && r.ds) { setMedDS(r.ds); setMedMeta(r.meta); setMedOrigin(r.origin); } }).catch(() => {}); return () => { on = false; }; }, []);
  const [half, setHalf] = useState("");
  const [elapsed, setElapsed] = useState("");
  const [amount, setAmount] = useState("");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [look, setLook] = useState("");
  const [looked, setLooked] = useState(false);
  const [picks, setPicks] = useState([]);
  const [pickId, setPickId] = useState(null);
  const [pickEntry, setPickEntry] = useState(null); // index entry for the chosen match (combo/review/atc)
  const [comboSub, setComboSub] = useState(null);    // substance chosen inside a combination product
  const [hlCache, setHlCache] = useState(hlCacheRead);
  const [calcSrc, setCalcSrc] = useState(null);
  const [halfHi, setHalfHi] = useState("");
  const [manual, setManual] = useState(hlManualRead);
  const [manualInput, setManualInput] = useState("");
  const calcRef = useRef(null);
  const cacheHit = (res) => { if (!res || !res.subId) return; const c = Object.assign({}, hlCacheRead()); c[res.subId] = { subName: res.subName, verified: res.status === "verified", ts: Date.now(), rechecked: (c[res.subId] || {}).rechecked || null }; hlCacheWrite(c); setHlCache(c); };
  const doLookup = () => {
    setLooked(true); setComboSub(null);
    const ms = medMatches(medDS, look);
    if (ms.length === 0) { setPicks([]); setPickId(null); setPickEntry(null); return; }
    if (ms.length === 1) { setPicks([]); const m = ms[0]; const entry = m.entry || medEntryForQuery(medDS, look); setPickId(m.subId); setPickEntry(entry); if (!(entry && entry.combo)) cacheHit(medGet(medDS, m.subId)); return; }
    setPicks(ms); setPickId(null); setPickEntry(null);
  };
  const selectPick = (m) => { const subId = (m && m.subId) || m; const entry = (m && m.entry) || null; setPickId(subId); setPickEntry(entry); setPicks([]); setComboSub(null); if (!(entry && entry.combo)) cacheHit(medGet(medDS, subId)); };
  const scrollCalc = () => { try { if (calcRef.current) calcRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {} };
  const applyToCalc = (entry, opt) => { setHalf(String(opt.h).replace(".", ",")); setHalfHi(""); setRes(null); setErr(""); setCalcSrc({ med: entry.substans, label: opt.label, kilde: entry.kilde }); scrollCalc(); };
  const applyToCalcRange = (card) => { const hs = (card.calcOptions || []).map((o) => o.h).filter((x) => isFinite(x)); if (!hs.length) return; const lo = Math.min.apply(null, hs), hi = Math.max.apply(null, hs); setHalf(String(lo).replace(".", ",")); setHalfHi(String(hi).replace(".", ",")); setRes(null); setErr(""); setCalcSrc({ med: card.substans, label: "interval " + hlFmt(lo, 2) + "\u2013" + hlFmt(hi, 2) + " t", kilde: card.kilde }); scrollCalc(); };
  const applyManual = (subId, subName) => { const v = hlParse(manualInput); if (!isFinite(v) || v <= 0) { setErr("Indtast en gyldig halveringstid (timer)."); return; } const m = Object.assign({}, hlManualRead()); m[subId] = { h: v, ts: Date.now() }; hlManualWrite(m); setManual(m); setHalf(String(v).replace(".", ",")); setHalfHi(""); setRes(null); setErr(""); setManualInput(""); setCalcSrc({ med: subName, label: "manuelt indtastet", kilde: "Manuelt indtastet \u2013 ikke verificeret", manual: true }); scrollCalc(); };
  const useManual = (subId, subName) => { const mm = hlManualRead()[subId]; if (!mm) return; setHalf(String(mm.h).replace(".", ",")); setHalfHi(""); setRes(null); setErr(""); setCalcSrc({ med: subName, label: "manuelt indtastet", kilde: "Manuelt indtastet \u2013 ikke verificeret", manual: true }); scrollCalc(); };
  const clearManual = (subId) => { const m = Object.assign({}, hlManualRead()); delete m[subId]; hlManualWrite(m); setManual(m); };
  const reverify = (subId, url) => {
    const c = Object.assign({}, hlCacheRead());
    c[subId] = Object.assign({}, c[subId] || {}, { rechecked: Date.now() });
    hlCacheWrite(c); setHlCache(c);
    try { window.open(url || "https://pro.medicin.dk/", "_blank", "noopener"); } catch (e) {}
  };
  const hlDate = (ts) => { try { return new Date(ts).toLocaleDateString("da-DK"); } catch (e) { return ""; } };
  const recents = Object.keys(hlCache).map((k) => Object.assign({ subId: k }, hlCache[k])).sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 4);

  const calc = () => {
    const h = hlParse(half), t = hlParse(elapsed), a = amount.trim() === "" ? null : hlParse(amount);
    const hh = halfHi.trim() === "" ? null : hlParse(halfHi);
    if (!isFinite(h) || h <= 0) { setErr("Indtast en gyldig halveringstid større end 0."); setRes(null); return; }
    if (!isFinite(t) || t < 0) { setErr("Indtast en gyldig tid (0 eller mere)."); setRes(null); return; }
    if (a != null && (!isFinite(a) || a < 0)) { setErr("Startmængden skal være et gyldigt tal."); setRes(null); return; }
    if (hh != null && (!isFinite(hh) || hh <= 0)) { setErr("Den høje halveringstid skal være større end 0."); setRes(null); return; }
    setErr("");
    const frac = Math.pow(0.5, t / h);
    let ex = {};
    if (hh != null) { const fh = Math.pow(0.5, t / hh); ex = { pctHi: fh * 100, remainHi: a != null ? a * fh : null, nHalfHi: t / hh, hHi: hh }; }
    setRes(Object.assign({ h, t, a, pct: frac * 100, remain: a != null ? a * frac : null, nHalf: t / h }, ex));
  };
  const clear = () => { setHalf(""); setHalfHi(""); setElapsed(""); setAmount(""); setRes(null); setErr(""); setCalcSrc(null); };

  // decay curve 0..6 halvlives, marker at current elapsed (in half-lives)
  const W = 300, H = 120, PL = 34, PB = 22, nMax = 6;
  const xOf = (nh) => PL + (Math.min(nh, nMax) / nMax) * (W - PL - 6);
  const yOf = (pct) => 8 + (1 - pct / 100) * (H - PB - 8);
  let path = "M " + xOf(0) + " " + yOf(100);
  for (let i = 1; i <= 60; i++) { const nh = (i / 60) * nMax; path += " L " + xOf(nh) + " " + yOf(Math.pow(0.5, nh) * 100); }
  const markNh = res ? res.nHalf : null;
  const markNhHi = res && res.nHalfHi != null ? res.nHalfHi : null;

  const isCombo = !!(pickEntry && pickEntry.combo && (pickEntry.subs || []).length > 1);
  const effSub = comboSub || pickId;
  const lookRes = (looked && effSub) ? medGet(medDS, effSub) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: tint("#7A5AF5", "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Clock size={21} color="#5B37C7" strokeWidth={2.1} /></div>
        <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.5 }}>Forstå hvor længe et lægemiddel bliver i kroppen — og prøv beregneren.</p>
      </div>

      {/* Educational */}
      {HALFLIFE_EDU.map((e, i) => (
        <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, padding: "13px 14px" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{e.t}</div>
          <FarmaTwo quick={e.q} more={e.m} />
        </div>
      ))}

      {/* Calculator */}
      <div ref={calcRef} style={{ border: `1px solid ${tint("#7A5AF5", "2E")}`, borderRadius: 16, background: tint("#7A5AF5", "07"), padding: 15 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Calculator size={19} color="#5B37C7" />
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Halveringstid-beregner</div>
        </div>
        {calcSrc ? (calcSrc.manual ? (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "33")}`, borderRadius: 11, padding: "10px 12px", marginBottom: 12 }}>
            <Info size={15} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "#7A4E0A", lineHeight: 1.5 }}>Halveringstid <b>manuelt indtastet</b> for <b>{calcSrc.med}</b> – <b>ikke verificeret</b>. Kontrollér selv værdien mod en godkendt kilde.</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: tint("#0FAE9E", "0E"), border: `1px solid ${tint("#0FAE9E", "33")}`, borderRadius: 11, padding: "10px 12px", marginBottom: 12 }}>
            <ShieldCheck size={15} color="#0B7A6E" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>Halveringstid indsat fra <b>{calcSrc.med}</b>{calcSrc.label ? " (" + calcSrc.label + ")" : ""} · kilde: {calcSrc.kilde}. Tjek altid den konkrete værdi mod ordination og kilde.</span>
          </div>
        )) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft }}>Halveringstid (timer)
            <input value={half} onChange={(e) => { setHalf(e.target.value); setCalcSrc(null); setHalfHi(""); }} inputMode="decimal" placeholder="fx 6" aria-label="Halveringstid i timer" style={{ width: "100%", marginTop: 5, boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 11, padding: "13px 13px", fontSize: 16, color: C.ink, background: C.surface, fontFamily: "inherit" }} />
          </label>
          {halfHi ? <div style={{ fontSize: 12, color: C.inkSoft, display: "flex", alignItems: "center", gap: 8 }}>Interval: beregnes også for <b>{halfHi}</b> t <button onClick={() => setHalfHi("")} style={{ border: "none", background: "transparent", color: "#5B37C7", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12, padding: 0 }}>Fjern</button></div> : null}
          <label style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft }}>Tid gået (timer)
            <input value={elapsed} onChange={(e) => setElapsed(e.target.value)} inputMode="decimal" placeholder="fx 12" aria-label="Tid gået i timer" style={{ width: "100%", marginTop: 5, boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 11, padding: "13px 13px", fontSize: 16, color: C.ink, background: C.surface, fontFamily: "inherit" }} />
          </label>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft }}>Startmængde (valgfri — til eksempler)
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="fx 100" aria-label="Startmængde, valgfri" style={{ width: "100%", marginTop: 5, boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 11, padding: "13px 13px", fontSize: 16, color: C.ink, background: C.surface, fontFamily: "inherit" }} />
          </label>
          {err ? <div style={{ fontSize: 13, color: RED, background: tint(RED, "0E"), border: `1px solid ${tint(RED, "2A")}`, borderRadius: 10, padding: "9px 12px" }}>{err}</div> : null}
          <div style={{ display: "flex", gap: 9 }}>
            <button onClick={calc} style={{ flex: 1, border: "none", borderRadius: 12, padding: "13px", background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 48 }}>Beregn</button>
            <button onClick={clear} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 16px", background: C.surface, color: C.inkSoft, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 48 }}>Ryd</button>
          </div>
        </div>

        {res ? (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 13, padding: "13px 14px" }}>
              <div style={{ fontSize: 12.5, color: C.inkSoft, fontWeight: 700 }}>Tilbage i kroppen{res.pctHi != null ? " (interval)" : ""}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#5B37C7", letterSpacing: -0.5, marginTop: 2 }}>{res.pctHi != null ? hlFmt(Math.min(res.pct, res.pctHi), 2) + "\u2013" + hlFmt(Math.max(res.pct, res.pctHi), 2) : hlFmt(res.pct, 2)} %</div>
              {res.remain != null ? <div style={{ fontSize: 14, color: C.ink, marginTop: 2 }}>≈ {res.remainHi != null ? hlFmt(Math.min(res.remain, res.remainHi), 2) + "\u2013" + hlFmt(Math.max(res.remain, res.remainHi), 2) : hlFmt(res.remain, 2)} af startmængden</div> : null}
              <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 6 }}>Svarer til {res.nHalfHi != null ? hlFmt(Math.min(res.nHalf, res.nHalfHi), 2) + "\u2013" + hlFmt(Math.max(res.nHalf, res.nHalfHi), 2) : hlFmt(res.nHalf, 2)} halveringstid(er)</div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 8, lineHeight: 1.5, background: tint(C.ink, "05"), borderRadius: 9, padding: "8px 10px" }}>Udregning: 0,5<sup>({hlFmt(res.t, 2)} ÷ {hlFmt(res.h, 2)})</sup> = {hlFmt(res.pct, 2)} %{res.pctHi != null ? " · ved T½ " + hlFmt(res.hHi, 2) + " t: " + hlFmt(res.pctHi, 2) + " %" : ""}</div>
            </div>
            <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 13 }} role="img" aria-label="Henfaldskurve">
              {[0, 25, 50, 75, 100].map((p) => (<g key={p}><line x1={PL} y1={yOf(p)} x2={W - 6} y2={yOf(p)} stroke={C.line} strokeWidth="1" /><text x={PL - 5} y={yOf(p) + 3} fontSize="8" fill={C.inkFaint} textAnchor="end">{p}%</text></g>))}
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (<text key={n} x={xOf(n)} y={H - 8} fontSize="8" fill={C.inkFaint} textAnchor="middle">{n}</text>))}
              <text x={(W + PL) / 2} y={H} fontSize="8" fill={C.inkSoft} textAnchor="middle">Halveringstider →</text>
              <path d={path} fill="none" stroke="#7A5AF5" strokeWidth="2.5" />
              {markNh != null && markNh <= nMax ? <g><line x1={xOf(markNh)} y1={8} x2={xOf(markNh)} y2={yOf(0)} stroke="#5B37C7" strokeWidth="1" strokeDasharray="3 3" /><circle cx={xOf(markNh)} cy={yOf(res.pct)} r="4" fill="#5B37C7" /></g> : null}
              {markNhHi != null && markNhHi <= nMax ? <g><line x1={xOf(markNhHi)} y1={8} x2={xOf(markNhHi)} y2={yOf(0)} stroke="#9B7DF6" strokeWidth="1" strokeDasharray="3 3" /><circle cx={xOf(markNhHi)} cy={yOf(res.pctHi)} r="4" fill="#9B7DF6" /></g> : null}
            </svg>
          </div>
        ) : null}

        <div style={{ marginTop: 13 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, marginBottom: 7 }}>Tabel: 1–6 halveringstider</div>
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 11, overflow: "hidden", background: C.surface }}>
            <div style={{ display: "flex", background: tint(C.ink, "06"), fontSize: 12, fontWeight: 700, color: C.inkSoft }}>
              <div style={{ flex: 1, padding: "8px 11px" }}>Halveringstider</div>
              <div style={{ width: 90, padding: "8px 11px", textAlign: "right" }}>Tilbage</div>
              <div style={{ width: 92, padding: "8px 11px", textAlign: "right" }}>Udskilt</div>
            </div>
            {HL_TABLE.map((r) => (
              <div key={r.n} style={{ display: "flex", fontSize: 13, color: C.ink, borderTop: `1px solid ${C.line}` }}>
                <div style={{ flex: 1, padding: "8px 11px" }}>{r.n} × T½</div>
                <div style={{ width: 90, padding: "8px 11px", textAlign: "right", fontWeight: 700 }}>{hlFmt(r.remaining, 3)} %</div>
                <div style={{ width: 92, padding: "8px 11px", textAlign: "right", color: C.inkSoft }}>{hlFmt(r.eliminated, 3)} %</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 7, lineHeight: 1.5 }}>Efter ca. 5 halveringstider er omtrent 96,875 % udskilt i denne forenklede model. Det er en tommelfingerregel — ikke en universel klinisk regel.</div>
        </div>

        <div style={{ display: "flex", gap: 9, marginTop: 12, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "2A")}`, borderRadius: 11, padding: "10px 12px" }}>
          <Info size={16} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: "#7A4E0A", lineHeight: 1.5 }}>Beregneren er et læringsværktøj. Den må ikke bruges til patientspecifikke kliniske beslutninger. Konkret dosering og intervaller følger ordination og lokale instrukser.</span>
        </div>
      </div>

      {/* Per-substance lookup */}
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, background: C.surface, padding: 15 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Slå et lægemiddels T½ op</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 11, lineHeight: 1.5 }}>Søg på handelsnavn, aktivt stof eller ATC-kode (fx Furix, furosemid eller C03CA01). Søgningen <b>identificerer</b> lægemidlet; en <b>halveringstid</b> vises kun, når den er kontrolleret mod en navngiven kilde — ellers henviser vi til en medicinkilde.</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={look} list="hl-suggest" onChange={(e) => { setLook(e.target.value); setLooked(false); setPicks([]); setPickId(null); setPickEntry(null); setComboSub(null); }} onKeyDown={(e) => { if (e.key === "Enter") doLookup(); }} placeholder="Fx Furix, furosemid eller C03CA01…" aria-label="Søg lægemiddel, stof eller ATC-kode" autoComplete="off" autoCapitalize="none" style={{ flex: 1, boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 11, padding: "12px 13px", fontSize: 15, color: C.ink, background: C.surface, fontFamily: "inherit" }} />
          <button onClick={doLookup} style={{ border: "none", borderRadius: 11, padding: "12px 16px", background: tint("#7A5AF5", "16"), color: "#5B37C7", fontFamily: "inherit", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Slå op</button>
        </div>
        <datalist id="hl-suggest">{medDS.suggest.map((x) => <option key={x} value={x} />)}</datalist>

        {!looked && recents.length ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.inkFaint, marginBottom: 7 }}>Senest slået op</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {recents.map((r) => (
                <button key={r.subId} onClick={() => { setLook(r.subName); setPicks([]); setPickId(r.subId); setPickEntry(null); setComboSub(null); setLooked(true); }} style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 99, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, color: C.inkSoft, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>{r.subName}{r.verified ? <span style={{ width: 7, height: 7, borderRadius: 99, background: "#0B9488" }} /> : null}</button>
              ))}
            </div>
          </div>
        ) : null}

        {looked && picks.length > 1 && !pickId ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Flere lægemidler matcher „{look}“ — vælg ét:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {picks.map((p, pi) => (
                <button key={p.subId + "_" + pi} onClick={() => selectPick(p)} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 12, padding: "11px 13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ flex: 1, minWidth: 120, fontSize: 14.5, fontWeight: 700, color: C.ink }}>{p.combo ? (p.subs || []).map((s) => medSubName(medDS, s)).join(" + ") : p.subName}{p.atc ? <span style={{ fontSize: 11, fontWeight: 700, color: C.inkFaint }}> · {String(p.atc).toUpperCase()}</span> : null}</span>
                  {p.combo ? <span style={{ fontSize: 10.5, fontWeight: 800, color: "#5B37C7", background: tint("#7A5AF5", "16"), padding: "2px 7px", borderRadius: 7 }}>Kombination</span> : null}
                  {p.review ? <span style={{ fontSize: 10.5, fontWeight: 800, color: "#8A5A0B", background: tint("#B7791F", "16"), padding: "2px 7px", borderRadius: 7 }}>Usikker</span> : null}
                  {p.verified ? <span style={{ fontSize: 10.5, fontWeight: 800, color: "#0B7A6E", background: tint("#0FAE9E", "18"), padding: "2px 7px", borderRadius: 7 }}>Verificeret T½</span> : <span style={{ fontSize: 10.5, fontWeight: 700, color: C.inkSoft, background: tint(C.ink, "0A"), padding: "2px 7px", borderRadius: 7 }}>T½ ej verificeret</span>}
                  <ChevronRight size={16} color={C.inkFaint} />
                </button>
              ))}
            </div>
          </div>
        ) : looked && pickId ? (() => {
          // Combination medicine (requirement 3): show ALL active substances, never
          // auto-pick one ingredient's half-life. User chooses a substance to view.
          if (isCombo && !comboSub) {
            const subList = (pickEntry.subs || []);
            return (
              <div style={{ marginTop: 12, border: `1px solid ${tint("#7A5AF5", "33")}`, borderRadius: 13, background: tint("#7A5AF5", "07"), padding: "13px 14px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: tint("#7A5AF5", "16"), color: "#5B37C7", borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 800, marginBottom: 8 }}><Pill size={13} color="#5B37C7" />Kombinationspræparat</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{look}{pickEntry.atc ? <span style={{ fontSize: 12, fontWeight: 700, color: C.inkFaint }}> · {String(pickEntry.atc).toUpperCase()}</span> : null}</div>
                <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.5 }}>Dette lægemiddel indeholder <b>{subList.length} aktive stoffer</b>. Klario beregner ikke én samlet halveringstid for et kombinationspræparat — hvert stof har sin egen. Vælg et stof for at se dets T½.</div>
                {pickEntry.review ? <div style={{ display: "flex", gap: 8, marginTop: 9, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "33")}`, borderRadius: 10, padding: "9px 11px" }}><Info size={14} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 11.5, color: "#7A4E0A", lineHeight: 1.5 }}>Usikker tilknytning: navnet optræder i kilden med forskellige salt-/prodrugformer. Kontrollér i medicinkilden.</span></div> : null}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 11 }}>
                  {subList.map((sid, si) => { const g = medGet(medDS, sid); const ver = g.status === "verified" || g.status === "previously-verified"; return (
                    <button key={sid + "_" + si} onClick={() => { setComboSub(sid); cacheHit(medGet(medDS, sid)); }} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 11, padding: "11px 13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: C.ink }}>{medSubName(medDS, sid)}</span>
                      {ver ? <span style={{ fontSize: 10.5, fontWeight: 800, color: "#0B7A6E", background: tint("#0FAE9E", "18"), padding: "2px 7px", borderRadius: 7 }}>Verificeret T½</span> : <span style={{ fontSize: 10.5, fontWeight: 700, color: C.inkSoft, background: tint(C.ink, "0A"), padding: "2px 7px", borderRadius: 7 }}>T½ ej verificeret</span>}
                      <ChevronRight size={16} color={C.inkFaint} />
                    </button>
                  ); })}
                </div>
              </div>
            );
          }
          const r = lookRes;
          const backToCombo = isCombo ? (
            <button onClick={() => setComboSub(null)} style={{ border: "none", background: "transparent", color: "#5B37C7", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, padding: 0, marginBottom: 9, display: "flex", alignItems: "center", gap: 5 }}><ChevronRight size={14} color="#5B37C7" style={{ transform: "rotate(180deg)" }} />Tilbage til kombinationspræparatet</button>
          ) : null;
          const reviewBanner = (pickEntry && pickEntry.review && !isCombo) ? (
            <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: -2, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "33")}`, borderRadius: 11, padding: "10px 12px" }}><Info size={15} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 11.5, color: "#7A4E0A", lineHeight: 1.5 }}>Usikker tilknytning: dette handelsnavn optræder i Lægemiddelstyrelsens liste med forskellige salt-/prodrug-/formuleringsformer. Klario behandler dem ikke som ens — kontrollér det aktive stof i medicinkilden.</span></div>
          ) : null;
          const manualBlock = (subId, subName) => (
            <div style={{ marginTop: 11, borderTop: `1px solid ${C.line}`, paddingTop: 11 }}>
              {manual[subId] ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 9 }}>
                  <span style={{ fontSize: 12.5, color: C.ink }}>Manuelt indtastet: <b>{hlFmt(manual[subId].h, 2)} t</b> <span style={{ color: "#8A5A0B" }}>(ikke verificeret)</span></span>
                  <button onClick={() => useManual(subId, subName)} style={{ border: "none", background: tint("#7A5AF5", "16"), color: "#5B37C7", borderRadius: 9, padding: "6px 12px", fontSize: 12.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Beregn</button>
                  <button onClick={() => clearManual(subId)} style={{ border: `1px solid ${C.line}`, background: C.surface, color: C.inkSoft, borderRadius: 9, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Ryd</button>
                </div>
              ) : null}
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Indtast en halveringstid, du selv har kontrolleret (timer):</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={manualInput} onChange={(ev) => setManualInput(ev.target.value)} inputMode="decimal" placeholder="fx 8" aria-label="Manuel halveringstid i timer" style={{ flex: 1, boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink, background: C.surface, fontFamily: "inherit" }} />
                <button onClick={() => applyManual(subId, subName)} style={{ border: "none", borderRadius: 10, padding: "10px 14px", background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", fontFamily: "inherit", fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>Gem &amp; beregn</button>
              </div>
              <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 6, lineHeight: 1.5 }}>Markeres som manuelt indtastet og ikke-verificeret. Kontrollér altid mod en godkendt kilde.</div>
              <a href="https://pro.medicin.dk/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ marginTop: 9, fontSize: 12.5, fontWeight: 700, color: "#5B37C7", display: "flex", alignItems: "center", gap: 6 }}><Pill size={15} color="#7A5AF5" />Find halveringstid i medicinkilde <ChevronRight size={14} color="#5B37C7" /></div></a>
            </div>
          );
          const card = (() => {
          if (r.status === "verified" || r.status === "previously-verified") { const e = medToCard(r.record); const stale = r.status === "previously-verified"; const rc = (hlCache[r.subId] || {}).rechecked; const AC = stale ? "#B7791F" : "#0FAE9E"; const TX = stale ? "#8A5A0B" : "#0B7A6E"; return (
            <div style={{ marginTop: 12, border: `1px solid ${tint(AC, "40")}`, borderRadius: 13, background: tint(AC, "08"), padding: "13px 14px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: tint(AC, "18"), color: TX, borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 800, marginBottom: 8 }}><ShieldCheck size={13} color={TX} />{stale ? "Tidligere verificeret – opdatering kræves" : "Verificeret"}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{e.substans}</div>
              <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 1 }}>Aktivt stof: {e.aktivt}{e.brands && e.brands.length ? " · Handelsnavne: " + e.brands.join(", ") : ""}</div>
              <div style={{ fontSize: 15, color: C.ink, marginTop: 9 }}>{e.measLabel} (T½): <b style={{ color: TX }}>{e.display}</b></div>
              {e.range ? <div style={{ fontSize: 13, color: C.ink, marginTop: 4, lineHeight: 1.5 }}>{e.range}</div> : null}
              {e.effekt ? <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 6, lineHeight: 1.5 }}><b>Virkningsvarighed:</b> {e.effekt}</div> : null}
              {e.faktorer ? <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.5 }}><b>Elimination påvirkes af:</b> {e.faktorer}</div> : null}
              {e.klinisk ? <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.5 }}><b>Klinisk:</b> {e.klinisk}</div> : null}
              {e.calcOptions && e.calcOptions.length ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#5B37C7", letterSpacing: 0.4, marginBottom: 7 }}>BEREGN HALVERINGSTID</div>
                  {e.calcOptions.length === 1
                    ? <button onClick={() => applyToCalc(e, e.calcOptions[0])} style={{ width: "100%", border: "none", borderRadius: 11, padding: "12px", background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", fontFamily: "inherit", fontSize: 14.5, fontWeight: 800, cursor: "pointer", minHeight: 46 }}>Beregn halveringstid</button>
                    : <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{e.calcOptions.map((o, i) => <button key={i} onClick={() => applyToCalc(e, o)} style={{ border: `1px solid ${tint("#7A5AF5", "40")}`, background: tint("#7A5AF5", "0C"), borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 800, color: "#5B37C7", cursor: "pointer", fontFamily: "inherit" }}>{o.label || "Beregn"}</button>)}<button onClick={() => applyToCalcRange(e)} style={{ border: "none", background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Interval (lav–høj)</button></div>}
                  <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 6, lineHeight: 1.5 }}>Overfører værdien til beregneren. Vælg selv tid; ved interval beregnes begge endepunkter.</div>
                </div>
              ) : null}
              <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 11, paddingTop: 10 }}>
                {stale ? <div style={{ fontSize: 12, color: "#8A5A0B", lineHeight: 1.5, marginBottom: 4 }}>Denne post er over 12 måneder gammel. Bekræft værdien mod kilden, før du bruger den.</div> : null}
                <div style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5 }}>Kilde: {e.kilde}</div>
                <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 2 }}>Kontrolleret: {e.lastVerified}{rc ? " · Gentjekket i appen: " + hlDate(rc) : ""}. En kontroldato er ikke bevis for, at oplysningen stadig er aktuel.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 9 }}>
                  <a href={e.kildeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", fontSize: 12.5, fontWeight: 700, color: C.ink }}>Åbn kilde <ChevronRight size={14} color={C.inkFaint} /></span></a>
                  <button onClick={() => reverify(r.subId, e.kildeUrl)} style={{ border: `1px solid ${C.line}`, background: C.surface, borderRadius: 10, padding: "8px 12px", fontSize: 12.5, fontWeight: 700, color: C.ink, cursor: "pointer", fontFamily: "inherit" }}>Gentjek kilde</button>
                </div>
              </div>
            </div>
          ); }
          if (r.status === "not-documented") { const e = medToCard(r.record); return (
            <div style={{ marginTop: 12, border: `1px solid ${C.line}`, borderRadius: 12, background: C.surface, padding: "12px 14px" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{e.substans}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.inkSoft, marginTop: 6 }}>Halveringstid ikke dokumenteret / ikke fastlagt</div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.5 }}>{e.range || "Kilden angiver ikke én meningsfuld halveringstid for dette lægemiddel."}</div>
              {e.kildeUrl ? <a href={e.kildeUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ marginTop: 9, fontSize: 12.5, fontWeight: 700, color: "#5B37C7" }}>Åbn kilde →</div></a> : null}
              {manualBlock(r.subId, e.substans)}
            </div>
          ); }
          if (r.status === "unverified") { const e = medToCard(r.record); return (
            <div style={{ marginTop: 12, border: `1px solid ${tint("#B7791F", "33")}`, background: tint("#B7791F", "0C"), borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{e.substans}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#8A5A0B", marginTop: 6 }}>Ikke verificeret</div>
              <div style={{ fontSize: 12.5, color: "#7A4E0A", marginTop: 4, lineHeight: 1.5 }}>Der er en post for {e.substans}, men halveringstiden er ikke tilstrækkeligt verificeret. Slå op i en godkendt kilde.</div>
              {manualBlock(r.subId, e.substans)}
            </div>
          ); }
          return (
            <div style={{ marginTop: 12, border: `1px solid ${tint("#B7791F", "33")}`, background: tint("#B7791F", "0C"), borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 13.5, color: C.ink }}>Aktivt stof: <b>{r.subName}</b></div>
              {pickEntry && (pickEntry.atc || pickEntry.source) ? <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{pickEntry.atc ? "ATC " + String(pickEntry.atc).toUpperCase() : ""}{pickEntry.atc && pickEntry.source ? " · " : ""}{pickEntry.source ? "Identifikation: " + pickEntry.source : ""}</div> : null}
              <div style={{ fontSize: 14, fontWeight: 800, color: "#8A5A0B", marginTop: 6 }}>Halveringstid ikke verificeret</div>
              <div style={{ fontSize: 12.5, color: "#7A4E0A", marginTop: 4, lineHeight: 1.5 }}>Lægemidlet er <b>identificeret</b>, men Klario har endnu ikke en kildekontrolleret T½ for {r.subName}. Klario opfinder ikke en værdi — slå den op i en godkendt kilde eller indtast en, du selv har kontrolleret.</div>
              {manualBlock(r.subId, r.subName)}
            </div>
          );
          })();
          return (<React.Fragment>{backToCombo}{reviewBanner}{card}</React.Fragment>);
        })() : looked ? (
          <div style={{ marginTop: 12, border: `1px solid ${tint("#B7791F", "33")}`, background: tint("#B7791F", "0C"), borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#8A5A0B" }}>Lægemidlet blev ikke genkendt</div>
            <div style={{ fontSize: 12.5, color: "#7A4E0A", marginTop: 4, lineHeight: 1.5 }}>Klario opfinder ikke en værdi. Tjek stavningen, prøv det aktive stof, eller slå det op i en godkendt kilde.</div>
          </div>
        ) : null}

        <a href="https://pro.medicin.dk/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ marginTop: 11, border: `1px solid ${tint("#7A5AF5", "33")}`, background: tint("#7A5AF5", "0A"), borderRadius: 12, padding: "12px 14px", fontSize: 13.5, fontWeight: 700, color: "#5B37C7", display: "flex", alignItems: "center", gap: 8 }}><Pill size={17} color="#7A5AF5" /><span style={{ flex: 1 }}>Slå halveringstid op på pro.medicin.dk</span><ChevronRight size={16} color="#7A5AF5" /></div></a>
        <div style={{ display: "flex", gap: 9, marginTop: 11, background: tint(C.ink, "05"), border: `1px solid ${C.line}`, borderRadius: 11, padding: "10px 12px" }}>
          <Info size={15} color={C.inkSoft} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11.5, color: C.inkSoft, lineHeight: 1.5 }}>Klario har ingen live-forbindelse til pro.medicin.dk. Verificerede værdier kommer fra en kurateret, kildekontrolleret database i appen. Bekræft altid klinisk i pro.medicin.dk og følg ordination.</span>
        </div>
        {(() => {
          const liveSubs = Object.keys(medDS.substances || {}).length;
          const liveVer = (medDS.records || []).length;
          const liveNames = (medDS.index || []).length;
          const isDev = medOrigin === "dev" || (medMeta && medMeta.nameIndexDev);
          return (
            <div style={{ fontSize: 10.5, color: C.inkFaint, marginTop: 8, textAlign: "center", lineHeight: 1.5 }}>
              {isDev ? <span style={{ display: "inline-block", fontSize: 9.5, fontWeight: 800, color: "#8A5A0B", background: tint("#B7791F", "18"), border: `1px solid ${tint("#B7791F", "33")}`, borderRadius: 6, padding: "1px 6px", marginBottom: 4 }}>UDVIKLING · officielt indeks (Lægemiddelstyrelsen) · ikke i produktion</span> : null}<br/>
              Datasæt T½ {medMeta && medMeta.datasetVersion ? medMeta.datasetVersion : "—"} · {liveSubs} stoffer søgbare, {liveNames} navne, {liveVer} med verificeret T½ · {medOrigin === "network" ? "opdateret fra data-fil" : medOrigin === "cache" ? "fra lokal cache" : medOrigin === "dev" ? "udviklings-indeks" : "medbragt i appen"}<br/>
              Navne-indeks: {isDev ? "Lægemiddelstyrelsen — gengivet med kildeangivelse (ikke-kommerciel, afventer bekræftelse)" : "Klario kurateret · officielt indeks fra Lægemiddelstyrelsen kan tilføjes med kildeangivelse"}.
            </div>
          );
        })()}
      </div>

      <button onClick={() => onTest("halveringstid")} style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px", background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Test din viden om halveringstid</button>
    </div>
  );
}

const FAGLIGT_CAT = { id: "fagligtsprog", title: "Fagligt sprog", subtitle: "Fra hverdagssprog til SSA-sprog.", color: "#0FAE9E", g1: "#2BC7B4", g2: "#0B9488", Icon: MessageCircle };
const PLEJE_CAT = { id: "plejeprocedurer", title: "Plejeprocedurer", subtitle: "Trin-for-trin til pleje, observation og dokumentation.", color: "#2E68E0", g1: "#4F86F4", g2: "#2257D8", Icon: ClipboardList };
const ANATOMI_CAT = { id: "anatomi", title: "Anatomi & fysiologi", subtitle: "Kropsdele, organer, systemer og latin.", color: "#0E9F6E", g1: "#34D399", g2: "#047857", Icon: Activity };
const FARMA_CAT = { id: "farmakologi", title: "Farmakologi", subtitle: "Forstå hvordan lægemidler virker i kroppen.", color: "#7A5AF5", g1: "#9B7DF6", g2: "#5B37C7", Icon: Pill };
const TESTVIDEN_CAT = { id: "testviden", title: "Test Viden", subtitle: "Quiz og case-træning til studie.", color: "#6741D9", g1: "#8B6DF0", g2: "#5B37C7", Icon: GraduationCap };

function GridTile({ cat, count, onClick }) {
  return (
    <button onClick={onClick} aria-label={cat.title} style={{ textAlign: "left", border: "none", borderRadius: 20, padding: 15, cursor: "pointer", background: `linear-gradient(160deg, ${tint(cat.color, "1A")}, ${tint(cat.color, "08")})`, display: "flex", flexDirection: "column", gap: 12, minHeight: 138, justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Chip cat={cat} size={42} radius={13} />
        {count != null && <span style={{ fontSize: 12, fontWeight: 700, color: cat.color, background: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: 8 }}>{count}</span>}
      </div>
      <div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{cat.title}</div>
        <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.35 }}>{cat.subtitle}</div>
      </div>
    </button>
  );
}


/* ========================= QUIZ + CASE-TRÆNING ========================= *
 *  Læringslag. Quizindhold er generel SSA-viden (proces, observation,
 *  terminologi, beregning med opgivne tal). Lægemiddelspecifikke svar
 *  opfindes IKKE — de markeres som "verificeret svar mangler".
 *  Alle borgere er fiktive.
 * ===================================================================== */

const CASE_SAFETY = "Case-træning er til læring og må ikke bruges som grundlag for behandling af en konkret borger. Følg altid ordinationer, lokale instrukser og relevant sundhedsfaglig vejledning.";
const FLAG_NOTE = "Fagligt verificeret svar mangler. Slå præparatet op i en godkendt kilde (fx pro.medicin.dk eller arbejdsstedets instruks). Verificeret svar tilføjes, når det er bekræftet.";

const T = "Sandt", F = "Falsk";
const QUIZ_LIST = [
  { id: "q-hjerte", category: "Hjerte/kredsløb", title: "Hjerte/kredsløb", level: 2, topic: "diag-hjertesvigt", caseId: "case-hjerte-medicin", qs: [
    { q: "Hvad kan være tegn på forværring ved hjertesvigt?", type: "mc", opts: ["Tiltagende åndenød og hævede ben", "Klar, lys urin", "Vægttab over natten"], correct: [0], why: "Tiltagende åndenød, hurtig vægtøgning og øgede ødemer kan tyde på forværring.", tag: "Observation" },
    { q: "Hvad er det faglige ord for hævelse pga. væske i vævet?", type: "mc", opts: ["Ødem", "Cyanose", "Diurese"], correct: [0], why: "Ødem = væskeophobning i vævet.", tag: "Terminologi" },
    { q: "Ved brystsmerter med mistanke om hjertetilfælde ringer du 1-1-2.", type: "tf", opts: [T, F], correct: [0], why: "Ring 1-1-2 ved mistanke om hjertetilfælde.", tag: "Reaktion" },
    { q: "Hvad observerer du ved hjertesvigt? (vælg alle korrekte)", type: "multi", opts: ["Åndenød", "Hævede ben (ødem)", "Vægt", "Hårvækst"], correct: [0, 1, 2], why: "Åndenød, ødem, vægt og træthed — ikke hårvækst.", tag: "Observation" },
    { q: "Hvad gør du ved hurtig vægtøgning og øget åndenød?", type: "mc", opts: ["Afventer en uge", "Observerer og kontakter ansvarlig", "Ignorerer det"], correct: [1], why: "Kontakt ansvarlig ved forværring.", tag: "Reaktion" },
  ] },
  { id: "q-respiration", category: "Respiration", title: "Respiration", level: 1, topic: "obs-respiration", caseId: "case-respiration", qs: [
    { q: "Hvad er en normal respirationsfrekvens for en voksen i hvile?", type: "mc", opts: ["6–8 pr. min", "12–20 pr. min", "24–30 pr. min"], correct: [1], why: "Normalområdet er ca. 12–20 pr. minut.", tag: "Faglig" },
    { q: "Cyanose (blålige læber) er et advarselstegn ved respiration.", type: "tf", opts: [T, F], correct: [0], why: "Cyanose kan tyde på iltmangel.", tag: "Observation" },
    { q: "Hvad kalder man åndenød med et fagligt ord?", type: "mc", opts: ["Dyspnø", "Ødem", "Cyanose"], correct: [0], why: "Dyspnø = åndenød/besværet vejrtrækning.", tag: "Terminologi" },
    { q: "Hvad observerer du ved respiration? (vælg alle korrekte)", type: "multi", opts: ["Frekvens", "Dybde", "Hårfarve", "Brug af hjælpemuskler"], correct: [0, 1, 3], why: "Frekvens, dybde, rytme og hjælpemuskler — ikke hårfarve.", tag: "Observation" },
    { q: "Hvad gør du først ved pludselig svær åndenød?", type: "mc", opts: ["Dokumenterer", "Skaber ro, hjælper op i siddende stilling og tilkalder hjælp", "Venter"], correct: [1], why: "Skab ro, siddende stilling, tilkald hjælp; 1-1-2 ved svær åndenød.", tag: "Reaktion" },
  ] },
  { id: "q-diabetes", category: "Diabetes", title: "Diabetes", level: 2, topic: "diag-diabetes", caseId: "case-diabetes", qs: [
    { q: "Hvilke tegn kan tyde på lavt blodsukker? (vælg alle korrekte)", type: "multi", opts: ["Sved", "Sløvhed", "Forvirring", "Kraftig tørst"], correct: [0, 1, 2], why: "Sved, sløvhed og forvirring kan tyde på lavt blodsukker.", tag: "Observation" },
    { q: "Hvad gør du ved mistanke om lavt blodsukker?", type: "mc", opts: ["Gætter en dosis insulin", "Følger lokal instruks/ordineret plan og kontakter ansvarlig ved tvivl", "Venter til næste dag"], correct: [1], why: "Følg delegation og lokal instruks; gæt aldrig.", tag: "Reaktion" },
    { q: "Diabetes handler om forhøjet blodsukker.", type: "tf", opts: [T, F], correct: [0], why: "Forhøjet blodsukker pga. mangel på/nedsat virkning af insulin.", tag: "Terminologi" },
    { q: "Hvorfor er fodpleje vigtig ved diabetes?", type: "mc", opts: ["Negle vokser hurtigere", "Selv små fodsår kan blive alvorlige", "Det er den ikke"], correct: [1], why: "Diabetiske fodsår kan blive alvorlige.", tag: "Observation" },
    { q: "Mest objektive dokumentation?", type: "mc", opts: ["Gerda har det skidt", "Gerda er sløv med klam hud og har ikke spist morgenmad", "Gerda er lidt underlig"], correct: [1], why: "Objektivt = konkret og observerbart.", tag: "Dokumentation" },
  ] },
  { id: "q-ernaering", category: "Ernæring", title: "Ernæring", level: 1, topic: "obs-ernaering", caseId: null, qs: [
    { q: "Hvad observerer du ved ernæring? (vælg alle korrekte)", type: "multi", opts: ["Appetit", "Mængde der spises", "Vægt", "Yndlingsret"], correct: [0, 1, 2], why: "Appetit, indtag, vægt og tygge-/synkebesvær.", tag: "Observation" },
    { q: "Hvad kan utilsigtet vægttab være tegn på?", type: "mc", opts: ["God ernæringstilstand", "Dårlig ernæringstilstand", "Ingenting"], correct: [1], why: "Utilsigtet vægttab kan tyde på underernæring.", tag: "Observation" },
    { q: "Fagligt ord for synkebesvær?", type: "mc", opts: ["Dysfagi", "Dyspnø", "Diurese"], correct: [0], why: "Dysfagi = synkebesvær.", tag: "Terminologi" },
    { q: "Hoste under måltid kan være tegn på fejlsynkning.", type: "tf", opts: [T, F], correct: [0], why: "Hoste/harken ved måltid kan tyde på dysfagi.", tag: "Observation" },
    { q: "Hvad gør du ved synkebesvær?", type: "mc", opts: ["Giver store bidder hurtigt", "Tilpasser konsistens, oprejst stilling og kontakter ansvarlig", "Ignorerer det"], correct: [1], why: "Tilpasset konsistens, oprejst stilling, ro; kontakt ansvarlig.", tag: "Reaktion" },
  ] },
  { id: "q-vaeske", category: "Væske", title: "Væske", level: 1, topic: "obs-vaeske", caseId: null, qs: [
    { q: "Tegn på dehydrering? (vælg alle korrekte)", type: "multi", opts: ["Tørre slimhinder", "Tørst", "Nedsat/mørk urin", "Hævede ben"], correct: [0, 1, 2], why: "Tørre slimhinder, tørst, nedsat/mørk urin; hævede ben = ødem.", tag: "Observation" },
    { q: "Vejledende væskebehov for en voksen?", type: "mc", opts: ["Ca. 10 ml/kg/døgn", "Ca. 30 ml/kg/døgn", "Ca. 100 ml/kg/døgn"], correct: [1], why: "Vejledende ca. 30 ml/kg/døgn (varierer).", tag: "Faglig" },
    { q: "Fagligt ord for væskemangel?", type: "mc", opts: ["Dehydrering", "Ødem", "Obstipation"], correct: [0], why: "Dehydrering = væskemangel.", tag: "Terminologi" },
    { q: "Nedsat urinmængde kan være tegn på dehydrering.", type: "tf", opts: [T, F], correct: [0], why: "Nedsat/mørk urin kan tyde på dehydrering.", tag: "Observation" },
    { q: "Hvad gør du ved tegn på dehydrering?", type: "mc", opts: ["Tilbyder væske ofte, registrerer og kontakter ansvarlig", "Venter et par dage", "Giver mindre at drikke"], correct: [0], why: "Tilbyd væske, registrér, kontakt ved tegn.", tag: "Reaktion" },
  ] },
  { id: "q-udskillelse", category: "Udskillelse", title: "Udskillelse", level: 1, topic: "obs-urin", caseId: null, qs: [
    { q: "Hvad observerer du ved urin? (vælg alle korrekte)", type: "multi", opts: ["Farve", "Klarhed", "Lugt", "Rumtemperatur"], correct: [0, 1, 2], why: "Farve, klarhed, lugt, mængde og svie.", tag: "Observation" },
    { q: "Fagligt ord for urinmængde/urinproduktion?", type: "mc", opts: ["Diurese", "Dysfagi", "Cyanose"], correct: [0], why: "Diurese = urinproduktion/urinmængde.", tag: "Terminologi" },
    { q: "Blod i urinen skal altid tages alvorligt.", type: "tf", opts: [T, F], correct: [0], why: "Blod i urinen kræver kontakt til ansvarlig.", tag: "Reaktion" },
    { q: "Fagligt ord for ufrivillig vandladning?", type: "mc", opts: ["Inkontinens", "Obstipation", "Ødem"], correct: [0], why: "Inkontinens = ufrivillig vandladning/afføring.", tag: "Terminologi" },
    { q: "Uklar, ildelugtende urin med svie kan tyde på?", type: "mc", opts: ["Urinvejsinfektion", "God væskebalance", "Intet"], correct: [0], why: "Kan tyde på urinvejsinfektion (UVI) — kontakt ansvarlig.", tag: "Observation" },
  ] },
  { id: "q-obstipation", category: "Obstipation", title: "Obstipation", level: 1, topic: "ern-obstipation", caseId: "case-obstipation", qs: [
    { q: "Fagligt ord for forstoppelse?", type: "mc", opts: ["Obstipation", "Diarré", "Diurese"], correct: [0], why: "Obstipation = forstoppelse.", tag: "Terminologi" },
    { q: "Hvad observerer du ved obstipation? (vælg alle korrekte)", type: "multi", opts: ["Hvornår sidste afføring", "Konsistens", "Oppustethed", "Hårfarve"], correct: [0, 1, 2], why: "Seneste afføring, konsistens, mavegener og indtag.", tag: "Observation" },
    { q: "Væske, fibre og mobilisering kan forebygge forstoppelse.", type: "tf", opts: [T, F], correct: [0], why: "Inden for planen: væske, fibre og mobilisering.", tag: "Faglig" },
    { q: "Hvad gør du ved vedvarende obstipation?", type: "mc", opts: ["Ignorerer det", "Observerer og kontakter ansvarlig", "Giver afføringsmiddel uden ordination"], correct: [1], why: "Kontakt ansvarlig; medicin kun efter ordination/delegation.", tag: "Reaktion" },
    { q: "Bristol-skalaen beskriver…", type: "mc", opts: ["Afføringens konsistens", "Blodtryk", "Respiration"], correct: [0], why: "Bristol-skalaen beskriver afføringens konsistens.", tag: "Faglig" },
  ] },
  { id: "q-hud", category: "Hud", title: "Hud", level: 1, topic: "obs-hudfarve", caseId: null, qs: [
    { q: "Fagligt ord for hudens tilstand/hele overflade?", type: "mc", opts: ["Hudintegritet", "Diurese", "Dyspnø"], correct: [0], why: "Hudintegritet = hudens tilstand.", tag: "Terminologi" },
    { q: "Hvad observerer du på huden? (vælg alle korrekte)", type: "multi", opts: ["Rødme", "Sår", "Fugt", "Rummets lys"], correct: [0, 1, 2], why: "Rødme, sår, fugt, tryksår og misfarvning.", tag: "Observation" },
    { q: "Blålige læber (cyanose) kan tyde på?", type: "mc", opts: ["Iltmangel", "God iltning", "Sult"], correct: [0], why: "Cyanose = blålig misfarvning pga. iltmangel.", tag: "Observation" },
    { q: "Vedvarende rødme over haleben kan være et tidligt tryksår.", type: "tf", opts: [T, F], correct: [0], why: "Rødme, der ikke forsvinder ved tryk (kategori 1).", tag: "Observation" },
    { q: "Hvad gør du ved et nyopstået sår?", type: "mc", opts: ["Observerer, dokumenterer og kontakter ansvarlig", "Ignorerer det", "Masserer det"], correct: [0], why: "Observér, dokumentér, kontakt ansvarlig.", tag: "Reaktion" },
  ] },
  { id: "q-tryksaar", category: "Tryksår", title: "Tryksår", level: 1, topic: "saar-tryksaar", caseId: null, qs: [
    { q: "Hvor opstår tryksår typisk?", type: "mc", opts: ["Over knoglefremspring som hæl og haleben", "Midt på maven", "På håndryggen"], correct: [0], why: "Hvor der er vedvarende tryk over knoglefremspring.", tag: "Faglig" },
    { q: "Rødme, der ikke forsvinder ved tryk, kan være et tidligt tryksår.", type: "tf", opts: [T, F], correct: [0], why: "Vedvarende rødme (kategori 1) er et tidligt tegn.", tag: "Observation" },
    { q: "Hvad forebygger tryksår? (vælg alle korrekte)", type: "multi", opts: ["Trykaflastning og lejring", "Hudpleje", "Langvarigt tryk i samme stilling", "Observation af huden"], correct: [0, 1, 3], why: "Lejring/trykaflastning, hudpleje og observation forebygger.", tag: "Faglig" },
    { q: "Hvad gør du ved et nyopstået tryksår?", type: "mc", opts: ["Ignorerer det", "Kontakter ansvarlig og aflaster", "Masserer området kraftigt"], correct: [1], why: "Kontakt ansvarlig og aflast; massage anbefales ikke.", tag: "Reaktion" },
    { q: "Et fagligt ord for hudens tilstand er…", type: "mc", opts: ["Hudintegritet", "Diurese", "Dyspnø"], correct: [0], why: "Hudintegritet beskriver hudens hele/tilstand.", tag: "Terminologi" },
  ] },
  { id: "q-personligpleje", category: "Personlig pleje", title: "Personlig pleje", level: 1, topic: "p-nedre", caseId: null, qs: [
    { q: "Personlig pleje er også en anledning til faglig observation.", type: "tf", opts: [T, F], correct: [0], why: "Brug plejen til at observere hud, mund, hovedbund m.m.", tag: "Faglig" },
    { q: "Hvad observerer du ved mundpleje? (vælg alle korrekte)", type: "multi", opts: ["Sår", "Blødning", "Belægninger", "Rumtemperatur"], correct: [0, 1, 2], why: "Sår, blødning, tørhed, belægninger og smerte.", tag: "Observation" },
    { q: "Hvad er vigtigt ved al personlig pleje?", type: "mc", opts: ["Værdighed og samtykke", "At skynde sig", "At undlade at spørge"], correct: [0], why: "Bevar værdighed og privatliv; inddrag samtykke.", tag: "Faglig" },
    { q: "Ved barbering skal du være ekstra forsigtig ved?", type: "mc", opts: ["Øget blødningsrisiko", "Godt humør", "Langt hår"], correct: [0], why: "Vær forsigtig ved øget blødningsrisiko; ingen medicinspecifik rådgivning.", tag: "Observation" },
    { q: "Hvad observerer du ved hårpleje?", type: "mc", opts: ["Hovedbund, rødme og sår", "Kun frisuren", "Ingenting"], correct: [0], why: "Observér hovedbund, rødme, sår og skæl.", tag: "Observation" },
  ] },
  { id: "q-hygiejne", category: "Hygiejne", title: "Hygiejne", level: 1, topic: "hyg-hand", caseId: null, qs: [
    { q: "Hvad er det vigtigste tiltag mod smittespredning?", type: "mc", opts: ["Håndhygiejne", "Nyt tøj", "Frisk luft"], correct: [0], why: "Håndhygiejne er det vigtigste tiltag.", tag: "Faglig" },
    { q: "Handsker erstatter håndhygiejne.", type: "tf", opts: [T, F], correct: [1], why: "Handsker erstatter ikke håndhygiejne.", tag: "Faglig" },
    { q: "Hvilket princip arbejder du efter?", type: "mc", opts: ["Fra rent mod urent", "Fra urent mod rent", "Tilfældigt"], correct: [0], why: "Fra rent mod urent for ikke at flytte smitte.", tag: "Faglig" },
    { q: "Hvornår udfører du håndhygiejne? (vælg alle korrekte)", type: "multi", opts: ["Før borgerkontakt", "Efter borgerkontakt", "Efter handsker", "Kun om morgenen"], correct: [0, 1, 2], why: "Før/efter borgerkontakt, efter handsker, ved rene/urene opgaver.", tag: "Faglig" },
    { q: "Hvor længe sprittes hænder som minimum?", type: "mc", opts: ["Ca. 5 sekunder", "Ca. 30 sekunder til tørre hænder", "2 minutter"], correct: [1], why: "Min. 30 sekunder til hænderne er tørre.", tag: "Faglig" },
  ] },
  { id: "q-kateter", category: "Kateterpleje", title: "Kateterpleje", level: 2, topic: "p-kateter", caseId: "case-kateter", qs: [
    { q: "Hvor skal urinposen placeres?", type: "mc", opts: ["Højere end blæren", "Lavere end blæren", "Det er ligegyldigt"], correct: [1], why: "Lavere end blæren, så urin ikke løber tilbage.", tag: "Faglig" },
    { q: "Du bør undgå unødvendig åbning af det lukkede drænagesystem.", type: "tf", opts: [T, F], correct: [0], why: "Hold det lukkede system lukket for at nedsætte infektionsrisiko.", tag: "Faglig" },
    { q: "Hvad observerer du ved urinen? (vælg alle korrekte)", type: "multi", opts: ["Farve", "Klarhed", "Lugt", "Rumtemperatur"], correct: [0, 1, 2], why: "Farve, klarhed, lugt, sediment og mængde.", tag: "Observation" },
    { q: "Hvornår kontakter du ansvarlig?", type: "mc", opts: ["Ved klar, lys urin", "Ved blod i urinen, feber eller stærk smerte", "Aldrig"], correct: [1], why: "Blod, feber eller stærk smerte kræver kontakt.", tag: "Reaktion" },
    { q: "Hvad gør du for at undgå skade på kateteret?", type: "mc", opts: ["Trækker i det", "Undgår træk og knæk på slangen", "Klemmer slangen"], correct: [1], why: "Undgå træk og knæk; håndtér nænsomt.", tag: "Faglig" },
  ] },
  { id: "q-medicin", category: "Medicin", title: "Medicin", level: 2, topic: "p-medicin", caseId: "case-medicinsikkerhed", qs: [
    { q: "Hvad hører til de rigtige kontroller? (vælg alle korrekte)", type: "multi", opts: ["Rigtig borger", "Rigtig dosis", "Rigtig administrationsvej", "Rigtig vejrudsigt"], correct: [0, 1, 2], why: "Borger, lægemiddel, dosis, tidspunkt, administrationsvej og dokumentation.", tag: "Faglig" },
    { q: "Er du i tvivl om dosis, må du gætte.", type: "tf", opts: [T, F], correct: [1], why: "Ved tvivl: stop og kontakt ansvarlig — gæt aldrig.", tag: "Reaktion" },
    { q: "Hvad gør du ved en medicinfejl?", type: "mc", opts: ["Skjuler den", "Vurderer borger, kontakter ansvarlig og rapporterer som UTH", "Venter til næste vagt"], correct: [1], why: "Vurder borger, kontakt ansvarlig, rapportér som UTH.", tag: "Reaktion" },
    { q: "Hvad skal du kende, før du giver medicin?", type: "mc", opts: ["Din kompetence og delegation/instruks", "Kun borgerens navn", "Ingenting"], correct: [0], why: "Kend din kompetence og delegation/instruks.", tag: "Faglig" },
    { q: "Du skal observere borgeren efter medicingivning.", type: "tf", opts: [T, F], correct: [0], why: "Observér for virkning og bivirkning; dokumentér.", tag: "Observation" },
  ] },
  { id: "q-farmakologi", category: "Farmakologi", title: "Farmakologi (begreber)", level: 3, topic: "p-medicin", caseId: "case-hjerte-medicin", qs: [
    { q: "Hvad betyder farmakodynamik?", type: "mc", opts: ["Hvad lægemidlet gør ved kroppen", "Hvad kroppen gør ved lægemidlet", "Hvor medicin opbevares"], correct: [0], why: "Farmakodynamik = lægemidlets virkning på kroppen.", tag: "Faglig" },
    { q: "Hvad betyder farmakokinetik?", type: "mc", opts: ["Hvad kroppen gør ved lægemidlet", "Lægemidlets pris", "Tablettens farve"], correct: [0], why: "Farmakokinetik = optagelse, fordeling, nedbrydning og udskillelse.", tag: "Faglig" },
    { q: "Hvad hører til farmakokinetik? (vælg alle korrekte)", type: "multi", opts: ["Optagelse", "Fordeling", "Udskillelse", "Emballagens farve"], correct: [0, 1, 2], why: "Optagelse, fordeling, nedbrydning og udskillelse.", tag: "Faglig" },
    { q: "En bivirkning er en uønsket virkning af et lægemiddel.", type: "tf", opts: [T, F], correct: [0], why: "Bivirkning = uønsket virkning.", tag: "Terminologi" },
    { q: "Hvor slår du et præparats virkning og bivirkninger op?", type: "mc", opts: ["I en godkendt kilde (fx pro.medicin.dk) eller lokal instruks", "Gætter", "Spørger en tilfældig"], correct: [0], why: "Brug godkendte kilder; gæt aldrig lægemiddelfakta.", tag: "Faglig" },
  ] },
  { id: "q-mobilitet", category: "Mobilitet/forflytning", title: "Mobilitet/forflytning", level: 2, topic: "p-sejl-seng-stol", caseId: null, qs: [
    { q: "Du skal altid bruge det sejl og den lift, der står i borgerens forflytningsplan.", type: "tf", opts: [T, F], correct: [0], why: "Følg altid forflytningsplanen samt producentens/arbejdsstedets instruktion.", tag: "Faglig" },
    { q: "Hvad gør du FØRST ved en forflytning med lift?", type: "mc", opts: ["Løfter borgeren", "Læser forflytningsplanen og vurderer borgeren", "Fjerner sejlet"], correct: [1], why: "Læs plan, vurder borger, informér, klargør — før løft.", tag: "Prioritering" },
    { q: "Hvad hører til sikkerhedstjek før løft? (vælg alle korrekte)", type: "multi", opts: ["Rigtigt sejl", "Rigtig størrelse", "Sejlet er intakt", "God musik"], correct: [0, 1, 2], why: "Rigtigt sejl, størrelse, intakt, korrekte fæstepunkter og fungerende lift.", tag: "Faglig" },
    { q: "Hvorfor løfter du minimalt først?", type: "mc", opts: ["For at spare tid", "For at kunne udføre et sikkerhedstjek", "Det gør du ikke"], correct: [1], why: "Løft minimalt og tjek, at alt sidder korrekt.", tag: "Faglig" },
    { q: "God ergonomi for dig?", type: "mc", opts: ["Vrid i ryggen", "Brug benene og hold ryggen neutral", "Løft med bøjet ryg"], correct: [1], why: "Brug benene, hold ryggen neutral, undgå vrid.", tag: "Faglig" },
  ] },
  { id: "q-demens", category: "Kognition/demens", title: "Kognition/demens", level: 1, topic: "diag-demens", caseId: null, qs: [
    { q: "Fagligt ord for forvirring/nedsat klarhed?", type: "mc", opts: ["Konfusion", "Cyanose", "Dysfagi"], correct: [0], why: "Konfusion = forvirring.", tag: "Terminologi" },
    { q: "Pludselig forværring hos en borger med demens kan skyldes fx infektion.", type: "tf", opts: [T, F], correct: [0], why: "Pludselig forværring bør give mistanke om fx infektion.", tag: "Observation" },
    { q: "God kommunikation ved demens?", type: "mc", opts: ["Tal enkelt, én besked ad gangen, ro og tid", "Mange valg på én gang", "Skæld ud ved fejl"], correct: [0], why: "Enkel, rolig kommunikation; én besked ad gangen.", tag: "Faglig" },
    { q: "Udadreagerende adfærd kan være udtryk for?", type: "mc", opts: ["Et uopfyldt behov eller mistrivsel", "Ondskab", "Ingenting"], correct: [0], why: "Ofte udtryk for uopfyldt behov (smerte, sult, uro).", tag: "Faglig" },
    { q: "Hvad hjælper i hverdagen?", type: "mc", opts: ["Struktur og genkendelige rutiner", "Konstante ændringer", "Uro"], correct: [0], why: "Struktur, genkendelighed og ro støtter borgeren.", tag: "Faglig" },
  ] },
  { id: "q-kommunikation", category: "Kommunikation", title: "Kommunikation", level: 1, topic: "kom-isbar", caseId: null, qs: [
    { q: "Hvad står ISBAR for (kort)?", type: "mc", opts: ["Identifikation, Situation, Baggrund, Analyse, Råd", "En medicin", "En diagnose"], correct: [0], why: "ISBAR: Identifikation, Situation, Baggrund, Analyse, Råd.", tag: "Terminologi" },
    { q: "Aktiv lytning betyder at afbryde og rette borgeren.", type: "tf", opts: [T, F], correct: [1], why: "Aktiv lytning: lyt fuldt uden at afbryde eller dømme.", tag: "Faglig" },
    { q: "God kommunikation med borger?", type: "mc", opts: ["Tal tydeligt, i øjenhøjde og uden fagsprog", "Tal hurtigt med fagsprog", "Undlad at tjekke forståelse"], correct: [0], why: "Tydeligt, i øjenhøjde; tjek forståelse.", tag: "Faglig" },
    { q: "Hvornår bruger du ISBAR?", type: "mc", opts: ["Ved sikker mundtlig overlevering til fx spl./læge", "Aldrig", "Kun til pårørende"], correct: [0], why: "ISBAR bruges ved overlevering, især ved forværring.", tag: "Faglig" },
    { q: "Ved svære samtaler bør du?", type: "mc", opts: ["Være nærværende og give plads til følelser", "Skynde dig", "Love ting du ikke kan holde"], correct: [0], why: "Vær nærværende, tal klart, giv plads; henvis ved behov.", tag: "Faglig" },
  ] },
  { id: "q-dokumentation", category: "Dokumentation", title: "Dokumentation", level: 2, topic: "dok-hvad", caseId: null, qs: [
    { q: "Mest objektive dokumentation?", type: "mc", opts: ["Han er sur", "Borger afviser morgenmad og oplyser kvalme", "Han er besværlig"], correct: [1], why: "Objektivt = konkret og observerbart; medtag borgerens udsagn.", tag: "Dokumentation" },
    { q: "Hvad er subjektivt?", type: "mc", opts: ["Temperatur 38,2 °C", "Borger angiver smerter 6/10", "Rød hud på læg"], correct: [1], why: "Subjektivt = borgerens egne udsagn.", tag: "Terminologi" },
    { q: "Det, der ikke er dokumenteret, regnes ofte som ikke udført.", type: "tf", opts: [T, F], correct: [0], why: "Dokumentér rettidigt.", tag: "Faglig" },
    { q: "Hvad bør en god note indeholde? (vælg alle korrekte)", type: "multi", opts: ["Tidspunkt", "Objektive fund", "Handling/kontakt", "Din private mening"], correct: [0, 1, 2], why: "Tid, fund, handling, kontakt og initialer — objektivt.", tag: "Dokumentation" },
    { q: "\u201EBorger fremstår ændret ift. …?\u201C", type: "mc", opts: ["habitualtilstand", "diurese", "dyspnø"], correct: [0], why: "Habitualtilstand = borgerens vanlige tilstand.", tag: "Terminologi" },
  ] },
  { id: "q-fagligtsprog", category: "Fagligt sprog", title: "Fagligt sprog", level: 1, topic: "fs", caseId: null, qs: [
    { q: "\u201EHan er forpustet\u201C beskrives fagligt som…", type: "mc", opts: ["Dyspnø", "Cyanose", "Ødem"], correct: [0], why: "Dyspnø = åndenød.", tag: "Terminologi" },
    { q: "\u201EHævede ben\u201C hedder fagligt…", type: "mc", opts: ["Ødem", "Diurese", "Konfusion"], correct: [0], why: "Ødem = væskeophobning i vævet.", tag: "Terminologi" },
    { q: "\u201EForvirret\u201C beskrives fagligt som…", type: "mc", opts: ["Konfus", "Dyspnøisk", "Inkontinent"], correct: [0], why: "Konfusion = forvirring.", tag: "Terminologi" },
    { q: "\u201EBorger fremstår ændret ift. habitualtilstand\u201C er en brugbar faglig formulering.", type: "tf", opts: [T, F], correct: [0], why: "Suppler gerne med konkrete observationer.", tag: "Faglig" },
    { q: "Hvad er mest objektivt?", type: "mc", opts: ["Hun virker mærkelig", "Borger spiste ca. 1/4 af morgenmaden og deltager mindre", "Hun har det skidt"], correct: [1], why: "Objektivt = konkret og observerbart.", tag: "Dokumentation" },
  ] },
  { id: "q-akut", category: "Akut/ABCDE", title: "Akut / ABCDE", level: 2, topic: "akut-abcde", caseId: null, qs: [
    { q: "Hvad er den rigtige rækkefølge i ABCDE?", type: "mc", opts: ["A luftvej, B vejrtrækning, C kredsløb, D bevidsthed, E helkrop", "C, A, B, D, E", "E, D, C, B, A"], correct: [0], why: "ABCDE: Airway, Breathing, Circulation, Disability, Exposure.", tag: "Prioritering" },
    { q: "Hvad står B for i ABCDE?", type: "mc", opts: ["Breathing (vejrtrækning)", "Blodtryk", "Bevidsthed"], correct: [0], why: "B = Breathing/vejrtrækning.", tag: "Terminologi" },
    { q: "Ved påvirket ABCDE tilkalder du hjælp og ringer 1-1-2 ved livsfare.", type: "tf", opts: [T, F], correct: [0], why: "Tilkald hjælp; 1-1-2 ved livstruende tegn.", tag: "Reaktion" },
    { q: "Hvad gør du FØRST ved en bevidstløs borger, der ikke trækker vejret normalt?", type: "mc", opts: ["Dokumenterer", "Tilkalder hjælp/ringer 1-1-2 og starter relevant førstehjælp", "Går efter kaffe"], correct: [1], why: "Ring 1-1-2 og start førstehjælp; behandl som hjertestop.", tag: "Prioritering" },
    { q: "Hvad betyder D i ABCDE?", type: "mc", opts: ["Disability (bevidsthed)", "Drop", "Diurese"], correct: [0], why: "D = Disability/bevidsthed.", tag: "Terminologi" },
  ] },
];
const quizById = (id) => QUIZ_LIST.find((q) => q.id === id);
const quizForTopic = (t) => QUIZ_LIST.find((q) => q.topic === t);
const QUIZ_CATS = ["Alle"].concat(QUIZ_LIST.map((q) => q.category).filter((v, i, a) => a.indexOf(v) === i));

const EXTRA_QUIZZES = [
  { id: "q-mikrobiologi", category: "Bakterier & virus", title: "Bakterier & virus", level: 1, topic: "", caseId: null, qs: [
    { q: "Virker antibiotika mod virus?", type: "mc", opts: ["Ja", "Nej", "Kun nogle gange"], correct: [1], why: "Antibiotika virker ikke mod virus.", tag: "Faglig" },
    { q: "Hvad er den hyppigste smittevej?", type: "mc", opts: ["Kontaktsmitte (hænder/flader)", "Via tanker", "Via lys"], correct: [0], why: "Kontaktsmitte er den hyppigste — brydes med håndhygiejne.", tag: "Faglig" },
    { q: "God håndhygiejne forebygger både bakterie- og virusinfektioner.", type: "tf", opts: [T, F], correct: [0], why: "God hygiejne forebygger begge.", tag: "Faglig" },
    { q: "Typiske infektionstegn? (vælg alle korrekte)", type: "multi", opts: ["Feber", "Rødme/varme/hævelse", "Almen utilpashed", "Altid blålige negle"], correct: [0, 1, 2], why: "Feber, lokale tegn og almen utilpashed; hos ældre evt. forvirring.", tag: "Observation" },
    { q: "CRP er…", type: "mc", opts: ["En blodprøve, der stiger ved infektion/betændelse", "En medicin", "En diagnose"], correct: [0], why: "CRP stiger ved infektion; vurderes sammen med symptomer.", tag: "Faglig" },
  ] },
  { id: "q-normalvaerdier", category: "Normalværdier", title: "Normalværdier", level: 1, topic: "", caseId: null, qs: [
    { q: "Normal hvilepuls hos en voksen?", type: "mc", opts: ["30–50", "60–100", "110–140"], correct: [1], why: "Ca. 60–100 slag/min.", tag: "Faglig" },
    { q: "Normal iltmætning (SpO₂)?", type: "mc", opts: ["70–80 %", "85–90 %", "95–100 %"], correct: [2], why: "Normalt ca. 95–100 % (KOL: individuel grænse).", tag: "Faglig" },
    { q: "Normal kropstemperatur?", type: "mc", opts: ["34–35 °C", "36,5–37,5 °C", "39–40 °C"], correct: [1], why: "Ca. 36,5–37,5 °C.", tag: "Faglig" },
    { q: "Vejledende normalt blodtryk?", type: "mc", opts: ["Ca. 90/50", "Ca. 120/80", "Ca. 160/100"], correct: [1], why: "Ca. 120/80 mmHg (variation er normalt).", tag: "Faglig" },
    { q: "Værdier skal altid vurderes sammen med borgerens vante niveau.", type: "tf", opts: [T, F], correct: [0], why: "Normalværdier er vejledende; sammenhold med habitualtilstand.", tag: "Faglig" },
  ] },
  { id: "q-love", category: "Love & regler", title: "Love & regler", level: 2, topic: "", caseId: null, qs: [
    { q: "Tavshedspligten gælder også uden for arbejdet.", type: "tf", opts: [T, F], correct: [0], why: "Den gælder også uden for arbejdet og efter ansættelsen.", tag: "Faglig" },
    { q: "Du må udføre en opgave, selvom du ikke er oplært og delegeret til den.", type: "tf", opts: [T, F], correct: [1], why: "Du må kun udføre opgaver, du er oplært og delegeret til.", tag: "Faglig" },
    { q: "Borgeren siger nej til pleje. Hvad gør du?", type: "mc", opts: ["Gennemfører alligevel", "Respekterer nej'et og dokumenterer", "Ignorerer borgeren"], correct: [1], why: "Selvbestemmelse; respektér og dokumentér. Tvang kræver særlige regler.", tag: "Reaktion" },
    { q: "Hvorfor rapporteres utilsigtede hændelser (UTH)?", type: "mc", opts: ["For at straffe", "For at lære og forebygge", "For sjov"], correct: [1], why: "UTH handler om læring, ikke skyld.", tag: "Faglig" },
    { q: "Magtanvendelse er…", type: "mc", opts: ["Første valg", "Sidste udvej efter særlige regler", "Altid forbudt"], correct: [1], why: "Sidste udvej; kræver hjemmel, dokumentation og indberetning.", tag: "Faglig" },
  ] },
  { id: "q-psykiatri", category: "Psykiatri", title: "Psykiatri", level: 2, topic: "", caseId: null, qs: [
    { q: "Ved tegn på selvmordsrisiko gør du?", type: "mc", opts: ["Venter og ser tiden an", "Tager det altid alvorligt, bliver hos borgeren og kontakter spl./læge straks", "Ignorerer det"], correct: [1], why: "Tag det ALTID alvorligt; bliv hos borgeren; kontakt straks.", tag: "Reaktion" },
    { q: "Ved et panikanfald kan du?", type: "mc", opts: ["Skabe ro og hjælpe med rolig vejrtrækning", "Skælde ud", "Gå din vej"], correct: [0], why: "Skab ro og tryghed; bliv hos borgeren.", tag: "Reaktion" },
    { q: "Professionelle grænser beskytter både borger og medarbejder.", type: "tf", opts: [T, F], correct: [0], why: "Grænser beskytter begge; hold fokus på borgerens behov.", tag: "Faglig" },
    { q: "God tilgang ved skizofreni?", type: "mc", opts: ["Modsig alle vrangforestillinger kraftigt", "Vær rolig og konkret, modsig ikke unødigt, kontakt spl.", "Lad borgeren være alene"], correct: [1], why: "Vær rolig og konkret; modsig ikke vrangforestillinger unødigt.", tag: "Faglig" },
    { q: "Ændret adfærd hos borgeren bør du?", type: "mc", opts: ["Observere og kontakte ansvarlig ved bekymring", "Ignorere", "Selv behandle"], correct: [0], why: "Observér, dokumentér og kontakt ved bekymring.", tag: "Observation" },
  ] },
  { id: "q-vaerktoejer", category: "Kliniske værktøjer", title: "Kliniske værktøjer", level: 2, topic: "", caseId: "case-medicinsikkerhed", qs: [
    { q: "ISBAR bruges til?", type: "mc", opts: ["Sikker mundtlig overlevering", "Blodtryksmåling", "Sårpleje"], correct: [0], why: "ISBAR: struktur til sikker overlevering.", tag: "Terminologi" },
    { q: "Braden Score vurderer?", type: "mc", opts: ["Risiko for tryksår", "Blodsukker", "Respiration"], correct: [0], why: "Braden vurderer risiko for tryksår.", tag: "Faglig" },
    { q: "NEWS2 bruges til?", type: "mc", opts: ["Tidlig opsporing af forværring", "At måle vægt", "At give medicin"], correct: [0], why: "NEWS2: Early Warning Score til tidlig opsporing.", tag: "Faglig" },
    { q: "BMI beregnes som?", type: "mc", opts: ["Vægt (kg) ÷ højde² (m)", "Højde ÷ vægt", "Vægt × højde"], correct: [0], why: "BMI = vægt/højde².", tag: "Beregning" },
    { q: "500 mg ordineret, tablet 250 mg. Hvor mange tabletter?", type: "mc", opts: ["1", "2", "4"], correct: [1], why: "500 ÷ 250 = 2 tabletter.", tag: "Beregning" },
  ] },
];
const ALL_QUIZ = QUIZ_LIST.concat(EXTRA_QUIZZES);
const QUIZ_CATMAP = { "q-respiration": "observationer", "q-udskillelse": "observationer", "q-hjerte": "diagnoser", "q-diabetes": "diagnoser", "q-hud": "saarpleje", "q-tryksaar": "saarpleje", "q-hygiejne": "hygiejne", "q-personligpleje": "hygiejne", "q-dokumentation": "dokumentation", "q-kommunikation": "kommunikation", "q-akut": "akut", "q-ernaering": "ernaering", "q-vaeske": "ernaering", "q-obstipation": "ernaering", "q-demens": "demens", "q-medicin": "medicin", "q-farmakologi": "medicin", "q-mikrobiologi": "mikrobiologi", "q-normalvaerdier": "normalvaerdier", "q-love": "love", "q-psykiatri": "psykiatri", "q-vaerktoejer": "vaerktoejer" };
const CAT_CASE = { observationer: "case-respiration", diagnoser: "case-hjerte-medicin", ernaering: "case-obstipation", medicin: "case-medicinsikkerhed", akut: "case-respiration" };
const CAT_TITLE_EXTRA = { anatomi: "Anatomi & fysiologi", farmakologi: "Farmakologi", halveringstid: "Halveringstid (T½)", injektion: "Injektioner" };
const catTitleById = (id) => (DATA.find((c) => c.id === id) || {}).title || CAT_TITLE_EXTRA[id] || id;
const makeTopicQuiz = (topicId) => ALL_QUIZ.find((x) => x.topic === topicId) || null;
const quizForTopic2 = (topicId) => ALL_QUIZ.find((x) => x.topic === topicId) || null;
function makeCategoryQuiz(catId) {
  const qs = ALL_QUIZ.filter((x) => QUIZ_CATMAP[x.id] === catId).reduce((acc, x) => acc.concat(x.qs.map((qq) => Object.assign({}, qq, { topic: x.topic }))), []);
  if (qs.length === 0) return null;
  return { title: "Test din viden om " + catTitleById(catId), category: catTitleById(catId), catId, level: 0, caseId: CAT_CASE[catId] || null, qs: qs.slice(0, 10) };
}
/* categories that have a quiz (all top-level clinical categories) */
const CAT_QUIZ_IDS = DATA.map((c) => c.id).filter((id) => makeCategoryQuiz(id));
/* ===== TEST DIN VIDEN — learning engine ================================ *
 *  Turns the existing question pool into a per-category bank with stable
 *  IDs, generates several spread-out tests per category, randomizes order
 *  and options (correct tracked by VALUE, not position), and stores
 *  progress + mistakes locally so the user can practise what they got wrong.
 *  Existing questions are reused untouched; new questions below are grounded
 *  in Klario's existing clinical content (terminology, actions, concepts).
 * ===================================================================== */
const QUIZ_KEY = "klario_quiz_v1";
function loadQuizStore() { try { const r = localStorage.getItem(QUIZ_KEY); const o = r ? JSON.parse(r) : null; if (o && typeof o === "object") return { tests: o.tests || {}, mistakes: o.mistakes || {}, seen: o.seen || {} }; } catch (e) {} return { tests: {}, mistakes: {}, seen: {} }; }
function saveQuizStore(o) { try { localStorage.setItem(QUIZ_KEY, JSON.stringify(o)); } catch (e) { /* storage unavailable — stays in session */ } }

/* Additional questions — each grounded in clinical content already in Klario
   (terminology, observations, safe SSA actions, hygiene, documentation…). */
const NEW_QS = [
  // observationer
  { qid: "n-obs-1", catId: "observationer", q: "Hvad betyder cyanose?", type: "mc", opts: ["Blålig hud/læber pga. iltmangel", "Hævelse pga. væske i vævet", "Feber"], correct: [0], why: "Cyanose = blålig misfarvning pga. iltmangel og er et advarselstegn.", tag: "Terminologi" },
  { qid: "n-obs-2", catId: "observationer", q: "En borger bliver pludselig konfus og utilpas. Hvad er den mest relevante SSA-handling?", type: "mc", opts: ["Observere og videregive til ansvarlig", "Vente til næste dag", "Ignorere det"], correct: [0], why: "Ændringer i tilstand observeres og videregives til ansvarlig.", tag: "Handling" },
  { qid: "n-obs-3", catId: "observationer", q: "Hvad er formålet med systematisk observation?", type: "mc", opts: ["At opdage ændringer i borgerens tilstand tidligt", "At spare tid", "At undgå dokumentation"], correct: [0], why: "Systematisk observation opdager ændringer tidligt.", tag: "Faglig" },
  { qid: "n-obs-4", catId: "observationer", q: "Ændringer i bevidsthedsniveau bør altid videregives.", type: "tf", opts: [T, F], correct: [0], why: "Ændret bevidsthed kan være alvorligt og skal videregives.", tag: "Handling" },
  // hygiejne
  { qid: "n-hyg-1", catId: "hygiejne", q: "Hvornår er håndhygiejne særligt vigtigt?", type: "mc", opts: ["Før og efter borgerkontakt", "Kun ved synligt snavs", "Kun om morgenen"], correct: [0], why: "Håndhygiejne før og efter borgerkontakt bryder smittekæden.", tag: "Hygiejne" },
  { qid: "n-hyg-2", catId: "hygiejne", q: "Hvad er formålet med værnemidler?", type: "mc", opts: ["At beskytte borger og personale mod smitte", "At se professionel ud", "At spare håndsprit"], correct: [0], why: "Værnemidler beskytter mod smitte begge veje.", tag: "Hygiejne" },
  { qid: "n-hyg-3", catId: "hygiejne", q: "God håndhygiejne bryder smittekæden.", type: "tf", opts: [T, F], correct: [0], why: "Håndhygiejne er den vigtigste enkeltstående forebyggelse.", tag: "Hygiejne" },
  { qid: "n-hyg-4", catId: "hygiejne", q: "Hvad menes med ren og uren arbejdsgang?", type: "mc", opts: ["At adskille rene og urene opgaver for at undgå smittespredning", "At vaske gulv til sidst", "At bruge handsker hele tiden"], correct: [0], why: "Adskillelse af rent og urent forebygger smittespredning.", tag: "Hygiejne" },
  // saarpleje
  { qid: "n-saar-1", catId: "saarpleje", q: "Hvad observerer du ved et sår?", type: "multi", opts: ["Rødme", "Hævelse og varme", "Sekret og smerte", "Borgerens yndlingsfarve"], correct: [0, 1, 2], why: "Rødme, varme, hævelse, sekret og smerte er relevante observationer.", tag: "Observation" },
  { qid: "n-saar-2", catId: "saarpleje", q: "Hvad kan være tegn på infektion i et sår?", type: "mc", opts: ["Øget rødme, varme, hævelse og pus", "Tør, lys hud", "Normal temperatur"], correct: [0], why: "Tiltagende rødme/varme/hævelse og pus kan tyde på infektion.", tag: "Observation" },
  { qid: "n-saar-3", catId: "saarpleje", q: "Hvad er et tryksår?", type: "mc", opts: ["Vævsskade pga. vedvarende tryk", "Et rent kirurgisk sår", "En hudinfektion fra bakterier"], correct: [0], why: "Tryksår opstår ved vedvarende tryk mod vævet.", tag: "Terminologi" },
  { qid: "n-saar-4", catId: "saarpleje", q: "Regelmæssig lejringsskift kan forebygge tryksår.", type: "tf", opts: [T, F], correct: [0], why: "Skift af stilling aflaster udsatte steder og forebygger tryksår.", tag: "Handling" },
  // mikrobiologi
  { qid: "n-mik-1", catId: "mikrobiologi", q: "Hvad er en central forskel på bakterier og virus?", type: "mc", opts: ["Antibiotika virker mod bakterier, ikke mod virus", "De er helt ens", "Virus er altid størst"], correct: [0], why: "Antibiotika virker mod bakterier — ikke mod virus.", tag: "Faglig" },
  { qid: "n-mik-2", catId: "mikrobiologi", q: "Hvad er den hyppigste smittevej?", type: "mc", opts: ["Kontaktsmitte via hænder/flader", "Via lys", "Via tanker"], correct: [0], why: "Kontaktsmitte er hyppigst og brydes med håndhygiejne.", tag: "Faglig" },
  { qid: "n-mik-3", catId: "mikrobiologi", q: "CRP kan stige ved infektion/betændelse.", type: "tf", opts: [T, F], correct: [0], why: "CRP stiger ved infektion og vurderes sammen med symptomer.", tag: "Faglig" },
  // dokumentation
  { qid: "n-dok-1", catId: "dokumentation", q: "Hvad er objektiv dokumentation?", type: "mc", opts: ["Det du kan måle eller observere", "Din personlige mening", "Et gæt om fremtiden"], correct: [0], why: "Objektiv dokumentation bygger på det målbare/observerbare.", tag: "Dokumentation" },
  { qid: "n-dok-2", catId: "dokumentation", q: "Hvad kendetegner subjektiv dokumentation?", type: "mc", opts: ["Det borgeren selv fortæller/oplever", "Dine egne følelser om borgeren", "At det er unødvendigt"], correct: [0], why: "Subjektivt = borgerens egne oplevelser/udsagn.", tag: "Dokumentation" },
  { qid: "n-dok-3", catId: "dokumentation", q: "Dokumentation skal være relevant, saglig og rettidig.", type: "tf", opts: [T, F], correct: [0], why: "God dokumentation er relevant, saglig og skrives rettidigt.", tag: "Dokumentation" },
  // kommunikation
  { qid: "n-kom-1", catId: "kommunikation", q: "Hvad kendetegner professionel kommunikation?", type: "mc", opts: ["Respekt, tydelighed og aktiv lytning", "At tale hurtigt", "At afbryde borgeren"], correct: [0], why: "Respekt, tydelighed og aktiv lytning bærer god kommunikation.", tag: "Kommunikation" },
  { qid: "n-kom-2", catId: "kommunikation", q: "Hvad er aktiv lytning?", type: "mc", opts: ["At lytte opmærksomt og vise forståelse", "At tjekke telefonen imens", "At svare før borgeren er færdig"], correct: [0], why: "Aktiv lytning viser nærvær og forståelse.", tag: "Kommunikation" },
  { qid: "n-kom-3", catId: "kommunikation", q: "Kropssprog er en del af kommunikationen.", type: "tf", opts: [T, F], correct: [0], why: "Nonverbal kommunikation (kropssprog) påvirker budskabet.", tag: "Kommunikation" },
  // akut
  { qid: "n-akut-1", catId: "akut", q: "Ved mistanke om alvorlig, pludselig tilstand — hvad gør du?", type: "mc", opts: ["Ringer 1-1-2 og bliver hos borgeren", "Venter til i morgen", "Giver mad og drikke"], correct: [0], why: "Ring 1-1-2 ved akut alvorlig tilstand og bliv hos borgeren.", tag: "Handling" },
  { qid: "n-akut-2", catId: "akut", q: "Hvad står ABC for i akut sammenhæng?", type: "mc", opts: ["Luftvej, vejrtrækning, kredsløb", "Arm, ben, cirkel", "Altid, bagefter, ciffer"], correct: [0], why: "ABC = luftvej (Airway), vejrtrækning (Breathing), kredsløb (Circulation).", tag: "Faglig" },
  { qid: "n-akut-3", catId: "akut", q: "Ved fund af en bevidstløs borger tilkalder du altid hjælp.", type: "tf", opts: [T, F], correct: [0], why: "Tilkald hjælp med det samme ved bevidstløshed.", tag: "Handling" },
  // ernaering
  { qid: "n-ern-1", catId: "ernaering", q: "Hvad kan være tegn på dehydrering?", type: "mc", opts: ["Tørre slimhinder, mørk urin og træthed", "Klar, rigelig urin", "Vægtøgning over natten"], correct: [0], why: "Tørre slimhinder, mørk urin og træthed kan tyde på væskemangel.", tag: "Observation" },
  { qid: "n-ern-2", catId: "ernaering", q: "Hvad betyder obstipation?", type: "mc", opts: ["Forstoppelse", "Diarré", "Feber"], correct: [0], why: "Obstipation = forstoppelse.", tag: "Terminologi" },
  { qid: "n-ern-3", catId: "ernaering", q: "Tilstrækkeligt væske- og energiindtag er vigtigt for trivsel.", type: "tf", opts: [T, F], correct: [0], why: "Nok væske og energi/protein er centralt for trivsel, især hos ældre.", tag: "Faglig" },
  { qid: "n-ern-4", catId: "ernaering", q: "Hvad er vigtigt ved risiko for underernæring hos ældre?", type: "mc", opts: ["Tidlig opsporing og tilstrækkelig energi/protein", "Faste i flere dage", "Kun at give væske"], correct: [0], why: "Tidlig opsporing og nok energi/protein forebygger underernæring.", tag: "Handling" },
  // demens
  { qid: "n-dem-1", catId: "demens", q: "Hvad er en god tilgang til en person med demens?", type: "mc", opts: ["Rolig, tryg og anerkendende kommunikation", "At rette hver eneste fejl", "At tale hurtigt og højt"], correct: [0], why: "Ro, tryghed og anerkendelse støtter personen med demens.", tag: "Tilgang" },
  { qid: "n-dem-2", catId: "demens", q: "Hvad kan udløse uro hos en person med demens?", type: "mc", opts: ["Utryghed, smerte eller for mange indtryk", "God søvn", "Rolige, kendte omgivelser"], correct: [0], why: "Utryghed, smerte og overstimulering kan give uro.", tag: "Observation" },
  { qid: "n-dem-3", catId: "demens", q: "Genkendelige rutiner kan skabe tryghed ved demens.", type: "tf", opts: [T, F], correct: [0], why: "Faste, kendte rutiner giver tryghed.", tag: "Tilgang" },
  // medicin
  { qid: "n-med-1", catId: "medicin", q: "Hvad hører til de rigtige ved medicingivning?", type: "mc", opts: ["Rigtig borger, medicin, dosis, tid og måde", "Rigtig farve og smag", "Rigtig pris"], correct: [0], why: "De 'rigtige': rigtig borger, medicin, dosis, tidspunkt og administrationsmåde.", tag: "Medicinsikkerhed" },
  { qid: "n-med-2", catId: "medicin", q: "Hvad gør du, hvis en ordination er uklar?", type: "mc", opts: ["Spørger ansvarlig før du giver medicinen", "Gætter dig frem", "Springer over uden at sige det"], correct: [0], why: "Ved tvivl: spørg ansvarlig, før du giver medicinen.", tag: "Medicinsikkerhed" },
  { qid: "n-med-3", catId: "medicin", q: "Du må kun give medicin, du er oplært og delegeret til.", type: "tf", opts: [T, F], correct: [0], why: "Medicinhåndtering kræver oplæring og delegation.", tag: "Ansvar" },
  { qid: "n-med-4", catId: "medicin", q: "Hvad dokumenterer du ved medicingivning?", type: "mc", opts: ["At medicinen er givet, og relevante observationer", "Ingenting", "Kun hvis borgeren spørger"], correct: [0], why: "Givet medicin og relevante observationer dokumenteres.", tag: "Dokumentation" },
  // normalvaerdier
  { qid: "n-nor-1", catId: "normalvaerdier", q: "Normal respirationsfrekvens for en voksen i hvile?", type: "mc", opts: ["12–20 pr. min", "6–8 pr. min", "30–40 pr. min"], correct: [0], why: "Ca. 12–20 pr. minut er normalområdet.", tag: "Faglig" },
  { qid: "n-nor-2", catId: "normalvaerdier", q: "Hvad angiver normalværdier?", type: "mc", opts: ["Vejledende referenceområder", "Præcise grænser der gælder alle ens", "En diagnose"], correct: [0], why: "Normalværdier er vejledende referenceområder.", tag: "Faglig" },
  { qid: "n-nor-3", catId: "normalvaerdier", q: "Normalværdier skal ses i sammenhæng med den enkelte borger.", type: "tf", opts: [T, F], correct: [0], why: "Værdier vurderes altid i forhold til borgerens habituelle tilstand.", tag: "Faglig" },
  // love
  { qid: "n-love-1", catId: "love", q: "Hvad betyder tavshedspligt?", type: "mc", opts: ["Pligt til ikke at videregive fortrolige oplysninger uberettiget", "At tie stille ved møder", "At undgå at dokumentere"], correct: [0], why: "Tavshedspligt beskytter borgerens fortrolige oplysninger.", tag: "Jura" },
  { qid: "n-love-2", catId: "love", q: "Hvad betyder samtykke i pleje?", type: "mc", opts: ["Borgerens accept af hjælp/behandling", "Personalets beslutning alene", "En type journal"], correct: [0], why: "Samtykke = borgerens accept; selvbestemmelse skal respekteres.", tag: "Jura" },
  { qid: "n-love-3", catId: "love", q: "Borgerens selvbestemmelse er en vigtig ret.", type: "tf", opts: [T, F], correct: [0], why: "Selvbestemmelse er en central rettighed.", tag: "Jura" },
  // psykiatri
  { qid: "n-psy-1", catId: "psykiatri", q: "Hvad er en god tilgang ved psykisk sygdom?", type: "mc", opts: ["Respekt, tryghed og ikke-dømmende kontakt", "At bagatellisere problemerne", "At undgå kontakt"], correct: [0], why: "Respekt, tryghed og en ikke-dømmende tilgang støtter borgeren.", tag: "Tilgang" },
  { qid: "n-psy-2", catId: "psykiatri", q: "Recovery-tilgangen fokuserer på håb og den enkeltes ressourcer.", type: "tf", opts: [T, F], correct: [0], why: "Recovery bygger på håb, ressourcer og medbestemmelse.", tag: "Faglig" },
  // vaerktoejer
  { qid: "n-vae-1", catId: "vaerktoejer", q: "Hvad bruges scoringsredskaber og tjeklister til?", type: "mc", opts: ["Systematisk vurdering og ensartet praksis", "Pynt i journalen", "At undgå dokumentation"], correct: [0], why: "Redskaber giver systematik og ensartethed.", tag: "Faglig" },
  { qid: "n-vae-2", catId: "vaerktoejer", q: "Tjeklister kan understøtte patientsikkerheden.", type: "tf", opts: [T, F], correct: [0], why: "Tjeklister reducerer fejl og øger sikkerhed.", tag: "Faglig" },
  // diagnoser
  { qid: "n-diag-1", catId: "diagnoser", q: "Hvad er vigtigt ved diabetes?", type: "mc", opts: ["Observation af blodsukker og tegn på højt/lavt blodsukker", "Kun at måle vægt", "At undgå observation"], correct: [0], why: "Observation af blodsukker og symptomer er centralt ved diabetes.", tag: "Observation" },
  { qid: "n-diag-2", catId: "diagnoser", q: "Ved lavt blodsukker kan hurtige kulhydrater være relevant.", type: "tf", opts: [T, F], correct: [0], why: "Ved lavt blodsukker gives typisk hurtige kulhydrater — følg lokale instrukser.", tag: "Handling" },
  { qid: "n-anat-1", catId: "anatomi", q: "Hvad hedder nyre på latin?", type: "mc", opts: ["Ren", "Cor", "Hepar", "Pulmo"], correct: [0], why: "Nyre = Ren (flertal Renes).", tag: "Latin" },
  { qid: "n-anat-2", catId: "anatomi", q: "Hvad hedder hjerte på latin?", type: "mc", opts: ["Cor", "Ren", "Hepar"], correct: [0], why: "Hjerte = Cor.", tag: "Latin" },
  { qid: "n-anat-3", catId: "anatomi", q: "Hvad hedder lever på latin?", type: "mc", opts: ["Hepar", "Lien", "Ren"], correct: [0], why: "Lever = Hepar.", tag: "Latin" },
  { qid: "n-anat-4", catId: "anatomi", q: "Hvilket organsystem hører nyrerne til?", type: "mc", opts: ["Urinvejssystemet", "Kredsløbssystemet", "Nervesystemet"], correct: [0], why: "Nyrerne er en del af urinvejssystemet.", tag: "Systemer" },
  { qid: "n-anat-5", catId: "anatomi", q: "Hvad betyder retningsbegrebet 'distal'?", type: "mc", opts: ["Længere væk fra kroppens centrum", "Tættere på midtlinjen", "Foran på kroppen"], correct: [0], why: "Distal = længere væk fra kroppens centrum (fx håndled distalt for albue).", tag: "Retning" },
  { qid: "n-anat-6", catId: "anatomi", q: "Hvad betyder 'proksimal'?", type: "mc", opts: ["Nærmere kroppens centrum", "Længere væk fra kroppen", "Bagpå kroppen"], correct: [0], why: "Proksimal = nærmere kroppens centrum.", tag: "Retning" },
  { qid: "n-anat-7", catId: "anatomi", q: "Hvad er den faglige betegnelse for 'balle'?", type: "mc", opts: ["Glutealregion", "Thorax", "Cubitus"], correct: [0], why: "Balle = glutealregion (Regio glutealis).", tag: "Region" },
  { qid: "n-anat-8", catId: "anatomi", q: "Hvad hedder selve lårBENET (knoglen)?", type: "mc", opts: ["Femur (os femoris)", "Regio femoris", "Patella"], correct: [0], why: "Lårbenet er femur. Regio femoris er lårREGIONEN — ikke knoglen.", tag: "Knogle" },
  { qid: "n-anat-9", catId: "anatomi", q: "Hvad hedder lungerne på latin?", type: "mc", opts: ["Pulmones", "Renes", "Costae"], correct: [0], why: "Lunger = Pulmones (ental Pulmo).", tag: "Latin" },
  { qid: "n-anat-10", catId: "anatomi", q: "Hvor ligger hjertet?", type: "mc", opts: ["I brysthulen (thorax)", "I bughulen", "I bækkenet"], correct: [0], why: "Hjertet ligger i thorax, lidt til venstre.", tag: "Placering" },
  { qid: "n-anat-11", catId: "anatomi", q: "Hvilket organ danner insulin?", type: "mc", opts: ["Bugspytkirtlen (pancreas)", "Leveren", "Milten"], correct: [0], why: "Insulin dannes i bugspytkirtlen (pancreas).", tag: "Fysiologi" },
  { qid: "n-anat-12", catId: "anatomi", q: "Hvad betyder 'anterior'?", type: "mc", opts: ["Foran på kroppen", "Bagpå kroppen", "Nedad"], correct: [0], why: "Anterior = foran.", tag: "Retning" },
  { qid: "n-anat-13", catId: "anatomi", q: "Hvad hedder knæskallen?", type: "mc", opts: ["Patella", "Femur", "Tibia"], correct: [0], why: "Knæskal = patella.", tag: "Knogle" },
  { qid: "n-anat-14", catId: "anatomi", q: "Hvad er alveoler?", type: "mc", opts: ["Lungeblærer hvor gasudveksling sker", "Hjertets kamre", "Strukturer i nyren"], correct: [0], why: "Alveoler (Alveoli pulmonis) er lungeblærer, hvor ilt/CO₂ udveksles.", tag: "Indre anatomi" },
  { qid: "n-anat-15", catId: "anatomi", q: "Skinnebenet hedder tibia.", type: "tf", opts: [T, F], correct: [0], why: "Skinneben = tibia; lægben = fibula.", tag: "Knogle" },
  { qid: "n-anat-16", catId: "anatomi", q: "Milten hører til lymfe- og immunsystemet.", type: "tf", opts: [T, F], correct: [0], why: "Milten (Lien) indgår i lymfe- og immunsystemet.", tag: "Systemer" },
  { qid: "n-anat-17", catId: "anatomi", q: "Hvad er kredsløbssystemets hovedopgave?", type: "mc", opts: ["At transportere blod med ilt og næring", "At nedbryde mad", "At danne urin"], correct: [0], why: "Kredsløbet transporterer blod, ilt, næring og affaldsstoffer.", tag: "Systemer" },
  { qid: "n-anat-18", catId: "anatomi", q: "Hvad hedder mavesækken på latin?", type: "mc", opts: ["Ventriculus (Gaster)", "Rectum", "Hepar"], correct: [0], why: "Mavesæk = Ventriculus (også Gaster).", tag: "Latin" },
  { qid: "n-anat-19", catId: "anatomi", q: "Hvilke af disse er anatomiske retningsbegreber? (vælg alle korrekte)", type: "multi", opts: ["Medial", "Lateral", "Proksimal", "Thorax"], correct: [0, 1, 2], why: "Medial, lateral og proksimal er retningsbegreber; thorax er en region.", tag: "Retning" },
  { qid: "n-anat-20", catId: "anatomi", q: "Hvad hedder nyrebarken på latin?", type: "mc", opts: ["Cortex renalis", "Medulla renalis", "Pelvis renalis"], correct: [0], why: "Nyrebark = Cortex renalis; nyremarv = Medulla renalis.", tag: "Indre anatomi" },
  { qid: "n-farm-1", catId: "farmakologi", q: "Hvad betyder farmakokinetik?", type: "mc", opts: ["Hvad kroppen gør ved lægemidlet", "Hvad lægemidlet gør ved kroppen", "Læren om kirurgi"], correct: [0], why: "Farmakokinetik = hvad kroppen gør ved lægemidlet (ADME).", tag: "Begreb" },
  { qid: "n-farm-2", catId: "farmakologi", q: "Hvad betyder farmakodynamik?", type: "mc", opts: ["Hvad lægemidlet gør ved kroppen", "Hvad kroppen gør ved lægemidlet", "Hvordan man beregner dosis"], correct: [0], why: "Farmakodynamik = hvad lægemidlet gør ved kroppen.", tag: "Begreb" },
  { qid: "n-farm-3", catId: "farmakologi", q: "Hvad står A'et for i ADME?", type: "mc", opts: ["Absorption", "Analyse", "Administration"], correct: [0], why: "ADME = Absorption, Distribution, Metabolisme, Ekskretion.", tag: "ADME" },
  { qid: "n-farm-4", catId: "farmakologi", q: "Hvilken rækkefølge beskriver ADME?", type: "mc", opts: ["Absorption → Distribution → Metabolisme → Ekskretion", "Metabolisme → Absorption → Ekskretion → Distribution", "Distribution → Ekskretion → Absorption → Metabolisme"], correct: [0], why: "ADME følger: Absorption, Distribution, Metabolisme, Ekskretion.", tag: "ADME" },
  { qid: "n-farm-5", catId: "farmakologi", q: "I hvilket organ sker metabolismen af lægemidler især?", type: "mc", opts: ["Leveren", "Milten", "Lungerne"], correct: [0], why: "Metabolisme sker især i leveren.", tag: "Organer" },
  { qid: "n-farm-6", catId: "farmakologi", q: "Hvilket organ udskiller især lægemidler med urinen?", type: "mc", opts: ["Nyrerne", "Leveren", "Hjertet"], correct: [0], why: "Nyrerne udskiller mange lægemidler via urinen.", tag: "Organer" },
  { qid: "n-farm-7", catId: "farmakologi", q: "Hvad er en receptor?", type: "mc", opts: ["Et sted på/i en celle, hvor et lægemiddel kan binde og påvirke cellen", "En type tablet", "Et måleapparat"], correct: [0], why: "En receptor er et bindingssted på/i cellen.", tag: "Farmakodynamik" },
  { qid: "n-farm-8", catId: "farmakologi", q: "Hvad gør en agonist?", type: "mc", opts: ["Binder til receptoren og udløser en virkning", "Blokerer receptoren", "Nedbryder lægemidlet"], correct: [0], why: "En agonist aktiverer receptoren.", tag: "Farmakodynamik" },
  { qid: "n-farm-9", catId: "farmakologi", q: "Hvad gør en antagonist?", type: "mc", opts: ["Binder til receptoren og blokerer virkningen", "Aktiverer receptoren", "Øger dosis"], correct: [0], why: "En antagonist blokerer receptoren.", tag: "Farmakodynamik" },
  { qid: "n-farm-10", catId: "farmakologi", q: "Hvad er halveringstid (T½)?", type: "mc", opts: ["Tiden, før koncentrationen er faldet til omtrent det halve", "Halvdelen af en tablet", "Tiden før virkningen starter"], correct: [0], why: "T½ = tid til koncentrationen er halveret.", tag: "Tid" },
  { qid: "n-farm-11", catId: "farmakologi", q: "Hvad er biotilgængelighed?", type: "mc", opts: ["Den andel af en dosis, der når blodbanen uændret", "Antallet af tabletter", "Lægemidlets pris"], correct: [0], why: "Biotilgængelighed = andel af dosis der når systemisk kredsløb uændret.", tag: "Begreb" },
  { qid: "n-farm-12", catId: "farmakologi", q: "Hvilken administrationsvej har fuld (100 %) biotilgængelighed?", type: "mc", opts: ["Intravenøs (IV)", "Oral", "Transdermal"], correct: [0], why: "IV gives direkte i blodet og skal ikke absorberes.", tag: "Administration" },
  { qid: "n-farm-13", catId: "farmakologi", q: "Hvad er first-pass metabolisme?", type: "mc", opts: ["At et oralt lægemiddel delvist omdannes i leveren, før det når blodbanen", "At lægemidlet virker med det samme", "At man tager første dosis"], correct: [0], why: "Blodet fra tarmen passerer leveren først (first-pass).", tag: "Kinetik" },
  { qid: "n-farm-14", catId: "farmakologi", q: "Alle tabletter må knuses.", type: "tf", opts: [T, F], correct: [1], why: "Nej. Fx depot- og enterotabletter må ofte ikke knuses. Kontrollér altid det konkrete præparat.", tag: "Sikkerhed" },
  { qid: "n-farm-15", catId: "farmakologi", q: "En depottablet frigiver lægemidlet langsomt over tid.", type: "tf", opts: [T, F], correct: [0], why: "Depottabletter afgiver stoffet gradvist — derfor må de typisk ikke knuses.", tag: "Former" },
  { qid: "n-farm-16", catId: "farmakologi", q: "En enterotablet er lavet til at gå i opløsning i mavesækken.", type: "tf", opts: [T, F], correct: [1], why: "Nej — enterotabletter går først i opløsning i tarmen.", tag: "Former" },
  { qid: "n-farm-17", catId: "farmakologi", q: "Konkrete interaktioner mellem to lægemidler kan man trygt gætte sig til.", type: "tf", opts: [T, F], correct: [1], why: "Nej — interaktioner skal altid slås op i en godkendt kilde.", tag: "Sikkerhed" },
  { qid: "n-farm-18", catId: "farmakologi", q: "Hvad er en kontraindikation?", type: "mc", opts: ["En tilstand, hvor et lægemiddel ikke bør gives", "En ønsket virkning", "En type dosis"], correct: [0], why: "Kontraindikation = hvor lægemidlet ikke bør bruges.", tag: "Begreb" },
  { qid: "n-farm-19", catId: "farmakologi", q: "Hvad betyder polyfarmaci?", type: "mc", opts: ["Brug af mange lægemidler samtidig", "En stærk tablet", "En bestemt receptor"], correct: [0], why: "Polyfarmaci = mange lægemidler samtidig; øger interaktionsrisiko.", tag: "Ældre" },
  { qid: "n-farm-20", catId: "farmakologi", q: "Hvorfor kan ældre reagere anderledes på medicin?", type: "multi", opts: ["Nedsat nyrefunktion", "Ændret kropssammensætning", "Polyfarmaci", "De har flere receptorer af natur"], correct: [0, 1, 2], why: "Nyrer/lever, kropssammensætning og polyfarmaci spiller ind.", tag: "Ældre" },
  { qid: "n-farm-21", catId: "farmakologi", q: "Nedsat nyrefunktion kan give langsommere udskillelse af visse lægemidler.", type: "tf", opts: [T, F], correct: [0], why: "Ja — det kan give risiko for ophobning.", tag: "Nyrer" },
  { qid: "n-farm-22", catId: "farmakologi", q: "Hvad gør du ved tvivl om en medicinadministration?", type: "mc", opts: ["Stopper op, spørger ansvarlig og følger lokale instrukser", "Giver bare medicinen", "Springer den over uden at sige det"], correct: [0], why: "Ved tvivl: giv ikke — spørg og følg instrukser/delegation.", tag: "Sikkerhed" },
  { qid: "n-farm-23", catId: "farmakologi", q: "Hvilke hører til 'de rigtige' i medicinsikkerhed?", type: "multi", opts: ["Korrekt borger", "Korrekt dosis", "Korrekt administrationsvej", "Korrekt farve på æsken"], correct: [0, 1, 2], why: "Rigtig borger, lægemiddel, dosis, tidspunkt og administrationsvej.", tag: "Sikkerhed" },
  { qid: "n-farm-24", catId: "farmakologi", q: "Hvad er steady state?", type: "mc", opts: ["Når tilførsel og udskillelse ved gentagen dosering er nogenlunde i balance", "Når tabletten er halveret", "Første gang man tager medicinen"], correct: [0], why: "Steady state nås typisk efter ca. 4-5 halveringstider.", tag: "Tid" },
  { qid: "n-farm-25", catId: "farmakologi", q: "Hvad er en bivirkning?", type: "mc", opts: ["En uønsket virkning ud over den ønskede", "Den ønskede virkning", "En dosisberegning"], correct: [0], why: "Bivirkning = uønsket virkning.", tag: "Begreb" },
  { qid: "n-farm-26", catId: "farmakologi", q: "Sublingual administration betyder, at lægemidlet lægges...", type: "mc", opts: ["Under tungen", "I øret", "På huden"], correct: [0], why: "Sublingual = under tungen.", tag: "Administration" },
  { qid: "n-farm-27", catId: "farmakologi", q: "Hvor optages de fleste orale tabletter?", type: "mc", opts: ["I tarmen", "I munden", "I nyrerne"], correct: [0], why: "Tyndtarmens store overflade er hovedstedet for absorption.", tag: "Vej" },
  { qid: "n-farm-28", catId: "farmakologi", q: "Furosemid er et loop-diuretikum, der øger udskillelsen af vand.", type: "tf", opts: [T, F], correct: [0], why: "Ja — loop-diuretika øger udskillelsen af salt og vand (øget diurese). Konkret brug følger ordination.", tag: "Eksempel" },
  { qid: "n-hl-1", catId: "halveringstid", q: "Hvad er halveringstid (T½)?", type: "mc", opts: ["Tiden før koncentrationen er faldet til omtrent det halve", "Halvdelen af en tablet", "Tiden før virkningen starter"], correct: [0], why: "T½ = tiden, før lægemiddelkoncentrationen er halveret.", tag: "Begreb" },
  { qid: "n-hl-2", catId: "halveringstid", q: "Et lægemiddel har T½ på 4 timer. Hvor meget er cirka tilbage efter 8 timer?", type: "mc", opts: ["25 %", "50 %", "75 %"], correct: [0], why: "8 timer = 2 halveringstider: 100 % → 50 % → 25 %.", tag: "Beregning" },
  { qid: "n-hl-3", catId: "halveringstid", q: "Et lægemiddel har T½ på 6 timer. Hvor meget er cirka tilbage efter 6 timer?", type: "mc", opts: ["50 %", "25 %", "0 %"], correct: [0], why: "Efter én halveringstid er ca. 50 % tilbage.", tag: "Beregning" },
  { qid: "n-hl-4", catId: "halveringstid", q: "Hvor meget er cirka udskilt efter ca. 5 halveringstider (forenklet model)?", type: "mc", opts: ["Ca. 97 %", "Ca. 50 %", "Ca. 25 %"], correct: [0], why: "Efter 5 halveringstider er ca. 96,875 % udskilt — en tommelfingerregel, ikke en universel klinisk regel.", tag: "Beregning" },
  { qid: "n-hl-5", catId: "halveringstid", q: "Efter 3 halveringstider er der cirka 12,5 % tilbage.", type: "tf", opts: [T, F], correct: [0], why: "100 → 50 → 25 → 12,5 %.", tag: "Beregning" },
  { qid: "n-hl-6", catId: "halveringstid", q: "Et lægemiddel med lang halveringstid bliver længere i kroppen end et med kort.", type: "tf", opts: [T, F], correct: [0], why: "Ja — lang T½ betyder langsommere fald i koncentration.", tag: "Begreb" },
  { qid: "n-hl-7", catId: "halveringstid", q: "Nedsat nyre- eller leverfunktion kan forlænge halveringstiden.", type: "tf", opts: [T, F], correct: [0], why: "Ja — langsommere elimination forlænger T½ og øger risiko for ophobning.", tag: "Organer" },
  { qid: "n-hl-8", catId: "halveringstid", q: "Hvad kan ske, hvis en ny dosis gives, før den forrige er elimineret?", type: "mc", opts: ["Lægemidlet kan ophobes i kroppen", "Lægemidlet forsvinder hurtigere", "Halveringstiden bliver kortere"], correct: [0], why: "Gentagen dosering før fuld elimination kan give ophobning.", tag: "Ophobning" },
  { qid: "n-hl-9", catId: "halveringstid", q: "Hvornår nås steady state typisk ved gentagen dosering?", type: "mc", opts: ["Efter ca. 4–5 halveringstider", "Efter én dosis", "Efter 24 timer uanset lægemiddel"], correct: [0], why: "Steady state nås typisk efter ca. 4–5 halveringstider.", tag: "Steady state" },
  { qid: "n-hl-10", catId: "halveringstid", q: "Halveringstid og virkningsvarighed er præcis det samme.", type: "tf", opts: [T, F], correct: [1], why: "Nej. Virkningsvarighed afhænger også af dosis, bindingsstyrke m.m. — ikke kun af T½.", tag: "Begreb" },
  { qid: "n-hl-11", catId: "halveringstid", q: "Hvad beskriver 'elimination' bedst?", type: "mc", opts: ["Den samlede fjernelse af lægemidlet (metabolisme + udskillelse)", "Kun optagelsen i tarmen", "Kun bindingen til receptoren"], correct: [0], why: "Elimination = metabolisme + udskillelse.", tag: "Begreb" },
  { qid: "n-hl-12", catId: "halveringstid", q: "Hvorfor kan ældre kræve ekstra opmærksomhed i forhold til halveringstid?", type: "multi", opts: ["Nedsat nyrefunktion", "Nedsat leverfunktion", "Polyfarmaci", "De har altid kortere T½"], correct: [0, 1, 2], why: "Nedsat organfunktion og polyfarmaci kan forlænge T½ og øge risiko for ophobning.", tag: "Ældre" },
  { qid: "n-hl-13", catId: "halveringstid", q: "Et lægemiddel har T½ 2 timer. Hvor meget er cirka tilbage efter 6 timer?", type: "mc", opts: ["12,5 %", "25 %", "50 %"], correct: [0], why: "6 timer = 3 halveringstider: 50 → 25 → 12,5 %.", tag: "Beregning" },
  { qid: "n-hl-14", catId: "halveringstid", q: "Formlen for resten af et lægemiddel er 0,5 opløftet i (tid ÷ halveringstid).", type: "tf", opts: [T, F], correct: [0], why: "Ja — remaining fraction = 0,5^(tid/T½) i den forenklede model.", tag: "Beregning" },
  { qid: "n-hl-15", catId: "halveringstid", q: "Lang halveringstid betyder, at steady state nås hurtigere.", type: "tf", opts: [T, F], correct: [1], why: "Nej — jo længere T½, jo længere tid tager det at nå steady state.", tag: "Steady state" },
  { qid: "n-hl-16", catId: "halveringstid", q: "Hvad er en relevant SSA-observation, når et lægemiddel kan ophobes?", type: "mc", opts: ["Tegn på øget virkning eller bivirkninger", "Tablettens farve", "Æskens udløbsdato alene"], correct: [0], why: "Ved ophobning kan virkning/bivirkninger tiltage — observér og videregiv efter lokale instrukser.", tag: "Observation" },
  { qid: "n-hl-17", catId: "halveringstid", q: "Hvor finder du en verificeret halveringstid for et konkret lægemiddel?", type: "mc", opts: ["I en godkendt kilde som pro.medicin.dk", "Ved at gætte ud fra tabletstørrelsen", "Det er altid 24 timer"], correct: [0], why: "Lægemiddelspecifikke værdier slås op i en godkendt kilde.", tag: "Sikkerhed" },
  { qid: "n-hl-18", catId: "halveringstid", q: "Halveringstid-beregneren i Klario kan bruges til at bestemme en borgers dosis.", type: "tf", opts: [T, F], correct: [1], why: "Nej — beregneren er et læringsværktøj og må ikke bruges til patientspecifikke beslutninger.", tag: "Sikkerhed" },
  { qid: "n-hl-19", catId: "halveringstid", q: "Et lægemiddel har T½ 8 timer. Hvor mange timer går der cirka, før ca. 75 % er udskilt?", type: "mc", opts: ["16 timer", "8 timer", "4 timer"], correct: [0], why: "75 % udskilt = 25 % tilbage = 2 halveringstider = 16 timer.", tag: "Beregning" },
  { qid: "n-hl-20", catId: "halveringstid", q: "Hvilke faktorer kan påvirke et lægemiddels halveringstid?", type: "multi", opts: ["Nyrefunktion", "Leverfunktion", "Alder", "Ugedagen"], correct: [0, 1, 2], why: "Nyre- og leverfunktion samt alder kan påvirke T½.", tag: "Organer" },
  { qid: "n-hl-21", catId: "halveringstid", q: "Efter 4 halveringstider er der cirka 6,25 % tilbage.", type: "tf", opts: [T, F], correct: [0], why: "100 → 50 → 25 → 12,5 → 6,25 %.", tag: "Beregning" },
  { qid: "n-hl-22", catId: "halveringstid", q: "Hvad er den sikreste handling, hvis du er i tvivl om et lægemiddels virkning eller ophobning hos en borger?", type: "mc", opts: ["Observér og videregiv efter lokale instrukser/delegation", "Giv en ekstra dosis", "Vent en uge og se"], correct: [0], why: "Ved tvivl: observér og følg lokale instrukser/delegation.", tag: "Observation" },
  // injektioner
  {"qid": "inj-an1", "catId": "injektion", "q": "I hvilket lag gives en subkutan injektion?", "type": "mc", "opts": ["Underhuden (fedtlaget)", "Musklen", "Venen", "Læderhuden (dermis)"], "correct": [0], "why": "Subkutant = i fedtlaget under huden, over musklen.", "tag": "Anatomi"},
  {"qid": "inj-an2", "catId": "injektion", "q": "Hvilken injektion gives i selve huden (dermis) og danner en kvaddel?", "type": "mc", "opts": ["Intradermal (ID)", "Subkutan (SC)", "Intramuskulær (IM)", "Intravenøs (IV)"], "correct": [0], "why": "Intradermal gives i dermis og danner en synlig kvaddel/blære.", "tag": "Anatomi"},
  {"qid": "inj-an3", "catId": "injektion", "q": "Hvilket injektionssted bruges til de fleste vacciner til voksne?", "type": "mc", "opts": ["Deltoideus (overarm)", "Maveskindet", "Volar underarm", "Håndryggen"], "correct": [0], "why": "Vacciner til voksne gives typisk intramuskulært i deltoideus.", "tag": "Anatomi"},
  {"qid": "inj-an4", "catId": "injektion", "q": "Hvilket muskelsted anbefales til intramuskulær injektion hos spædbørn 0–12 mdr.?", "type": "mc", "opts": ["Vastus lateralis (låret)", "Deltoideus", "Ventrogluteus", "Ballen midt"], "correct": [0], "why": "Hos spædbørn bruges vastus lateralis pga. større muskelmasse der.", "tag": "Anatomi"},
  {"qid": "inj-an5", "catId": "injektion", "q": "Hvor gives en intradermal test (fx Mantoux) typisk?", "type": "mc", "opts": ["Indersiden af underarmen (volart)", "Ballen", "Maven", "Låret"], "correct": [0], "why": "Volar underarm bruges, fordi huden er tynd og reaktionen let kan aflæses.", "tag": "Anatomi"},
  {"qid": "inj-an6", "catId": "injektion", "q": "Rækkefølgen af lagene fra overfladen er:", "type": "mc", "opts": ["Hud → underhud (fedt) → muskel", "Muskel → hud → fedt", "Fedt → muskel → hud", "Vene → hud → muskel"], "correct": [0], "why": "Udefra: hud (epidermis+dermis) → subkutant fedt → muskel.", "tag": "Anatomi"},
  {"qid": "inj-ad1", "catId": "injektion", "q": "Hvilken vinkel bruges typisk ved intramuskulær injektion?", "type": "mc", "opts": ["90°", "15°", "45°", "5°"], "correct": [0], "why": "IM gives i 90° for at nå ind i musklen.", "tag": "Administration"},
  {"qid": "inj-ad2", "catId": "injektion", "q": "Hvilken vinkel passer til en intradermal injektion?", "type": "mc", "opts": ["10–15°", "45°", "90°", "60°"], "correct": [0], "why": "ID lægges næsten fladt (10–15°), så spidsen bliver i dermis.", "tag": "Administration"},
  {"qid": "inj-ad3", "catId": "injektion", "q": "Hvilken vinkel kan bruges ved subkutan injektion?", "type": "mc", "opts": ["45° eller 90° afhængigt af kanyle og fedtlag", "Altid 10°", "Altid 15°", "Altid i venen"], "correct": [0], "why": "SC gives typisk i 45° (lang kanyle/tynd person) eller 90° (kort kanyle).", "tag": "Administration"},
  {"qid": "inj-ad4", "catId": "injektion", "q": "Hvilken injektionsvej giver den hurtigste virkning?", "type": "mc", "opts": ["Intravenøs (IV)", "Subkutan (SC)", "Intradermal (ID)", "Intramuskulær (IM)"], "correct": [0], "why": "IV går direkte i blodbanen og virker hurtigst.", "tag": "Administration"},
  {"qid": "inj-ad5", "catId": "injektion", "q": "Må man bruge samme vinkel, kanyle og aspirationsregel til alle injektionstyper?", "type": "tf", "opts": ["Sandt", "Falsk"], "correct": [1], "why": "Nej — vinkel, kanyle og aspiration er procedurespecifikke og afhænger også af lægemiddel og lokal instruks.", "tag": "Administration"},
  {"qid": "inj-ad6", "catId": "injektion", "q": "Et lægemiddel skal optages langsomt og jævnt. Hvilken vej passer bedst?", "type": "mc", "opts": ["Subkutan", "Intravenøs", "Intradermal", "Altid intramuskulær"], "correct": [0], "why": "SC giver langsom, jævn optagelse — fx insulin og heparin.", "tag": "Administration"},
  {"qid": "inj-ad7", "catId": "injektion", "q": "Hvilket lægemiddel gives typisk subkutant?", "type": "mc", "opts": ["Insulin", "I.v.-væske", "Kontraststof", "Tuberkulin"], "correct": [0], "why": "Insulin gives subkutant. Tuberkulin gives intradermalt.", "tag": "Administration"},
  {"qid": "inj-hy1", "catId": "injektion", "q": "Hvad gør du med hænderne før og efter en injektion?", "type": "mc", "opts": ["Udfører håndhygiejne (hånddesinfektion)", "Kun efter", "Kun før", "Ingenting hvis du bruger handsker"], "correct": [0], "why": "Håndhygiejne udføres både før og efter.", "tag": "Hygiejne"},
  {"qid": "inj-hy2", "catId": "injektion", "q": "Ifølge SSI skal huden altid sprittes af før en vaccination.", "type": "tf", "opts": ["Sandt", "Falsk"], "correct": [1], "why": "SSI anbefaler, at huden normalt ikke desinficeres ved vaccination, hvis den er synligt ren. Følg lokal instruks for øvrige lægemidler.", "tag": "Hygiejne"},
  {"qid": "inj-hy3", "catId": "injektion", "q": "Hvornår bør du bruge handsker?", "type": "mc", "opts": ["Ved risiko for kontakt med blod eller sekret", "Aldrig", "Kun ved IV", "Kun ved SC"], "correct": [0], "why": "Handsker bruges ved risiko for blod/sekret — vurder efter opgaven og lokal instruks.", "tag": "Hygiejne"},
  {"qid": "inj-hy4", "catId": "injektion", "q": "Hud-desinfektion før injektion er ens for alle lægemidler og situationer.", "type": "tf", "opts": ["Sandt", "Falsk"], "correct": [1], "why": "Nej — praksis afhænger af lægemiddel, situation og lokal instruks.", "tag": "Hygiejne"},
  {"qid": "inj-hy5", "catId": "injektion", "q": "Hvad er vigtigst for at forebygge infektion ved injektion?", "type": "mc", "opts": ["God håndhygiejne og ren teknik", "At arbejde hurtigt", "At genbruge kanylen", "At springe dokumentation over"], "correct": [0], "why": "Håndhygiejne og ren/aseptisk teknik forebygger infektion.", "tag": "Hygiejne"},
  {"qid": "inj-ko1", "catId": "injektion", "q": "Hvad er lipohypertrofi?", "type": "mc", "opts": ["Fortykket væv ved gentagne injektioner samme sted", "En allergisk reaktion", "En blodprop", "En nerveskade"], "correct": [0], "why": "Gentagne injektioner samme sted (fx insulin) kan give lipohypertrofi → rotér sted.", "tag": "Komplikationer"},
  {"qid": "inj-ko2", "catId": "injektion", "q": "Hvad er ekstravasation ved en intravenøs injektion?", "type": "mc", "opts": ["Lægemidlet løber uden for venen ud i vævet", "En normal virkning", "En allergisk hudreaktion", "At venen skylles igennem"], "correct": [0], "why": "Ekstravasation = lægemiddel uden for venen, kan skade vævet.", "tag": "Komplikationer"},
  {"qid": "inj-ko3", "catId": "injektion", "q": "Hvorfor er korrekte landemærker vigtige ved intramuskulær injektion?", "type": "mc", "opts": ["For at undgå at ramme nerver og store kar", "For at det går hurtigere", "For at spare kanyler", "Det er ikke vigtigt"], "correct": [0], "why": "Forkert sted kan ramme fx n. radialis eller n. ischiadicus.", "tag": "Komplikationer"},
  {"qid": "inj-ko4", "catId": "injektion", "q": "Hvad kan det betyde, hvis der IKKE dannes en kvaddel ved en intradermal injektion?", "type": "mc", "opts": ["Injektionen er gået for dybt, og resultatet bliver usikkert", "Alt er som det skal være", "Der er givet for lidt luft", "Kanylen var for tynd"], "correct": [0], "why": "Ingen kvaddel tyder på for dyb (subkutan) injektion → usikkert testresultat.", "tag": "Komplikationer"},
  {"qid": "inj-ko5", "catId": "injektion", "q": "Hvilke er mulige komplikationer ved injektion? (vælg alle korrekte)", "type": "multi", "opts": ["Blødning/hæmatom", "Infektion", "Nerveskade ved forkert IM-sted", "Bedre syn"], "correct": [0, 1, 2], "why": "Blødning, infektion og nerveskade er reelle komplikationer; bedre syn er ikke en komplikation.", "tag": "Komplikationer"},
  {"qid": "inj-ko6", "catId": "injektion", "q": "Flebitis er et tegn, man kan se ved:", "type": "mc", "opts": ["Intravenøs injektion (rødme/varme langs venen)", "Intradermal test", "Subkutan insulin", "Peroral medicin"], "correct": [0], "why": "Flebitis (veneirritation) ses ved i.v.-adgang.", "tag": "Komplikationer"},
  {"qid": "inj-pr1", "catId": "injektion", "q": "Intravenøs administration ligger normalt inden for grundlæggende SSA-kompetence.", "type": "tf", "opts": ["Sandt", "Falsk"], "correct": [1], "why": "IV er typisk forbeholdt sygeplejerske/læge og kræver særlig kompetence og delegation.", "tag": "Faglig ansvar"},
  {"qid": "inj-pr2", "catId": "injektion", "q": "Du er i tvivl om en ordination før en injektion. Hvad gør du?", "type": "mc", "opts": ["Stopper og kontakter den ansvarlige fagperson", "Gætter en dosis", "Giver halvdelen", "Venter til i morgen"], "correct": [0], "why": "Ved tvivl: stop og afklar — gæt aldrig.", "tag": "Faglig ansvar"},
  {"qid": "inj-pr3", "catId": "injektion", "q": "Hvad skal være på plads, før du må give en injektion?", "type": "mc", "opts": ["Din kompetence og en gyldig delegation/instruks", "Kun at du har tid", "Kun borgerens ønske", "Kun en kanyle"], "correct": [0], "why": "Du skal kende din kompetence og arbejde efter delegation/instruks.", "tag": "Faglig ansvar"},
  {"qid": "inj-pr4", "catId": "injektion", "q": "Hvem har forrang, hvis Klario og den lokale instruks er uenige?", "type": "mc", "opts": ["Den lokale instruks og ordination", "Klario", "Din kollega", "Ingen af delene"], "correct": [0], "why": "Lokal instruks, ordination og produktresumé har altid forrang.", "tag": "Faglig ansvar"},
  {"qid": "inj-pr5", "catId": "injektion", "q": "Hvad gør du ved et stikuheld med en brugt kanyle?", "type": "mc", "opts": ["Følger arbejdsstedets stikuheldsinstruks straks", "Venter og ser tiden an", "Skjuler det", "Sætter hætten på og fortsætter"], "correct": [0], "why": "Stikuheld håndteres straks efter lokal stikuheldsinstruks.", "tag": "Faglig ansvar"},
  {"qid": "inj-ps1", "catId": "injektion", "q": "Hvad hører med til de rigtige kontroller før medicin/injektion? (vælg alle korrekte)", "type": "multi", "opts": ["Rigtig borger", "Rigtigt lægemiddel", "Rigtig dosis", "Rigtig farve på kanylen"], "correct": [0, 1, 2], "why": "Rigtig borger, lægemiddel, dosis, vej, tidspunkt og dokumentation — ikke kanylens farve.", "tag": "Patientsikkerhed"},
  {"qid": "inj-ps2", "catId": "injektion", "q": "Hvordan bekræfter du borgerens identitet før en injektion?", "type": "mc", "opts": ["Med to identifikatorer efter lokal instruks", "Ved at spørge sidemanden", "Ved at gætte", "Det behøver du ikke"], "correct": [0], "why": "Brug to identifikatorer (fx navn og CPR) efter lokal instruks.", "tag": "Patientsikkerhed"},
  {"qid": "inj-ps3", "catId": "injektion", "q": "Hvad gør du med kanylen efter brug?", "type": "mc", "opts": ["Lægger den direkte i en godkendt kanylebøtte", "Sætter hætten på igen", "Smider den i skraldespanden", "Lægger den på bordet"], "correct": [0], "why": "Kanylen i kanylebøtte straks — recap aldrig.", "tag": "Patientsikkerhed"},
  {"qid": "inj-ps4", "catId": "injektion", "q": "Må en kanylebøtte fyldes helt til kanten?", "type": "tf", "opts": ["Sandt", "Falsk"], "correct": [1], "why": "Nej — fyld ikke over max-stregen; luk bøtten, når den er fuld.", "tag": "Patientsikkerhed"},
  {"qid": "inj-ps5", "catId": "injektion", "q": "Hvad skal dokumenteres efter en injektion?", "type": "mc", "opts": ["Præparat, dosis, sted, tidspunkt og initialer", "Kun tidspunkt", "Kun dit navn", "Ingenting"], "correct": [0], "why": "Dokumentér præparat, dosis, sted, tidspunkt og initialer.", "tag": "Patientsikkerhed"},
  {"qid": "inj-ps6", "catId": "injektion", "q": "Hvorfor skal man rotere injektionssted ved gentagne subkutane injektioner?", "type": "mc", "opts": ["For at undgå lipohypertrofi og skåne vævet", "For at det ser pænt ud", "For at spare tid", "Det behøver man ikke"], "correct": [0], "why": "Rotation forebygger lipohypertrofi og uens optagelse.", "tag": "Patientsikkerhed"},
  {"qid": "inj-ps7", "catId": "injektion", "q": "En ampul er beregnet til:", "type": "mc", "opts": ["Engangsbrug", "Flere borgere", "Genbrug næste dag", "At opbevares åben i ugevis"], "correct": [0], "why": "Glasampuller er engangsbrug.", "tag": "Udstyr"},
  {"qid": "inj-va1", "catId": "injektion", "q": "Ifølge SSI aspireres der ved vaccination.", "type": "tf", "opts": ["Sandt", "Falsk"], "correct": [1], "why": "SSI anbefaler, at der ikke aspireres ved vacciner, da der ikke er store kar på de anbefalede steder.", "tag": "Vacciner"},
  {"qid": "inj-va2", "catId": "injektion", "q": "Vaccinationsvejledning må frit overføres til alle andre injektionslægemidler.", "type": "tf", "opts": ["Sandt", "Falsk"], "correct": [1], "why": "Nej — hold vaccinationsvejledning adskilt; andre lægemidler følger produktresumé og lokal instruks.", "tag": "Vacciner"},
];

/* Per-category bank with stable IDs (existing questions + new ones). */
const CATEGORY_BANK = (() => {
  const bank = {};
  ALL_QUIZ.forEach((qz) => {
    const catId = QUIZ_CATMAP[qz.id];
    if (!catId) return;
    (qz.qs || []).forEach((qq, i) => { (bank[catId] = bank[catId] || []).push({ qid: qz.id + "#" + i, catId, q: qq.q, type: qq.type, opts: qq.opts, correct: qq.correct, why: qq.why, tag: qq.tag }); });
  });
  NEW_QS.forEach((nq) => { (bank[nq.catId] = bank[nq.catId] || []).push(nq); });
  return bank;
})();
const bankSize = (catId) => (CATEGORY_BANK[catId] || []).length;
/* Number of test slots scales with the bank (target up to 8; never padded
   with duplicates just to reach 8). Add more questions → more/º richer tests. */
const testCountFor = (catId) => { const n = bankSize(catId); return n < 6 ? (n > 0 ? 1 : 0) : Math.min(8, Math.max(2, Math.ceil(n / 5))); };
const TESTVIDEN_CAT_IDS = DATA.map((c) => c.id).concat(["anatomi", "farmakologi", "halveringstid", "injektion"]).filter((id, i, a) => a.indexOf(id) === i && bankSize(id) > 0);

function hashStr(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
function seededShuffle(arr, seed) { const a = arr.slice(); let s = (seed >>> 0) || 1; for (let i = a.length - 1; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function shuffleArr(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
/* Randomize option order; recompute correct indices by VALUE so the correct
   answer is never tied to a fixed position. */
function shuffleOptions(q) {
  const order = shuffleArr(q.opts.map((_, i) => i));
  const opts = order.map((i) => q.opts[i]);
  const correct = order.map((orig, ni) => (q.correct.indexOf(orig) >= 0 ? ni : -1)).filter((i) => i >= 0);
  return { qid: q.qid, q: q.q, type: q.type, opts, correct, why: q.why, tag: q.tag };
}
/* Stable set of questions for a given test slot: spread windows across a
   seeded shuffle of the bank so Test 1..N differ as much as the bank allows. */
function buildTestQuestions(catId, testIndex) {
  const bank = CATEGORY_BANK[catId] || []; const n = bank.length; if (!n) return [];
  const count = testCountFor(catId) || 1; const size = Math.min(10, n);
  const shuffled = seededShuffle(bank, hashStr(catId));
  const step = Math.max(1, Math.floor(n / count));
  const start = ((testIndex - 1) * step) % n;
  const out = []; for (let k = 0; k < size; k++) out.push(shuffled[(start + k) % n]);
  return out;
}



const CASE_LEVELS = { 1: "Niveau 1 – Grundlæggende", 2: "Niveau 2 – Praktik", 3: "Niveau 3 – Farmakologi" };

const CASES = [
  {
    id: "case-hjerte-medicin", category: "Hjerte/kredsløb", level: 3, title: "Leif, 65 år – hjerte og medicin",
    citizen: "Leif, 65 år (fiktiv borger). Bor alene i eget hjem og klarer det meste selv.",
    situation: "Leif får hjælp til sin medicin. Han har kendt hjertesvigt og forhøjet blodtryk.",
    history: "Kendt hjertesvigt og forhøjet blodtryk. Ingen kendt kognitiv svækkelse.",
    medications: ["Furix", "Digoxin", "Kalium", "Imdur"],
    observations: ["Leif virker mere træt end vanligt.", "Han vil ikke tage sin medicin i dag.", "Lidt hævede ankler (ødem)."],
    questions: [
      { section: "A · Præparat", q: "Hvad bruges Furix til, og hvad er den ønskede virkning?", flagged: true },
      { section: "A · Præparat", q: "Hvordan virker Digoxin, og hvilke relevante bivirkninger skal du kende?", flagged: true },
      { section: "B · Farmakodynamik", q: "Hvad gør præparaterne ved kroppen, og hvilken effekt forventes?", flagged: true },
      { section: "C · Farmakokinetik", q: "Hvordan optages, fordeles, nedbrydes og udskilles præparatet (på SSA-niveau)?", flagged: true },
      { section: "D · Interaktioner", q: "Er der præparater i listen, der kan påvirke hinanden? Hvad skal du være opmærksom på?", flagged: true },
      { section: "E · Kontraindikationer", q: "Hvilke kontraindikationer er relevante for præparaterne?", flagged: true },
      { section: "F · Dispenseringsformer", q: "Hvilke dispenseringsformer kan præparaterne fås i (fx tablet, mikstur, injektion, depot)?", flagged: true },
      { section: "G · Observation", q: "Hvad skal du være særligt opmærksom på hos Leif, og hvornår i hverdagen kan du observere det?", answer: "Observér Leifs almentilstand: træthed/ændring ift. habitualtilstand, hævelse (ødem) i anklerne, vejrtrækning og om han tager sin medicin. Du kan observere det ved daglige besøg, ved måltider og ved personlig pleje. Følg ordination og lokal instruks, og kontakt ansvarlig ved ændringer.", why: "Observation bygger på borgerens habitualtilstand og konkrete, objektive fund — ikke på gæt om lægemidlernes virkning." },
      { section: "H · Dokumentation", type: "doc", q: "Skriv fagligt: \u201ELeif virker mere træt og vil ikke tage sin medicin.\u201C", answer: "Fx: \u201EBorger fremstår mere træt end vanligt (ændring ift. habitualtilstand). Ønsker ikke at tage sin medicin i dag. Ansvarlig sygeplejerske informeret.\u201C", why: "Beskriv objektivt og konkret, medtag ændring ift. habitualtilstand og hvem du har informeret." },
      { section: "I · Medicinregning", type: "calc", q: "Ordination: Kaliumklorid 1500 mg × 2 dagligt. Præparat: Kaliumklorid 750 mg pr. tablet. Hvor mange tabletter pr. dosis og pr. døgn?", steps: ["1500 mg ÷ 750 mg = 2 tabletter pr. dosis", "2 doser × 2 tabletter = 4 tabletter pr. døgn"], result: "2 tabletter pr. dosis · 4 tabletter pr. døgn" },
    ],
    relatedTopics: ["p-medicin", "diag-hjertesvigt", "t-oedem"],
  },
  {
    id: "case-diabetes", category: "Diabetes", level: 2, title: "Gerda, 78 år – diabetes og observation",
    citizen: "Gerda, 78 år (fiktiv borger). Får hjælp i hjemmet.",
    situation: "Gerda har type 2-diabetes. Du kommer til morgenbesøg.",
    history: "Kendt type 2-diabetes.",
    medications: ["Insulin (efter ordination)"],
    observations: ["Gerda er sløv og klam om morgenen.", "Hun har ikke spist morgenmad."],
    questions: [
      { q: "Hvilke tegn kan tyde på lavt blodsukker?", answer: "Fx sved, klam hud, sløvhed, forvirring eller uro. Vurder altid sammen med borgerens habitualtilstand.", why: "Generelle observationstegn — følg lokal instruks og ordineret plan." },
      { q: "Hvad gør du ved mistanke om lavt blodsukker?", answer: "Følg lokal instruks/ordineret plan, mål blodsukker hvis du er oplært og delegeret til det, og kontakt ansvarlig ved tvivl. Klario viser ikke behandling.", why: "Handling følger delegation og lokal instruks — ikke gæt." },
      { type: "doc", q: "Skriv fagligt: \u201EGerda er sløv og klam og har ikke spist.\u201C", answer: "Fx: \u201EBorger fremstår sløv med klam hud. Har ikke indtaget morgenmad. Ansvarlig kontaktet.\u201C", why: "Objektivt, konkret og med handling." },
    ],
    relatedTopics: ["diag-diabetes", "nv-bs"],
  },
  {
    id: "case-obstipation", category: "Obstipation", level: 1, title: "Karl, 82 år – obstipation",
    citizen: "Karl, 82 år (fiktiv borger). Får hjælp til personlig pleje.",
    situation: "Karl har ikke haft afføring i flere dage og føler sig utilpas.",
    history: "Nedsat mobilitet.",
    medications: [],
    observations: ["Ingen afføring i 3 døgn.", "Oppustet mave; oplyser ubehag."],
    questions: [
      { q: "Hvad observerer du ved mistanke om obstipation?", answer: "Hvornår borgeren sidst har haft afføring, konsistens, mavegener/oppustethed, appetit samt væske-, fiber- og aktivitetsniveau.", why: "Systematisk observation giver overblik." },
      { q: "Hvad kan du gøre inden for borgerens plan?", answer: "Tilbyd væske, fibre og mobilisering inden for planen, observér og kontakt ansvarlig ved vedvarende obstipation. Følg lokal instruks.", why: "Handling holder sig inden for plan og delegation." },
      { q: "Hvad er det faglige ord for forstoppelse?", answer: "Obstipation.", why: "Obstipation = forstoppelse." },
    ],
    relatedTopics: ["ern-obstipation", "t-obstipation"],
  },
  {
    id: "case-respiration", category: "Respiration", level: 1, title: "Bodil, 70 år – respiration",
    citizen: "Bodil, 70 år (fiktiv borger).",
    situation: "Bodil er blevet mere forpustet det seneste døgn.",
    history: "Ingen kendt lungesygdom oplyst i casen.",
    medications: [],
    observations: ["Forpustet ved gang.", "Respirationsfrekvensen virker forhøjet."],
    questions: [
      { q: "Hvad observerer du ved respiration?", answer: "Frekvens, dybde, rytme, besvær/brug af hjælpemuskler, hudfarve (cyanose) og lyde.", why: "Systematisk respirationsobservation." },
      { q: "Hvad er det faglige ord for åndenød?", answer: "Dyspnø.", why: "Dyspnø = åndenød/besværet vejrtrækning." },
      { q: "Hvad gør du ved svær åndenød?", answer: "Skab ro, hjælp op i siddende stilling, ilt efter retningslinje og tilkald hjælp. Ring 1-1-2 ved svær åndenød eller cyanose.", why: "Sikkerhed først; følg lokal retningslinje." },
    ],
    relatedTopics: ["obs-respiration", "t-dyspnoe"],
  },
  {
    id: "case-kateter", category: "Infektion", level: 2, title: "Aksel, 74 år – kateter og urin",
    citizen: "Aksel, 74 år (fiktiv borger). Har permanent kateter.",
    situation: "Du kommer på besøg og skal hjælpe med personlig pleje.",
    history: "Permanent kateter.",
    medications: [],
    observations: ["Uklar urin med kraftig lugt.", "Ingen feber oplyst."],
    questions: [
      { q: "Hvad observerer du på urinen?", answer: "Farve, klarhed, lugt, evt. sediment og mængde samt lækage ved kateteret.", why: "Grundlæggende urinobservation ved kateter." },
      { q: "Hvor placeres urinposen, og hvorfor?", answer: "Lavere end blæren, så urin ikke løber tilbage (nedsætter infektionsrisiko).", why: "Tilbageløb øger risiko for infektion." },
      { q: "Hvornår kontakter du ansvarlig?", answer: "Ved blod i urinen, feber, stærk smerte, ingen urin trods væskeindtag eller tegn på infektion.", why: "Eskalering ved bekymrende fund." },
    ],
    relatedTopics: ["p-kateter", "t-urin", "t-diurese"],
  },
  {
    id: "case-medicinsikkerhed", category: "Medicin", level: 2, title: "Inge, 80 år – medicinsikkerhed",
    citizen: "Inge, 80 år (fiktiv borger).",
    situation: "Du skal hjælpe Inge med hendes medicin, men noget ser forkert ud.",
    history: "Ingen kendt kognitiv svækkelse.",
    medications: ["Medicin i doseringsæske"],
    observations: ["Medicinen i æsken stemmer ikke med det forventede.", "Inge spørger, om det er de rigtige piller."],
    questions: [
      { q: "Hvad gør du, når noget ikke stemmer?", answer: "Stop. Giv ikke medicinen. Kontrollér ordination, og kontakt den relevante ansvarlige fagperson. Gæt aldrig.", why: "Ved tvivl – stop. Sikkerhed frem for at gennemføre." },
      { q: "Hvilke kontroller hører til sikker medicingivning?", answer: "Rigtig borger, rigtigt lægemiddel, rigtig dosis, rigtigt tidspunkt, rigtig administrationsvej og relevant dokumentation.", why: "De grundlæggende kontroller forebygger fejl." },
      { type: "calc", q: "Ordination: 500 mg. Præparat: 250 mg pr. tablet. Hvor mange tabletter gives?", steps: ["500 mg ÷ 250 mg = 2 tabletter"], result: "2 tabletter" },
    ],
    relatedTopics: ["p-medicin", "med-5r"],
  },
];
const caseById = (id) => CASES.find((c) => c.id === id);
/* topic -> case, for "Øv dette i en case" */
const TOPIC_CASE = { "p-kateter": "case-kateter", "p-medicin": "case-medicinsikkerhed", "obs-respiration": "case-respiration", "ern-obstipation": "case-obstipation", "diag-hjertesvigt": "case-hjerte-medicin", "diag-diabetes": "case-diabetes" };

/* ---- Quiz + Case components ---- */
function quizBand(score, total) {
  const p = total > 0 ? score / total : 0;
  if (p >= 0.8) return "Stærkt overblik";
  if (p >= 0.5) return "Godt på vej";
  return "Gennemgå emnet igen";
}

function Quiz({ quiz, onClose, onCase, onCategory, onDone, onPracticeMistakes, onBackToTests }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [phase, setPhase] = useState("quiz");
  const qs = quiz.qs; const q = qs[idx];
  const doneRef = useRef(false);
  useEffect(() => {
    if (phase === "result" && !doneRef.current) {
      doneRef.current = true;
      if (quiz.testId && onDone) onDone({ catId: quiz.catId, testId: quiz.testId, isMistakes: !!quiz.isMistakes, score, total: qs.length, answered: qs.map((qq, i) => ({ qid: qq.qid, correct: wrong.indexOf(i) < 0 })) });
    }
    if (phase !== "result") doneRef.current = false;
  }, [phase]);
  const isMulti = q && q.type === "multi";
  const eq = (a, b) => { const x = [...a].sort(), y = [...b].sort(); return x.length === y.length && x.every((v, i) => v === y[i]); };
  const toggle = (i) => { if (checked) return; setSel((s) => isMulti ? (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]) : [i]); };
  const check = () => { if (sel.length === 0) return; const ok = eq(sel, q.correct); setChecked(true); if (ok) setScore((s) => s + 1); else setWrong((w) => w.includes(idx) ? w : [...w, idx]); };
  const next = () => { if (idx + 1 < qs.length) { setIdx(idx + 1); setSel([]); setChecked(false); } else setPhase("result"); };
  const restart = () => { setIdx(0); setSel([]); setChecked(false); setScore(0); setWrong([]); setPhase("quiz"); };
  const correctNow = checked && eq(sel, q.correct);
  return (
    <div role="dialog" aria-modal="true" aria-label={"Quiz: " + quiz.title} style={{ position: "absolute", inset: 0, zIndex: 1000, background: C.surface, display: "flex", flexDirection: "column", overscrollBehavior: "contain" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "calc(13px + env(safe-area-inset-top)) 16px 13px", borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Test din viden</div>
          <div style={{ fontSize: 11.5, color: C.inkFaint }}>{quiz.title}{phase === "quiz" ? " · " + (idx + 1) + " af " + qs.length : ""}</div>
        </div>
        <button onClick={onClose} aria-label="Luk" style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} color={C.ink} /></button>
      </div>
      <div className="cscroll" style={{ flex: 1, overflowY: "auto", padding: "18px 16px calc(28px + env(safe-area-inset-bottom))" }}>
        {phase === "quiz" && q && (
          <div className="anim" key={idx}>
            <div style={{ height: 6, borderRadius: 99, background: C.line, marginBottom: 18, overflow: "hidden" }}><div style={{ height: "100%", width: ((idx + (checked ? 1 : 0)) / qs.length) * 100 + "%", background: C.primary, transition: "width .3s ease" }} /></div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, lineHeight: 1.35, marginBottom: 14 }}>{q.q}</div>
            {isMulti && !checked && <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 10 }}>Vælg alle korrekte.</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.opts.map((o, i) => {
                const isSel = sel.includes(i); const isCorrect = q.correct.includes(i);
                let bd = C.line, bg = C.surface, col = C.ink;
                if (checked) { if (isCorrect) { bd = "#0FAE9E"; bg = tint("#0FAE9E", "12"); } else if (isSel) { bd = RED; bg = tint(RED, "0E"); } }
                else if (isSel) { bd = C.primary; bg = tint(C.primary, "0E"); }
                return (
                  <button key={i} onClick={() => toggle(i)} aria-pressed={isSel} style={{ textAlign: "left", border: `1.6px solid ${bd}`, background: bg, borderRadius: 14, padding: "14px 15px", cursor: checked ? "default" : "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 600, color: col, minHeight: 52, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ flex: 1 }}>{o}</span>
                    {checked && isCorrect && <ShieldCheck size={18} color="#0FAE9E" />}
                    {checked && isSel && !isCorrect && <X size={18} color={RED} />}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div style={{ marginTop: 14, background: correctNow ? tint("#0FAE9E", "10") : tint(RED, "0C"), border: `1px solid ${correctNow ? tint("#0FAE9E", "33") : tint(RED, "26")}`, borderRadius: 14, padding: "13px 14px" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: correctNow ? "#1F5136" : "#7A2A28" }}>{correctNow ? "Rigtigt" : "Ikke helt"}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, marginTop: 8 }}>Hvorfor?</div>
                <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5, marginTop: 2 }}>{q.why}</div>
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              {!checked ? (
                <button onClick={check} disabled={sel.length === 0} style={{ width: "100%", border: "none", borderRadius: 13, padding: "14px", background: sel.length === 0 ? tint(C.ink, "14") : "linear-gradient(135deg,#3E78EE,#2457D6)", color: sel.length === 0 ? C.inkFaint : "#fff", fontFamily: "inherit", fontSize: 16, fontWeight: 800, cursor: sel.length === 0 ? "default" : "pointer", minHeight: 52 }}>Tjek svar</button>
              ) : (
                <button onClick={next} style={{ width: "100%", border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 16, fontWeight: 800, cursor: "pointer", minHeight: 52 }}>{idx + 1 < qs.length ? "Næste" : "Se resultat"}</button>
              )}
            </div>
          </div>
        )}
        {phase === "result" && (() => {
          const wrongTags = Array.from(new Set(wrong.map((i) => qs[i].tag).filter(Boolean)));
          const rightTags = Array.from(new Set(qs.map((q, i) => (!wrong.includes(i) ? q.tag : null)).filter(Boolean)));
          const strengths = rightTags.filter((t) => !wrongTags.includes(t));
          const lvlLabel = quiz.level === 0 ? "Blandet niveau" : quiz.level ? "Niveau " + quiz.level : "";
          return (
          <div className="anim" style={{ paddingTop: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.inkSoft }}>{quiz.testId ? "Test gennemført" : "Dit resultat"}</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: C.ink, margin: "4px 0" }}>{score} / {qs.length}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.inkSoft, marginBottom: 2 }}>rigtige · {Math.round((score / qs.length) * 100)} %</div>
              <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 4 }}>{quiz.category}{lvlLabel ? " · " + lvlLabel : ""}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 20 }}>{quizBand(score, qs.length)}</div>
            </div>
            {(strengths.length > 0 || wrongTags.length > 0) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                {strengths.length > 0 && (
                  <div style={{ background: tint("#0FAE9E", "0E"), border: `1px solid ${tint("#0FAE9E", "2A")}`, borderRadius: 13, padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1F5136", marginBottom: 5 }}>Styrker</div>
                    <div style={{ fontSize: 13.5, color: C.ink }}>{strengths.join(" · ")}</div>
                  </div>
                )}
                {wrongTags.length > 0 && (
                  <div style={{ background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "2A")}`, borderRadius: 13, padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#7A4E0A", marginBottom: 5 }}>Gennemgå igen</div>
                    <div style={{ fontSize: 13.5, color: C.ink }}>{wrongTags.join(" · ")}</div>
                  </div>
                )}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340, margin: "0 auto" }}>
              {wrong.length > 0 && <button onClick={() => setPhase("review")} style={{ border: `1px solid ${C.line}`, borderRadius: 13, padding: "14px", background: C.surface, color: C.ink, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 50 }}>Se mine fejl ({wrong.length})</button>}
              {quiz.catId && onPracticeMistakes && !quiz.isMistakes && <button onClick={() => { onClose(); onPracticeMistakes(quiz.catId); }} style={{ border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Øv mine fejl</button>}
              {quiz.caseId && onCase && <button onClick={() => { onClose(); onCase(quiz.caseId); }} style={{ border: `1px solid ${C.line}`, borderRadius: 13, padding: "14px", background: C.surface, color: C.ink, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 50 }}>Øv dette i en case</button>}
              <button onClick={restart} style={{ border: `1px solid ${C.line}`, borderRadius: 13, padding: "14px", background: C.surface, color: C.ink, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 50 }}>Prøv igen</button>
              {quiz.catId && onBackToTests ? (
                <button onClick={() => { onClose(); onBackToTests(quiz.catId); }} style={{ border: "none", background: "transparent", color: C.inkSoft, fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 10 }}>Tilbage til Test Viden</button>
              ) : quiz.catId && onCategory ? (
                <button onClick={() => { onClose(); onCategory(quiz.catId); }} style={{ border: "none", background: "transparent", color: C.inkSoft, fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 10 }}>Tilbage til kategori</button>
              ) : (
                <button onClick={onClose} style={{ border: "none", background: "transparent", color: C.inkSoft, fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 10 }}>Luk</button>
              )}
            </div>
          </div>
          );
        })()}
        {phase === "review" && (
          <div className="anim">
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 14 }}>Gennemgå fejl</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {wrong.map((wi) => { const wq = qs[wi]; return (
                <div key={wi} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 14px", background: C.surface }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, lineHeight: 1.35 }}>{wq.q}</div>
                  <div style={{ fontSize: 13, color: "#1F5136", marginTop: 8 }}>Korrekt: {wq.correct.map((ci) => wq.opts[ci]).join(", ")}</div>
                  <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, marginTop: 6 }}>{wq.why}</div>
                </div>
              ); })}
            </div>
            <button onClick={() => setPhase("result")} style={{ width: "100%", marginTop: 16, border: `1px solid ${C.line}`, borderRadius: 13, padding: "14px", background: C.surface, color: C.ink, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 50 }}>Tilbage til resultat</button>
          </div>
        )}
      </div>
    </div>
  );
}

function TestButtons({ topicId, onQuiz, onCase }) {
  const quiz = onQuiz ? quizForTopic(topicId) : null;
  const caseId = onCase ? TOPIC_CASE[topicId] : null;
  if (!quiz && !caseId) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 4 }}>
      {quiz && (
        <button onClick={() => onQuiz(quiz)} style={{ width: "100%", border: `1px solid ${tint(C.primary, "33")}`, background: tint(C.primary, "0C"), borderRadius: 13, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
          <ShieldCheck size={18} color={C.primary} />
          <span style={{ flex: 1, textAlign: "left", fontSize: 14, fontWeight: 700, color: C.primary }}>Test din viden om dette emne</span>
          <ChevronRight size={17} color={C.primary} />
        </button>
      )}
      {caseId && (
        <button onClick={() => onCase(caseId)} style={{ width: "100%", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
          <ClipboardList size={18} color={C.inkSoft} />
          <span style={{ flex: 1, textAlign: "left", fontSize: 14, fontWeight: 700, color: C.ink }}>Øv dette i en case</span>
          <ChevronRight size={17} color={C.inkFaint} />
        </button>
      )}
    </div>
  );
}

function CaseCard({ c, onOpen }) {
  return (
    <button onClick={() => onOpen(c.id)} aria-label={c.title} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 16, padding: 14, cursor: "pointer", boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
      <div style={{ display: "flex", gap: 7, marginBottom: 7, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: tint(C.primary, "12"), padding: "2px 8px", borderRadius: 7 }}>{c.category}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, background: tint(C.ink, "0A"), padding: "2px 8px", borderRadius: 7 }}>Niveau {c.level}</span>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{c.title}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{c.situation}</div>
    </button>
  );
}

function CaseQuestion({ q }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 14px", background: C.surface }}>
      {q.section && <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 4 }}>{q.section}</div>}
      <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>{q.q}</div>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ marginTop: 10, border: `1px solid ${C.line}`, background: tint(C.primary, "0A"), color: C.primary, borderRadius: 11, padding: "9px 14px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Se svar</button>
      ) : (
        <div style={{ marginTop: 10 }}>
          {q.type === "calc" ? (
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Udregning</div>
              <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {q.steps.map((s, i) => <li key={i} style={{ fontSize: 14, color: C.ink, lineHeight: 1.4 }}>{i + 1}. {s}</li>)}
              </ol>
              <div style={{ marginTop: 8, fontSize: 15, fontWeight: 800, color: C.ink }}>{q.result}</div>
            </div>
          ) : q.flagged ? (
            <div style={{ display: "flex", gap: 9, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "2A")}`, borderRadius: 11, padding: "10px 12px" }}>
              <Info size={16} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12.5, color: "#7A4E0A", lineHeight: 1.45 }}>{FLAG_NOTE}</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft }}>Forslag til svar</div>
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5, marginTop: 2 }}>{q.answer}</div>
              {q.why && <><div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, marginTop: 8 }}>Hvorfor?</div><div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, marginTop: 2 }}>{q.why}</div></>}
              {q.type === "doc" && <div style={{ fontSize: 12, color: C.inkFaint, marginTop: 8, lineHeight: 1.45 }}>Flere formuleringer kan være korrekte, så længe de er objektive og konkrete.</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CaseDetail({ c, onTopic }) {
  const sec = (label, text) => (
    <div style={{ marginBottom: 12 }}>
      <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 0.2, textTransform: "uppercase", color: C.primary, background: tint(C.primary, "14"), padding: "3px 9px", borderRadius: 8, marginBottom: 6 }}>{label}</span>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: C.ink }}>{text}</div>
    </div>
  );
  return (
    <div>
      <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: tint(C.primary, "12"), padding: "2px 8px", borderRadius: 7 }}>{c.category}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, background: tint(C.ink, "0A"), padding: "2px 8px", borderRadius: 7 }}>{CASE_LEVELS[c.level]}</span>
      </div>
      <div style={{ display: "flex", gap: 10, background: tint(RED, "0C"), border: `1px solid ${tint(RED, "26")}`, borderRadius: 12, padding: "11px 13px", marginBottom: 14 }}>
        <Siren size={17} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.45 }}>{CASE_SAFETY}</span>
      </div>
      {sec("Borger", c.citizen)}
      {sec("Situation", c.situation)}
      {c.history && sec("Sygdomshistorie", c.history)}
      {c.medications && c.medications.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.primary, background: tint(C.primary, "14"), padding: "3px 9px", borderRadius: 8, marginBottom: 6 }}>Medicinliste</span>
          <Bullets items={c.medications} color={C.primary} />
        </div>
      )}
      {c.observations && c.observations.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#2F6FAE", background: tint("#2F6FAE", "14"), padding: "3px 9px", borderRadius: 8, marginBottom: 6 }}>Aktuelle observationer</span>
          <Bullets items={c.observations} color="#2F6FAE" />
        </div>
      )}
      <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, margin: "4px 0 11px" }}>Spørgsmål</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {c.questions.map((q, i) => <CaseQuestion key={i} q={q} />)}
      </div>
      {c.relatedTopics && c.relatedTopics.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, marginBottom: 9 }}>Læs mere i Klario</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {c.relatedTopics.map((tid) => { const label = onTopic.label(tid); if (!label) return null; return (
              <button key={tid} onClick={() => onTopic.go(tid)} style={{ border: `1px solid ${C.line}`, background: tint(C.primary, "0C"), color: C.primary, borderRadius: 99, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
            ); })}
          </div>
        </div>
      )}
    </div>
  );
}


/* ===== EXTERNAL RESOURCES (quick-access shortcuts) =====================
 * One place to edit these links. To replace the UddData+ login URL later,
 * change UDDDATA_URL below — it is used nowhere else. */
const UDDDATA_URL = "https://all.uddataplus.dk/login/doLogin?returURL=L3Jlc3NvdXJjZXIvP2lkPWlkX21lbnVfcmVzcyNyZXNzb3VyY2VyOkNISUxEX0NPTlRBSU5FUjo0ODUxMQ%3D%3D";
const EXTERNAL_RESOURCES = {
  medicine: [
    { name: "Pro.medicin.dk", sub: "Fagligt medicinopslag", url: "https://pro.medicin.dk/", aria: "Åbn Pro.medicin.dk – eksternt link", Icon: Pill, color: "#7A5AF5" },
    { name: "Min.medicin.dk", sub: "Medicin forklaret til borgere", url: "https://min.medicin.dk/", aria: "Åbn Min.medicin.dk – eksternt link", Icon: Pill, color: "#7A5AF5" },
  ],
  study: [
    { name: "UddData+", sub: "Uddannelse og praktik", url: UDDDATA_URL, aria: "Åbn UddData+ – eksternt link", Icon: GraduationCap, color: "#0FAE9E" },
    { name: "EduAdm", sub: "Uddannelsesadministration", url: "https://eduadm.dk/", aria: "Åbn EduAdm – eksternt link", Icon: GraduationCap, color: "#0FAE9E" },
  ],
};
function ExtLinkCard({ r }) {
  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={r.aria} style={{ textDecoration: "none", position: "relative", border: `1px solid ${C.line}`, background: `linear-gradient(160deg, ${tint(r.color, "10")}, #fff)`, borderRadius: 18, padding: 14, display: "flex", flexDirection: "column", gap: 11, minHeight: 104, justifyContent: "space-between" }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: tint(r.color, "16"), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <r.Icon size={20} color={r.color} strokeWidth={2.1} />
      </div>
      <div style={{ paddingRight: 18 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{r.name}</div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, marginTop: 2, lineHeight: 1.3 }}>{r.sub}</div>
      </div>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.inkFaint} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", top: 14, right: 14 }} aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
    </a>
  );
}

/* ===== HUSK AT TJEKKE — local quick-notes ==============================
 * Personal study/work reminders. Stored only in the browser (localStorage)
 * on this device; no server, no login. Guarded so it degrades gracefully
 * where storage is unavailable. */
const NOTES_KEY = "klario_notes_v1";
function loadNotes() { try { const r = localStorage.getItem(NOTES_KEY); const a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function saveNotes(a) { try { localStorage.setItem(NOTES_KEY, JSON.stringify(a)); } catch (e) { /* storage unavailable — stays in-session */ } }
function noteId() { return "n-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7); }
function fmtNoteDate(iso) {
  const d = new Date(iso); if (isNaN(d.getTime())) return "";
  const now = new Date(); const y = new Date(now); y.setDate(now.getDate() - 1);
  const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const hhmm = d.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
  if (same(d, now)) return "I dag " + hhmm;
  if (same(d, y)) return "I går";
  return d.toLocaleDateString("da-DK", { day: "numeric", month: "short" });
}
function noteSearchTerm(text) {
  let t = (text || "").trim();
  t = t.replace(/^(tjek forskellen på|tjek|læs om|læs|undersøg|se på|se|find|slå op på|slå op|kig på)\s+/i, "");
  return t.trim() || (text || "").trim();
}

/* ===== MINE DOKUMENTER ================================================= *
 *  Personal local document library. Binary files live in IndexedDB on THIS
 *  device only — never uploaded anywhere. Clean storage abstraction so the
 *  backend could later be swapped (e.g. encrypted/cloud) without touching UI.
 *  Metadata store: docs. Binary store: blobs. Folders store: folders.
 * ===================================================================== */
const DOCS_DB = "klario_docs";
const docStore = {
  _db: null,
  open() {
    return new Promise((resolve, reject) => {
      if (this._db) return resolve(this._db);
      if (typeof indexedDB === "undefined") return reject(new Error("no-idb"));
      let req;
      try { req = indexedDB.open(DOCS_DB, 1); } catch (e) { return reject(e); }
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("folders")) db.createObjectStore("folders", { keyPath: "id" });
        if (!db.objectStoreNames.contains("docs")) db.createObjectStore("docs", { keyPath: "id" });
        if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs", { keyPath: "id" });
      };
      req.onsuccess = () => { this._db = req.result; resolve(this._db); };
      req.onerror = () => reject(req.error || new Error("idb-open"));
    });
  },
  _all(store) { return this.open().then((db) => new Promise((res, rej) => { const r = db.transaction(store, "readonly").objectStore(store).getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error); })); },
  _tx(stores, mode, fn) { return this.open().then((db) => new Promise((res, rej) => { const tx = db.transaction(stores, mode); fn(tx); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error || new Error("abort")); })); },
  async init(defaults) {
    let folders = await this._all("folders");
    if (folders.length === 0 && defaults && defaults.length) {
      await this._tx("folders", "readwrite", (tx) => { const os = tx.objectStore("folders"); defaults.forEach((f) => os.put(f)); });
      folders = defaults.slice();
    }
    const docs = await this._all("docs");
    return [folders, docs];
  },
  putFolder(f) { return this._tx("folders", "readwrite", (tx) => tx.objectStore("folders").put(f)); },
  deleteFolder(id) { return this._tx("folders", "readwrite", (tx) => tx.objectStore("folders").delete(id)); },
  putDoc(meta, blob) { return this._tx(["docs", "blobs"], "readwrite", (tx) => { tx.objectStore("docs").put(meta); tx.objectStore("blobs").put({ id: meta.id, blob }); }); },
  putDocMeta(meta) { return this._tx("docs", "readwrite", (tx) => tx.objectStore("docs").put(meta)); },
  deleteDoc(id) { return this._tx(["docs", "blobs"], "readwrite", (tx) => { tx.objectStore("docs").delete(id); tx.objectStore("blobs").delete(id); }); },
  getBlob(id) { return this.open().then((db) => new Promise((res, rej) => { const r = db.transaction("blobs", "readonly").objectStore("blobs").get(id); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); })); },
};

const DEFAULT_FOLDERS = ["Skole", "Opgaver", "Farmakologi", "Praktik", "Procedurer", "Egne noter", "Fagligt"].map((n, i) => ({ id: "f-def-" + i, name: n, createdAt: new Date().toISOString() }));

const DOC_ERRORS = {
  kunne_ikke_indlaese: "Dokumenterne kunne ikke indlæses. Prøv at genindlæse KLARIO.",
  kunne_ikke_gemme: "Dokumentet kunne ikke gemmes. Prøv igen.",
  kunne_ikke_aabne: "Dokumentet kunne ikke åbnes.",
  kunne_ikke_slette: "Handlingen kunne ikke gennemføres. Prøv igen.",
  kvote: "Der er ikke mere plads på enheden til flere dokumenter.",
  ingen_lager: "Denne enhed understøtter ikke lokal dokumentlagring i browseren.",
};

function docUid() { return "d-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7); }
function nowISO() { return new Date().toISOString(); }
function fmtBytes(n) { if (!(n > 0)) return "0 B"; if (n < 1024) return n + " B"; if (n < 1048576) return Math.round(n / 1024) + " KB"; return (n / 1048576).toFixed(1).replace(".", ",") + " MB"; }
function fmtDocDate(iso) { const d = new Date(iso); if (isNaN(d.getTime())) return ""; return d.toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" }); }
function stripExt(n) { const i = (n || "").lastIndexOf("."); return i > 0 ? n.slice(0, i) : (n || ""); }
function extOf(n) { const i = (n || "").lastIndexOf("."); return i > 0 ? n.slice(i) : ""; }
function downloadName(display, original) { const d = (display || original || "dokument").trim(); return /\.[a-z0-9]{1,6}$/i.test(d) ? d : d + extOf(original); }
const MIME_BY_EXT = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", heic: "image/heic", txt: "text/plain", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", xls: "application/vnd.ms-excel", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ppt: "application/vnd.ms-powerpoint", pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation", csv: "text/csv" };
function guessMime(name) { const e = (name || "").toLowerCase().split(".").pop(); return MIME_BY_EXT[e] || ""; }
function mimeFor(meta, blob) {
  const src = (meta && meta.originalName) || (meta && meta.displayName) || "";
  const ext = extOf(src).replace(".", "").toLowerCase();
  if (MIME_BY_EXT[ext]) return MIME_BY_EXT[ext];
  return (meta && meta.mimeType) || (blob && blob.type) || "application/octet-stream";
}
function isPreviewableMime(m) { return m === "application/pdf" || (m || "").indexOf("image/") === 0; }
function extLower(meta) { const src = (meta && meta.originalName) || (meta && meta.displayName) || ""; return extOf(src).replace(".", "").toLowerCase(); }
function isDocxName(meta) { return extLower(meta) === "docx"; }
function isLegacyDocName(meta) { return extLower(meta) === "doc"; }
function blobToArrayBuffer(blob) { if (blob.arrayBuffer) return blob.arrayBuffer(); return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsArrayBuffer(blob); }); }
/* Styling for the locally-rendered DOCX — reflows to iPhone width; wide tables
   scroll inside their own box rather than forcing the page sideways. */
const DOCX_CSS = ".klario-docx{color:#15212B;font-size:16px;line-height:1.62;word-wrap:break-word;overflow-wrap:break-word;-webkit-text-size-adjust:100%;}"
  + ".klario-docx *{max-width:100%;}"
  + ".klario-docx h1{font-size:22px;font-weight:800;line-height:1.3;margin:20px 0 9px;}"
  + ".klario-docx h2{font-size:19px;font-weight:800;line-height:1.32;margin:18px 0 8px;}"
  + ".klario-docx h3{font-size:17px;font-weight:700;margin:15px 0 7px;}"
  + ".klario-docx h4,.klario-docx h5,.klario-docx h6{font-size:15.5px;font-weight:700;margin:14px 0 6px;}"
  + ".klario-docx p{margin:0 0 11px;}"
  + ".klario-docx strong,.klario-docx b{font-weight:700;}"
  + ".klario-docx em,.klario-docx i{font-style:italic;}"
  + ".klario-docx u{text-decoration:underline;}"
  + ".klario-docx ul,.klario-docx ol{margin:0 0 12px;padding-left:23px;}"
  + ".klario-docx li{margin:0 0 5px;}"
  + ".klario-docx a{color:#2E68E0;word-break:break-all;}"
  + ".klario-docx img{height:auto;border-radius:8px;display:block;margin:12px 0;}"
  + ".klario-docx table{border-collapse:collapse;width:100%;margin:13px 0;font-size:14px;display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;}"
  + ".klario-docx td,.klario-docx th{border:1px solid #D8DEE3;padding:7px 10px;text-align:left;vertical-align:top;min-width:70px;}"
  + ".klario-docx th{background:#F3F5F7;font-weight:700;}";
function docKind(mime, name) {
  const m = (mime || "").toLowerCase(); const n = (name || "").toLowerCase(); const ext = n.includes(".") ? n.split(".").pop() : "";
  if (m === "application/pdf" || ext === "pdf") return { label: "PDF", color: "#E5484D" };
  if (m.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "heic"].indexOf(ext) >= 0) return { label: "Billede", color: "#7A5AF5" };
  if (["doc", "docx"].indexOf(ext) >= 0 || m.indexOf("word") >= 0) return { label: "Word", color: "#2B6CB0" };
  if (["xls", "xlsx", "csv"].indexOf(ext) >= 0 || m.indexOf("sheet") >= 0 || m.indexOf("excel") >= 0) return { label: "Regneark", color: "#1F9D57" };
  if (["ppt", "pptx"].indexOf(ext) >= 0 || m.indexOf("presentation") >= 0 || m.indexOf("powerpoint") >= 0) return { label: "Slides", color: "#D97706" };
  if (ext === "txt" || m === "text/plain") return { label: "Tekst", color: "#5B6A73" };
  return { label: "Fil", color: "#5B6A73" };
}

/* ---- reusable modal shell ---- */
function Sheet({ label, onClose, children, top }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={label} onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 38, background: "rgba(12,20,26,0.55)", display: "flex", alignItems: top ? "flex-start" : "center", justifyContent: "center", padding: 16, paddingTop: top ? "calc(env(safe-area-inset-top) + 54px)" : 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400, background: C.surface, borderRadius: 20, padding: 18, boxShadow: "0 20px 50px rgba(0,0,0,0.3)", maxHeight: "82vh", overflowY: "auto" }}>{children}</div>
    </div>
  );
}
const dInput = { width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 14px", fontSize: 16, color: C.ink, background: C.surface, fontFamily: "inherit", outline: "none" };
const dBtnPri = (on) => ({ flex: 1, border: "none", borderRadius: 13, padding: "14px", background: on ? "linear-gradient(135deg,#3E78EE,#2457D6)" : tint(C.ink, "14"), color: on ? "#fff" : C.inkFaint, fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: on ? "pointer" : "default", minHeight: 50 });
const dBtnSec = { flex: 1, border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "14px", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: C.ink, cursor: "pointer", minHeight: 50 };

function DocRow({ d, folderName, onOpen, onMenu }) {
  const k = docKind(d.mimeType, d.displayName);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 6px 12px 12px" }}>
      <button onClick={onOpen} aria-label={`Åbn ${d.displayName}`} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, textAlign: "left", border: "none", background: "transparent", padding: 0, cursor: "pointer", fontFamily: "inherit" }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: tint(k.color, "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileText size={20} color={k.color} strokeWidth={2.1} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.displayName}</div>
          <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.label} · Tilføjet {fmtDocDate(d.createdAt)}{folderName ? " · " + folderName : ""}</div>
        </div>
      </button>
      <button onClick={onMenu} aria-label={`Valgmuligheder for ${d.displayName}`} style={{ border: "none", background: "transparent", padding: 8, cursor: "pointer", flexShrink: 0, borderRadius: 10 }}>
        <MoreHorizontal size={20} color={C.inkFaint} />
      </button>
    </div>
  );
}

function DocPreview({ preview, onClose }) {
  const isPdf = preview.mime === "application/pdf";
  const isImg = (preview.mime || "").startsWith("image/");
  return (
    <div role="dialog" aria-modal="true" aria-label={"Forhåndsvisning: " + preview.name} style={{ position: "absolute", inset: 0, zIndex: 1000, background: C.surface, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "calc(13px + env(safe-area-inset-top)) 14px 13px", borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview.name}</div>
        </div>
        <a href={preview.url} target="_blank" rel="noopener noreferrer" aria-label="Åbn i ny fane" style={{ textDecoration: "none", fontSize: 13, fontWeight: 700, color: C.primary, padding: "8px 10px" }}>Ny fane</a>
        <button onClick={onClose} aria-label="Luk" style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><X size={20} color={C.ink} /></button>
      </div>
      <div style={{ flex: 1, overflow: "auto", background: "#33414B", display: "flex", alignItems: isImg ? "center" : "stretch", justifyContent: "center" }}>
        {isPdf ? (
          <iframe src={preview.url} title={preview.name} style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} />
        ) : isImg ? (
          <img src={preview.url} alt={preview.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 10, boxSizing: "border-box" }} />
        ) : (
          <div style={{ color: "#fff", padding: 30, textAlign: "center", alignSelf: "center", fontSize: 14 }}>Denne filtype kan ikke forhåndsvises. Brug “Ny fane” for at åbne den.</div>
        )}
      </div>
    </div>
  );
}


/* In-app DOCX reader. Renders the document locally (mammoth) from the Blob
   already in IndexedDB — never uploads, never modifies the stored file.
   Sharing/export is a secondary action in the ⋯ menu. */
function DocxViewer({ dv, onClose, onShare }) {
  const [menu, setMenu] = useState(false);
  const status = dv.status;
  const fallback = (msg) => (
    <div style={{ maxWidth: 340, margin: "0 auto", textAlign: "center", paddingTop: "12vh" }}>
      <div style={{ width: 54, height: 54, borderRadius: 15, background: tint("#2B6CB0", "12"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><FileText size={26} color="#2B6CB0" /></div>
      <div style={{ fontSize: 15, color: C.ink, lineHeight: 1.55, marginBottom: 18 }}>{msg}</div>
      <button onClick={onShare} style={{ width: "100%", border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Åbn / del dokument</button>
    </div>
  );
  return (
    <div role="dialog" aria-modal="true" aria-label={"Dokument: " + dv.name} style={{ position: "absolute", inset: 0, zIndex: 1000, background: C.surface, display: "flex", flexDirection: "column" }}>
      <style>{DOCX_CSS}</style>
      <div style={{ padding: "calc(11px + env(safe-area-inset-top)) 12px 11px", borderBottom: `1px solid ${C.line}`, background: C.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onClose} aria-label="Tilbage til Mine dokumenter" style={{ display: "flex", alignItems: "center", gap: 2, border: "none", background: "transparent", padding: "6px 6px 6px 2px", cursor: "pointer", fontFamily: "inherit", color: C.primary, fontSize: 15, fontWeight: 700 }}>
            <ChevronLeft size={22} color={C.primary} /><span>Mine dokumenter</span>
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setMenu(true)} aria-label="Valgmuligheder" style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><MoreHorizontal size={20} color={C.ink} /></button>
        </div>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, marginTop: 6, lineHeight: 1.35, wordBreak: "break-word" }}>{dv.name}</div>
      </div>
      <div className="cscroll" style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", background: C.surface, padding: "18px 16px calc(30px + env(safe-area-inset-bottom))" }}>
        {status === "loading" && <div style={{ textAlign: "center", paddingTop: "14vh", color: C.inkSoft, fontSize: 14.5 }}>Åbner dokument…</div>}
        {status === "ready" && <div className="klario-docx" dangerouslySetInnerHTML={{ __html: dv.html }} />}
        {status === "error" && fallback("Dokumentet kunne ikke vises i Klario.")}
        {status === "legacy" && fallback("Dette ældre Word-format kan ikke forhåndsvises direkte i Klario.")}
      </div>
      {menu && (
        <Sheet label="Dokumentvalg" onClose={() => setMenu(false)} top>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, wordBreak: "break-word", marginBottom: 4 }}>{dv.name}</div>
          <div style={{ fontSize: 12.5, color: C.inkFaint, marginBottom: 6 }}>Originalfilen deles uændret.</div>
          <button onClick={() => { setMenu(false); onShare(); }} style={{ width: "100%", border: "none", background: "transparent", textAlign: "left", padding: "14px 4px", fontSize: 15, fontWeight: 600, color: C.ink, cursor: "pointer", fontFamily: "inherit", borderTop: `1px solid ${C.line}` }}>Del / åbn i anden app</button>
          <button onClick={() => { setMenu(false); onShare(); }} style={{ width: "100%", border: "none", background: "transparent", textAlign: "left", padding: "14px 4px", fontSize: 15, fontWeight: 600, color: C.ink, cursor: "pointer", fontFamily: "inherit", borderTop: `1px solid ${C.line}` }}>Gem i Filer</button>
          <button onClick={() => setMenu(false)} style={{ width: "100%", marginTop: 10, border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "13px", fontSize: 15, fontWeight: 700, color: C.ink, cursor: "pointer", fontFamily: "inherit", minHeight: 48 }}>Annullér</button>
        </Sheet>
      )}
    </div>
  );
}

export default function Klario() {
  const [screen, setScreen] = useState("hjem");
  const [medlibSel, setMedlibSel] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [recents, setRecents] = useState([]);
  const [moreView, setMoreView] = useState(null);
  const [akutView, setAkutView] = useState(null);
  const [region, setRegion] = useState(null);        // KLARIO region — kept in React state (same in-memory model as favoritter/senest brugt)
  const [callPrompt, setCallPrompt] = useState(null); // { phone } — confirmation shown before any tel: link is used
  const [procView, setProcView] = useState(null); // Plejeprocedurer — open procedure id
  const [injView, setInjView] = useState(null); // Injektioner — internal view (module id / tool / null)
  const [termView, setTermView] = useState(null); // Fagligt sprog — open term id
  const [procQuery, setProcQuery] = useState("");
  const [termQuery, setTermQuery] = useState("");
  const [anatView, setAnatView] = useState(null); // Anatomi & fysiologi — open entry id
  const [anatQuery, setAnatQuery] = useState("");  // Anatomi & fysiologi — search
  const [anatCat, setAnatCat] = useState("alle");  // Anatomi & fysiologi — active subcategory
  const [farmaSec, setFarmaSec] = useState(null);  // Farmakologi — open section id (null = hub)
  const [farmaItem, setFarmaItem] = useState(null); // Farmakologi — open item within a section
  const [farmaQuery, setFarmaQuery] = useState(""); // Farmakologi — begreber search
  const [calcView, setCalcView] = useState(null); // Lommeregnere — open tool (medicin/infusion/bmi)
  const [calcGroup, setCalcGroup] = useState(null); // which calculator group is being shown (medicin | bmi)
  const [calcBack, setCalcBack] = useState(null);   // where to return from a calculator (hjem | vaerktoejer | soeg)
  const [activeQuiz, setActiveQuiz] = useState(null); // Test din viden — open quiz overlay (topicId)
  const [quizStore, setQuizStore] = useState(loadQuizStore); // Test din viden progress + mistakes (localStorage)
  const [quizCat, setQuizCat] = useState(null); // Test din viden — open category's test list
  const [quizMsg, setQuizMsg] = useState(null); // transient note on the test list (e.g. no mistakes yet)
  const [caseView, setCaseView] = useState(null); // Case-træning — open case id
  const [notes, setNotes] = useState(() => loadNotes()); // Husk at tjekke — persisted locally
  const [noteModal, setNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  // Mine dokumenter (IndexedDB)
  const [docs, setDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [docsReady, setDocsReady] = useState(false);
  const [docErr, setDocErr] = useState(null);
  const [docFolder, setDocFolder] = useState("alle");
  const [docQuery, setDocQuery] = useState("");
  const [docSort, setDocSort] = useState("nyeste");
  const [docMenu, setDocMenu] = useState(null);      // id → options sheet
  const [preview, setPreview] = useState(null);      // {url,mime,name}
  const [docxView, setDocxView] = useState(null);     // in-app DOCX reader: {meta,blob,name,status,html}
  const [pendingFile, setPendingFile] = useState(null); // {file,name,folderId,note}
  const [folderModal, setFolderModal] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [renameFolderT, setRenameFolderT] = useState(null); // {id,name}
  const [deleteFolderT, setDeleteFolderT] = useState(null); // id
  const [renameDocT, setRenameDocT] = useState(null); // {id,name}
  const [moveDocT, setMoveDocT] = useState(null);     // id
  const [noteDocT, setNoteDocT] = useState(null);     // {id,note}
  const [deleteDocT, setDeleteDocT] = useState(null); // id
  const fileInputRef = useRef(null);
  const [caseCat, setCaseCat] = useState("Alle");
  const [caseLevel, setCaseLevel] = useState(0);
  const [pbQuery, setPbQuery] = useState(""); // Akut telefonbog — instant local search
  const mainRef = useRef(null);
  const searchRef = useRef(null);
  const pendingScroll = useRef(null);

  const recordRecent = (id) => setRecents((p) => [id, ...p.filter((x) => x !== id)].slice(0, 8));
  const toggleFav = (id) => setFavs((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleExpand = (id) => {
    const willOpen = !expanded.has(id);
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
    if (willOpen) recordRecent(id);
  };
  const scrollTop = () => requestAnimationFrame(() => { if (mainRef.current) mainRef.current.scrollTop = 0; });

  const openCategory = (catId) => { setActiveCat(catId); scrollTop(); };
  const openCard = (id) => {
    const { cat } = CARD_INDEX[id];
    setActiveCat(cat.id);
    setExpanded((p) => new Set(p).add(id));
    recordRecent(id);
    pendingScroll.current = id;
  };
  const goTab = (tab) => { setActiveCat(null); setMoreView(null); setAkutView(null); setProcView(null); setTermView(null); setCalcView(null); setCalcGroup(null); setCalcBack(null); setCaseView(null); setActiveQuiz(null); setQuizCat(null); setQuizMsg(null); setAnatView(null); setAnatQuery(""); setAnatCat("alle"); setFarmaSec(null); setFarmaItem(null); setFarmaQuery(""); setNoteModal(false); setDeleteNoteId(null); setDocMenu(null); setPendingFile(null); if (preview) { try { URL.revokeObjectURL(preview.url); } catch (e) {} setPreview(null); } setDocxView(null); setScreen(tab); scrollTop(); };
  useEffect(() => { saveNotes(notes); }, [notes]);
  const openNotes = notes.filter((n) => !n.completed);
  const doneNotes = notes.filter((n) => n.completed);
  const addNote = () => { const t = noteText.trim(); if (!t) return; setNotes((prev) => [{ id: noteId(), text: t, createdAt: new Date().toISOString(), completed: false }, ...prev]); setNoteText(""); setNoteModal(false); };
  const toggleNote = (id) => setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n)));
  const removeNote = (id) => { setNotes((prev) => prev.filter((n) => n.id !== id)); setDeleteNoteId(null); };
  const searchNote = (text) => { setQuery(noteSearchTerm(text)); goTab("soeg"); };

  // ---- Mine dokumenter ----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [fs, ds] = await docStore.init(DEFAULT_FOLDERS);
        if (!alive) return;
        setFolders(fs); setDocs(ds); setDocsReady(true);
      } catch (e) { if (alive) { setDocErr(typeof indexedDB === "undefined" ? "ingen_lager" : "kunne_ikke_indlaese"); setDocsReady(true); } }
    })();
    return () => { alive = false; };
  }, []);
  const folderName = (id) => { const f = folders.find((x) => x.id === id); return f ? f.name : null; };
  const docsFiltered = (() => {
    let list = docs.slice();
    if (docFolder !== "alle") list = list.filter((d) => (docFolder === "ingen" ? !d.folderId : d.folderId === docFolder));
    const q = docQuery.trim().toLowerCase();
    if (q) list = list.filter((d) => (d.displayName || "").toLowerCase().includes(q) || (d.note || "").toLowerCase().includes(q) || (folderName(d.folderId) || "").toLowerCase().includes(q));
    list.sort((a, b) => {
      if (docSort === "navn") return (a.displayName || "").localeCompare(b.displayName || "", "da");
      if (docSort === "navnrev") return (b.displayName || "").localeCompare(a.displayName || "", "da");
      const t = (x) => new Date(x.createdAt).getTime() || 0;
      return docSort === "aeldste" ? t(a) - t(b) : t(b) - t(a);
    });
    return list;
  })();
  const pickFile = () => { if (fileInputRef.current) fileInputRef.current.click(); };
  const onFilePicked = (e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return; setPendingFile({ file: f, name: stripExt(f.name), folderId: docFolder !== "alle" && docFolder !== "ingen" ? docFolder : "", note: "" }); };
  const saveDoc = async () => {
    const p = pendingFile; if (!p) return;
    const meta = { id: docUid(), originalName: p.file.name, displayName: (p.name.trim() || p.file.name), mimeType: p.file.type || guessMime(p.file.name), size: p.file.size, createdAt: nowISO(), updatedAt: nowISO(), folderId: p.folderId || null, note: p.note.trim() };
    try { await docStore.putDoc(meta, p.file); setDocs((prev) => [meta, ...prev]); setPendingFile(null); }
    catch (e) { setDocErr(e && e.name === "QuotaExceededError" ? "kvote" : "kunne_ikke_gemme"); }
  };
  const shareBlob = async (meta, blob) => {
    const fname = downloadName(meta && meta.displayName, meta && meta.originalName);
    const type = mimeFor(meta, blob);
    try {
      const file = new File([blob], fname, { type });
      if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: (meta && meta.displayName) || fname });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return; // user cancelled the share sheet
      // any other share failure → fall through to the download fallback
    }
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = fname; a.rel = "noopener";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => { try { URL.revokeObjectURL(url); } catch (x) {} }, 15000);
    } catch (e2) { setDocErr("kunne_ikke_aabne"); }
  };
  const openDocx = async (meta, blob) => {
    setDocxView({ meta, blob, name: (meta && meta.displayName) || "Dokument", status: "loading", html: "" });
    try {
      if (!(window.mammoth && window.mammoth.convertToHtml)) throw new Error("no-lib");
      const ab = await blobToArrayBuffer(blob); // reads a COPY — the stored Blob is never modified
      const result = await window.mammoth.convertToHtml({ arrayBuffer: ab });
      const html = (result && result.value ? result.value : "").trim();
      setDocxView((v) => (v && v.meta && meta && v.meta.id === meta.id ? { ...v, status: html ? "ready" : "error", html } : v));
    } catch (e) {
      setDocxView((v) => (v ? { ...v, status: "error" } : v));
    }
  };
  const closeDocx = () => setDocxView(null);
  const openDoc = async (id) => {
    try {
      const rec = await docStore.getBlob(id); const meta = docs.find((d) => d.id === id);
      if (!rec || !rec.blob) throw new Error("missing");
      const mime = mimeFor(meta, rec.blob);
      if (isPreviewableMime(mime)) {                       // PDF + images → in-app preview (unchanged)
        const url = URL.createObjectURL(rec.blob);
        setPreview({ url, mime, name: (meta && meta.displayName) || "Dokument" });
      } else if (isDocxName(meta)) {                        // .docx → read locally inside Klario
        openDocx(meta, rec.blob);
      } else if (isLegacyDocName(meta)) {                   // legacy .doc → cannot render client-side
        setDocxView({ meta, blob: rec.blob, name: (meta && meta.displayName) || "Dokument", status: "legacy", html: "" });
      } else {                                              // other types → iOS share sheet (unchanged)
        await shareBlob(meta, rec.blob);
      }
    } catch (e) { setDocErr("kunne_ikke_aabne"); }
  };
  const closePreview = () => { if (preview) { try { URL.revokeObjectURL(preview.url); } catch (x) {} } setPreview(null); };
  const shareDoc = async (id) => {
    try {
      const rec = await docStore.getBlob(id); const meta = docs.find((d) => d.id === id);
      if (!rec || !rec.blob) return;
      await shareBlob(meta, rec.blob);
    } catch (e) { setDocErr("kunne_ikke_aabne"); }
  };
  const doRenameDoc = async () => { const t = renameDocT; if (!t || !t.name.trim()) return; const meta = docs.find((d) => d.id === t.id); if (!meta) return; const nd = { ...meta, displayName: t.name.trim(), updatedAt: nowISO() }; try { await docStore.putDocMeta(nd); setDocs((p) => p.map((d) => (d.id === t.id ? nd : d))); setRenameDocT(null); } catch (e) { setDocErr("kunne_ikke_slette"); } };
  const doMoveDoc = async (fid) => { const id = moveDocT; const meta = docs.find((d) => d.id === id); if (!meta) return; const nd = { ...meta, folderId: fid || null, updatedAt: nowISO() }; try { await docStore.putDocMeta(nd); setDocs((p) => p.map((d) => (d.id === id ? nd : d))); setMoveDocT(null); } catch (e) { setDocErr("kunne_ikke_slette"); } };
  const doSaveNote = async () => { const t = noteDocT; const meta = docs.find((d) => d.id === t.id); if (!meta) return; const nd = { ...meta, note: t.note.trim(), updatedAt: nowISO() }; try { await docStore.putDocMeta(nd); setDocs((p) => p.map((d) => (d.id === t.id ? nd : d))); setNoteDocT(null); } catch (e) { setDocErr("kunne_ikke_slette"); } };
  const doDeleteDoc = async () => { const id = deleteDocT; try { await docStore.deleteDoc(id); setDocs((p) => p.filter((d) => d.id !== id)); setDeleteDocT(null); } catch (e) { setDocErr("kunne_ikke_slette"); } };
  const createFolder = async () => { const n = folderNameInput.trim(); if (!n) return; const f = { id: "f-" + Date.now().toString(36), name: n, createdAt: nowISO() }; try { await docStore.putFolder(f); setFolders((p) => [...p, f]); setFolderNameInput(""); setFolderModal(false); } catch (e) { setDocErr("kunne_ikke_slette"); } };
  const doRenameFolder = async () => { const t = renameFolderT; if (!t || !t.name.trim()) return; const f = folders.find((x) => x.id === t.id); if (!f) return; const nf = { ...f, name: t.name.trim() }; try { await docStore.putFolder(nf); setFolders((p) => p.map((x) => (x.id === t.id ? nf : x))); setRenameFolderT(null); } catch (e) { setDocErr("kunne_ikke_slette"); } };
  const doDeleteFolder = async () => {
    const fid = deleteFolderT; const inFolder = docs.filter((d) => d.folderId === fid);
    try { for (const d of inFolder) { await docStore.putDocMeta({ ...d, folderId: null, updatedAt: nowISO() }); } await docStore.deleteFolder(fid); setFolders((p) => p.filter((x) => x.id !== fid)); setDocs((p) => p.map((d) => (d.folderId === fid ? { ...d, folderId: null } : d))); if (docFolder === fid) setDocFolder("alle"); setDeleteFolderT(null); }
    catch (e) { setDocErr("kunne_ikke_slette"); }
  };
  const startCall = (phone) => setCallPrompt({ phone });

  useEffect(() => {
    if (activeCat && pendingScroll.current) {
      const id = pendingScroll.current; pendingScroll.current = null;
      setTimeout(() => { document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 90);
    }
  }, [activeCat]);
  useEffect(() => { if (screen === "soeg" && !activeCat) searchRef.current?.focus(); }, [screen, activeCat]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL_CARDS.filter((c) => c.search.includes(q)) : [];
  }, [query]);

  const favCards = ALL_CARDS.filter((c) => favs.has(c.card.id));
  const favProcs = PLEJE_PROCS.filter((p) => favs.has(p.id));
  const recentCards = recents.map((id) => CARD_INDEX[id]).filter(Boolean);
  const activeCatObj = DATA.find((c) => c.id === activeCat);
  const akut = DATA.find((c) => c.id === "akut");
  const akutCatObj = EMERGENCY_CATEGORIES.find((c) => c.id === akutView);
  const curProc = procView ? procById(procView) : null;
  const curTerm = termView ? termById(termView) : null;
  const procQ = procQuery.trim().toLowerCase();
  const procResults = procQ ? PLEJE_PROCS.filter((p) => procText(p).includes(procQ)) : [];
  const termQ = termQuery.trim().toLowerCase();
  const termResults = termQ ? TERMS.filter((t) => termText(t).includes(termQ)) : [];
  const anatHits = termQ ? anatSearch(termQuery) : [];
  const anatResults = anatQuery.trim() ? anatSearch(anatQuery) : [];
  const openProc = (id) => { setScreen("plejeprocedurer"); setProcView(id); setTermView(null); setInjView(null); scrollTop(); };
  const openTerm = (id) => { setScreen("fagligtsprog"); setTermView(id); setProcView(null); scrollTop(); };
  const openAnat = (id) => { setScreen("anatomi"); setAnatView(id); scrollTop(); };
  const openAnatHome = () => { setScreen("anatomi"); setAnatView(null); scrollTop(); };
  const openFarma = () => { setScreen("farmakologi"); setFarmaSec(null); setFarmaItem(null); setFarmaQuery(""); scrollTop(); };
  const openFarmaSec = (id) => { if (id === "test") { openTestKat("farmakologi"); return; } setScreen("farmakologi"); setFarmaSec(id); setFarmaItem(null); scrollTop(); };
  const inPF = screen === "plejeprocedurer" || screen === "fagligtsprog" || screen === "lommeregnere" || screen === "casetraening" || screen === "quizoversigt" || screen === "dokumenter" || screen === "testviden" || screen === "testkat" || screen === "anatomi" || screen === "farmakologi" || screen === "medicinbibliotek";
  const curCase = caseView ? caseById(caseView) : null;
  const pfTitle = screen === "plejeprocedurer" ? (procView === "p-injektioner" ? (injView ? ((INJ.modules.find((m) => m.id === injView) || {}).title || "Injektioner") : "Injektioner") : (curProc ? curProc.title : "Plejeprocedurer"))
    : screen === "lommeregnere" ? (calcView ? (CALC_TOOLS.find((t) => t.id === calcView) || {}).title : (calcGroup === "medicin" ? "Medicinberegner" : "Lommeregnere"))
    : screen === "casetraening" ? (curCase ? curCase.title : "Case-træning")
    : screen === "quizoversigt" ? "Test din viden"
    : screen === "testkat" ? (quizCat ? catTitleById(quizCat) : "Test din viden")
    : screen === "testviden" ? "Test Viden"
    : screen === "dokumenter" ? "Mine dokumenter"
    : screen === "anatomi" ? "Anatomi & fysiologi"
    : screen === "farmakologi" ? (farmaSec ? ((FARMA_SECTIONS.find((x) => x.id === farmaSec) || {}).title || "Farmakologi") : "Farmakologi")
    : screen === "medicinbibliotek" ? (medlibSel ? ((MEDLIB.find((x) => x.id === medlibSel) || {}).brandName || "Medicinbibliotek") : "Medicinbibliotek")
    : (curTerm ? curTerm.term : "Fagligt sprog");
  const pfBack = () => {
    if (screen === "plejeprocedurer" && procView === "p-injektioner" && injView) { setInjView(null); scrollTop(); return; }
    if (screen === "plejeprocedurer" && procView) { setProcView(null); scrollTop(); return; }
    if (screen === "fagligtsprog" && termView) { setTermView(null); scrollTop(); return; }
    if (screen === "anatomi" && anatView) { setAnatView(null); scrollTop(); return; }
    if (screen === "anatomi") { setScreen("kategorier"); scrollTop(); return; }
    if (screen === "farmakologi" && farmaItem) { setFarmaItem(null); scrollTop(); return; }
    if (screen === "farmakologi" && farmaSec) { setFarmaSec(null); setFarmaQuery(""); scrollTop(); return; }
    if (screen === "farmakologi") { setScreen("kategorier"); scrollTop(); return; }
    if (screen === "medicinbibliotek" && medlibSel) { setMedlibSel(null); scrollTop(); return; }
    if (screen === "medicinbibliotek") { setScreen("hjem"); scrollTop(); return; }
    if (screen === "lommeregnere") {
      if (calcView && calcGroup === "medicin") { setCalcView(null); scrollTop(); return; }
      const back = calcBack; setCalcView(null); setCalcGroup(null); setCalcBack(null);
      if (back === "hjem") { setScreen("hjem"); scrollTop(); return; }
      if (back === "soeg") { setScreen("soeg"); scrollTop(); return; }
      if (back === "vaerktoejer") { setScreen("kategorier"); setActiveCat("vaerktoejer"); scrollTop(); return; }
      setScreen("kategorier"); scrollTop(); return;
    }
    if (screen === "casetraening" && caseView) { setCaseView(null); scrollTop(); return; }
    if (screen === "testkat") { setScreen("quizoversigt"); scrollTop(); return; }
    setScreen("kategorier"); setProcView(null); setTermView(null); setCalcView(null); setCalcGroup(null); setCalcBack(null); setCaseView(null); scrollTop();
  };
  const openCase = (id) => { setScreen("casetraening"); setCaseView(id); scrollTop(); };
  const openTestKat = (catId) => { setQuizCat(catId); setQuizMsg(null); setActiveCat(null); setScreen("testkat"); scrollTop(); };
  const startTest = (catId, n) => { const raw = buildTestQuestions(catId, n); if (!raw.length) return; const qs = shuffleArr(raw).map(shuffleOptions); setActiveQuiz({ title: "Test " + n, category: catTitleById(catId), catId, level: 0, caseId: CAT_CASE[catId] || null, testId: catId + "#" + n, qs }); };
  const startMistakes = (catId) => { const ids = (quizStore.mistakes && quizStore.mistakes[catId]) || []; const bank = CATEGORY_BANK[catId] || []; const byId = {}; bank.forEach((q) => { byId[q.qid] = q; }); const raw = ids.map((id) => byId[id]).filter(Boolean).slice(0, 10); if (!raw.length) { setQuizCat(catId); setQuizMsg("Du har ingen fejl at øve endnu."); setActiveCat(null); setScreen("testkat"); scrollTop(); return; } const qs = shuffleArr(raw).map(shuffleOptions); setActiveQuiz({ title: "Øv mine fejl", category: catTitleById(catId), catId, level: 0, caseId: null, testId: catId + "#ovfejl", isMistakes: true, qs }); };
  const recordTestResult = (rec) => { setQuizStore((prev) => { const next = { tests: Object.assign({}, prev.tests), mistakes: Object.assign({}, prev.mistakes), seen: Object.assign({}, prev.seen) }; if (rec.testId && !rec.isMistakes) next.tests[rec.testId] = { score: rec.score, total: rec.total, date: nowISO() }; const mk = {}; (next.mistakes[rec.catId] || []).forEach((id) => { mk[id] = 1; }); const seen = (next.seen[rec.catId] || []).slice(); (rec.answered || []).forEach((a) => { if (!a.qid) return; if (a.correct) delete mk[a.qid]; else mk[a.qid] = 1; seen.push(a.qid); }); next.mistakes[rec.catId] = Object.keys(mk); const uniq = []; const s = {}; for (let i = seen.length - 1; i >= 0 && uniq.length < 60; i--) { if (!s[seen[i]]) { s[seen[i]] = 1; uniq.unshift(seen[i]); } } next.seen[rec.catId] = uniq; saveQuizStore(next); return next; }); };
  const openTopicById = (id) => { if (procById(id)) { openProc(id); } else if (CARD_INDEX[id]) { openCard(id); } else if (termById(id)) { openTerm(id); } };
  const topicLabel = (id) => { if (procById(id)) return procById(id).title; if (CARD_INDEX[id]) return CARD_INDEX[id].card.title; if (termById(id)) return termById(id).term; return null; };
  const caseTopicNav = { go: openTopicById, label: topicLabel };
  const caseResults = CASES.filter((c) => (caseCat === "Alle" || c.category === caseCat) && (caseLevel === 0 || c.level === caseLevel));
  const CASE_CATS = ["Alle"].concat(CASES.map((c) => c.category).filter((v, i, a) => a.indexOf(v) === i));
  const regionName = region ? EMERGENCY_REGIONS.find((r) => r.id === region)?.name : null;
  const pbQ = pbQuery.trim().toLowerCase();
  const pbResults = pbQ ? PHONEBOOK.filter((e) => pbText(e).includes(pbQ)) : [];
  const pbFavs = PHONEBOOK.filter((e) => favs.has(e.id) && !e.pending);
  const togglePbCat = (id) => setExpanded((p) => { const n = new Set(p); const k = "pbcat-" + id; n.has(k) ? n.delete(k) : n.add(k); return n; });


  const greeting = () => { const h = new Date().getHours(); return h < 10 ? "Godmorgen" : h < 17 ? "God eftermiddag" : "Godaften"; };

  const nav = [
    { id: "hjem", label: "Hjem", Icon: Home },
    { id: "soeg", label: "Søg", Icon: Search },
    { id: "telefonbog", label: "Akut", Icon: PhoneIcon, danger: true },
    { id: "kategorier", label: "Kategorier", Icon: LayoutGrid },
    { id: "favoritter", label: "Favoritter", Icon: Star },
    { id: "mere", label: "Mere", Icon: MoreHorizontal },
  ];

  const PAD = 18;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        .cscroll::-webkit-scrollbar { width: 0; }
        .hscroll { -ms-overflow-style: none; scrollbar-width: none; }
        .hscroll::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .anim { animation: fadeUp .45s cubic-bezier(.22,.61,.36,1) both; }
        button:active { transform: scale(.98); }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#D7DEE4", display: "flex", justifyContent: "center", fontFamily: "'Schibsted Grotesk', system-ui, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 440, height: "100vh", background: C.surface, display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 0 80px rgba(21,33,43,0.16)" }}>

          {/* HEADER */}
          <header style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 18px", background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.line}`, zIndex: 6 }}>
            {activeCat ? (
              <>
                <button onClick={() => setActiveCat(null)} style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ChevronLeft size={20} color={C.ink} />
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.2 }}>{activeCatObj.title}</div>
                  <div style={{ fontSize: 11.5, color: C.inkFaint }}>{activeCatObj.cards.length} emner</div>
                </div>
              </>
            ) : moreView ? (
              <>
                <button onClick={() => { setMoreView(null); scrollTop(); }} style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ChevronLeft size={20} color={C.ink} />
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.2 }}>{MORE_MENU.find((m) => m.id === moreView)?.label}</div>
                  <div style={{ fontSize: 11.5, color: C.inkFaint }}>KLARIO Information</div>
                </div>
              </>
            ) : inPF ? (
              <>
                <button onClick={pfBack} aria-label="Tilbage" style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ChevronLeft size={20} color={C.ink} />
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.2 }}>{pfTitle}</div>
                  <div style={{ fontSize: 11.5, color: C.inkFaint }}>Kategorier</div>
                </div>
              </>
            ) : akutView ? (
              <>
                <button onClick={() => { setAkutView(null); scrollTop(); }} style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ChevronLeft size={20} color={C.ink} />
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.2 }}>{akutCatObj?.name}</div>
                  <div style={{ fontSize: 11.5, color: C.inkFaint }}>Akut hjælp</div>
                </div>
              </>
            ) : screen === "husk" ? (
              <>
                <button onClick={() => goTab("hjem")} aria-label="Tilbage" style={{ border: "none", background: tint(C.ink, "0A"), width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ChevronLeft size={20} color={C.ink} />
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, letterSpacing: -0.2 }}>Husk at tjekke</div>
                  <div style={{ fontSize: 11.5, color: C.inkFaint }}>Personlige noter</div>
                </div>
              </>
            ) : (
              <>
                <Mark />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: 2 }}>KLARIO</div>
                  <div style={{ fontSize: 11, color: C.inkFaint, letterSpacing: 0.2 }}>Din kliniske lommehjælper</div>
                </div>
              </>
            )}
          </header>

          {/* MAIN */}
          <main ref={mainRef} className="cscroll" style={{ flex: 1, overflowY: "auto", padding: `18px ${PAD}px 26px` }}>

            {/* CATEGORY DETAIL */}
            {activeCat && (
              <div key={activeCat} className="anim">
                <div style={{ borderRadius: 22, background: grad(activeCatObj), padding: "18px 18px 20px", color: "#fff", marginBottom: 16, boxShadow: `0 12px 28px ${tint(activeCatObj.color, "55")}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: 99, background: "rgba(255,255,255,0.12)" }} />
                  <activeCatObj.Icon size={26} color="#fff" strokeWidth={2.2} />
                  <div style={{ fontSize: 23, fontWeight: 800, marginTop: 12, letterSpacing: -0.4 }}>{activeCatObj.title}</div>
                  <div style={{ fontSize: 13.5, opacity: 0.92, marginTop: 3 }}>{activeCatObj.subtitle}</div>
                </div>
                {activeCatObj.banner && (
                  <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: tint(activeCatObj.color, "12"), borderRadius: 14, marginBottom: 14 }}>
                    <Info size={17} color={activeCatObj.color} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: C.inkSoft }}>{activeCatObj.banner}</p>
                  </div>
                )}
                {bankSize(activeCatObj.id) > 0 && (
                  <button onClick={() => openTestKat(activeCatObj.id)} aria-label={"Test din viden om " + activeCatObj.title} style={{ width: "100%", border: `1px solid ${tint(C.primary, "33")}`, background: tint(C.primary, "0C"), borderRadius: 14, padding: "13px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, marginBottom: 14, fontFamily: "inherit" }}>
                    <ShieldCheck size={19} color={C.primary} />
                    <span style={{ flex: 1, textAlign: "left", fontSize: 14.5, fontWeight: 700, color: C.primary }}>Test din viden om {activeCatObj.title}</span>
                    <ChevronRight size={18} color={C.primary} />
                  </button>
                )}
                {activeCatObj.id === "vaerktoejer" && (
                  <button onClick={() => { setCalcGroup("bmi"); setCalcView("bmi"); setCalcBack("vaerktoejer"); setActiveCat(null); setScreen("lommeregnere"); scrollTop(); }} aria-label="BMI-beregner" style={{ width: "100%", border: `1px solid ${tint("#7A5AF5", "33")}`, background: tint("#7A5AF5", "0C"), borderRadius: 14, padding: "13px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, marginBottom: 14, fontFamily: "inherit" }}>
                    <Gauge size={19} color="#7A5AF5" />
                    <span style={{ flex: 1, textAlign: "left", fontSize: 14.5, fontWeight: 700, color: "#7A5AF5" }}>BMI-beregner</span>
                    <ChevronRight size={18} color="#7A5AF5" />
                  </button>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {activeCatObj.cards.map((card) => (
                    <ClinCard key={card.id} card={card} cat={activeCatObj} expanded={expanded.has(card.id)} onToggle={() => toggleExpand(card.id)} isFav={favs.has(card.id)} onFav={() => toggleFav(card.id)} onQuiz={setActiveQuiz} onCase={openCase} />
                  ))}
                </div>
                <div style={{ marginTop: 16 }}><DisclaimerPill /></div>
              </div>
            )}

            {/* AKUT HJÆLP — main page */}
            {!activeCat && screen === "akut_hjaelp" && !akutView && (
              <div className="anim">
                <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Akut hjælp</h2>

                <div style={{ borderRadius: 22, padding: 18, marginBottom: 22, background: "linear-gradient(150deg,#F0625E,#C22F2C)", color: "#fff", boxShadow: "0 14px 30px rgba(194,47,44,0.45)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Siren size={22} color="#fff" />
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Livsfare eller alvorlig akut situation</div>
                  </div>
                  <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: 1, lineHeight: 1, margin: "2px 0 10px", userSelect: "text" }}>{svcById("alarm-112").phone}</div>
                  <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.5, opacity: 0.97 }}>Ring 112 ved livsfare, alvorlig ulykke, brand, akut vold eller anden situation, hvor der er behov for ambulance, politi eller brandvæsen med det samme.</p>
                  <button onClick={() => startCall(svcById("alarm-112").phone)} aria-label={`Ring ${svcById("alarm-112").phone}`} style={{ width: "100%", border: "none", borderRadius: 14, padding: "15px 16px", background: "#fff", color: "#C22F2C", fontFamily: "inherit", fontSize: 18, fontWeight: 800, cursor: "pointer", minHeight: 54 }}>Ring {svcById("alarm-112").phone}</button>
                </div>

                <h3 style={{ margin: "0 0 12px", fontSize: 16.5, fontWeight: 700, color: C.ink }}>Hvad har du brug for hjælp til?</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {EMERGENCY_CATEGORIES.map((c) => (
                    <button key={c.id} onClick={() => { setAkutView(c.id); scrollTop(); }} aria-label={c.name} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 16, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 13, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 66 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 13, background: tint(RED, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <c.Icon size={21} color={RED} strokeWidth={2.1} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{c.name}</div>
                        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{c.desc}</div>
                      </div>
                      <ChevronRight size={19} color={C.inkFaint} style={{ flexShrink: 0 }} />
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 18, lineHeight: 1.5 }}>KLARIO stiller ikke diagnoser og vejleder kun til den rette hjælp. Ved tvivl, kontakt relevant sundhedsfaglig person.</p>
              </div>
            )}

            {/* AKUT HJÆLP — category detail */}
            {!activeCat && screen === "akut_hjaelp" && akutView && akutCatObj && (
              <div key={akutView} className="anim">
                <div style={{ borderRadius: 20, background: tint(RED, "0E"), padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <akutCatObj.Icon size={23} color="#fff" strokeWidth={2.1} />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>{akutCatObj.name}</div>
                    <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{akutCatObj.desc}</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {akutCatObj.serviceId && (
                    <EmergencyServiceCard service={svcById(akutCatObj.serviceId)} onCall={startCall} />
                  )}

                  {akutCatObj.kind === "regional" && (
                    region ? (
                      <>
                        {akutCatObj.note && (
                          <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 14px" }}>{akutCatObj.note}</div>
                        )}
                        <EmergencyServiceCard service={acuteFor(region)} onCall={startCall} />
                        <button onClick={() => setRegion(null)} style={{ border: "none", background: "transparent", color: C.primary, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start", padding: 4 }}>Skift region ({regionName})</button>
                      </>
                    ) : (
                      <RegionSelector region={region} onSelect={(r) => setRegion(r)} />
                    )
                  )}

                  {akutCatObj.kind === "pending" && akutCatObj.note && (
                    <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 15px" }}>{akutCatObj.note}</div>
                  )}

                  <EmergencyWarning />
                </div>
              </div>
            )}

            {/* AKUT TELEFONBOG */}
            {!activeCat && screen === "telefonbog" && (
              <div className="anim">
                <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Akut telefonbog</h2>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.45 }}>Vigtige telefonnumre til akut hjælp, sundhed, politi og beredskab.</p>

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: tint(C.ink, "06"), border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 18 }}>
                  <Search size={19} color={C.inkSoft} />
                  <input value={pbQuery} onChange={(e) => setPbQuery(e.target.value)} placeholder="Søg efter nummer eller afdeling" aria-label="Søg efter nummer eller afdeling" style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
                  {pbQuery && <button onClick={() => setPbQuery("")} aria-label="Ryd søgning" style={{ border: "none", background: tint(C.ink, "12"), borderRadius: 99, padding: 4, display: "flex", cursor: "pointer" }}><X size={15} color={C.inkSoft} /></button>}
                </div>

                {pbQ ? (
                  <>
                    <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 12 }}>{pbResults.length} {pbResults.length === 1 ? "resultat" : "resultater"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {pbResults.map((e) => (
                        <EmergencyPhoneEntry key={e.id} e={e} isFav={favs.has(e.id)} onFav={toggleFav} onCall={startCall} highlight={e.region && e.region === region} />
                      ))}
                      {pbResults.length === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "26px 0" }}>Ingen numre matcher \u201E{pbQuery}\u201C.</p>}
                    </div>
                  </>
                ) : (
                  <>
                    {pbFavs.length > 0 && (
                      <div style={{ marginBottom: 22 }}>
                        <h3 style={{ margin: "0 0 11px", fontSize: 15, fontWeight: 700, color: C.ink }}>Mine vigtige numre</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {pbFavs.map((e) => (
                            <EmergencyPhoneEntry key={e.id} e={e} isFav onFav={toggleFav} onCall={startCall} highlight={e.region && e.region === region} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: 22 }}>
                      <h3 style={{ margin: "0 0 11px", fontSize: 15, fontWeight: 700, color: C.ink }}>Vigtigste numre</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {PB_VIGTIGSTE.map((id) => { const e = pbById(id); return <EmergencyPhoneEntry key={id} e={e} isFav={favs.has(id)} onFav={toggleFav} onCall={startCall} />; })}
                      </div>
                    </div>

                    <div style={{ marginBottom: 22 }}>
                      <h3 style={{ margin: "0 0 11px", fontSize: 15, fontWeight: 700, color: C.ink }}>Akut lægehjælp</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {PHONEBOOK.filter((e) => e.category === "laege").map((e) => (
                          <EmergencyPhoneEntry key={e.id} e={e} isFav={favs.has(e.id)} onFav={toggleFav} onCall={startCall} highlight={e.region === region} />
                        ))}
                      </div>
                    </div>

                    <h3 style={{ margin: "0 0 11px", fontSize: 15, fontWeight: 700, color: C.ink }}>Kategorier</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                      {PB_CATS.map((cat) => {
                        const entries = PHONEBOOK.filter((e) => e.category === cat.id);
                        const open = expanded.has("pbcat-" + cat.id);
                        return (
                          <div key={cat.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(21,33,43,0.04)" }}>
                            <button onClick={() => togglePbCat(cat.id)} aria-expanded={open} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: 13 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 11, background: tint(RED, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <cat.Icon size={19} color={RED} strokeWidth={2.1} />
                              </div>
                              <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: C.ink }}>{cat.label}</span>
                              <ChevronDown size={19} color={C.inkFaint} style={{ transition: "transform .25s ease", transform: open ? "rotate(180deg)" : "none" }} />
                            </button>
                            {open && (
                              <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
                                {entries.length > 0 ? entries.map((e) => (
                                  <EmergencyPhoneEntry key={e.id} e={e} isFav={favs.has(e.id)} onFav={toggleFav} onCall={startCall} highlight={e.region === region} />
                                )) : (
                                  <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, background: tint(C.ink, "04"), borderRadius: 12, padding: "12px 13px" }}>Verificerede numre tilføjes senere.</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button onClick={() => { setAkutView(null); setScreen("akut_hjaelp"); scrollTop(); }} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: "13px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                      <Siren size={19} color={RED} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.ink }}>Guidet akut hjælp — find den rette hjælp trin for trin</span>
                      <ChevronRight size={18} color={C.inkFaint} />
                    </button>

                    <EmergencyWarning />
                  </>
                )}
              </div>
            )}

            {/* HJEM — dashboard */}
            {!activeCat && screen === "hjem" && (
              <div className="anim">
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>{greeting()}</div>
                  <h1 style={{ margin: "2px 0 0", fontSize: 26, fontWeight: 800, color: C.ink, letterSpacing: -0.6 }}>Hvad har du brug for?</h1>
                </div>

                {/* SEARCH FIRST */}
                <button onClick={() => goTab("soeg")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "15px 16px", background: tint(C.ink, "06"), border: `1px solid ${C.line}`, borderRadius: 16, cursor: "pointer", marginBottom: 18 }}>
                  <Search size={20} color={C.inkSoft} />
                  <span style={{ fontSize: 15, color: C.inkSoft, fontWeight: 500 }}>Søg i KLARIO…</span>
                </button>

                {/* EMERGENCY */}
                <button onClick={() => openCategory("akut")} style={{ width: "100%", textAlign: "left", border: "none", borderRadius: 22, padding: 18, marginBottom: 24, cursor: "pointer", background: grad(akut), color: "#fff", display: "flex", alignItems: "center", gap: 15, boxShadow: `0 14px 30px ${tint(akut.color, "55")}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -25, bottom: -35, width: 130, height: 130, borderRadius: 99, background: "rgba(255,255,255,0.13)" }} />
                  <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Siren size={26} color="#fff" strokeWidth={2.3} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2 }}>Akut overblik</div>
                    <div style={{ fontSize: 12.5, opacity: 0.95, marginTop: 2 }}>ABCDE · Fald · Åndenød · Brystsmerter</div>
                  </div>
                  <ChevronRight size={22} color="#fff" />
                </button>

                {/* RECENTLY USED */}
                {recentCards.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <SectionHead title="Senest brugt" />
                    <div className="hscroll" style={{ display: "flex", gap: 11, overflowX: "auto", margin: `0 -${PAD}px`, padding: `2px ${PAD}px 4px` }}>
                      {recentCards.map(({ card, cat }) => (
                        <MiniCard key={card.id} card={card} cat={cat} fav={favs.has(card.id)} onClick={() => openCard(card.id)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* FAVORITES */}
                <div style={{ marginBottom: 24 }}>
                  <SectionHead title="Favoritter" action={favCards.length > 0 ? "Se alle" : null} onAction={() => goTab("favoritter")} />
                  {favCards.length > 0 ? (
                    <div className="hscroll" style={{ display: "flex", gap: 11, overflowX: "auto", margin: `0 -${PAD}px`, padding: `2px ${PAD}px 4px` }}>
                      {favCards.map(({ card, cat }) => (
                        <MiniCard key={card.id} card={card} cat={cat} fav onClick={() => openCard(card.id)} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 11, alignItems: "center", padding: "14px 15px", borderRadius: 16, border: `1px dashed ${tint(C.ink, "20")}` }}>
                      <Star size={20} color={C.inkFaint} />
                      <span style={{ fontSize: 13.5, color: C.inkSoft }}>Tryk på stjernen på et kort for at gemme det her.</span>
                    </div>
                  )}
                </div>

                {/* HUSK AT TJEKKE — local quick-notes */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHead title="Husk at tjekke" action={notes.length > 0 ? "Se alle" : null} onAction={() => goTab("husk")} />
                  <div style={{ marginTop: -6, marginBottom: 12, fontSize: 12.5, color: C.inkSoft }}>Ting jeg skal undersøge senere</div>
                  {openNotes.length === 0 ? (
                    <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: "14px 15px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 13.5, color: C.inkSoft }}>Intet du skal tjekke lige nu</span>
                      <button onClick={() => setNoteModal(true)} aria-label="Tilføj note" style={{ border: `1px solid ${tint(C.primary, "33")}`, background: tint(C.primary, "0C"), color: C.primary, borderRadius: 11, padding: "8px 13px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>+ Tilføj</button>
                    </div>
                  ) : (
                    <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
                      {openNotes.slice(0, 3).map((n, i) => (
                        <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "12px 14px", borderTop: i ? `1px solid ${C.line}` : "none" }}>
                          <button onClick={() => toggleNote(n.id)} aria-label={`Markér ${n.text} som færdig`} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", marginTop: 1, flexShrink: 0 }}>
                            <span style={{ display: "block", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${C.inkFaint}` }} />
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.35, wordBreak: "break-word" }}>{n.text}</div>
                            <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 2 }}>{fmtNoteDate(n.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 14px", borderTop: `1px solid ${C.line}`, background: tint(C.ink, "03") }}>
                        <button onClick={() => setNoteModal(true)} aria-label="Tilføj note" style={{ border: "none", background: "transparent", color: C.primary, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Tilføj</button>
                        <button onClick={() => goTab("husk")} style={{ border: "none", background: "transparent", color: C.primary, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 1 }}>Se alle <ChevronRight size={15} /></button>
                      </div>
                    </div>
                  )}
                </div>

                {/* MEDICINOPSLAG — external links to medicin.dk + Medicinberegner */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHead title="Medicinopslag" />
                  <button onClick={() => { setMedlibSel(null); setScreen("medicinbibliotek"); scrollTop(); }} aria-label="Medicinbibliotek" style={{ width: "100%", textAlign: "left", border: `1px solid ${tint("#7A5AF5", "2E")}`, background: `linear-gradient(160deg, ${tint("#7A5AF5", "12")}, ${C.surface})`, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 66, marginBottom: 11 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint("#7A5AF5", "1E"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Pill size={23} color="#5B37C7" strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Medicinbibliotek</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Søg medicin, aktivt stof og lægemiddelgruppe.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                  <button onClick={() => { setCalcGroup("medicin"); setCalcView(null); setCalcBack("hjem"); setScreen("lommeregnere"); scrollTop(); }} aria-label="Medicinberegner" style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 66, marginBottom: 11 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint("#7A5AF5", "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Calculator size={23} color="#7A5AF5" strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Medicinberegner</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Dosis, styrke og infusion.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                  <button onClick={() => { setScreen("farmakologi"); setFarmaSec("halveringstid"); setFarmaItem(null); scrollTop(); }} aria-label="Medicinens halveringstid" style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 16, padding: "13px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 11, minHeight: 60 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: tint("#7A5AF5", "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Clock size={21} color="#5B37C7" strokeWidth={2.1} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>Medicinens halveringstid (T½)</div><div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1 }}>Forstå T½ og prøv beregneren</div></div>
                    <ChevronRight size={19} color={C.inkFaint} />
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
                    {EXTERNAL_RESOURCES.medicine.map((r) => <ExtLinkCard key={r.url} r={r} />)}
                  </div>
                </div>

                {/* STUDIE — external education shortcuts */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHead title="Studie" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
                    {EXTERNAL_RESOURCES.study.map((r) => <ExtLinkCard key={r.url} r={r} />)}
                  </div>
                </div>

                {/* MOST USED TOOLS */}
                <div style={{ marginBottom: 22 }}>
                  <SectionHead title="Mest brugte værktøjer" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
                    {TOOLS.map((id) => {
                      const { card, cat } = CARD_INDEX[id];
                      return (
                        <button key={id} onClick={() => openCard(id)} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: `linear-gradient(160deg, ${tint(cat.color, "10")}, #fff)`, borderRadius: 18, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 11, minHeight: 104, justifyContent: "space-between" }}>
                          <Chip cat={cat} size={38} radius={12} />
                          <div>
                            <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{card.title}</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: cat.color, marginTop: 2 }}>{cat.title}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <DisclaimerPill />
              </div>
            )}

            {/* HUSK AT TJEKKE — full page (Se alle) */}
            {!activeCat && screen === "husk" && (
              <div className="anim">
                <button onClick={() => setNoteModal(true)} aria-label="Ny note" style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 52, marginBottom: 20 }}>+ Ny note</button>

                <SectionHead title="Skal tjekkes" />
                {openNotes.length === 0 ? (
                  <p style={{ fontSize: 13.5, color: C.inkFaint, margin: "0 0 24px" }}>Ingen noter lige nu.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
                    {openNotes.map((n) => (
                      <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 11, border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 14px" }}>
                        <button onClick={() => toggleNote(n.id)} aria-label={`Markér ${n.text} som færdig`} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", marginTop: 1, flexShrink: 0 }}>
                          <span style={{ display: "block", width: 22, height: 22, borderRadius: "50%", border: `2px solid ${C.inkFaint}` }} />
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.35, wordBreak: "break-word" }}>{n.text}</div>
                          <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 2 }}>{fmtNoteDate(n.createdAt)}</div>
                          <div style={{ display: "flex", gap: 16, marginTop: 9 }}>
                            <button onClick={() => searchNote(n.text)} aria-label={`Søg i KLARIO efter ${noteSearchTerm(n.text)}`} style={{ border: "none", background: "transparent", padding: 0, color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}><Search size={14} /> Søg i KLARIO</button>
                            <button onClick={() => setDeleteNoteId(n.id)} aria-label="Slet note" style={{ border: "none", background: "transparent", padding: 0, color: RED, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Slet</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <SectionHead title="Færdige" />
                {doneNotes.length === 0 ? (
                  <p style={{ fontSize: 13.5, color: C.inkFaint, margin: "0 0 16px" }}>Ingen færdige noter endnu.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    {doneNotes.map((n) => (
                      <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 11, border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 14px", background: tint(C.ink, "03") }}>
                        <button onClick={() => toggleNote(n.id)} aria-label={`Genåbn ${n.text}`} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", marginTop: 1, flexShrink: 0 }}>
                          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "#0FAE9E" }}>
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4 9-10" /></svg>
                          </span>
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, color: C.inkSoft, textDecoration: "line-through", lineHeight: 1.35, wordBreak: "break-word" }}>{n.text}</div>
                          <div style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 2 }}>Færdig</div>
                          <div style={{ display: "flex", gap: 16, marginTop: 9 }}>
                            <button onClick={() => toggleNote(n.id)} aria-label={`Genåbn ${n.text}`} style={{ border: "none", background: "transparent", padding: 0, color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Genåbn</button>
                            <button onClick={() => setDeleteNoteId(n.id)} aria-label="Slet note" style={{ border: "none", background: "transparent", padding: 0, color: RED, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Slet</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 16 }}><DisclaimerPill /></div>
              </div>
            )}

            {/* TEST VIDEN — parent for the two learning functions */}
            {!activeCat && screen === "testviden" && (
              <div className="anim">
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Øv og repetér med quizzer og cases — til skole og praktik.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <button onClick={() => { setScreen("quizoversigt"); scrollTop(); }} aria-label="Test din viden" style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 68 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint(C.primary, "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={23} color={C.primary} strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Test din viden</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Quiz i alle kategorier.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                  <button onClick={() => { setCaseView(null); setScreen("casetraening"); scrollTop(); }} aria-label="Case-træning" style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 68 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint("#D6336C", "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ClipboardList size={23} color="#D6336C" strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Case-træning</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Øv dig som til skole og praktik.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                </div>
              </div>
            )}

            {/* MINE DOKUMENTER */}
            {!activeCat && screen === "dokumenter" && (
              <div className="anim">
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Dine egne studie- og faglige dokumenter samlet ét sted.</p>

                {docErr && (
                  <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: tint(RED, "0C"), border: `1px solid ${tint(RED, "26")}`, borderRadius: 12, padding: "11px 13px", marginBottom: 14 }}>
                    <Info size={16} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ flex: 1, fontSize: 13, color: "#7A2A28", lineHeight: 1.45 }}>{DOC_ERRORS[docErr] || "Der opstod en fejl."}</span>
                    <button onClick={() => setDocErr(null)} aria-label="Luk" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2 }}><X size={16} color={RED} /></button>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <button onClick={pickFile} aria-label="Tilføj dokument" style={{ flex: 2, border: "none", borderRadius: 13, padding: "13px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><Plus size={18} /> Tilføj dokument</button>
                  <button onClick={() => { setFolderNameInput(""); setFolderModal(true); }} aria-label="Ny mappe" style={{ flex: 1, border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "13px", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: C.ink, cursor: "pointer", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Folder size={17} color={C.inkSoft} /> Ny mappe</button>
                </div>

                <div style={{ position: "relative", marginBottom: 11 }}>
                  <Search size={17} color={C.inkFaint} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                  <input value={docQuery} onChange={(e) => setDocQuery(e.target.value)} placeholder="Søg i dokumenter…" aria-label="Søg i dokumenter" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px 12px 38px", fontSize: 15, color: C.ink, background: C.surface, fontFamily: "inherit", outline: "none" }} />
                </div>

                <div className="hscroll" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -18px 10px", padding: "0 18px" }}>
                  {[{ id: "alle", name: "Alle" }].concat(folders).concat(docs.some((d) => !d.folderId) ? [{ id: "ingen", name: "Ingen mappe" }] : []).map((f) => { const on = docFolder === f.id; return (
                    <button key={f.id} onClick={() => setDocFolder(f.id)} style={{ flexShrink: 0, border: `1.5px solid ${on ? C.primary : C.line}`, background: on ? tint(C.primary, "0E") : C.surface, color: on ? C.primary : C.ink, borderRadius: 99, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{f.name}</button>
                  ); })}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                  {docFolder !== "alle" && docFolder !== "ingen" ? (
                    <div style={{ display: "flex", gap: 14 }}>
                      <button onClick={() => { const f = folders.find((x) => x.id === docFolder); setRenameFolderT({ id: docFolder, name: f ? f.name : "" }); }} style={{ border: "none", background: "transparent", padding: 0, color: C.primary, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Omdøb mappe</button>
                      <button onClick={() => setDeleteFolderT(docFolder)} style={{ border: "none", background: "transparent", padding: 0, color: RED, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Slet mappe</button>
                    </div>
                  ) : <span />}
                  <select value={docSort} onChange={(e) => setDocSort(e.target.value)} aria-label="Sortér" style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 10px", fontSize: 13, color: C.ink, background: C.surface, fontFamily: "inherit", cursor: "pointer" }}>
                    <option value="nyeste">Nyeste</option>
                    <option value="aeldste">Ældste</option>
                    <option value="navn">Navn A–Å</option>
                    <option value="navnrev">Navn Å–A</option>
                  </select>
                </div>

                {!docsReady ? (
                  <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Indlæser…</p>
                ) : docs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 16px", border: `1px solid ${C.line}`, borderRadius: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 15, background: tint("#2B6CB0", "12"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><FileText size={26} color="#2B6CB0" strokeWidth={2} /></div>
                    <div style={{ fontSize: 15.5, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Du har endnu ikke tilføjet dokumenter</div>
                    <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5, marginBottom: 16 }}>Gem opgaver, undervisningsmateriale og faglige dokumenter her, så du nemt kan finde dem igen.</div>
                    <button onClick={pickFile} style={{ border: "none", borderRadius: 13, padding: "13px 20px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 48 }}>+ Tilføj dokument</button>
                  </div>
                ) : docsFiltered.length === 0 ? (
                  <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Ingen dokumenter matcher.</p>
                ) : (
                  <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
                    {docsFiltered.map((d, i) => (
                      <div key={d.id} style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
                        <DocRow d={d} folderName={folderName(d.folderId)} onOpen={() => openDoc(d.id)} onMenu={() => setDocMenu(d.id)} />
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 11.5, color: C.inkFaint, lineHeight: 1.45 }}>Dokumenter gemmes lokalt på denne enhed. Sørg for at beholde en kopi af vigtige dokumenter.</p>
                  <p style={{ margin: 0, fontSize: 11.5, color: C.inkFaint, lineHeight: 1.45 }}>Mine dokumenter er beregnet til studie- og fagligt materiale. Gem ikke dokumenter med personfølsomme borgeroplysninger her.</p>
                </div>
              </div>
            )}

            {/* SØG */}
            {!activeCat && screen === "soeg" && (
              <div className="anim">
                <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Søg</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 15px", background: tint(C.ink, "06"), border: `1px solid ${C.line}`, borderRadius: 16, marginBottom: 18 }}>
                  <Search size={20} color={C.inkSoft} />
                  <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Søg efter emne, fx puls eller ISBAR…" style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
                  {query && <button onClick={() => setQuery("")} style={{ border: "none", background: tint(C.ink, "12"), borderRadius: 99, padding: 4, display: "flex", cursor: "pointer" }}><X size={15} color={C.inkSoft} /></button>}
                </div>

                {!query && (
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkFaint, marginBottom: 11, letterSpacing: 0.3 }}>HURTIGE FORSLAG</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                      {TOOLS.map((id) => {
                        const { card, cat } = CARD_INDEX[id];
                        return (
                          <button key={id} onClick={() => openCard(id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px 8px 9px", borderRadius: 99, border: `1px solid ${C.line}`, background: tint(cat.color, "0E"), cursor: "pointer", fontFamily: "inherit" }}>
                            <span style={{ width: 8, height: 8, borderRadius: 99, background: cat.color }} />
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{card.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {query && (() => {
                  const qs2 = query.trim().toLowerCase();
                  const quizHub = qs2.includes("quiz") || qs2.includes("test din viden") || qs2 === "test";
                  const quizCats = DATA.filter((c) => makeCategoryQuiz(c.id) && qs2.includes(c.title.toLowerCase()) && (qs2.includes("quiz") || qs2.includes("test") || true)).map((c) => c.id);
                  const showHub = quizHub && quizCats.length === 0;
                  const procHitsQ = qs2 ? PLEJE_PROCS.filter((p) => procText(p).includes(qs2)) : [];
                  const anatHitsQ = anatSearch(query);
                  const farmaHitsQ = farmaSearch(query);
                  const total = results.length + calcSearch(query).length + quizCats.length + (showHub ? 1 : 0) + anatHitsQ.length + farmaHitsQ.length + procHitsQ.length;
                  return (
                  <>
                    <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 12 }}>{total} {total === 1 ? "resultat" : "resultater"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      {showHub && (
                        <button onClick={() => { setScreen("quizoversigt"); scrollTop(); }} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: tint(C.primary, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={20} color={C.primary} strokeWidth={2.1} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 1 }}>Læring</div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>Test din viden</div></div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      )}
                      {quizCats.map((cid) => { const qz = makeCategoryQuiz(cid); return (
                        <button key={"qz-" + cid} onClick={() => openTestKat(cid)} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: tint(C.primary, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={20} color={C.primary} strokeWidth={2.1} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 1 }}>Quiz</div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>Test din viden om {qz.category}</div></div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      ); })}
                      {calcSearch(query).map((c) => (
                        <button key={c.id} onClick={() => { setCalcView(c.id); setCalcGroup(c.id === "bmi" ? "bmi" : "medicin"); setCalcBack("soeg"); setScreen("lommeregnere"); scrollTop(); }} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: tint("#7A5AF5", "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><c.Icon size={20} color="#7A5AF5" strokeWidth={2.1} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#7A5AF5", marginBottom: 1 }}>Lommeregnere</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{c.title}</div>
                          </div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      ))}
                      {results.map(({ card, cat }) => (
                        <ClinCard key={card.id} card={card} cat={cat} showCat expanded={expanded.has(card.id)} onToggle={() => toggleExpand(card.id)} isFav={favs.has(card.id)} onFav={() => toggleFav(card.id)} onQuiz={setActiveQuiz} onCase={openCase} />
                      ))}
                      {anatHitsQ.map((a) => (
                        <button key={"an-" + a.id} onClick={() => openAnat(a.id)} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: tint("#0FAE9E", "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Activity size={20} color="#0B9488" strokeWidth={2.1} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#0B9488", marginBottom: 1 }}>Anatomi &amp; fysiologi</div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{a.daglig}{a.latin && a.latin !== a.daglig ? " · " + a.latin : ""}</div></div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      ))}
                      {farmaHitsQ.map((h) => (
                        <button key={"fa-" + h.kind + "-" + h.id} onClick={() => { if (h.kind === "term") { setScreen("farmakologi"); setFarmaSec("begreber"); setFarmaItem(null); setFarmaQuery(h.title); scrollTop(); } else { openFarmaSec(h.id); } }} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: tint("#7A5AF5", "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Pill size={20} color="#7A5AF5" strokeWidth={2.1} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#7A5AF5", marginBottom: 1 }}>Farmakologi</div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{h.title}</div></div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      ))}
                      {procHitsQ.map((p) => (
                        <button key={"pr-" + p.id} onClick={() => openProc(p.id)} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: tint("#2E68E0", "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><p.Icon size={20} color="#2257D8" strokeWidth={2.1} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#2257D8", marginBottom: 1 }}>Plejeprocedurer</div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{p.title}</div></div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      ))}
                      {total === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "30px 0" }}>Ingen emner matcher \u201E{query}\u201C.</p>}
                    </div>
                  </>
                  );
                })()}
              </div>
            )}

            {/* KATEGORIER */}
            {/* TEST DIN VIDEN — quiz hub */}
            {!activeCat && screen === "quizoversigt" && (
              <div className="anim">
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Vælg et emne og se, hvor godt du kan stoffet.</p>
                <div style={{ display: "flex", gap: 10, background: tint(C.primary, "0A"), border: `1px solid ${tint(C.primary, "22")}`, borderRadius: 13, padding: "12px 14px", marginBottom: 16 }}>
                  <Info size={17} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>Quizzer i Klario er til læring og erstatter ikke lokale instrukser, ordinationer eller sundhedsfaglig vurdering.</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {TESTVIDEN_CAT_IDS.map((cid) => { const tc = testCountFor(cid); return (
                    <button key={cid} onClick={() => openTestKat(cid)} aria-label={"Test din viden om " + catTitleById(cid)} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 16, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 60 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: tint(C.primary, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={20} color={C.primary} strokeWidth={2.1} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{catTitleById(cid)}</div>
                        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1 }}>{tc} {tc === 1 ? "test" : "tests"} · {bankSize(cid)} spørgsmål</div>
                      </div>
                      <ChevronRight size={18} color={C.inkFaint} />
                    </button>
                  ); })}
                </div>
              </div>
            )}

            {/* TEST DIN VIDEN — a category's tests + Øv mine fejl */}
            {!activeCat && screen === "testkat" && quizCat && (() => {
              const cnt = testCountFor(quizCat);
              const mist = (quizStore.mistakes && quizStore.mistakes[quizCat]) || [];
              const tests = quizStore.tests || {};
              return (
                <div className="anim">
                  <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Vælg en test. Spørgsmål og svar blandes hver gang, så du kan øve igen og igen.</p>
                  {quizMsg && (
                    <div style={{ display: "flex", gap: 9, alignItems: "center", background: tint(C.primary, "0A"), border: `1px solid ${tint(C.primary, "22")}`, borderRadius: 12, padding: "11px 13px", marginBottom: 14 }}>
                      <Info size={16} color={C.primary} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, color: C.ink }}>{quizMsg}</span>
                    </div>
                  )}
                  {mist.length > 0 ? (
                    <button onClick={() => startMistakes(quizCat)} aria-label="Øv mine fejl" style={{ width: "100%", border: "none", borderRadius: 14, padding: "14px 16px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 52, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ flex: 1, textAlign: "left" }}>Øv mine fejl</span>
                      <span style={{ fontSize: 13, fontWeight: 700, background: "rgba(255,255,255,0.22)", padding: "2px 9px", borderRadius: 8 }}>{mist.length}</span>
                    </button>
                  ) : (
                    <div style={{ fontSize: 13, color: C.inkFaint, background: tint(C.ink, "05"), border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>Du har ingen fejl at øve endnu.</div>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.inkFaint, letterSpacing: 0.3, margin: "18px 0 11px" }}>TESTS</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {Array.from({ length: cnt }).map((_, k) => { const n = k + 1; const rec = tests[quizCat + "#" + n]; const done = !!rec; return (
                      <button key={n} onClick={() => startTest(quizCat, n)} aria-label={"Test " + n} style={{ textAlign: "left", border: `1px solid ${done ? tint("#0FAE9E", "44") : C.line}`, background: done ? tint("#0FAE9E", "08") : C.surface, borderRadius: 16, padding: 15, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, minHeight: 92, justifyContent: "space-between", boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Test {n}</span>
                          {done && <ShieldCheck size={18} color="#0FAE9E" />}
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: done ? "#1F7A5A" : C.inkFaint }}>{done ? rec.score + "/" + rec.total + " rigtige" : "Ikke gennemført"}</div>
                      </button>
                    ); })}
                  </div>
                  <p style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 16, lineHeight: 1.5 }}>Efterhånden som der tilføjes flere spørgsmål, bliver der flere og mere varierede tests.</p>
                </div>
              );
            })()}

            {/* CASE-TRÆNING — overview */}
            {!activeCat && screen === "casetraening" && !caseView && (
              <div className="anim">
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Øv dig som til skole, praktik og farmakologiopgaver.</p>
                <div style={{ display: "flex", gap: 10, background: tint(RED, "0C"), border: `1px solid ${tint(RED, "26")}`, borderRadius: 13, padding: "12px 14px", marginBottom: 16 }}>
                  <Siren size={17} color={RED} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>{CASE_SAFETY}</span>
                </div>
                <div className="hscroll" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -18px 10px", padding: "0 18px" }}>
                  {CASE_CATS.map((cat) => { const on = caseCat === cat; return (
                    <button key={cat} onClick={() => setCaseCat(cat)} style={{ flexShrink: 0, border: `1.5px solid ${on ? C.primary : C.line}`, background: on ? tint(C.primary, "0E") : C.surface, color: on ? C.primary : C.ink, borderRadius: 99, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{cat}</button>
                  ); })}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {[{ v: 0, l: "Alle niveauer" }, { v: 1, l: "Niveau 1" }, { v: 2, l: "Niveau 2" }, { v: 3, l: "Niveau 3" }].map((o) => { const on = caseLevel === o.v; return (
                    <button key={o.v} onClick={() => setCaseLevel(o.v)} style={{ border: `1.5px solid ${on ? C.primary : C.line}`, background: on ? tint(C.primary, "0E") : C.surface, color: on ? C.primary : C.ink, borderRadius: 10, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{o.l}</button>
                  ); })}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {caseResults.map((c) => <CaseCard key={c.id} c={c} onOpen={openCase} />)}
                  {caseResults.length === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Ingen cases i dette filter endnu.</p>}
                </div>
              </div>
            )}

            {/* CASE-TRÆNING — detail */}
            {!activeCat && screen === "casetraening" && caseView && curCase && (
              <div key={caseView} className="anim"><CaseDetail c={curCase} onTopic={caseTopicNav} /></div>
            )}

            {/* LOMMEREGNERE — landing */}
            {!activeCat && screen === "lommeregnere" && !calcView && (
              <div className="anim">
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Hurtige beregnere til hverdagen. Kontrollér altid resultatet mod ordination og lokale instrukser.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {CALC_TOOLS.filter((t) => (calcGroup === "bmi" ? t.id === "bmi" : (t.id === "medicin" || t.id === "infusion" || t.id === "blodtryk"))).map((t) => (
                    <button key={t.id} onClick={() => { setCalcView(t.id); scrollTop(); }} aria-label={t.title} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 72 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: tint("#7A5AF5", "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><t.Icon size={23} color="#7A5AF5" strokeWidth={2.1} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{t.title}</div>
                        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{t.sub}</div>
                      </div>
                      <ChevronRight size={20} color={C.inkFaint} />
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 16, lineHeight: 1.5 }}>Klario er et lærings- og støtteværktøj. Lokale procedurer har altid forrang, og resultatet skal verificeres, hvor det kræves.</p>
              </div>
            )}

            {/* LOMMEREGNERE — tools */}
            {!activeCat && screen === "lommeregnere" && calcView === "medicin" && (
              <div key="c-medicin" className="anim"><MedicinBeregner /></div>
            )}
            {!activeCat && screen === "lommeregnere" && calcView === "infusion" && (
              <div key="c-infusion" className="anim"><InfusionsBeregner /></div>
            )}
            {!activeCat && screen === "lommeregnere" && calcView === "bmi" && (
              <div key="c-bmi" className="anim"><BmiBeregner /></div>
            )}
            {!activeCat && screen === "lommeregnere" && calcView === "blodtryk" && (
              <div key="c-blodtryk" className="anim"><BlodtryksBeregner /></div>
            )}

            {/* PLEJEPROCEDURER — overview */}
            {!activeCat && screen === "plejeprocedurer" && !procView && (
              <div className="anim">
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Praktiske trin-for-trin guides til pleje, observation og dokumentation.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: tint(C.ink, "06"), border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 16 }}>
                  <Search size={19} color={C.inkSoft} />
                  <input value={procQuery} onChange={(e) => setProcQuery(e.target.value)} placeholder="Søg i plejeprocedurer" aria-label="Søg i plejeprocedurer" style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
                  {procQuery && <button onClick={() => setProcQuery("")} aria-label="Ryd søgning" style={{ border: "none", background: tint(C.ink, "12"), borderRadius: 99, padding: 4, display: "flex", cursor: "pointer" }}><X size={15} color={C.inkSoft} /></button>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(procQ ? procResults : PLEJE_PROCS).map((p) => <ProcCard key={p.id} p={p} onOpen={openProc} />)}
                  {procQ && procResults.length === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Ingen procedurer matcher \u201E{procQuery}\u201C.</p>}
                </div>
              </div>
            )}

            {/* PLEJEPROCEDURER — detail */}
            {!activeCat && screen === "plejeprocedurer" && procView && curProc && (
              <div key={procView} className="anim">
                {procView === "p-injektioner"
                  ? <Injektioner view={injView} setView={setInjView} onQuiz={() => openTestKat("injektion")} isFav={favs.has("p-injektioner")} onFav={() => toggleFav("p-injektioner")} />
                  : <ProcDetail p={curProc} onTerm={openTerm} onQuiz={setActiveQuiz} onCase={openCase} />}
              </div>
            )}

            {/* FAGLIGT SPROG — overview */}
            {!activeCat && screen === "fagligtsprog" && !termView && (
              <div className="anim">
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Fra hverdagssprog til SSA-sprog.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: tint(C.ink, "06"), border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 16 }}>
                  <Search size={19} color={C.inkSoft} />
                  <input value={termQuery} onChange={(e) => setTermQuery(e.target.value)} placeholder="Fx: Han er forpustet…" aria-label="Søg efter ord eller situation" style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
                  {termQuery && <button onClick={() => setTermQuery("")} aria-label="Ryd søgning" style={{ border: "none", background: tint(C.ink, "12"), borderRadius: 99, padding: 4, display: "flex", cursor: "pointer" }}><X size={15} color={C.inkSoft} /></button>}
                </div>

                {termQ ? (
                  <>
                    <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 11 }}>{termResults.length + anatHits.length} {termResults.length + anatHits.length === 1 ? "resultat" : "resultater"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {termResults.map((t) => <TermCard key={t.id} t={t} onOpen={openTerm} />)}
                      {termResults.length === 0 && anatHits.length === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Ingen ord matcher \u201E{termQuery}\u201C.</p>}
                    </div>
                    {anatHits.length > 0 && (
                      <div style={{ marginTop: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.inkFaint, letterSpacing: 0.3, marginBottom: 9 }}>ANATOMI &amp; FYSIOLOGI</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                          {anatHits.map((a) => <AnatCard key={a.id} a={a} onOpen={openAnat} />)}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: 16 }}><TestButtons topicId="fs" onQuiz={setActiveQuiz} /></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                      <Acc title="Sig det fagligt">
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {SIG_PAIRS.map((s, i) => (
                            <div key={i} style={{ borderTop: i > 0 ? `1px solid ${C.line}` : "none", paddingTop: i > 0 ? 12 : 0 }}>
                              <div style={{ fontSize: 13.5, color: "#7A2A28", lineHeight: 1.4 }}>❌ {s.bad}</div>
                              <div style={{ fontSize: 13.5, color: "#1F5136", marginTop: 4, lineHeight: 1.4 }}>✓ {s.good}</div>
                              <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.4 }}>Gør det mere objektivt: {s.better}</div>
                            </div>
                          ))}
                        </div>
                      </Acc>
                      <Acc title="Fra observation → dokumentation">
                        <div style={{ fontSize: 12.5, color: C.inkSoft }}>Du ser:</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: "3px 0 10px" }}>{DOC_TRAINER.see}</div>
                        <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 6 }}>Tænk fagligt:</div>
                        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                          {DOC_TRAINER.steps.map((q, i) => (
                            <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                              <span style={{ width: 20, height: 20, borderRadius: 6, background: tint(C.primary, "16"), color: C.primary, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                              <span style={{ fontSize: 13.5, lineHeight: 1.45, color: C.ink }}>{q}</span>
                            </li>
                          ))}
                        </ol>
                        <div style={{ fontSize: 12.5, color: C.inkSoft, margin: "12px 0 4px" }}>Eksempel på dokumentation:</div>
                        <div style={{ fontSize: 13.5, color: "#1F5136", background: tint("#0FAE9E", "0E"), borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>{DOC_TRAINER.example}</div>
                        <div style={{ display: "flex", gap: 9, marginTop: 10, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "2A")}`, borderRadius: 10, padding: "9px 11px" }}>
                          <Info size={16} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} />
                          <span style={{ fontSize: 12.5, color: "#7A4E0A", lineHeight: 1.45 }}>{DOC_TRAINER.note}</span>
                        </div>
                      </Acc>
                    </div>

                    {FS_CATS.map((cat) => {
                      const list = TERMS.filter((t) => t.cat === cat);
                      if (list.length === 0) return null;
                      return (
                        <div key={cat} style={{ marginBottom: 18 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.inkFaint, letterSpacing: 0.3, marginBottom: 9 }}>{cat.toUpperCase()}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                            {list.map((t) => <TermCard key={t.id} t={t} onOpen={openTerm} />)}
                          </div>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 4, lineHeight: 1.5 }}>Stil aldrig en diagnose ud fra én observation. Beskriv objektivt, hvad du ser.</p>
                  </>
                )}
              </div>
            )}

            {/* FAGLIGT SPROG — detail */}
            {!activeCat && screen === "fagligtsprog" && termView && curTerm && (
              <div key={termView} className="anim">
                <TermDetail t={curTerm} onProc={openProc} />
              </div>
            )}

            {/* ANATOMI & FYSIOLOGI */}
            {!activeCat && screen === "anatomi" && (
              anatView && anatById(anatView) ? (
                <div key={anatView} className="anim">
                  <AnatDetail a={anatById(anatView)} onCat={openCategory} onTest={openTestKat} />
                </div>
              ) : (
                <div className="anim">
                  <p style={{ margin: "0 0 14px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Slå kropsdele, organer og faglige/latinske betegnelser op.</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: tint(C.ink, "06"), border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 14 }}>
                    <Search size={19} color={C.inkSoft} />
                    <input value={anatQuery} onChange={(e) => setAnatQuery(e.target.value)} placeholder="Søg kropsdel, organ eller fagligt ord…" aria-label="Søg i anatomi" style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
                    {anatQuery && <button onClick={() => setAnatQuery("")} aria-label="Ryd søgning" style={{ border: "none", background: tint(C.ink, "12"), borderRadius: 99, padding: 4, display: "flex", cursor: "pointer" }}><X size={15} color={C.inkSoft} /></button>}
                  </div>

                  {anatQuery.trim() ? (
                    <>
                      <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 11 }}>{anatResults.length} {anatResults.length === 1 ? "resultat" : "resultater"}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                        {anatResults.map((a) => <AnatCard key={a.id} a={a} onOpen={openAnat} />)}
                        {anatResults.length === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Ingen match på \u201E{anatQuery}\u201C.</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
                        {ANAT_SUBS.map((sc) => { const on = anatCat === sc.id; return (
                          <button key={sc.id} onClick={() => setAnatCat(sc.id)} style={{ flexShrink: 0, border: `1px solid ${on ? "#0FAE9E" : C.line}`, background: on ? tint("#0FAE9E", "12") : C.surface, color: on ? "#0B9488" : C.inkSoft, borderRadius: 99, padding: "7px 13px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{sc.label}</button>
                        ); })}
                      </div>
                      {anatCat === "alle" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {ANAT_SUBS.filter((sc) => sc.id !== "alle").map((sc) => { const n = anatBySub(sc.id).length; return (
                            <button key={sc.id} onClick={() => setAnatCat(sc.id)} aria-label={sc.label} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 58 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{sc.label}</div>
                                <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1 }}>{n} opslag</div>
                              </div>
                              <ChevronRight size={18} color={C.inkFaint} />
                            </button>
                          ); })}
                          <button onClick={() => openTestKat("anatomi")} style={{ width: "100%", border: "none", borderRadius: 14, padding: "13px", background: "linear-gradient(135deg,#2BC7B4,#0B9488)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50, marginTop: 4 }}>Test din viden om anatomi</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.inkFaint, letterSpacing: 0.3, marginBottom: 10 }}>{(ANAT_SUBS.find((x) => x.id === anatCat) || {}).label.toUpperCase()}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                            {anatBySub(anatCat).map((a) => <AnatCard key={a.id} a={a} onOpen={openAnat} />)}
                          </div>
                        </>
                      )}
                      <p style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 16, lineHeight: 1.5 }}>Latinske betegnelser følger gængs anatomisk nomenklatur. Er noget uklart, så kontrollér med din uddannelse eller lokale kilder.</p>
                    </>
                  )}
                </div>
              )
            )}


            {/* FARMAKOLOGI */}
            {!activeCat && screen === "medicinbibliotek" && (
              <MedicinBibliotek sel={medlibSel} setSel={setMedlibSel} onTest={() => { setScreen("quizoversigt"); scrollTop(); }} />
            )}

            {!activeCat && screen === "farmakologi" && (
              <div className="anim">
                {farmaSec === null ? (
                  <>
                    <p style={{ margin: "0 0 12px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>Forstå hvordan lægemidler virker i kroppen. Læringsområde — ikke behandlings- eller doseringsråd.</p>
                    <div style={{ display: "flex", gap: 9, background: tint("#7A5AF5", "0C"), border: `1px solid ${tint("#7A5AF5", "2A")}`, borderRadius: 13, padding: "11px 13px", marginBottom: 16 }}>
                      <Info size={17} color="#5B37C7" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>Lægemiddelspecifikke oplysninger (doser, interaktioner, knusning) slås altid op i en godkendt kilde og følger ordination og lokale instrukser.</span>
                    </div>
                    <a href={FARMA_SRC} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ width: "100%", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16, minHeight: 58 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: tint("#7A5AF5", "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Pill size={20} color="#7A5AF5" strokeWidth={2.1} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>Medicinopslag</div><div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1 }}>Slå konkrete præparater op på pro.medicin.dk</div></div>
                      <ChevronRight size={18} color={C.inkFaint} />
                    </div></a>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {FARMA_SECTIONS.map((sec, i) => (
                        <button key={sec.id} onClick={() => openFarmaSec(sec.id)} aria-label={sec.title} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 14, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 13, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 60 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: tint("#7A5AF5", "12"), color: "#5B37C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800 }}>{i + 1}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{sec.title}</div>
                            <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 1 }}>{sec.sub}</div>
                          </div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      ))}
                    </div>
                  </>
                ) : farmaSec === "vej" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>Følg en tablet trin for trin. Tryk på et trin for at læse mere.</p>
                    <FarmaFlow steps={FARMA_JOURNEY.map((s) => s.t)} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.inkFaint, letterSpacing: 0.3, margin: "6px 0 2px" }}>TRIN FOR TRIN</div>
                    {FARMA_JOURNEY.map((s, i) => (
                      <Acc key={i} title={(i + 1) + ". " + s.t}><FarmaTwo quick={s.q} more={s.m} /></Acc>
                    ))}
                  </div>
                ) : farmaSec === "adme" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>ADME beskriver, hvad kroppen gør ved lægemidlet.</p>
                    {FARMA_ADME.map((a) => (
                      <div key={a.k} style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, padding: "13px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 8 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#9B7DF6,#5B37C7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{a.k}</div>
                          <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink }}>{a.title}</div>
                        </div>
                        <FarmaTwo quick={a.q} more={a.m} />
                      </div>
                    ))}
                  </div>
                ) : farmaSec === "dynamik" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>Farmakodynamik: hvad lægemidlet gør ved kroppen.</p>
                    {FARMA_DYN.map((d, i) => (
                      <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, padding: "13px 14px" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{d.term}</div>
                        <FarmaTwo quick={d.q} more={d.m} />
                      </div>
                    ))}
                  </div>
                ) : farmaSec === "admin" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>Hvor og hvordan medicin gives. SC/IM/IV kræver kompetence, delegation og lokale instrukser.</p>
                    {FARMA_ROUTES.map((r) => (
                      <Acc key={r.id} title={r.name + " — " + r.full}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>
                          <div><b>Hvor:</b> {r.hvor}</div>
                          <div><b>Hvordan:</b> {r.hvordan}</div>
                          <div><b>Karakteristika:</b> {r.kar}</div>
                          <div><b>SSA-observationer:</b><Bullets items={r.obs} color="#7A5AF5" /></div>
                          <div><b>Sikkerhed:</b><Bullets items={r.sik} color={C.primary} /></div>
                        </div>
                      </Acc>
                    ))}
                  </div>
                ) : farmaSec === "former" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 9, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "2A")}`, borderRadius: 12, padding: "11px 13px" }}>
                      <Info size={17} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12.5, color: "#7A4E0A", lineHeight: 1.5 }}>Kontrollér altid det konkrete præparat før deling, knusning eller åbning — brug en godkendt kilde og lokale instrukser.</span>
                    </div>
                    {FARMA_FORMS.map((f) => (
                      <Acc key={f.id} title={f.name}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>
                          <div><b>Hvad er det?</b> {f.hvad}</div>
                          <div><b>Anvendelse:</b> {f.brug}</div>
                          <div><b>Frigivelse/optagelse:</b> {f.frig}</div>
                          <div style={{ color: "#7A4E0A" }}><b>Vigtigt:</b> {f.vig}</div>
                        </div>
                      </Acc>
                    ))}
                  </div>
                ) : farmaSec === "tid" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>Hvornår og hvor længe virker medicinen?</p>
                    <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, padding: "12px 10px" }}>
                      <svg viewBox="0 0 300 120" style={{ width: "100%", height: "auto" }} role="img" aria-label="Koncentration over tid">
                        <line x1="30" y1="100" x2="290" y2="100" stroke="#C9D2D8" strokeWidth="1.5" />
                        <line x1="30" y1="10" x2="30" y2="100" stroke="#C9D2D8" strokeWidth="1.5" />
                        <path d="M30 100 Q 90 15 150 40 Q 210 60 290 92" fill="none" stroke="#7A5AF5" strokeWidth="2.5" />
                        <circle cx="96" cy="34" r="3.5" fill="#5B37C7" />
                        <text x="102" y="30" fontSize="10" fill="#5B6A73">Maks. effekt</text>
                        <text x="150" y="115" fontSize="10" fill="#5B6A73" textAnchor="middle">Tid →</text>
                        <text x="20" y="20" fontSize="10" fill="#5B6A73" textAnchor="end" transform="rotate(-90 20 20)">Koncentration</text>
                      </svg>
                      <div style={{ fontSize: 11.5, color: C.inkFaint, textAlign: "center", marginTop: 4 }}>Forenklet illustration — konkret forløb varierer fra lægemiddel til lægemiddel.</div>
                    </div>
                    {FARMA_TIMING.map((t, i) => (
                      <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, padding: "13px 14px" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{t.term}</div>
                        <FarmaTwo quick={t.q} more={t.m} />
                      </div>
                    ))}
                  </div>
                ) : farmaSec === "halveringstid" ? (
                  <HalfLifeView onTest={openTestKat} />
                ) : farmaSec === "bivirk" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>Når medicin gør andet end det ønskede. Konkrete bivirkninger, interaktioner og kontraindikationer slås op i godkendt kilde.</p>
                    {FARMA_ADVERSE.map((d, i) => (
                      <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, padding: "13px 14px" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{d.term}</div>
                        <FarmaTwo quick={d.q} more={d.m} />
                      </div>
                    ))}
                    <a href={FARMA_SRC} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ border: `1px solid ${tint("#7A5AF5", "33")}`, background: tint("#7A5AF5", "0A"), borderRadius: 12, padding: "12px 14px", fontSize: 13.5, fontWeight: 700, color: "#5B37C7", display: "flex", alignItems: "center", gap: 8 }}><Pill size={17} color="#7A5AF5" /><span style={{ flex: 1 }}>Slå op på pro.medicin.dk</span><ChevronRight size={16} color="#7A5AF5" /></div></a>
                  </div>
                ) : farmaSec === "lever" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <FarmaTwo quick={FARMA_LEVER.quick} />
                    <Bullets items={FARMA_LEVER.points} color="#7A5AF5" />
                    <button onClick={() => openAnat(FARMA_LEVER.anat)} style={{ width: "100%", textAlign: "left", border: `1px solid ${tint("#0FAE9E", "33")}`, background: tint("#0FAE9E", "0A"), borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#0B9488", display: "flex", alignItems: "center", gap: 8 }}><Activity size={17} color="#0B9488" /><span style={{ flex: 1 }}>Se også → Lever (anatomi &amp; fysiologi)</span><ChevronRight size={16} color="#0B9488" /></button>
                  </div>
                ) : farmaSec === "nyrer" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <FarmaTwo quick={FARMA_NYRER.quick} />
                    <Bullets items={FARMA_NYRER.points} color="#7A5AF5" />
                    <button onClick={() => openAnat(FARMA_NYRER.anat)} style={{ width: "100%", textAlign: "left", border: `1px solid ${tint("#0FAE9E", "33")}`, background: tint("#0FAE9E", "0A"), borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#0B9488", display: "flex", alignItems: "center", gap: 8 }}><Activity size={17} color="#0B9488" /><span style={{ flex: 1 }}>Se også → Nyrer (anatomi &amp; fysiologi)</span><ChevronRight size={16} color="#0B9488" /></button>
                  </div>
                ) : farmaSec === "aeldre" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <FarmaTwo quick={FARMA_AELDRE.quick} />
                    <Acc title="Hvorfor reagerer ældre anderledes?" defaultOpen={true}><Bullets items={FARMA_AELDRE.hvorfor} color="#7A5AF5" /></Acc>
                    <Acc title="Hvad skal jeg observere?"><Bullets items={FARMA_AELDRE.obs} color={C.primary} /></Acc>
                  </div>
                ) : farmaSec === "sikkerhed" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <p style={{ margin: 0, fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>Sikker medicinhåndtering. Handl inden for din delegation og arbejdsstedets instrukser.</p>
                    {FARMA_SAFETY.map((s, i) => (
                      <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.surface, padding: "12px 14px" }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{s.t}</div>
                        <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>{s.d}</div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 9, background: tint(C.primary, "0A"), border: `1px solid ${tint(C.primary, "22")}`, borderRadius: 12, padding: "11px 13px" }}><Info size={16} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>Meget afhænger af lokale instrukser og delegation — dem følger du altid.</span></div>
                  </div>
                ) : farmaSec === "obs" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    <p style={{ margin: "0 0 12px", fontSize: 14, color: C.inkSoft, lineHeight: 1.55 }}>En praktisk huskerække, når du håndterer medicin.</p>
                    {FARMA_OBS.map((o, i) => (
                      <div key={i}>
                        <div style={{ border: `1px solid ${tint("#7A5AF5", "2A")}`, background: tint("#7A5AF5", "0A"), borderRadius: 12, padding: "12px 14px" }}>
                          <div style={{ fontSize: 14.5, fontWeight: 800, color: "#5B37C7" }}>{o.t}</div>
                          <div style={{ fontSize: 13.5, color: C.ink, marginTop: 3, lineHeight: 1.5 }}>{o.d}</div>
                        </div>
                        {i < FARMA_OBS.length - 1 ? <div style={{ textAlign: "center", color: "#7A5AF5", fontSize: 16, padding: "3px 0" }}>↓</div> : null}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 9, background: tint("#B7791F", "10"), border: `1px solid ${tint("#B7791F", "2A")}`, borderRadius: 12, padding: "11px 13px", marginTop: 12 }}><Info size={16} color="#8A5A0B" style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 12.5, color: "#7A4E0A", lineHeight: 1.5 }}>Observationer og handlinger må ikke tilsidesætte ordination, delegation eller lokale procedurer.</span></div>
                  </div>
                ) : farmaSec === "furosemid" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <div style={{ display: "flex", gap: 9, background: tint("#7A5AF5", "0C"), border: `1px solid ${tint("#7A5AF5", "2A")}`, borderRadius: 12, padding: "11px 13px" }}><Info size={16} color="#5B37C7" style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>Læringseksempel med generel, verificerbar virkningsmekanisme. Indikation, dosis og behandling afhænger af ordination — {FARMA_VERIFY}</span></div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: C.ink }}>{FARMA_FUROSEMID.navn}</div>
                    <div style={{ fontSize: 13, color: C.inkSoft }}>{FARMA_FUROSEMID.gruppe}</div>
                    <FarmaFlow steps={FARMA_FUROSEMID.chain} />
                    <Acc title="Hvorfor gives det?"><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.55 }}>{FARMA_FUROSEMID.hvorfor}</div></Acc>
                    <Acc title="Hvad sker der fysiologisk?"><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.55 }}>{FARMA_FUROSEMID.fysiologi}</div></Acc>
                    <Acc title="Hvad kan være relevant at observere?"><Bullets items={FARMA_FUROSEMID.obs} color="#7A5AF5" /></Acc>
                    <button onClick={() => openAnat("a-nyrer")} style={{ width: "100%", textAlign: "left", border: `1px solid ${tint("#0FAE9E", "33")}`, background: tint("#0FAE9E", "0A"), borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#0B9488", display: "flex", alignItems: "center", gap: 8 }}><Activity size={17} color="#0B9488" /><span style={{ flex: 1 }}>Se også → Nyrer (anatomi &amp; fysiologi)</span><ChevronRight size={16} color="#0B9488" /></button>
                    <a href={FARMA_SRC} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><div style={{ border: `1px solid ${tint("#7A5AF5", "33")}`, background: tint("#7A5AF5", "0A"), borderRadius: 12, padding: "12px 14px", fontSize: 13.5, fontWeight: 700, color: "#5B37C7", display: "flex", alignItems: "center", gap: 8 }}><Pill size={17} color="#7A5AF5" /><span style={{ flex: 1 }}>Slå Furix/furosemid op på pro.medicin.dk</span><ChevronRight size={16} color="#7A5AF5" /></div></a>
                  </div>
                ) : farmaSec === "begreber" ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: tint(C.ink, "06"), border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 14 }}>
                      <Search size={19} color={C.inkSoft} />
                      <input value={farmaQuery} onChange={(e) => setFarmaQuery(e.target.value)} placeholder="Søg fagligt ord, fx halveringstid…" aria-label="Søg i farmakologiske begreber" style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.ink, background: "transparent", fontFamily: "inherit" }} />
                      {farmaQuery && <button onClick={() => setFarmaQuery("")} aria-label="Ryd søgning" style={{ border: "none", background: tint(C.ink, "12"), borderRadius: 99, padding: 4, display: "flex", cursor: "pointer" }}><X size={15} color={C.inkSoft} /></button>}
                    </div>
                    {(() => { const list = farmaQuery.trim() ? farmaTermSearch(farmaQuery) : FARMA_TERMS; return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                        {list.map((t) => (
                          <Acc key={t.id} title={t.term}>
                            <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.55 }}>{t.forklaring}</div>
                            {t.eksempel ? <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 7, lineHeight: 1.5 }}><b>Eksempel:</b> {t.eksempel}</div> : null}
                            {t.related && t.related.length ? <div style={{ fontSize: 12.5, color: "#5B37C7", marginTop: 7 }}>Relateret: {t.related.join(", ")}</div> : null}
                          </Acc>
                        ))}
                        {list.length === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Ingen begreber matcher \u201E{farmaQuery}\u201C.</p>}
                      </div>
                    ); })()}
                  </div>
                ) : null}
                {farmaSec && farmaSec !== "begreber" && (
                  <p style={{ fontSize: 11.5, color: C.inkFaint, marginTop: 18, lineHeight: 1.5 }}>Klario er et lærings- og opslagsværktøj. Lægemiddelspecifik information verificeres i godkendt kilde og følger ordination og lokale instrukser.</p>
                )}
              </div>
            )}

            {!activeCat && screen === "kategorier" && (
              <div className="anim">
                <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Kategorier</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 18 }}>
                  <button onClick={() => { setScreen("dokumenter"); scrollTop(); }} aria-label="Mine dokumenter" style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 68 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint("#2B6CB0", "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FileText size={23} color="#2B6CB0" strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Mine dokumenter</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Dine egne dokumenter samlet ét sted.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.inkFaint, letterSpacing: 0.3, marginBottom: 11 }}>KLINISKE KATEGORIER</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <GridTile cat={FAGLIGT_CAT} count={TERMS.length} onClick={() => { setTermView(null); setScreen("fagligtsprog"); scrollTop(); }} />
                  <GridTile cat={PLEJE_CAT} count={PLEJE_PROCS.length} onClick={() => { setProcView(null); setScreen("plejeprocedurer"); scrollTop(); }} />
                  <GridTile cat={ANATOMI_CAT} count={ANAT.length} onClick={() => { setAnatView(null); setAnatQuery(""); setAnatCat("alle"); setScreen("anatomi"); scrollTop(); }} />
                  <GridTile cat={FARMA_CAT} count={FARMA_SECTIONS.length - 1} onClick={openFarma} />
                  {DATA.map((cat) => (
                    <button key={cat.id} onClick={() => openCategory(cat.id)} style={{ textAlign: "left", border: "none", borderRadius: 20, padding: 15, cursor: "pointer", background: `linear-gradient(160deg, ${tint(cat.color, "1A")}, ${tint(cat.color, "08")})`, display: "flex", flexDirection: "column", gap: 12, minHeight: 138, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Chip cat={cat} size={42} radius={13} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: cat.color, background: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: 8 }}>{cat.cards.length}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 15.5, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{cat.title}</div>
                        <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.35 }}>{cat.subtitle}</div>
                      </div>
                    </button>
                  ))}
                  <GridTile cat={TESTVIDEN_CAT} count={2} onClick={() => { setScreen("testviden"); scrollTop(); }} />
                </div>
              </div>
            )}

            {/* FAVORITTER */}
            {!activeCat && screen === "favoritter" && (
              <div className="anim">
                <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Favoritter</h2>
                {favCards.length === 0 && favProcs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "54px 24px", color: C.inkFaint }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: tint("#F5A623", "16"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Star size={30} color="#F5A623" />
                    </div>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: C.inkSoft }}>Du har ingen favoritter endnu.<br />Tryk på stjernen på et kort for at gemme det her.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    {favProcs.map((p) => <ProcCard key={p.id} p={p} onOpen={() => openProc(p.id)} />)}
                    {favCards.map(({ card, cat }) => (
                      <ClinCard key={card.id} card={card} cat={cat} showCat expanded={expanded.has(card.id)} onToggle={() => toggleExpand(card.id)} isFav onFav={() => toggleFav(card.id)} onQuiz={setActiveQuiz} onCase={openCase} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MERE — menu */}
            {!activeCat && screen === "mere" && !moreView && (
              <div className="anim">
                <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Mere</h2>

                <div style={{ borderRadius: 22, padding: 18, marginBottom: 22, background: "linear-gradient(150deg,#1B4868,#0E2A40)", color: "#fff", boxShadow: "0 14px 30px rgba(15,52,77,0.4)", display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><KGlyph size={28} stem="#FFFFFF" arm="#3BE3CB" /></div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>KLARIO</div>
                    <div style={{ fontSize: 11, opacity: 0.78, letterSpacing: 1.5, fontWeight: 600 }}>KLARIO HEALTHCARE</div>
                  </div>
                </div>

                <SectionHead title="KLARIO Information" />
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", background: C.surface }}>
                  {MORE_MENU.map((m, i) => (
                    <button key={m.id} onClick={() => { setMoreView(m.id); scrollTop(); }} style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 13, padding: "14px 15px", borderBottom: i < MORE_MENU.length - 1 ? `1px solid ${C.line}` : "none" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: tint(m.c, "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><m.Icon size={19} color={m.c} /></div>
                      <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: C.ink }}>{m.label}</div>
                      <ChevronRight size={19} color={C.inkFaint} />
                    </button>
                  ))}
                </div>

                <p style={{ textAlign: "center", fontSize: 11.5, color: C.inkFaint, marginTop: 20, lineHeight: 1.6 }}>KLARIO v1.0 · Indhold gemmes lokalt på enheden<br />© KLARIO HEALTHCARE</p>
              </div>
            )}

            {/* MERE — sub-pages */}
            {!activeCat && screen === "mere" && moreView && (
              <div key={moreView} className="anim">

                {moreView === "om" && (
                  <>
                    <div style={{ borderRadius: 22, padding: 18, marginBottom: 18, background: "linear-gradient(150deg,#1B4868,#0E2A40)", color: "#fff", boxShadow: "0 14px 30px rgba(15,52,77,0.4)", display: "flex", alignItems: "center", gap: 13 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><KGlyph size={28} stem="#FFFFFF" arm="#3BE3CB" /></div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>KLARIO</div>
                        <div style={{ fontSize: 11, opacity: 0.78, letterSpacing: 1.5, fontWeight: 600 }}>KLARIO HEALTHCARE</div>
                      </div>
                    </div>
                    <InfoBlock label="Hvad er KLARIO?">KLARIO er en klinisk lommehjælper til hverdagen i sundhedssektoren — et roligt opslagsværk med observationer, normalværdier, hygiejne, sårpleje, dokumentation, akutte situationer og meget mere.</InfoBlock>
                    <InfoBlock label="Hvem er det til?">SOSU- og SSA-elever, sygeplejestuderende, social- og sundhedsassistenter, plejepersonale og nye medarbejdere i sundhedssektoren.</InfoBlock>
                    <InfoBlock label="Sådan bruges det">Søg eller bladr i kategorierne, åbn et emne for hurtigt overblik, og gem dine favoritter. Alt indhold er vejledende og fungerer lokalt på din enhed.</InfoBlock>
                    <div style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", margin: "4px 0 16px" }}>
                      {[
                        { Ic: ShieldCheck, t: "Sikker brug", d: "Til læring og støtte — ikke til diagnose.", c: "#0FAE9E" },
                        { Ic: LayoutGrid, t: `${DATA.length} kategorier`, d: `${ALL_CARDS.length} kliniske emner i alt.`, c: "#2E68E0" },
                        { Ic: Clock, t: "Hurtig adgang", d: "Senest brugt og favoritter på forsiden.", c: "#7A5AF5" },
                      ].map((r, i, arr) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 12, background: tint(r.c, "16"), display: "flex", alignItems: "center", justifyContent: "center" }}><r.Ic size={19} color={r.c} /></div>
                          <div>
                            <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{r.t}</div>
                            <div style={{ fontSize: 12.5, color: C.inkSoft }}>{r.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <DisclaimerPill />
                  </>
                )}

                {moreView === "privatliv" && (
                  <>
                    <InfoBlock label="Kort fortalt">KLARIO indsamler ingen personoplysninger og kræver hverken login eller internetforbindelse for at vise indhold.</InfoBlock>
                    <InfoBlock label="Dine data">Favoritter og “senest brugt” gemmes kun lokalt i appen på din enhed og forsvinder, hvis du rydder appens data. Der sendes ingen oplysninger til servere.</InfoBlock>
                    <InfoBlock label="Sporing">KLARIO bruger ingen sporing, markedsføringscookies eller tredjepartsannoncer.</InfoBlock>
                    <InfoBlock label="Dataansvarlig">KLARIO HEALTHCARE. Dette er en eksempeltekst — tilpas til jeres faktiske privatlivspolitik før udgivelse.</InfoBlock>
                  </>
                )}

                {moreView === "vilkaar" && (
                  <>
                    <InfoBlock label="Formål">KLARIO er et lærings- og opslagsværktøj. Det er en hjælp til at huske og slå op — ikke en autoritativ kilde.</InfoBlock>
                    <InfoBlock label="Ansvar">Indholdet er vejledende og kan ikke erstatte sundhedsfaglig uddannelse, faglig vurdering eller lokale instrukser. Brug sker på eget ansvar.</InfoBlock>
                    <InfoBlock label="Ændringer">Indhold og funktioner kan ændres eller opdateres uden varsel.</InfoBlock>
                    <InfoBlock label="Rettigheder">Navnet KLARIO og KLARIO-mærket tilhører KLARIO HEALTHCARE. Dette er en eksempeltekst — tilpas før udgivelse.</InfoBlock>
                    <DisclaimerPill />
                  </>
                )}

                {moreView === "ansvar" && (
                  <>
                    <InfoBlock label="Vigtigt">KLARIO er et lærings- og støtteværktøj og erstatter ikke sundhedsfaglig vurdering, uddannelse eller lokale retningslinjer.</InfoBlock>
                    <InfoBlock label="Ikke til diagnose">KLARIO stiller ikke diagnoser og giver ikke individuel behandlingsvejledning. Følg altid lokale retningslinjer og ordinationer.</InfoBlock>
                    <InfoBlock label="Ved tvivl">Kontakt en relevant sundhedsfaglig person. I akutte og livstruende situationer: ring 1-1-2.</InfoBlock>
                    <DisclaimerPill />
                  </>
                )}

                {moreView === "kontakt" && (
                  <>
                    <InfoBlock label="KLARIO HEALTHCARE">Har du spørgsmål, forslag eller har du fundet en fejl i indholdet, hører vi gerne fra dig.</InfoBlock>
                    <div style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", marginBottom: 14, background: C.surface }}>
                      {[
                        { Ic: MessageCircle, t: "E-mail", d: "kontakt@klario.dk", c: "#1AA0E6" },
                        { Ic: Info, t: "Web", d: "klario.dk", c: "#2BA99A" },
                      ].map((r, i, arr) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 12, background: tint(r.c, "16"), display: "flex", alignItems: "center", justifyContent: "center" }}><r.Ic size={19} color={r.c} /></div>
                          <div>
                            <div style={{ fontSize: 12.5, color: C.inkSoft }}>{r.t}</div>
                            <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{r.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: C.inkFaint, lineHeight: 1.5, margin: 0 }}>Eksempelkontaktoplysninger — tilpas til jeres rigtige oplysninger før udgivelse.</p>
                  </>
                )}

                {moreView === "version" && (
                  <div style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", background: C.surface }}>
                    {[
                      { t: "App", d: "KLARIO" },
                      { t: "Version", d: "1.0 (v1)" },
                      { t: "Udgiver", d: "KLARIO HEALTHCARE" },
                      { t: "Indhold", d: "Gemmes lokalt på enheden" },
                      { t: "Status", d: "Læringsversion" },
                    ].map((r, i, arr) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 15px", borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none" }}>
                        <span style={{ fontSize: 13.5, color: C.inkSoft }}>{r.t}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{r.d}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p style={{ textAlign: "center", fontSize: 11.5, color: C.inkFaint, marginTop: 20 }}>© KLARIO HEALTHCARE</p>
              </div>
            )}
          </main>

          {/* BOTTOM NAV */}
          <nav style={{ display: "flex", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderTop: `1px solid ${C.line}`, padding: "8px 6px 10px" }}>
            {nav.map((n) => {
              const active = !activeCat && (screen === n.id || (n.id === "kategorier" && inPF) || (n.id === "hjem" && screen === "husk"));
              return (
                <button key={n.id} onClick={() => goTab(n.id)} style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "5px 0" }}>
                  <n.Icon size={22} strokeWidth={active ? 2.5 : 2} color={n.danger ? RED : (active ? C.primary : C.inkFaint)} fill={active && n.id === "favoritter" ? C.primary : "none"} />
                  <span style={{ fontSize: 10.5, fontWeight: active || n.danger ? 700 : 500, color: n.danger ? RED : (active ? C.primary : C.inkFaint) }}>{n.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Call confirmation — tel: link is only used after the user confirms */}
          {callPrompt && (
            <div role="dialog" aria-modal="true" aria-label="Bekræft opkald" onClick={() => setCallPrompt(null)} style={{ position: "absolute", inset: 0, zIndex: 30, background: "rgba(12,20,26,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400, background: C.surface, borderRadius: 22, padding: 20, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: tint(RED, "14"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Siren size={26} color={RED} />
                </div>
                <div style={{ textAlign: "center", fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Er du sikker på, at du vil ringe {callPrompt.phone}?</div>
                <div style={{ textAlign: "center", fontSize: 13, color: C.inkSoft, marginBottom: 18 }}>Opkaldet åbnes i din telefon.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setCallPrompt(null)} style={{ flex: 1, border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "14px", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: C.ink, cursor: "pointer", minHeight: 50 }}>Annuller</button>
                  <a href={`tel:${digitsOnly(callPrompt.phone)}`} onClick={() => setCallPrompt(null)} aria-label={`Ring ${callPrompt.phone}`} style={{ flex: 1, textDecoration: "none", textAlign: "center", background: "linear-gradient(135deg,#F0625E,#C22F2C)", borderRadius: 13, padding: "14px", fontFamily: "inherit", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>Ring {callPrompt.phone}</a>
                </div>
              </div>
            </div>
          )}

          {/* Quiz overlay — Test din viden */}
          {activeQuiz && (
            <Quiz quiz={activeQuiz} onClose={() => setActiveQuiz(null)} onCase={openCase} onCategory={openCategory} onDone={recordTestResult} onPracticeMistakes={startMistakes} onBackToTests={openTestKat} />
          )}

          {/* HUSK AT TJEKKE — add note */}
          {noteModal && (
            <div role="dialog" aria-modal="true" aria-label="Tilføj note" onClick={() => { setNoteModal(false); setNoteText(""); }} style={{ position: "absolute", inset: 0, zIndex: 35, background: "rgba(12,20,26,0.55)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, paddingTop: "calc(env(safe-area-inset-top) + 54px)" }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400, background: C.surface, borderRadius: 20, padding: 18, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Hvad skal du huske at tjekke?</div>
                <input autoFocus value={noteText} onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addNote(); }} placeholder="Fx Tjek Furix…" aria-label="Note" maxLength={200} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 14px", fontSize: 16, color: C.ink, background: C.surface, fontFamily: "inherit", outline: "none" }} />
                <p style={{ margin: "8px 2px 0", fontSize: 11.5, color: C.inkFaint, lineHeight: 1.4 }}>Skriv ikke personfølsomme oplysninger om borgere.</p>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={() => { setNoteModal(false); setNoteText(""); }} style={{ flex: 1, border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "14px", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: C.ink, cursor: "pointer", minHeight: 50 }}>Annuller</button>
                  <button onClick={addNote} disabled={!noteText.trim()} aria-label="Gem note" style={{ flex: 1, border: "none", borderRadius: 13, padding: "14px", background: noteText.trim() ? "linear-gradient(135deg,#3E78EE,#2457D6)" : tint(C.ink, "14"), color: noteText.trim() ? "#fff" : C.inkFaint, fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: noteText.trim() ? "pointer" : "default", minHeight: 50 }}>Gem</button>
                </div>
              </div>
            </div>
          )}

          {/* HUSK AT TJEKKE — delete confirm */}
          {deleteNoteId && (
            <div role="dialog" aria-modal="true" aria-label="Slet note" onClick={() => setDeleteNoteId(null)} style={{ position: "absolute", inset: 0, zIndex: 36, background: "rgba(12,20,26,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 380, background: C.surface, borderRadius: 20, padding: 20, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
                <div style={{ textAlign: "center", fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Slet note?</div>
                <div style={{ textAlign: "center", fontSize: 13, color: C.inkSoft, marginBottom: 18 }}>Denne note bliver slettet permanent.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setDeleteNoteId(null)} style={{ flex: 1, border: `1px solid ${C.line}`, background: C.surface, borderRadius: 13, padding: "14px", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: C.ink, cursor: "pointer", minHeight: 50 }}>Annuller</button>
                  <button onClick={() => removeNote(deleteNoteId)} aria-label="Slet note permanent" style={{ flex: 1, border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#F0625E,#C22F2C)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Slet</button>
                </div>
              </div>
            </div>
          )}

          {/* MINE DOKUMENTER — file input (hidden) */}
          <input ref={fileInputRef} type="file" onChange={onFilePicked} aria-hidden="true" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,image/*,application/pdf" style={{ display: "none" }} />

          {/* MINE DOKUMENTER — preview */}
          {preview && <DocPreview preview={preview} onClose={closePreview} />}
          {docxView && <DocxViewer dv={docxView} onClose={closeDocx} onShare={() => shareBlob(docxView.meta, docxView.blob)} />}

          {/* MINE DOKUMENTER — add confirm */}
          {pendingFile && (
            <Sheet label="Gem dokument" top onClose={() => setPendingFile(null)}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Gem dokument</div>
              <div style={{ display: "flex", gap: 8, fontSize: 12.5, color: C.inkSoft, marginBottom: 14, flexWrap: "wrap" }}>
                <span>{docKind(pendingFile.file.type, pendingFile.file.name).label}</span><span>·</span><span>{fmtBytes(pendingFile.file.size)}</span><span>·</span><span style={{ minWidth: 0, wordBreak: "break-word" }}>{pendingFile.file.name}</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.inkSoft, marginBottom: 6 }}>Navn</div>
              <input value={pendingFile.name} onChange={(e) => setPendingFile({ ...pendingFile, name: e.target.value })} placeholder="Dokumentets navn" aria-label="Dokumentnavn" style={dInput} />
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.inkSoft, margin: "12px 0 6px" }}>Mappe</div>
              <select value={pendingFile.folderId} onChange={(e) => setPendingFile({ ...pendingFile, folderId: e.target.value })} aria-label="Vælg mappe" style={{ ...dInput, cursor: "pointer" }}>
                <option value="">Ingen mappe</option>
                {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.inkSoft, margin: "12px 0 6px" }}>Note (valgfri)</div>
              <input value={pendingFile.note} onChange={(e) => setPendingFile({ ...pendingFile, note: e.target.value })} placeholder="Kort note…" aria-label="Note" maxLength={280} style={dInput} />
              <p style={{ margin: "8px 2px 0", fontSize: 11.5, color: C.inkFaint, lineHeight: 1.4 }}>Skriv ikke personfølsomme oplysninger om borgere.</p>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setPendingFile(null)} style={dBtnSec}>Annuller</button>
                <button onClick={saveDoc} style={dBtnPri(true)}>Gem dokument</button>
              </div>
            </Sheet>
          )}

          {/* MINE DOKUMENTER — options / detail */}
          {docMenu && (() => { const md = docs.find((d) => d.id === docMenu); if (!md) return null; const k = docKind(md.mimeType, md.displayName); const canPreview = isPreviewableMime(mimeFor(md, null)) || isDocxName(md); const act = { border: "none", background: "transparent", textAlign: "left", padding: "13px 4px", fontSize: 15, fontWeight: 600, color: C.ink, cursor: "pointer", fontFamily: "inherit", borderTop: `1px solid ${C.line}`, width: "100%" }; return (
            <Sheet label={md.displayName} onClose={() => setDocMenu(null)}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, lineHeight: 1.3, wordBreak: "break-word" }}>{md.displayName}</div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 6, lineHeight: 1.6 }}>{k.label} · {fmtBytes(md.size)}<br />Tilføjet {fmtDocDate(md.createdAt)}{folderName(md.folderId) ? " · " + folderName(md.folderId) : " · Ingen mappe"}</div>
              {md.note && <div style={{ fontSize: 13, color: C.ink, marginTop: 8, background: tint(C.ink, "04"), borderRadius: 10, padding: "9px 11px", lineHeight: 1.45, wordBreak: "break-word" }}>{md.note}</div>}
              <button onClick={() => { setDocMenu(null); openDoc(md.id); }} style={{ width: "100%", border: "none", borderRadius: 13, padding: "13px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 48, margin: "14px 0 6px" }}>{canPreview ? "Åbn dokument" : "Åbn / del dokument"}</button>
              <button onClick={() => { setRenameDocT({ id: md.id, name: md.displayName }); setDocMenu(null); }} style={act}>Omdøb</button>
              <button onClick={() => { setMoveDocT(md.id); setDocMenu(null); }} style={act}>Flyt til mappe</button>
              <button onClick={() => { setNoteDocT({ id: md.id, note: md.note || "" }); setDocMenu(null); }} style={act}>Rediger note</button>
              <button onClick={() => { setDocMenu(null); shareDoc(md.id); }} style={act}>Del / eksportér</button>
              <button onClick={() => { setDocMenu(null); setDeleteDocT(md.id); }} style={{ ...act, color: RED }}>Slet</button>
            </Sheet>
          ); })()}

          {/* MINE DOKUMENTER — rename doc */}
          {renameDocT && (
            <Sheet label="Omdøb dokument" top onClose={() => setRenameDocT(null)}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Omdøb dokument</div>
              <input value={renameDocT.name} onChange={(e) => setRenameDocT({ ...renameDocT, name: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") doRenameDoc(); }} aria-label="Nyt navn" autoFocus style={dInput} />
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setRenameDocT(null)} style={dBtnSec}>Annuller</button>
                <button onClick={doRenameDoc} disabled={!renameDocT.name.trim()} style={dBtnPri(!!renameDocT.name.trim())}>Gem</button>
              </div>
            </Sheet>
          )}

          {/* MINE DOKUMENTER — move doc */}
          {moveDocT && (
            <Sheet label="Flyt til mappe" onClose={() => setMoveDocT(null)}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Flyt til mappe</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button onClick={() => doMoveDoc("")} style={{ border: "none", background: "transparent", textAlign: "left", padding: "13px 4px", fontSize: 15, fontWeight: 600, color: C.ink, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>Ingen mappe</button>
                {folders.map((f) => <button key={f.id} onClick={() => doMoveDoc(f.id)} style={{ border: "none", background: "transparent", textAlign: "left", padding: "13px 4px", fontSize: 15, fontWeight: 600, color: C.ink, cursor: "pointer", fontFamily: "inherit", borderTop: `1px solid ${C.line}`, width: "100%", display: "flex", alignItems: "center", gap: 10 }}><Folder size={17} color={C.inkSoft} /> {f.name}</button>)}
              </div>
              <button onClick={() => setMoveDocT(null)} style={{ ...dBtnSec, width: "100%", marginTop: 14 }}>Annuller</button>
            </Sheet>
          )}

          {/* MINE DOKUMENTER — edit note */}
          {noteDocT && (
            <Sheet label="Rediger note" top onClose={() => setNoteDocT(null)}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Rediger note</div>
              <textarea value={noteDocT.note} onChange={(e) => setNoteDocT({ ...noteDocT, note: e.target.value })} placeholder="Kort note…" aria-label="Note" maxLength={280} rows={3} style={{ ...dInput, resize: "vertical", fontSize: 15 }} />
              <p style={{ margin: "8px 2px 0", fontSize: 11.5, color: C.inkFaint, lineHeight: 1.4 }}>Skriv ikke personfølsomme oplysninger om borgere.</p>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setNoteDocT(null)} style={dBtnSec}>Annuller</button>
                <button onClick={doSaveNote} style={dBtnPri(true)}>Gem</button>
              </div>
            </Sheet>
          )}

          {/* MINE DOKUMENTER — delete doc */}
          {deleteDocT && (
            <Sheet label="Slet dokument" onClose={() => setDeleteDocT(null)}>
              <div style={{ textAlign: "center", fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Vil du slette dette dokument fra Klario?</div>
              <div style={{ textAlign: "center", fontSize: 13, color: C.inkSoft, marginBottom: 18 }}>Dokumentet slettes permanent fra denne enhed.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setDeleteDocT(null)} style={dBtnSec}>Annuller</button>
                <button onClick={doDeleteDoc} style={{ flex: 1, border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#F0625E,#C22F2C)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Slet</button>
              </div>
            </Sheet>
          )}

          {/* MINE DOKUMENTER — new folder */}
          {folderModal && (
            <Sheet label="Ny mappe" top onClose={() => setFolderModal(false)}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Ny mappe</div>
              <input value={folderNameInput} onChange={(e) => setFolderNameInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") createFolder(); }} placeholder="Fx Medicin" aria-label="Mappenavn" autoFocus style={dInput} />
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setFolderModal(false)} style={dBtnSec}>Annuller</button>
                <button onClick={createFolder} disabled={!folderNameInput.trim()} style={dBtnPri(!!folderNameInput.trim())}>Gem</button>
              </div>
            </Sheet>
          )}

          {/* MINE DOKUMENTER — rename folder */}
          {renameFolderT && (
            <Sheet label="Omdøb mappe" top onClose={() => setRenameFolderT(null)}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 12 }}>Omdøb mappe</div>
              <input value={renameFolderT.name} onChange={(e) => setRenameFolderT({ ...renameFolderT, name: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") doRenameFolder(); }} aria-label="Nyt mappenavn" autoFocus style={dInput} />
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setRenameFolderT(null)} style={dBtnSec}>Annuller</button>
                <button onClick={doRenameFolder} disabled={!renameFolderT.name.trim()} style={dBtnPri(!!renameFolderT.name.trim())}>Gem</button>
              </div>
            </Sheet>
          )}

          {/* MINE DOKUMENTER — delete folder */}
          {deleteFolderT && (() => { const cnt = docs.filter((d) => d.folderId === deleteFolderT).length; return (
            <Sheet label="Slet mappe" onClose={() => setDeleteFolderT(null)}>
              <div style={{ textAlign: "center", fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Slet mappe?</div>
              <div style={{ textAlign: "center", fontSize: 13, color: C.inkSoft, marginBottom: 18, lineHeight: 1.5 }}>{cnt > 0 ? `${cnt} dokument${cnt === 1 ? "" : "er"} i mappen flyttes til “Ingen mappe” og bliver ikke slettet.` : "Mappen er tom og slettes."}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setDeleteFolderT(null)} style={dBtnSec}>Annuller</button>
                <button onClick={doDeleteFolder} style={{ flex: 1, border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#F0625E,#C22F2C)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Slet mappe</button>
              </div>
            </Sheet>
          ); })()}
        </div>
      </div>
    </>
  );
}
