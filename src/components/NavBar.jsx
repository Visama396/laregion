import { useState, useEffect } from 'react'
import { translate } from '../utils/translate'

export default function NavBar({ lang, changeLanguage, del, dels, changeDel }) {
  const [language, setLanguage] = useState(lang)
  const [delivery, setDelivery] = useState(del)

  return (
    <nav className='flex items-center gap-4'>
      <h1 className='text-xl text-white font-bold'>{translate('deliveries', language)}</h1>
      {dels.length > 0 && <select className='text-white font-bold bg-[#222] border-2 border-[#444] outline-0 px-2 py-1 rounded-md' value={delivery} onChange={(e) => { setDelivery(e.target.value); changeDel(e.target.value) }}>
        <option value="0">{translate('selectdelivery', language)}</option>
        {dels.map((id) => (
          <option key={id} value={id}>{translate('delivery', language)} {id}</option>
        ))}
      </select>}
      <div className='flex-1'></div>
      <select className='text-white font-bold bg-[#222] border-2 border-[#444] outline-0 px-2 py-1 rounded-md' value={language} onChange={(e) => { setLanguage(e.target.value); changeLanguage(e.target.value) }}>
        <option value="en">{translate('english', language)}</option>
        <option value="es">{translate('spanish', language)}</option>
        <option value="de">{translate('german', language)}</option>
        <option value="ja">{translate('japanese', language)}</option>
        <option value="ko">{translate('korean', language)}</option>
        <option value="uk">{translate('ukrainian', language)}</option>
      </select>
    </nav>
  )
}
