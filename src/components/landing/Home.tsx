import React from 'react'

import { Hero } from './hero'
import ParticleWave from '../ui/particle-wave'

function Home() {
  return (
    <div>
    <div className="absolute inset-0 z-40 opacity-100">
<ParticleWave />
</div>
      <Hero></Hero>
    </div>
  )
}

export default Home
