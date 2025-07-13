"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MonumentProps, useMonumentTexture, Logo3D, BrutalistBase, LogoSpotlights, MONUMENT_CONFIGS } from './base-monument'
import * as THREE from 'three'

export const Level5Monument: React.FC<MonumentProps> = ({
    clubLogo,
    clubColor,
    clubName,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    isAR = false
}) => {
    const meshRef = useRef<THREE.Group>(null)
    const logoTexture = useMonumentTexture(clubLogo)
    const config = MONUMENT_CONFIGS[5]

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005

            if (isAR) {
                meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
            }
        }
    })

    return (
        <group ref={meshRef} position={position} scale={scale} rotation={rotation}>
            {/* Brutalist Base */}
            <BrutalistBase level={5} clubColor={clubColor} radius={config.radius} />

            {/* Central Logo Display - Legendary Scale */}
            <group position={[0, 6, 0]}>
                <Logo3D
                    logoTexture={logoTexture}
                    clubColor={clubColor}
                    clubName={clubName}
                    scale={2}
                />
            </group>

            {/* Massive Layered Frame Structure - Hollow Frames */}
            <group position={[0, 6, -1.5]}>
                {/* Layer 1 Frame */}
                <group>
                    <mesh position={[0, 2.8, 0]}>
                        <boxGeometry args={[6.5, 0.4, 0.3]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, -2.8, 0]}>
                        <boxGeometry args={[6.5, 0.4, 0.3]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                    <mesh position={[-3.05, 0, 0]}>
                        <boxGeometry args={[0.4, 6.1, 0.3]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                    <mesh position={[3.05, 0, 0]}>
                        <boxGeometry args={[0.4, 6.1, 0.3]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                </group>

                {/* Layer 2 Frame */}
                <group position={[0, 0, -0.5]}>
                    <mesh position={[0, 3.1, 0]}>
                        <boxGeometry args={[7, 0.4, 0.3]} />
                        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, -3.1, 0]}>
                        <boxGeometry args={[7, 0.4, 0.3]} />
                        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
                    </mesh>
                    <mesh position={[-3.3, 0, 0]}>
                        <boxGeometry args={[0.4, 6.6, 0.3]} />
                        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
                    </mesh>
                    <mesh position={[3.3, 0, 0]}>
                        <boxGeometry args={[0.4, 6.6, 0.3]} />
                        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
                    </mesh>
                </group>

                {/* Layer 3 Frame */}
                <group position={[0, 0, -1]}>
                    <mesh position={[0, 3.35, 0]}>
                        <boxGeometry args={[7.5, 0.4, 0.3]} />
                        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, -3.35, 0]}>
                        <boxGeometry args={[7.5, 0.4, 0.3]} />
                        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
                    </mesh>
                    <mesh position={[-3.55, 0, 0]}>
                        <boxGeometry args={[0.4, 7.1, 0.3]} />
                        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
                    </mesh>
                    <mesh position={[3.55, 0, 0]}>
                        <boxGeometry args={[0.4, 7.1, 0.3]} />
                        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
                    </mesh>
                </group>

                {/* Layer 4 Frame */}
                <group position={[0, 0, -1.5]}>
                    <mesh position={[0, 3.6, 0]}>
                        <boxGeometry args={[8, 0.4, 0.3]} />
                        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, -3.6, 0]}>
                        <boxGeometry args={[8, 0.4, 0.3]} />
                        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
                    </mesh>
                    <mesh position={[-3.8, 0, 0]}>
                        <boxGeometry args={[0.4, 7.6, 0.3]} />
                        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
                    </mesh>
                    <mesh position={[3.8, 0, 0]}>
                        <boxGeometry args={[0.4, 7.6, 0.3]} />
                        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
                    </mesh>
                </group>
            </group>

            {/* Dodecagonal Support Cathedral */}
            {Array.from({ length: 12 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.167) * 4.2,
                    3.5,
                    Math.sin(i * Math.PI * 0.167) * 4.2
                ]}>
                    <boxGeometry args={[0.8, 7, 0.8]} />
                    <meshStandardMaterial
                        color="#2a2a2a"
                        roughness={0.9}
                    />
                </mesh>
            ))}



            {/* Legendary Crown Matrix */}
            <mesh position={[0, 9.5, 0]}>
                <boxGeometry args={[9, 0.6, 0.6]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                />
            </mesh>


            {/* Massive Color Accent System */}
            <mesh position={[0, 9.2, 0]}>
                <boxGeometry args={[9.5, 0.4, 0.4]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.8}
                />
            </mesh>

            <mesh position={[0, 2.8, 0]}>
                <boxGeometry args={[9.5, 0.4, 0.4]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Vertical Accent Megastructure */}
            {/* {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.33) * 5,
                    6,
                    Math.sin(i * Math.PI * 0.33) * 5
                ]}>
                    <boxGeometry args={[0.4, 12, 0.4]} />
                    <meshLambertMaterial
                        color={clubColor}
                        emissive={clubColor}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            ))} */}

            {/* Energy Crystal Array */}
            {Array.from({ length: 8 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.25) * 5.5,
                    4.5,
                    Math.sin(i * Math.PI * 0.25) * 5.5
                ]}>
                    <octahedronGeometry args={[0.4, 0]} />
                    <meshLambertMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={1}
                    />
                </mesh>
            ))}



            {/* Epic Flame Effects */}
            {/* {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.5) * 3.8,
                    8.5,
                    Math.sin(i * Math.PI * 0.5) * 3.8
                ]}>
                    <coneGeometry args={[0.3, 1.5, 8]} />
                    <meshLambertMaterial
                        color="#ff6600"
                        emissive="#ff6600"
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))} */}

            {/* Logo Spotlights - Maximum Intensity */}
            <LogoSpotlights clubColor={clubColor} intensity={3} />

            {/* Epic lighting system */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} />

            {/* Additional rim lighting */}
            <pointLight position={[0, 12, 0]} intensity={2} color="#ffffff" />
            <pointLight position={[8, 6, 0]} intensity={1} color="#68d4fc" />
            <pointLight position={[-8, 6, 0]} intensity={1} color="#68d4fc" />
        </group>
    )
} 