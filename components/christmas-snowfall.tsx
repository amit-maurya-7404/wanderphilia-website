'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Snowflake {
  x: number
  y: number
  radius: number
  density: number
  opacity: number
  speedX: number
  speedY: number
  sway: number
  swaySpeed: number
}

interface ChristmasSnowfallProps {
  density?: number // snowflake count factor
  className?: string
}

export function ChristmasSnowfall({ density = 45, className = '' }: ChristmasSnowfallProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Generate snowflakes
    const count = Math.min(density, Math.floor((width * height) / 25000) + 20)
    const snowflakes: Snowflake[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      density: Math.random() * 30,
      opacity: Math.random() * 0.7 + 0.25,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: Math.random() * 0.9 + 0.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.005,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i]
        flake.sway += flake.swaySpeed
        flake.x += flake.speedX + Math.sin(flake.sway) * 0.4
        flake.y += flake.speedY

        // Wrap around edges
        if (flake.y > height) {
          flake.y = -10
          flake.x = Math.random() * width
        }
        if (flake.x > width + 10) {
          flake.x = -10
        } else if (flake.x < -10) {
          flake.x = width + 10
        }

        // Draw snowflake with soft glow
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
        ctx.shadowBlur = flake.radius > 2 ? 6 : 2
        ctx.fill()
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [enabled, density])

  return (
    <div className={`pointer-events-none fixed inset-0 z-30 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full pointer-events-none"
        style={{ opacity: enabled ? 1 : 0, transition: 'opacity 0.5s' }}
      />
    </div>
  )
}
