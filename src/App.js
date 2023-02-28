import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import ObjectDemo from './pages/ObjectDemo';
import ObjectDemoRtf from './pages/ObjectDemoRtf';
import HandsTranslationInteraction from './pages/HandsTranslationInteraction';
import Hover from './pages/Hover';
import ClickTarget from './pages/ClickTarget';
import ScrollSections from './pages/ScrollSections';
import ScrollAnimation from './pages/ScrollAnimation';

const App = () => {


  return (
    <BrowserRouter basename={`/${process.env.PUBLIC_URL}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/objectdemo" element={<ObjectDemo />} />
        <Route path="/objectdemo-rtf" element={<ObjectDemoRtf />} />
        <Route path="/hands-translation-interaction" element={<HandsTranslationInteraction />} />
        <Route path="/hover" element={<Hover />} />
        <Route path="/clicktarget" element={<ClickTarget />} />
        <Route path="/scroll-sections" element={<ScrollSections />} />
        <Route path="/scroll-animation" element={<ScrollAnimation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
