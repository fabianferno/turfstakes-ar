"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MonumentProps, useMonumentTexture, Logo3D, BrutalistBase, LogoSpotlights, MONUMENT_CONFIGS } from './base-monument'
import * as THREE from 'three'

export const Level3Monument: React.FC<MonumentProps> = ({
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
    const config = MONUMENT_CONFIGS[3]

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
            <BrutalistBase level={3} clubColor={clubColor} radius={config.radius} />

            {/* Central Logo Display - Prominently Elevated */}
            <group position={[0, 3.5, 0]}>
                <Logo3D
                    logoTexture={logoTexture}
                    clubColor={clubColor}
                    clubName={clubName}
                    scale={1.3}
                />
            </group>

            {/* Triple Frame Structure */}
            {/* <mesh position={[0, 3.5, -0.7]}>
                <boxGeometry args={[4, 4, 0.3]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                />
            </mesh>

            <mesh position={[0, 3.5, -1.1]}>
                <boxGeometry args={[4.5, 4.5, 0.2]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.9}
                />
            </mesh>

            <mesh position={[0, 3.5, -1.4]}>
                <boxGeometry args={[5, 5, 0.2]} />
                <meshStandardMaterial
                    color="#3a3a3a"
                    roughness={0.9}
                />
            </mesh> */}

            {/* Hexagonal Support Structure */}
            {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.33) * 3,
                    2,
                    Math.sin(i * Math.PI * 0.33) * 3
                ]}>
                    <boxGeometry args={[0.6, 4, 0.6]} />
                    <meshStandardMaterial
                        color="#2a2a2a"
                        roughness={0.9}
                    />
                </mesh>
            ))}

            {/* Geometric Brutalist Arches */}
            {/* {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.33) * 2.2,
                    5,
                    Math.sin(i * Math.PI * 0.33) * 2.2
                ]} rotation={[0, i * Math.PI * 0.33, Math.PI * 0.15]}>
                    <boxGeometry args={[0.4, 3, 0.4]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>
            ))} */}

            {/* Angular Top Structure */}
            <mesh position={[0, 5.5, 0]}>
                <boxGeometry args={[5.5, 0.4, 0.4]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                />
            </mesh>



            {/* Color Accent System */}
            <mesh position={[0, 5.2, 0]}>
                <boxGeometry args={[6, 0.3, 0.3]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.5}
                />
            </mesh>

            <mesh position={[0, 1.8, 0]}>
                <boxGeometry args={[6, 0.3, 0.3]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Diagonal Accent Beams */}
            {/* {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.5) * 2.5,
                    3.5,
                    Math.sin(i * Math.PI * 0.5) * 2.5
                ]} rotation={[0, i * Math.PI * 0.5, Math.PI * 0.25]}>
                    <boxGeometry args={[0.3, 4, 0.3]} />
                    <meshLambertMaterial
                        color={clubColor}
                        emissive={clubColor}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            ))} */}

            {/* Logo Spotlights */}
            <LogoSpotlights clubColor={clubColor} intensity={2.2} />

            {/* Enhanced lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} />
        </group>
    )
} 