import SmoothScroll from './components/SmoothScroll';
import SceneContainer from './components/SceneContainer';
import OverlayUI from './components/OverlayUI';
import './index.css';

export default function App() {
  return (
    <SmoothScroll>
      {/* Fixed 3D canvas — always behind everything */}
      <SceneContainer />

      {/* Scrollable HTML overlay — drives the camera via ScrollTrigger */}
      <OverlayUI />
    </SmoothScroll>
  );
}
