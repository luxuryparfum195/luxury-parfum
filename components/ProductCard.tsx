'use client'

import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { Perfume } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import { Eye } from 'lucide-react'
import { useStore } from '@/store/useStore'

interface ProductCardProps {
  perfume: Perfume
  index: number
}

export function ProductCard({ perfume, index }: ProductCardProps) {
  const { currentLang, setSelectedProduct, setCurrentView } = useStore()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showBack, setShowBack] = useState(false)

  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleClick = () => {
    setSelectedProduct(perfume)
    setCurrentView('product')
  }

  // Auto flip animation
  useState(() => {
    if (perfume.image_url_2 && !isHovered) {
      const interval = setInterval(() => {
        setShowBack(prev => !prev)
      }, 4000)
      return () => clearInterval(interval)
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className="relative group cursor-pointer"
    >
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-[450px]"
      >
        {/* Card Front */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
            background: currentLang === 'fr' ? '#fff' : currentLang === 'ar' ? '#1a1a1a' : '#2d2d2d',
          }}
          animate={{
            rotateY: showBack ? 180 : 0,
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Image */}
          <div className="relative h-[320px] overflow-hidden">
            <motion.img
              src={perfume.image_url_1}
              alt={perfume.nom}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0"
            />

            {/* Quick View Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: currentLang === 'fr' ? 'rgba(255,255,255,0.95)' :
                  currentLang === 'ar' ? 'rgba(26,26,26,0.95)' :
                    'rgba(61,61,61,0.95)',
              }}
            >
              <Eye className="w-5 h-5" style={{ color: currentLang === 'fr' ? '#c9a227' : '#d4a03c' }} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <h3
              className="text-2xl font-bold mb-2 font-serif"
              style={{ color: currentLang === 'fr' ? '#1a1a1a' : '#f5f5f5' }}
            >
              {perfume.nom}
            </h3>
            <p
              className="text-lg font-display tracking-widest"
              style={{ color: currentLang === 'fr' ? '#c9a227' : currentLang === 'ar' ? '#d4a03c' : '#c0c0c0' }}
            >
              {formatPrice(perfume.prix_par_ml)} / ml
            </p>
          </div>
        </motion.div>

        {/* Card Back */}
        {perfume.image_url_2 && (
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: '#1a1a1a',
            }}
            animate={{
              rotateY: showBack ? 0 : -180,
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative h-[320px] overflow-hidden">
              <img
                src={perfume.image_url_2}
                alt={perfume.nom}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2 font-serif text-white">
                {perfume.nom}
              </h3>
              <p className="text-luxury-gold-300 font-display tracking-widest">
                {currentLang === 'fr' ? 'Vue Alternative' :
                  currentLang === 'ar' ? 'عرض بديل' : 'Alternate View'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Glow Effect */}
        <motion.div
          className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.4), rgba(244, 228, 188, 0.4))',
          }}
        />
      </motion.div>
    </motion.div>
  )
}