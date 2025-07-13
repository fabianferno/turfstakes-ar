"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MonumentProps, useMonumentTexture, Logo3D, BrutalistBase, LogoSpotlights, MONUMENT_CONFIGS } from './base-monument'
import * as THREE from 'three'

export const Level1Monument: React.FC<MonumentProps> = ({
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
    const config = MONUMENT_CONFIGS[1]

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle rotation animation
            meshRef.current.rotation.y += 0.005

            // Gentle floating animation for AR
            if (isAR) {
                meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
            }
        }
    })

    return (
        <group ref={meshRef} position={position} scale={scale} rotation={rotation}>
            {/* Brutalist Base */}
            <BrutalistBase level={1} clubColor={clubColor} radius={config.radius} />

            {/* Central Logo Display - The Star */}
            <group position={[0, 2, 0]}>
                <Logo3D
                    logoTexture={logoTexture}
                    clubColor={clubColor}
                    clubName={clubName}
                    scale={1}
                />
            </group>

            {/* Simple Brutalist Frame Structure - Hollow Frame */}
            <group position={[0, 2, -0.5]}>
                {/* Top Frame */}
                <mesh position={[0, 1.3, 0]}>
                    <boxGeometry args={[3, 0.4, 0.3]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>

                {/* Bottom Frame */}
                <mesh position={[0, -1.3, 0]}>
                    <boxGeometry args={[3, 0.4, 0.3]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>

                {/* Left Frame */}
                <mesh position={[-1.3, 0, 0]}>
                    <boxGeometry args={[0.4, 2.6, 0.3]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>

                {/* Right Frame */}
                <mesh position={[1.3, 0, 0]}>
                    <boxGeometry args={[0.4, 2.6, 0.3]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>
            </group>

            {/* Side Support Pillars */}
            <mesh position={[-2, 1, 0]}>
                <boxGeometry args={[0.4, 2, 0.4]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.9}
                />
            </mesh>

            <mesh position={[2, 1, 0]}>
                <boxGeometry args={[0.4, 2, 0.4]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.9}
                />
            </mesh>

            {/* Color Accent Beams */}
            <mesh position={[0, 3.5, 0]}>
                <boxGeometry args={[3.5, 0.2, 0.2]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.3}
                />
            </mesh>

            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[3.5, 0.2, 0.2]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Logo Spotlights */}
            <LogoSpotlights clubColor={clubColor} intensity={1.5} />

            {/* Ambient lighting for the logo */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} />
        </group>
    )
} 