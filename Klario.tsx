import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Home, Search, LayoutGrid, Star, MoreHorizontal,
  Activity, Droplets, Heart, Microscope, ClipboardList,
  MessageCircle, Siren, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Plus, Info, ShieldCheck, X,
  Gauge, Scale, Stethoscope, Utensils, Puzzle, Pill, Brain, Calculator,
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

const CALC_TOOLS = [
  { id: "medicin", title: "Medicinberegner", sub: "Dosis, styrke og mængde", Icon: Pill, kw: "medicinberegner medicinberegning dosis tabletter kapsler flydende medicin styrke mængde mg ml mikrogram" },
  { id: "infusion", title: "Infusioner", sub: "ml/time, tid og volumen", Icon: Droplets, kw: "infusioner infusionsberegner infusion ml/time tid volumen dråber/minut dråber/min dråbefaktor" },
  { id: "bmi", title: "BMI-beregner", sub: "Højde + vægt → BMI", Icon: Gauge, kw: "bmi bmi-beregner højde vægt body mass index" },
];
const calcSearch = (q) => { const s = (q || "").trim().toLowerCase(); return s ? CALC_TOOLS.filter((c) => (c.title + " " + c.sub + " " + c.kw).toLowerCase().includes(s)) : []; };


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
const catTitleById = (id) => (DATA.find((c) => c.id === id) || {}).title || id;
const makeTopicQuiz = (topicId) => ALL_QUIZ.find((x) => x.topic === topicId) || null;
const quizForTopic2 = (topicId) => ALL_QUIZ.find((x) => x.topic === topicId) || null;
function makeCategoryQuiz(catId) {
  const qs = ALL_QUIZ.filter((x) => QUIZ_CATMAP[x.id] === catId).reduce((acc, x) => acc.concat(x.qs.map((qq) => Object.assign({}, qq, { topic: x.topic }))), []);
  if (qs.length === 0) return null;
  return { title: "Test din viden om " + catTitleById(catId), category: catTitleById(catId), catId, level: 0, caseId: CAT_CASE[catId] || null, qs: qs.slice(0, 10) };
}
/* categories that have a quiz (all top-level clinical categories) */
const CAT_QUIZ_IDS = DATA.map((c) => c.id).filter((id) => makeCategoryQuiz(id));


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

