import React from 'react'
import Recommendations from '../../components/RecommendedWorkers'
import NearbyWorkers from '../../components/NearbyWorkers'

export default function TopPicks() {
  return (
    <div>
      <Recommendations/>
      <NearbyWorkers/>
    </div>
  )
}
