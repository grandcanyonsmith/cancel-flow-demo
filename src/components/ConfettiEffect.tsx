import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

interface ConfettiEffectProps {
  isActive: boolean
  duration?: number
  onComplete?: () => void
}

const colors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
]

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  isActive,
  duration = 3000,
  onComplete,
}) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
      }))

      setPieces(newPieces)

      // Clean up after duration
      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, duration, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: piece.color,
            left: piece.x,
          }}
          initial={{
            y: piece.y,
            rotate: piece.rotation,
            scale: piece.scale,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: duration / 1000,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
