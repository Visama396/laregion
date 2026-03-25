import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

import { translate } from '../utils/translate'

import NavBar from './NavBar.jsx'

export default function App() {
  const [repartos, setRepartos] = useState([])
  const [repartoIds, setRepartoIds] = useState([])
  const [repartidores, setRepartidores] = useState([])
  const [deliveryAddresses, setDeliveryAddresses] = useState([])
  const [selectedDelivery, setSelectedDelivery] = useState(0)
  const [language, setLanguage] = useState('es')
  const [showLogin, setShowLogin] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [formAddress, setFormAddress] = useState({ delivery: 0, address: '', extra: '', monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0, magazine: false })
  const [errors, setErrors] = useState([])

  useEffect(() => {
    async function getRepartos() {
      const { data, error } = await supabase.from('deliveries').select()

      if (error) {
        console.error(error)
        return
      }

      setRepartos(data || [])

      const uniqueIds = [...new Set((data || []).map(r => r.delivery))]

      setRepartoIds(uniqueIds)
    }

    async function getRepartidores() {
      const { data, error } = await supabase.from('profiles').select()

      if (error) {
        console.error(error)
        return
      }

      setRepartidores(data || [])
    }

    getRepartos()
    getRepartidores()
  }, []);

  useEffect(() => {
    setDeliveryAddresses(repartos.filter((reparto) => reparto.delivery == selectedDelivery))
  }, [selectedDelivery])

  const handleLogin = async (username, password) => {
    const fakeEmail = `${username}@app.local`
    const { data, error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password: password
    })

    if (error) {
      console.error(error.message)
    } else {
      setUser(data.user)
      setShowLogin(false)
    }
  }

  const handleAddAddress = async (item) => {

    const { data, error } = await supabase.from('deliveries').insert([item]).select()

    if (error) {
      console.error(error.message)
    } else {
      console.log('Address added: ', data)
      setShowAddAddress(false)
    }
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      {showLogin && <div className='fixed inset-0 z-10 bg-black/95 flex justify-center items-center'>
        <div className='bg-emerald-600 text-white p-4 flex flex-col gap-2'>
          <h2 className='text-2xl font-semibold'>{translate('login', language)}</h2>
          <input type='text' placeholder='Username' className='w-full p-2 outline-0 rounded-md bg-emerald-700' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type='password' placeholder='Password' className='w-full p-2 outline-0 rounded-md bg-emerald-700' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className='bg-emerald-500 px-2 py-1 rounded-md text-white font-semibold cursor-pointer hover:bg-emerald-500/80 transition duration-300' onClick={() => { handleLogin(username, password) }}>{translate('loginbtn', language)}</button>
          <button className='bg-red-500 px-2 py-1 rounded-md text-white font-semibold cursor-pointer hover:bg-red-500/80 transition duration-300' onClick={() => { setShowLogin(false) }}>{translate('close', language)}</button>
        </div>
      </div>}

      {showAddAddress && <div className='fixed inset-0 z-10 bg-black/95 flex justify-center items-center'>
        <div className='bg-emerald-600 text-white p-4 flex flex-col gap-2'>
          <h2 className='text-2xl font-semibold'>{translate('addaddress', language)}</h2>
          <input type='text' placeholder={translate('address', language)} className='w-full p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.address} onChange={(e) => setFormAddress({ ...formAddress, address: e.target.value })} />
          <div className='flex gap-2'>
            <select className='text-white font-bold bg-emerald-500 border-2 border-emerald-300 outline-0 px-2 py-1 rounded-md' value={formAddress.deliverer} onChange={(e) => setFormAddress({ ...formAddress, deliverer: parseInt(e.target.value) })}>
              <option value='0'>{translate('selectdeliverer', language)}</option>
              {repartidores.map((repartidor) => (
                <option key={repartidor.id} value={repartidor.id}>{repartidor.name}</option>
              ))}
            </select>
            <select className='text-white font-bold bg-emerald-500 border-2 border-emerald-300 outline-0 px-2 py-1 rounded-md' value={formAddress.delivery} onChange={(e) => setFormAddress({ ...formAddress, delivery: parseInt(e.target.value) })}>
              <option value='0'>{translate('selectdelivery', language)}</option>
              {repartoIds.map((id) => (
                <option key={id} value={id}>{translate('delivery', language)} {id}</option>
              ))}
            </select>
          </div>
          <div className='flex gap-2'>
            <input type='number' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.monday} onChange={(e) => setFormAddress({ ...formAddress, monday: parseInt(e.target.value) })} />
            <input type='number' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.tuesday} onChange={(e) => setFormAddress({ ...formAddress, tuesday: parseInt(e.target.value) })} />
            <input type='number' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.wednesday} onChange={(e) => setFormAddress({ ...formAddress, wednesday: parseInt(e.target.value) })} />
            <input type='number' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.thursday} onChange={(e) => setFormAddress({ ...formAddress, thursday: parseInt(e.target.value) })} />
            <input type='number' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.friday} onChange={(e) => setFormAddress({ ...formAddress, friday: parseInt(e.target.value) })} />
            <input type='number' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.saturday} onChange={(e) => setFormAddress({ ...formAddress, saturday: parseInt(e.target.value) })} />
            <input type='number' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.sunday} onChange={(e) => setFormAddress({ ...formAddress, sunday: parseInt(e.target.value) })} />
          </div>
          <div>
            <label htmlFor='hasMagazineCheckbox'>Magazine?</label>
            <input id='hasMagazineCheckbox' type='checkbox' className='w-25 p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.magazine} onChange={(e) => setFormAddress({ ...formAddress, magazine: e.target.checked })} />
          </div>
          <input type='text' placeholder={translate('extraholder', language)} className='w-full p-2 outline-0 rounded-md bg-emerald-700' value={formAddress.extra} onChange={(e) => setFormAddress({ ...formAddress, extra: e.target.value })} />
          <button className='bg-emerald-500 px-2 py-1 rounded-md text-white font-semibold cursor-pointer hover:bg-emerald-500/80 transition duration-300' onClick={() => { handleAddAddress(formAddress) }}>{translate('add', language)}</button>
          <button className='bg-red-500 px-2 py-1 rounded-md text-white font-semibold cursor-pointer hover:bg-red-500/95 transition duration-300' onClick={() => { setShowAddAddress(false) }}>{translate('close', language)}</button>
        </div>
      </div>}

      <NavBar lang={language} changeLanguage={setLanguage} del={selectedDelivery} dels={repartoIds} changeDel={setSelectedDelivery} />
      <div className='flex gap-4'>
        <button className='bg-blue-600 px-2 py-1 rounded-md text-white cursor-pointer' onClick={() => { setShowLogin(true) }}>{translate('login', language)}</button>
        {user && <button className='bg-blue-800 px-2 py-1 rounded-md text-white cursor-pointer' onClick={() => { setShowAddAddress(true) }}>{translate('addaddress', language)}</button>}
      </div>
      <table className='border-collapse text-white'>
        <thead>
          <tr>
            <th className='border border-gray-300 p-2'>{translate('address', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('monday', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('tuesday', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('wednesday', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('thursday', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('friday', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('saturday', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('sunday', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('magazine', language)}</th>
            <th className='border border-gray-300 p-2'>{translate('extra', language)}</th>
          </tr>
        </thead>
        <tbody>
          {deliveryAddresses.map((reparto) => (
            <tr key={reparto.id}>
              <td className='border border-gray-300 text-center'>{reparto.address}</td>
              <td className='border border-gray-300 text-center'>{reparto.monday}</td>
              <td className='border border-gray-300 text-center'>{reparto.tuesday}</td>
              <td className='border border-gray-300 text-center'>{reparto.wednesday}</td>
              <td className='border border-gray-300 text-center'>{reparto.thursday}</td>
              <td className='border border-gray-300 text-center'>{reparto.friday}</td>
              <td className='border border-gray-300 text-center'>{reparto.saturday}</td>
              <td className='border border-gray-300 text-center'>{reparto.sunday}</td>
              <td className='border border-gray-300 text-center'>{reparto.magazine}</td>
              <td className='border border-gray-300 text-center'>{reparto.extra}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
