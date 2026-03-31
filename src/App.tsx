import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Classes } from './pages/Classes';
import { Events } from './pages/Events';
import { Ministries } from './pages/Ministries';
import { HeavenBand } from './pages/HeavenBand';
import { HeavenAcademy } from './pages/HeavenAcademy';
import { GlobalGospelPowerBibleSchool } from './pages/BibleSchool';
import { GlobalGospelPowerChurch } from './pages/GlobalGospelPowerChurch';
import { CouncilOfPrayers } from './pages/CouncilOfPrayers';
import { MensMinistry } from './pages/MensMinistry';
import { WomensMinistry } from './pages/WomensMinistry';
import { Giving } from './pages/Giving';
import { Contact } from './pages/Contact';
import { Live } from './pages/Live';
import { BuildingLordsHouse } from './pages/BuildingLordsHouse';
import { JourneyOfGrace } from './pages/JourneyOfGrace';
import { ScrollToTop } from './components/ScrollToTop';
// import { SpiritualAssistant } from './components/SpiritualAssistant';

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="classes" element={<Classes />} />
            <Route path="events" element={<Events />} />
            <Route path="ministries" element={<Ministries />} />
            <Route path="ministries/heaven-band" element={<HeavenBand />} />
            <Route path="ministries/heaven-academy" element={<HeavenAcademy />} />
            <Route path="ministries/bible-school" element={<GlobalGospelPowerBibleSchool />} />
            <Route path="ministries/church" element={<GlobalGospelPowerChurch />} />
            <Route path="ministries/council-of-prayers" element={<CouncilOfPrayers />} />
            <Route path="ministries/mens-ministry" element={<MensMinistry />} />
            <Route path="ministries/womens-ministry" element={<WomensMinistry />} />
            <Route path="giving" element={<Giving />} />
            <Route path="building-lords-house" element={<BuildingLordsHouse />} />
            <Route path="journey-of-grace" element={<JourneyOfGrace />} />
            <Route path="contact" element={<Contact />} />
            <Route path="live" element={<Live />} />
          </Route>
        </Routes>
        {/* <SpiritualAssistant /> */}
      </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}
