"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type MotionProps = React.ComponentPropsWithoutRef<typeof motion.div>

export function MotionContainer({ children, className, ...props }: MotionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.995 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default MotionContainer
