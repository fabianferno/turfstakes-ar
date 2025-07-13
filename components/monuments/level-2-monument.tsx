"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MonumentProps, useMonumentTexture, Logo3D, BrutalistBase, LogoSpotlights, MONUMENT_CONFIGS } from './base-monument'
import * as THREE from 'three'

export const Level2Monument: React.FC<MonumentProps> = ({
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
    const config = MONUMENT_CONFIGS[2]

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
            <BrutalistBase level={2} clubColor={clubColor} radius={config.radius} />

            {/* Central Logo Display - Elevated */}
            <group position={[0, 2.5, 0]}>
                <Logo3D
                    logoTexture={logoTexture}
                    clubColor={clubColor}
                    clubName={clubName}
                    scale={1.1}
                />
            </group>

            {/* Double Frame Structure - Hollow Frames */}
            <group position={[0, 2.5, -0.6]}>
                {/* Inner Frame */}
                <group>
                    <mesh position={[0, 1.5, 0]}>
                        <boxGeometry args={[3.5, 0.4, 0.3]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, -1.5, 0]}>
                        <boxGeometry args={[3.5, 0.4, 0.3]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
                    </mesh>
                    <mesh position={[-1.55, 0, 0]}>
                        <boxGeometry args={[0.4, 3.1, 0.3]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
                    </mesh>
                    <mesh position={[1.55, 0, 0]}>
                        <boxGeometry args={[0.4, 3.1, 0.3]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
                    </mesh>
                </group>

                {/* Outer Frame */}
                <group position={[0, 0, -0.3]}>
                    <mesh position={[0, 1.8, 0]}>
                        <boxGeometry args={[4, 0.4, 0.2]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, -1.8, 0]}>
                        <boxGeometry args={[4, 0.4, 0.2]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                    <mesh position={[-1.8, 0, 0]}>
                        <boxGeometry args={[0.4, 3.6, 0.2]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                    <mesh position={[1.8, 0, 0]}>
                        <boxGeometry args={[0.4, 3.6, 0.2]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                </group>
            </group>

            {/* Brutalist Support Columns */}
            {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.5) * 2.5,
                    1.5,
                    Math.sin(i * Math.PI * 0.5) * 2.5
                ]}>
                    <boxGeometry args={[0.5, 3, 0.5]} />
                    <meshStandardMaterial
                        color="#2a2a2a"
                        roughness={0.9}
                    />
                </mesh>
            ))}

            {/* Angular Brutalist Beams */}
            {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.5) * 1.8,
                    4,
                    Math.sin(i * Math.PI * 0.5) * 1.8
                ]} rotation={[0, i * Math.PI * 0.5, Math.PI * 0.1]}>
                    <boxGeometry args={[0.3, 2, 0.3]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>
            ))}

            {/* Color Accent Elements */}
            <mesh position={[0, 4.2, 0]}>
                <boxGeometry args={[4.5, 0.3, 0.3]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.4}
                />
            </mesh>

            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[4.5, 0.3, 0.3]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Corner Accent Pillars */}
            {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.5 + Math.PI * 0.25) * 3.2,
                    2.5,
                    Math.sin(i * Math.PI * 0.5 + Math.PI * 0.25) * 3.2
                ]}>
                    <boxGeometry args={[0.2, 5, 0.2]} />
                    <meshLambertMaterial
                        color="#68d4fc"
                        emissive="#68d4fc"
                        emissiveIntensity={0.2}
                    />
                </mesh>
            ))}

            {/* Logo Spotlights */}
            <LogoSpotlights clubColor={clubColor} intensity={1.8} />

            {/* Enhanced lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} />
        </group>
    )
} 