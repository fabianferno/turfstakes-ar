"use client"

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Center } from '@react-three/drei'
import * as THREE from 'three'

export interface MonumentProps {
    clubLogo: string
    clubColor: string
    clubName: string
    level: number
    position?: [number, number, number]
    scale?: [number, number, number]
    rotation?: [number, number, number]
    isAR?: boolean
    anchorImage?: string
}

export interface MonumentMeshProps extends MonumentProps {
    meshRef: React.RefObject<THREE.Group>
}

export const useMonumentTexture = (logoUrl: string) => {
    const texture = useTexture(logoUrl)

    useEffect(() => {
        if (texture) {
            texture.flipY = false
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
        }
    }, [texture])

    return texture
}

// 3D Logo Component - The Star of the Show
export const Logo3D: React.FC<{
    logoTexture: THREE.Texture
    clubColor: string
    clubName: string
    scale?: number
}> = ({ logoTexture, clubColor, clubName, scale = 1 }) => {
    const logoRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (logoRef.current) {
            // Gentle floating animation
            logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            // Slight rotation to catch light
            logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
        }
    })

    return (
        <group ref={logoRef}>
            {/* Front-facing Logo */}
            <mesh position={[0, 0, 0.2]} renderOrder={100}>
                <planeGeometry args={[2 * scale, 2 * scale]} />
                <meshLambertMaterial
                    map={logoTexture}
                    transparent
                    side={THREE.FrontSide}
                    emissive="#68d4fc"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Back-facing Logo (mirrored) */}
            <mesh position={[0, 0, 0.2]} rotation={[0, Math.PI, 0]} renderOrder={100}>
                <planeGeometry args={[2 * scale, 2 * scale]} />
                <meshLambertMaterial
                    map={logoTexture}
                    transparent
                    side={THREE.FrontSide}
                    emissive="#68d4fc"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Logo Backing for 3D Effect - Double Sided */}
            <mesh position={[0, 0, 0]} renderOrder={99}>
                <planeGeometry args={[2.1 * scale, 2.1 * scale]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 3D Extrusion Frame - Position behind logo */}
            <mesh position={[0, 0, -0.1]} renderOrder={98}>
                <boxGeometry args={[2.2 * scale, 2.2 * scale, 0.2]} />
                <meshStandardMaterial
                    color="#68d4fc"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Front-facing Club Name Text */}
            <Center position={[0, -1.5 * scale, 0.3]} renderOrder={101}>
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[1.5 * scale, 0.3 * scale]} />
                    <meshLambertMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={0.2}
                        side={THREE.FrontSide}
                    />
                </mesh>
            </Center>

            {/* Back-facing Club Name Text */}
            <Center position={[0, -1.5 * scale, 0.3]} rotation={[0, Math.PI, 0]} renderOrder={101}>
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[1.5 * scale, 0.3 * scale]} />
                    <meshLambertMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={0.2}
                        side={THREE.FrontSide}
                    />
                </mesh>
            </Center>
        </group>
    )
}

// Brutalist Base Platform
export const BrutalistBase: React.FC<{
    level: number
    clubColor: string
    radius?: number
}> = ({ level, clubColor, radius = 3 }) => {
    const baseRef = useRef<THREE.Group>(null)

    return (
        <group ref={baseRef}>
            {/* Main brutalist platform */}
            <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[radius, radius + 0.5, 0.8, 6]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Color accent ring */}
            <mesh position={[0, -0.2, 0]}>
                <torusGeometry args={[radius - 0.2, 0.1, 8, 16]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Angular support beams */}
            {Array.from({ length: level + 2 }, (_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos(i * (Math.PI * 2) / (level + 2)) * (radius - 0.5),
                        0,
                        Math.sin(i * (Math.PI * 2) / (level + 2)) * (radius - 0.5)
                    ]}
                    rotation={[0, i * (Math.PI * 2) / (level + 2), 0]}
                >
                    <boxGeometry args={[0.3, 1.5, 0.3]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.8}
                    />
                </mesh>
            ))}
        </group>
    )
}

// Spotlights for Logo
export const LogoSpotlights: React.FC<{
    clubColor: string
    intensity?: number
}> = ({ clubColor, intensity = 2 }) => {
    return (
        <group>
            {/* Main spotlight from above */}
            <spotLight
                position={[0, 8, 0]}
                target-position={[0, 0, 0]}
                angle={0.3}
                penumbra={0.5}
                intensity={intensity}
                color="#ffffff"
                castShadow
            />

            {/* Accent spotlights */}
            <spotLight
                position={[3, 5, 3]}
                target-position={[0, 0, 0]}
                angle={0.4}
                penumbra={0.7}
                intensity={intensity * 0.6}
                color="#68d4fc"
            />

            <spotLight
                position={[-3, 5, 3]}
                target-position={[0, 0, 0]}
                angle={0.4}
                penumbra={0.7}
                intensity={intensity * 0.6}
                color="#68d4fc"
            />

            {/* Back rim light */}
            <spotLight
                position={[0, 3, -5]}
                target-position={[0, 0, 0]}
                angle={0.6}
                penumbra={0.8}
                intensity={intensity * 0.3}
                color="#ffffff"
            />
        </group>
    )
}

// Monument level configurations
export const MONUMENT_CONFIGS = {
    1: { height: 2, complexity: 'simple', elements: 3, radius: 2.5 },
    2: { height: 3, complexity: 'basic', elements: 5, radius: 3 },
    3: { height: 4, complexity: 'intermediate', elements: 7, radius: 3.5 },
    4: { height: 5, complexity: 'advanced', elements: 9, radius: 4 },
    5: { height: 6, complexity: 'legendary', elements: 12, radius: 4.5 }
} as const 