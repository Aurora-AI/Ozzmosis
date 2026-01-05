'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number // -1 to 1, where negative moves opposite to scroll
  fadeIn?: boolean
  slideUp?: boolean
  slideDistance?: number
}

/**
 * Parallax Section - Fantasy.co inspired
 *
 * Creates depth through differential scroll speeds.
 * Elements with lower speed values move slower, appearing further away.
 */
export function ParallaxSection({
  children,
  className = '',
  speed = 0.1,
  fadeIn = true,
  slideUp = true,
  slideDistance = 60
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Parallax Y movement
  const y = useTransform(smoothProgress, [0, 1], [100 * speed, -100 * speed])

  // Fade in as element enters viewport
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
      initial={fadeIn ? { opacity: 0, y: slideUp ? slideDistance : 0 } : undefined}
      whileInView={fadeIn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxTextProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

/**
 * Parallax Text - Individual text element with reveal animation
 */
export function ParallaxText({
  children,
  className = '',
  delay = 0,
  as: Component = 'div'
}: ParallaxTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Component className={className}>{children}</Component>
    </motion.div>
  )
}

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
}

/**
 * Parallax Image - Image with depth scroll effect
 */
export function ParallaxImage({
  src,
  alt,
  className = '',
  speed = -0.2
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

/**
 * Stagger Children - Animate children with staggered delays
 */
export function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.1
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}
