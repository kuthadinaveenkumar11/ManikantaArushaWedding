import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import Home from './pages/Home';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <Home />
      </LazyMotion>
    </MotionConfig>
  );
}
