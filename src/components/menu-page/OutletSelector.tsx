import React from "react"
import { motion } from "framer-motion"

export type OutletType = "PATHARGADIA" | "KALINGA_NAGAR"

interface OutletSelectorProps {
  activeOutlet: OutletType
  onSelectOutlet: (outlet: OutletType) => void
}

const OUTLETS = [
  { id: "PATHARGADIA", label: "Pathargadia" },
  { id: "KALINGA_NAGAR", label: "Kalinga Nagar" }
] as const

export default function OutletSelector({ activeOutlet, onSelectOutlet }: OutletSelectorProps) {
  return (
    <div className="w-full flex justify-center px-4 mt-2 mb-1 z-20">
      {/* iOS-style premium segmented control matching Bob's Momo branding */}
      <div className="relative w-full max-w-[340px] bg-white border border-brand-charcoal/5 rounded-full p-1 shadow-[0_2px_8px_rgba(26,26,26,0.02)] flex">
        {OUTLETS.map((outlet) => {
          const isActive = activeOutlet === outlet.id
          
          return (
            <button
              key={outlet.id}
              onClick={() => onSelectOutlet(outlet.id)}
              className={`relative flex-grow py-2 text-[10px] md:text-xs font-sans font-bold tracking-wider uppercase transition-colors duration-300 z-10 ${
                isActive ? "text-white" : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
              style={{ flexBasis: "50%" }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeOutletPill"
                  className="absolute inset-0 bg-brand-red rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {outlet.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
