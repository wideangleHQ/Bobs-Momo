import React from "react"
import MenuSection from "../MenuSection"
import AboutSection from "../AboutSection"
import LocationsSection from "../LocationsSection"
import CareersSection from "../CareersSection"
import FeedbackSection from "../FeedbackSection"
import InstagramSection from "../InstagramSection"

export default function MainContent() {
  return (
    <div className="relative z-10 bg-brand-beige">
      <AboutSection />
      <MenuSection />
      <InstagramSection />
      <LocationsSection />
      <FeedbackSection />
      <CareersSection />
    </div>
  )
}