function Quiz({ quiz, onClose, onCase, onCategory }) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [phase, setPhase] = useState("quiz");
  const qs = quiz.qs; const q = qs[idx];
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
              <div style={{ fontSize: 15, fontWeight: 700, color: C.inkSoft }}>Dit resultat</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: C.ink, margin: "4px 0" }}>{score} / {qs.length}</div>
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
              <button onClick={restart} style={{ border: "none", borderRadius: 13, padding: "14px", background: "linear-gradient(135deg,#3E78EE,#2457D6)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer", minHeight: 50 }}>Prøv igen</button>
              {wrong.length > 0 && <button onClick={() => setPhase("review")} style={{ border: `1px solid ${C.line}`, borderRadius: 13, padding: "14px", background: C.surface, color: C.ink, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 50 }}>Gennemgå fejl ({wrong.length})</button>}
              {quiz.caseId && onCase && <button onClick={() => { onClose(); onCase(quiz.caseId); }} style={{ border: `1px solid ${C.line}`, borderRadius: 13, padding: "14px", background: C.surface, color: C.ink, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 50 }}>Øv dette i en case</button>}
              {quiz.catId && onCategory ? (
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


/* ------------------------------ APP ------------------------------- */

export default function Klario() {
  const [screen, setScreen] = useState("hjem");
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
  const [termView, setTermView] = useState(null); // Fagligt sprog — open term id
  const [procQuery, setProcQuery] = useState("");
  const [termQuery, setTermQuery] = useState("");
  const [calcView, setCalcView] = useState(null); // Lommeregnere — open tool (medicin/infusion/bmi)
  const [activeQuiz, setActiveQuiz] = useState(null); // Test din viden — open quiz overlay (topicId)
  const [caseView, setCaseView] = useState(null); // Case-træning — open case id
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
  const goTab = (tab) => { setActiveCat(null); setMoreView(null); setAkutView(null); setProcView(null); setTermView(null); setCalcView(null); setCaseView(null); setActiveQuiz(null); setScreen(tab); scrollTop(); };
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
  const openProc = (id) => { setScreen("plejeprocedurer"); setProcView(id); setTermView(null); scrollTop(); };
  const openTerm = (id) => { setScreen("fagligtsprog"); setTermView(id); setProcView(null); scrollTop(); };
  const inPF = screen === "plejeprocedurer" || screen === "fagligtsprog" || screen === "lommeregnere" || screen === "casetraening" || screen === "quizoversigt";
  const curCase = caseView ? caseById(caseView) : null;
  const pfTitle = screen === "plejeprocedurer" ? (curProc ? curProc.title : "Plejeprocedurer")
    : screen === "lommeregnere" ? (calcView ? (CALC_TOOLS.find((t) => t.id === calcView) || {}).title : "Lommeregnere")
    : screen === "casetraening" ? (curCase ? curCase.title : "Case-træning")
    : screen === "quizoversigt" ? "Test din viden"
    : (curTerm ? curTerm.term : "Fagligt sprog");
  const pfBack = () => {
    if (screen === "plejeprocedurer" && procView) { setProcView(null); scrollTop(); return; }
    if (screen === "fagligtsprog" && termView) { setTermView(null); scrollTop(); return; }
    if (screen === "lommeregnere" && calcView) { setCalcView(null); scrollTop(); return; }
    if (screen === "casetraening" && caseView) { setCaseView(null); scrollTop(); return; }
    setScreen("kategorier"); setProcView(null); setTermView(null); setCalcView(null); setCaseView(null); scrollTop();
  };
  const openCase = (id) => { setScreen("casetraening"); setCaseView(id); scrollTop(); };
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
                {makeCategoryQuiz(activeCatObj.id) && (
                  <button onClick={() => setActiveQuiz(makeCategoryQuiz(activeCatObj.id))} aria-label={"Test din viden om " + activeCatObj.title} style={{ width: "100%", border: `1px solid ${tint(C.primary, "33")}`, background: tint(C.primary, "0C"), borderRadius: 14, padding: "13px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, marginBottom: 14, fontFamily: "inherit" }}>
                    <ShieldCheck size={19} color={C.primary} />
                    <span style={{ flex: 1, textAlign: "left", fontSize: 14.5, fontWeight: 700, color: C.primary }}>Test din viden om {activeCatObj.title}</span>
                    <ChevronRight size={18} color={C.primary} />
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
                  const total = results.length + calcSearch(query).length + quizCats.length + (showHub ? 1 : 0);
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
                        <button key={"qz-" + cid} onClick={() => setActiveQuiz(qz)} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: tint(C.primary, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={20} color={C.primary} strokeWidth={2.1} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 1 }}>Quiz</div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>Test din viden om {qz.category}</div></div>
                          <ChevronRight size={18} color={C.inkFaint} />
                        </button>
                      ); })}
                      {calcSearch(query).map((c) => (
                        <button key={c.id} onClick={() => { setCalcView(c.id); setScreen("lommeregnere"); scrollTop(); }} style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)" }}>
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
                  {CAT_QUIZ_IDS.map((cid) => { const qz = makeCategoryQuiz(cid); if (!qz) return null; return (
                    <button key={cid} onClick={() => setActiveQuiz(qz)} aria-label={"Test din viden om " + qz.category} style={{ width: "100%", textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 16, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 60 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: tint(C.primary, "12"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={20} color={C.primary} strokeWidth={2.1} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{qz.category}</div>
                        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1 }}>{qz.qs.length} spørgsmål</div>
                      </div>
                      <ChevronRight size={18} color={C.inkFaint} />
                    </button>
                  ); })}
                </div>
              </div>
            )}

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
                  {CALC_TOOLS.map((t) => (
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
                <ProcDetail p={curProc} onTerm={openTerm} onQuiz={setActiveQuiz} onCase={openCase} />
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
                    <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 11 }}>{termResults.length} {termResults.length === 1 ? "resultat" : "resultater"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {termResults.map((t) => <TermCard key={t.id} t={t} onOpen={openTerm} />)}
                      {termResults.length === 0 && <p style={{ textAlign: "center", color: C.inkFaint, fontSize: 14, padding: "24px 0" }}>Ingen ord matcher \u201E{termQuery}\u201C.</p>}
                    </div>
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

            {!activeCat && screen === "kategorier" && (
              <div className="anim">
                <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Kategorier</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 18 }}>
                  <button onClick={() => { setProcView(null); setScreen("plejeprocedurer"); scrollTop(); }} aria-label="Plejeprocedurer" style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 68 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint(C.primary, "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ClipboardList size={23} color={C.primary} strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Plejeprocedurer</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Trin-for-trin til pleje, observation og dokumentation.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                  <button onClick={() => { setTermView(null); setScreen("fagligtsprog"); scrollTop(); }} aria-label="Fagligt sprog" style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 68 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint("#0FAE9E", "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={23} color="#0FAE9E" strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Fagligt sprog</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Fra hverdagssprog til SSA-sprog.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                  <button onClick={() => { setCalcView(null); setScreen("lommeregnere"); scrollTop(); }} aria-label="Lommeregnere" style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 68 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint("#7A5AF5", "16"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Calculator size={23} color="#7A5AF5" strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Lommeregnere</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Medicin, infusion og BMI.</div>
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
                  <button onClick={() => { setScreen("quizoversigt"); scrollTop(); }} aria-label="Test din viden" style={{ textAlign: "left", border: `1px solid ${C.line}`, background: C.surface, borderRadius: 18, padding: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(21,33,43,0.05)", minHeight: 68 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tint(C.primary, "14"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={23} color={C.primary} strokeWidth={2.1} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Test din viden</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>Quiz i alle kategorier.</div>
                    </div>
                    <ChevronRight size={20} color={C.inkFaint} />
                  </button>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.inkFaint, letterSpacing: 0.3, marginBottom: 11 }}>KLINISKE KATEGORIER</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                </div>
              </div>
            )}

            {/* FAVORITTER */}
            {!activeCat && screen === "favoritter" && (
              <div className="anim">
                <h2 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>Favoritter</h2>
                {favCards.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "54px 24px", color: C.inkFaint }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: tint("#F5A623", "16"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Star size={30} color="#F5A623" />
                    </div>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: C.inkSoft }}>Du har ingen favoritter endnu.<br />Tryk på stjernen på et kort for at gemme det her.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
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
              const active = !activeCat && (screen === n.id || (n.id === "kategorier" && inPF));
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
            <Quiz quiz={activeQuiz} onClose={() => setActiveQuiz(null)} onCase={openCase} onCategory={openCategory} />
          )}
        </div>
      </div>
    </>
  );
}
