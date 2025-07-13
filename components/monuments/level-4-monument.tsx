"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MonumentProps, useMonumentTexture, Logo3D, BrutalistBase, LogoSpotlights, MONUMENT_CONFIGS } from './base-monument'
import * as THREE from 'three'

export const Level4Monument: React.FC<MonumentProps> = ({
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
    const config = MONUMENT_CONFIGS[4]

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
            <BrutalistBase level={4} clubColor={clubColor} radius={config.radius} />

            {/* Central Logo Display - Monumentally Elevated */}
            <group position={[0, 4.5, 0]}>
                <Logo3D
                    logoTexture={logoTexture}
                    clubColor={clubColor}
                    clubName={clubName}
                    scale={1.5}
                />
            </group>



            {/* Octagonal Support Matrix */}
            {/* {Array.from({ length: 8 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.25) * 3.5,
                    2.5,
                    Math.sin(i * Math.PI * 0.25) * 3.5
                ]}>
                    <boxGeometry args={[0.7, 5, 0.7]} />
                    <meshStandardMaterial
                        color="#2a2a2a"
                        roughness={0.9}
                    />
                </mesh>
            ))} */}

            {/* Complex Angular Structures */}
            {/* {Array.from({ length: 8 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.25) * 2.8,
                    6,
                    Math.sin(i * Math.PI * 0.25) * 2.8
                ]} rotation={[0, i * Math.PI * 0.25, Math.PI * 0.2]}>
                    <boxGeometry args={[0.5, 4, 0.5]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>
            ))} */}

            {/* Geometric Crown Structure */}
            {/* <mesh position={[0, 7, 0]}>
                <boxGeometry args={[7, 0.5, 0.5]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                />
            </mesh>

            <mesh position={[0, 7, 0]} rotation={[0, Math.PI * 0.25, 0]}>
                <boxGeometry args={[7, 0.5, 0.5]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                />
            </mesh>

            <mesh position={[0, 7, 0]} rotation={[0, Math.PI * 0.5, 0]}>
                <boxGeometry args={[7, 0.5, 0.5]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                />
            </mesh>

            <mesh position={[0, 7, 0]} rotation={[0, Math.PI * 0.75, 0]}>
                <boxGeometry args={[7, 0.5, 0.5]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                />
            </mesh> */}

            {/* Enhanced Color Accent System */}
            <mesh position={[0, 6.7, 0]}>
                <boxGeometry args={[7.5, 0.3, 0.3]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.6}
                />
            </mesh>

            <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[7.5, 0.3, 0.3]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.6}
                />
            </mesh>

            {/* Vertical Accent Columns */}
            {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.5) * 4.2,
                    4.5,
                    Math.sin(i * Math.PI * 0.5) * 4.2
                ]}>
                    <boxGeometry args={[0.3, 9, 0.3]} />
                    <meshLambertMaterial
                        color="#68d4fc"
                        emissive="#68d4fc"
                        emissiveIntensity={0.4}
                    />
                </mesh>
            ))}

            {/* Energy Orbs */}
            {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} position={[
                    Math.cos(i * Math.PI * 0.5 + Math.PI * 0.25) * 4.5,
                    3.5,
                    Math.sin(i * Math.PI * 0.5 + Math.PI * 0.25) * 4.5
                ]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshLambertMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}

            {/* Logo Spotlights */}
            <LogoSpotlights clubColor={clubColor} intensity={2.5} />

            {/* Enhanced lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} />
        </group>
    )
} 