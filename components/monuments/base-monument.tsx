"use client"

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Center, Text } from '@react-three/drei'
import * as THREE from 'three'

// Sponsor data
const sponsorData = [
    { id: 'binance', name: 'Binance', imageUrl: '/sponsors/binance.png', campaign: 'Trade with Binance - The world\'s leading crypto exchange!', color: '#F3BA2F' },
    { id: 'nike', name: 'Nike', imageUrl: '/sponsors/nike.png', campaign: 'Just Do It - Premium sports gear and apparel!', color: '#FF6900' },
    { id: 'qatar', name: 'Qatar', imageUrl: '/sponsors/qatar.png', campaign: 'Visit Qatar - Experience the beauty of the desert!', color: '#5D1A35' },
    { id: 'okx', name: 'OKX', imageUrl: '/sponsors/okx.png', campaign: 'OKX - Your gateway to the crypto world!', color: '#000000' },
    { id: 'animoca', name: 'Animoca Brands', imageUrl: '/sponsors/animoca.png', campaign: 'Animoca Brands - Leading the way in Web3 gaming!', color: '#4A90E2' },
]

// Function to get a random sponsor
export const getRandomSponsor = () => {
    return sponsorData[Math.floor(Math.random() * sponsorData.length)]
}

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

// Rotating 3D Logo Component
export const RotatingLogo3D: React.FC<{
    logoTexture: THREE.Texture
    clubColor: string
    clubName: string
    scale?: number
    height?: number
}> = ({ logoTexture, clubColor, clubName, scale = 1, height = 3 }) => {
    const logoRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (logoRef.current) {
            // Continuous rotation on Y axis
            logoRef.current.rotation.y += 0.01
            // Gentle floating animation
            logoRef.current.position.y = height + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <group ref={logoRef} position={[0, height, 0]}>
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
            <mesh position={[0, 0, -0.2]} rotation={[0, Math.PI, 0]} renderOrder={100}>
                <planeGeometry args={[2 * scale, 2 * scale]} />
                <meshLambertMaterial
                    map={logoTexture}
                    transparent
                    side={THREE.FrontSide}
                    emissive="#68d4fc"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Logo Backing for 3D Effect */}
            <mesh position={[0, 0, 0]} renderOrder={99}>
                <planeGeometry args={[2.1 * scale, 2.1 * scale]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 3D Extrusion Frame */}
            <mesh position={[0, 0, 0]} renderOrder={98}>
                <boxGeometry args={[2.2 * scale, 2.2 * scale, 0.4]} />
                <meshStandardMaterial
                    color="#68d4fc"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Club Name Text */}
            <Center position={[0, -1.5 * scale, 0.3]} renderOrder={101}>
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[1.5 * scale, 0.3 * scale]} />
                    <meshLambertMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={0.2}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </Center>
        </group>
    )
}

// Floor Component
export const MonumentFloor: React.FC<{
    radius?: number
    clubColor: string
}> = ({ radius = 6, clubColor }) => {
    const floorRef = useRef<THREE.Mesh>(null)

    return (
        <group>
            {/* Main floor */}
            <mesh ref={floorRef} position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius, 32]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Floor border */}
            <mesh position={[0, 0, 0]}>
                <torusGeometry args={[radius - 0.1, 0.05, 8, 32]} />
                <meshLambertMaterial
                    color="#68d4fc"
                    emissive="#68d4fc"
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Inner circle accent */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius * 0.3, 32]} />
                <meshStandardMaterial
                    color="#3a3a3a"
                    roughness={0.6}
                    metalness={0.2}
                />
            </mesh>
        </group>
    )
}

// Spotlights for Monument
export const MonumentSpotlights: React.FC<{
    clubColor: string
    intensity?: number
}> = ({ clubColor, intensity = 2 }) => {
    return (
        <group>
            {/* Main spotlight from above */}
            <spotLight
                position={[0, 10, 0]}
                target-position={[0, 0, 0]}
                angle={0.4}
                penumbra={0.5}
                intensity={intensity}
                color="#ffffff"
                castShadow
            />

            {/* Accent spotlights */}
            <spotLight
                position={[4, 6, 4]}
                target-position={[0, 0, 0]}
                angle={0.5}
                penumbra={0.7}
                intensity={intensity * 0.6}
                color="#68d4fc"
            />

            <spotLight
                position={[-4, 6, 4]}
                target-position={[0, 0, 0]}
                angle={0.5}
                penumbra={0.7}
                intensity={intensity * 0.6}
                color="#68d4fc"
            />
        </group>
    )
}

// Monument level configurations
export const MONUMENT_CONFIGS = {
    1: { height: 3, logoHeight: 2.5, floorRadius: 4 },
    2: { height: 4, logoHeight: 3.5, floorRadius: 5 },
    3: { height: 5, logoHeight: 4.5, floorRadius: 6 },
    4: { height: 6, logoHeight: 5.5, floorRadius: 7 },
    5: { height: 7, logoHeight: 6.5, floorRadius: 8 }
} as const

// Sponsor Display Component
export const SponsorDisplay: React.FC<{
    position?: [number, number, number]
    scale?: number
}> = ({ position = [0, 0, 6], scale = 1 }) => {
    const sponsor = useMemo(() => getRandomSponsor(), [])
    const sponsorTexture = useTexture(sponsor.imageUrl)

    useEffect(() => {
        if (sponsorTexture) {
            sponsorTexture.flipY = false
        }
    }, [sponsorTexture])

    return (
        <group position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Fixed black background */}
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[7, 2.5]} />
                <meshStandardMaterial
                    color="#000000"
                    transparent={true}
                    opacity={0.8}
                />
            </mesh>

            {/* Sponsor Logo */}
            <mesh position={[0, 0.5, 0]}>
                <planeGeometry args={[2, 1]} />
                <meshStandardMaterial
                    map={sponsorTexture}
                    transparent={true}
                />
            </mesh>

            {/* Campaign Text - White color only */}
            <Text
                position={[0, -0.5, 0]}
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                maxWidth={6}
                textAlign="center"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {sponsor.campaign}
            </Text>
        </group>
    )
} 