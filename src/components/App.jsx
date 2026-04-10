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
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayMap = {monday: "lunes", tuesday: "martes", wednesday: "miercoles", thursday: "jueves", friday: "viernes", saturday: "sabado", sunday: "domingo"}
  const [selectedDay, setSelectedDay] = useState(days[0])

  useEffect(() => {
    const today = new Date()
    const dayIndex = (today.getDay() + 6) % 7
    setSelectedDay(days[dayIndex])
  }, [])

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
        if (updatedDelivery.orden !== data[0].orden) {
          getDelivery(selectedDelivery).then(({ data }) => {
            if (data) setDeliveryData(data)
          })
        } else {
          const updated = data[0]
          setDeliveryData((prev) => prev.map((d) => d.id === updated.id ? updated : d))
        }
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
            <Card key={i} className={`rounded-2xl shadow-md ${r.baja ? "bg-red-100" : "bg-white"}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold">
                    {translate('delivery', language)} {r.numero}
                  </div>
                  <div className="flex gap-2">
                    {r.baja && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">{translate('leave', language).toUpperCase()}</span>
                    )}
                    {selectedDay === 'sunday' && r.revista && (
                      <span className="text-xs bg-yellow-400 px-2 py-1 rounded font-bold">{translate('magazine', language).toUpperCase()}</span>
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
          {deliveryData.length > 0 && (<table className="w-auto border-collapse mx-auto">
            <thead className="sticky top-0 bg-white">
              <tr>
                {profile && profile.canEdit && <th className="p-2 text-left">Orden</th>}
                <th className="p-2 text-left">{translate("address", language)}</th>
                {days.map((day) => {
                  return <th key={day} className={`p-2 text-left ${selectedDay === day ? 'bg-blue-100 font-bold rounded-t-md' : ''}`}>{translate(day, language)}</th>
                })}
                <th className="p-2 text-left">Voz de Galicia</th>
                <th className="p-2 text-left">Atlántico</th>
                {profile && profile.canEdit && <th className="p-2 text-right">{translate("actions", language)}</th>}
              </tr>
            </thead>
            <tbody>
              {deliveryData.map((delivery, index) => {
                const isLastRow = index === deliveryData.length - 1
                return (
                  <tr key={delivery.id} className={`${delivery.baja ? 'bg-red-100 rounded-md' : ''}`}>
                    {profile && profile.canEdit && <td className="p-2">{delivery.orden}</td>}
                    <td className="p-2">
                      <p>{delivery.direccion}</p>
                      {delivery.extra && <p className="text-sm text-gray-400">{delivery.extra}</p>}
                    </td>
                    {
                      days.map((day) => {
                        const isSelected = selectedDay === day
                        return <td key={day} className={`p-2 ${delivery.baja ? 'bg-red-100' : day === 'sunday' && isSelected && delivery.revista ? 'bg-yellow-200' : day === 'sunday' && delivery.revista ? 'bg-yellow-200 rounded-md' : isSelected ? 'bg-blue-50':'' } ${isLastRow && isSelected ? 'rounded-b-md' : ''}`}>{delivery[dayMap[day]]}</td>
                      })
                    }
                    <td className="p-2">{delivery.voz_de_galicia}</td>
                    <td className="p-2">{delivery.atlantico}</td>
                    {profile && profile.canEdit && <td className="p-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => editRow(delivery)}>{translate("edit", language)}</DropdownMenuItem>
                          {delivery.baja === true && <DropdownMenuItem onClick={() => subscribe(delivery)}>{translate("subscribe", language)}</DropdownMenuItem>}
                          {delivery.baja === false && <DropdownMenuItem onClick={() => unsubscribe(delivery)}>{translate("unsubscribe", language)}</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>}
                  </tr>
                )
              })}
            </tbody>
          </table>)
          }
        </div>
      </div>
		</div>
	);
}
