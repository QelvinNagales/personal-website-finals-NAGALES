import { useMemo } from 'react';
import * as THREE from 'three';

export function Sky() {
  // Create gradient sky
  const skyGeometry = useMemo(() => new THREE.SphereGeometry(500, 32, 32), []);
  
  const skyMaterial = useMemo(() => {
    const uniforms = {
      topColor: { value: new THREE.Color('#38bdf8') },    // sky-400 bright blue
      bottomColor: { value: new THREE.Color('#bae6fd') }, // sky-200 pale horizon
      offset: { value: 22 },
      exponent: { value: 0.5 },
    };

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
    });
  }, []);

  return (
    <>
      <mesh geometry={skyGeometry} material={skyMaterial} />
      
      {/* Sun */}
      <mesh position={[120, 110, -280]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial color="#fff8c0" />
      </mesh>
      {/* Sun halo */}
      <mesh position={[120, 110, -280]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial color="#fffde7" transparent opacity={0.22} />
      </mesh>
    </>
  );
}
