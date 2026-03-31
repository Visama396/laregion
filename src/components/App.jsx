import { useState, useEffect } from 'react'

import { supabase } from '../utils/supabase'
import { translate } from '../utils/translate'

import UserForm from './UserForm'

export default function App() {
  const [profile, setProfile] = useState(null)
  const [selectableDeliveries, setSelectableDeliveries] = useState([])
  const [selectedDelivery, setSelectedDelivery] = useState('')

  useEffect(() => {
    if (profile) {
      setSelectableDeliveries(profile.deliveries)
    }
  }, [profile])

  return (
    <div className=''>
      <div className='flex p-4'>
        <UserForm profile={profile} setProfile={setProfile} />
        {selectableDeliveries.length > 0 && (
          <select className='text-white' value={selectedDelivery} onChange={(e) => setSelectedDelivery(e.target.value)}>
            <option value="">Select a delivery</option>
            {selectableDeliveries.map((delivery) => (
              <option key={delivery.id} value={delivery.id}>
                {delivery.name}
              </option>
            ))}
          </select>
        )}
      </div>

    </div>
  )
}
