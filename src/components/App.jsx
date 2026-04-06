import { useState, useEffect } from "react"

import { getDelivery, insertAddress, updateAddress } from "@/utils/supabase"
import { translate } from "@/utils/translate"

import UserForm from "@/components/UserForm"
import AddDeliveryForm from "@/components/AddDeliveryForm"
import EditDeliveryForm from "@/components/EditDeliveryForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { MoreHorizontalIcon } from "lucide-react"

export default function App() {
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingDelivery, setEditingDelivery] = useState(null)
	const [profile, setProfile] = useState(null)
	const [selectableDeliveries, setSelectableDeliveries] = useState([])
  const [selectedDelivery, setSelectedDelivery] = useState(0)
  const [deliveryData, setDeliveryData] = useState([])
  const [language, setLanguage] = useState('es')
  //const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/Madrid' }).toLowerCase())
  const today = new Date()
  const dayIndex = (today.getDay() + 6) % 7
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayMap = {monday: "lunes", tuesday: "martes", wednesday: "miercoles", thursday: "jueves", friday: "viernes", saturday: "sabado", sunday: "domingo"}
  const [selectedDay, setSelectedDay] = useState(days[dayIndex])

	useEffect(() => {
    if (profile) {
			setSelectableDeliveries(profile.deliveries);
		}
  }, [profile])

  useEffect(() => {
    if (selectedDelivery > 0) {
      getDelivery(selectedDelivery).then(({ data, error }) => {
        if (error) {
          console.error(error)
          return
        }

        if (data) {
          setDeliveryData(data)
        }
      })
    }
  }, [selectedDelivery])

  const handleAddDelivery = (formData) => {
    if (formData.direccion.length == 0 || formData.numero == 0) {
      return
    } else {
      insertAddress(formData).then(({ data, error }) => {
        if (error) {
          console.error(error)
          return
        }

        if (data) {
          if (selectedDelivery > 0 && data[0].numero == selectedDelivery) {
            setDeliveryData((prev) => [...prev, ...data])
          }
        }
      })
    }
  }

  const editRow = (delivery) => {
    setEditingDelivery(delivery)
    setShowEditForm(true)
  }

  const subscribe = (delivery) => {
    delivery.baja = false
    updateAddress(delivery).then(({ data, error }) => {
      if (error) {
        console.error(error)
        return
      }
      if (data && data.length > 0) {
        setDeliveryData((prev) => prev.map((d) => d.id === data.id ? data : d))
      }
    })
  }

  const unsubscribe = (delivery) => {
    delivery.baja = true
    updateAddress(delivery).then(({ data, error }) => {
      if (error) {
        console.error(error)
        return
      }
      if (data && data.length > 0) {
        setDeliveryData((prev) => prev.map((d) => d.id === data.id ? data : d))
      }
    })
  }

  const editAddress = (updatedDelivery) => {
    updateAddress(updatedDelivery).then(({ data, error }) => {
      if (error) {
        console.error(error)
        return
      }

      if (data && data.length > 0) {
        const updated = data[0]
        setDeliveryData((prev) => prev.map((d) => d.id === updated.id ? updated : d))
      }
    })

    setShowEditForm(false)
    setEditingDelivery(null)
  }

	return (
    <div className="flex flex-col">
      <EditDeliveryForm showForm={showEditForm} setShowEditForm={setShowEditForm} delivery={editingDelivery} language={language} selectableDeliveries={selectableDeliveries} onEdit={editAddress} />
			<div className="flex p-4 justify-between">
        <div className="flex items-center gap-2">
          <UserForm profile={profile} setProfile={setProfile} language={language} />
          {profile && profile.canEdit && <AddDeliveryForm language={language} selectableDeliveries={selectableDeliveries} onAdd={handleAddDelivery} />}
        </div>
        <div>
          <Select defaultValue={language} onValueChange={(value) => setLanguage(value)}>
            <SelectTrigger>
              <SelectValue placeholder={translate("selectlanguage", language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="es">{translate("spanish", language)}</SelectItem>
                <SelectItem value="en">{translate("english", language)}</SelectItem>
                <SelectItem value="de">{translate("german", language)}</SelectItem>
                <SelectItem value="ja">{translate("japanese", language)}</SelectItem>
                <SelectItem value="ko">{translate("korean", language)}</SelectItem>
                <SelectItem value="uk">{translate("ukrainian", language)}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4">
        {selectableDeliveries.length > 0 && (
          <Select defaultValue="" onValueChange={(value) => setSelectedDelivery(value)}>
            <SelectTrigger>
              <SelectValue placeholder={translate("selectdelivery", language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectableDeliveries.map((delivery) => (
                  <SelectItem key={delivery} value={delivery}>
                    {translate("delivery", language)} {delivery}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <div className="flex md:hidden gap-2 my-4">
          {days.map((d) => (
            <Button
              key={d}
              variant={selectedDay === d ? "default" : "outline"}
              onClick={() => setSelectedDay(d)}
              className="capitalize"
            >
              {translate(d, language).slice(0,1)}
            </Button>
          ))}
        </div>

        <div className="grid gap-3 md:hidden">
          {deliveryData.map((r, i) => (r[dayMap[selectedDay]] > 0 &&
            <Card key={i} className={`rounded-2xl shadow ${r.baja ? "bg-red-100" : "bg-white"}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold">
                    {translate('delivery', language)} {r.numero}
                  </div>
                  <div className="flex gap-2">
                    {r.baja && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">{translate('leave', language).toUpperCase()}</span>
                    )}
                    {r.revista && (
                      <span className="text-xs bg-yellow-400 px-2 py-1 rounded">{translate('magazine', language)}</span>
                    )}
                  </div>
                </div>

                <div className="font-medium text-lg mb-1">
                  {r.direccion}
                </div>

                <div className="text-xl font-bold mb-2">
                  📰 {r[dayMap[selectedDay]]} {translate(r[dayMap[selectedDay]] < 2 ? 'newspaper' : 'newspapers', language)}
                </div>
                {r.extra && (
                  <div className="text-sm text-gray-600">
                    📝 {r.extra}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="hidden md:block">
          {deliveryData.length > 0 && (<table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left">{translate("address", language)}</th>
                <th className="p-2 text-left">{translate("monday", language)}</th>
                <th className="p-2 text-left">{translate("tuesday", language)}</th>
                <th className="p-2 text-left">{translate("wednesday", language)}</th>
                <th className="p-2 text-left">{translate("thursday", language)}</th>
                <th className="p-2 text-left">{translate("friday", language)}</th>
                <th className="p-2 text-left">{translate("saturday", language)}</th>
                <th className="p-2 text-left">{translate("sunday", language)}</th>
                <th className="p-2 text-left">{translate("status", language)}</th>
                {profile && profile.canEdit && <th className="p-2 text-right">{translate("actions", language)}</th>}
              </tr>
            </thead>
            <tbody>
              {deliveryData.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="p-2">
                    <p>{delivery.direccion}</p>
                    {delivery.extra && <p className="text-sm text-gray-400">{delivery.extra}</p>}
                  </td>
                  <td className="p-2">{delivery.lunes}</td>
                  <td className="p-2">{delivery.martes}</td>
                  <td className="p-2">{delivery.miercoles}</td>
                  <td className="p-2">{delivery.jueves}</td>
                  <td className="p-2">{delivery.viernes}</td>
                  <td className="p-2">{delivery.sabado}</td>
                  <td className="p-2">{delivery.domingo}</td>
                  <td className="p-2 flex gap-2">
                    {delivery.baja && <span>🔴</span>}
                    {delivery.revista && <span>🟡</span>}
                  </td>
                  {profile && profile.canEdit && <td className="p-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => editRow(delivery)}>Edit</DropdownMenuItem>
                        {delivery.baja === true && <DropdownMenuItem onClick={() => subscribe(delivery)}>Dar de alta</DropdownMenuItem>}
                        {delivery.baja === false && <DropdownMenuItem onClick={() => unsubscribe(delivery)}>Dar de baja</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>)}

        </div>
      </div>
		</div>
	);
}
