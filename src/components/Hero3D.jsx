import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function Dice() {
  const meshRef = React.useRef();

  React.useEffect(() => {
    let frame;
    const animate = () => {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#00C9A7" roughness={0.2} metalness={0.7} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <motion.div
      className="w-full h-[400px] flex items-center justify-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <Dice />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
