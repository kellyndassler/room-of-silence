import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import ParticleVisualization from './pages/ParticleVisualization';
import HandsTranslationInteraction from './pages/HandsTranslationInteraction';

const App = () => {


  return (
    <BrowserRouter basename={`/${process.env.PUBLIC_URL}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/particle-visualization" element={<ParticleVisualization />} />
        <Route path="/hands-translation-interaction" element={<HandsTranslationInteraction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
