import { useState, useEffect } from "react"

import { supabase } from "../utils/supabase"
import { translate } from "../utils/translate"

import UserForm from "./UserForm"

export default function App() {
	const [profile, setProfile] = useState(null)
	const [selectableDeliveries, setSelectableDeliveries] = useState([])
  const [selectedDelivery, setSelectedDelivery] = useState("")
  const [language, setLanguage] = useState('es')
  const [selectedDay, setSelectedDay] = useState("martes")
	const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

	useEffect(() => {
		if (profile) {
			setSelectableDeliveries(profile.deliveries);
		}
	}, [profile])

	return (
		<div className="flex flex-col">
			<div className="flex p-4 items-center gap-2">
				<UserForm profile={profile} setProfile={setProfile} language={language} />
				{selectableDeliveries.length > 0 && (
					<select
						className="bg-[#333] text-white p-2"
						value={selectedDelivery}
						onChange={(e) => setSelectedDelivery(e.target.value)}
					>
						<option value="">Escoge reparto</option>
						{selectableDeliveries.map((delivery) => (
							<option
								key={delivery}
								value={delivery}
							>
								{translate("delivery", language)} {delivery}
							</option>
						))}
					</select>
        )}
        <div className="flex-1"></div>
        <div>
          <select className="bg-[#333] text-white p-2" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="es">{translate("spanish", language)}</option>
            <option value="en">{translate("english", language)}</option>
            <option value="de">{translate("german", language)}</option>
            <option value="ja">{translate("japanese", language)}</option>
            <option value="ko">{translate("korean", language)}</option>
            <option value="uk">{translate("ukrainian", language)}</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="p-4 max-w-5xl mx-auto">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {days.map((d) => (
              <button
                key={d}
                className={`capitalize text-2xl w-10 rounded-sm ${selectedDay === d ? "bg-[#333] text-white" : "bg-white text-[#333] border border-white"}`}
                onClick={() => setSelectedDay(d)}
              >
                {d.slice(0, 1)}
              </button>
            ))}
          </div>
        </div>
      </div>
		</div>
	);
}
