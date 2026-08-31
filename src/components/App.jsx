import { useState, useEffect, useRef } from "react"

import { getDelivery, getHolidays, insertAddress, updateAddress, reorderDelivery } from "@/utils/supabase"
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
  const [holidays, setHolidays] = useState([])
  const [showBajas, setShowBajas] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [touchDraggingId, setTouchDraggingId] = useState(null)
  const [touchDragOverId, setTouchDragOverId] = useState(null)
  const [touchOffsetY, setTouchOffsetY] = useState(0)
  const touchStart = useRef({})
  const mobileListRef = useRef(null)
  const touchDragOverIdRef = useRef(null)
  const pointerDragActiveRef = useRef(false)
  const onDragWheelRef = useRef(null)

  useEffect(() => {
    const today = new Date()
    const dayIndex = (today.getDay() + 6) % 7
    setSelectedDay(days[dayIndex])

    getHolidays().then(({ data }) => {
      if (data) setHolidays(data.map(h => h.fecha))
    })
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

  const isHoliday = (day) => {
    const today = new Date()
    const dayIndex = days.indexOf(day)
    const currentDayIndex = (today.getDay() + 6) % 7
    const diff = dayIndex - currentDayIndex
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)
    const formatted = targetDate.toISOString().split('T')[0]
    return holidays.includes(formatted)
  }

  const shouldDeliver = (r, day) => {
    if (r.baja) return false
    const festivo = isHoliday(day)
    if (festivo && r.dia_festivo === 'entregar') return true
    if (festivo && r.dia_festivo === 'no_entregar') return false
    return r[dayMap[day]] > 0
  }

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

  const clearWheelListener = () => {
    if (onDragWheelRef.current) {
      window.removeEventListener('wheel', onDragWheelRef.current)
      onDragWheelRef.current = null
    }
  }

  const handleDragStart = (e, delivery) => {
    if (!profile?.canEdit) return
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(delivery.id))
    setDraggingId(delivery.id)
    if (!onDragWheelRef.current) {
      onDragWheelRef.current = (ev) => window.scrollBy(0, ev.deltaY)
      window.addEventListener('wheel', onDragWheelRef.current, { passive: true })
    }
  }

  const handleDragOver = (e, delivery) => {
    if (!profile?.canEdit) return
    e.preventDefault()
    setDragOverId(delivery.id)
  }

  const handleDrop = (e, targetRow) => {
    e.preventDefault()
    const from = deliveryData.findIndex((d) => d.id === draggingId)
    const to = deliveryData.findIndex((d) => d.id === targetRow.id)

    if (from === -1 || to === -1 || from === to) {
      clearWheelListener()
      setDraggingId(null)
      setDragOverId(null)
      return
    }

    const moved = deliveryData[from]
    const newOrden = targetRow.orden

    reorderDelivery(moved.id, moved.numero, moved.orden, newOrden).then(({ error }) => {
      if (error) {
        console.error(error)
        clearWheelListener()
        setDraggingId(null)
        setDragOverId(null)
        return
      }
      getDelivery(selectedDelivery).then(({ data }) => {
        if (data) setDeliveryData(data)
      })
      clearWheelListener()
      setDraggingId(null)
      setDragOverId(null)
    })
  }

  const handleDragEnd = () => {
    clearWheelListener()
    setDraggingId(null)
    setDragOverId(null)
  }

  const startPointerDrag = (e, delivery) => {
    if (!profile?.canEdit) return
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') return
    e.preventDefault()
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}

    touchStart.current = { y: e.clientY, id: delivery.id }
    touchDragOverIdRef.current = delivery.id
    pointerDragActiveRef.current = true
    setTouchDraggingId(delivery.id)
    setTouchDragOverId(delivery.id)
    setTouchOffsetY(0)
  }

  const movePointerDrag = (e) => {
    if (!pointerDragActiveRef.current) return
    e.preventDefault()
    const dy = e.clientY - touchStart.current.y
    setTouchOffsetY(dy)

    let closestId = null
    let closestDist = Infinity
    mobileListRef.current?.querySelectorAll('[data-slot="card"]').forEach((el) => {
      const id = Number(el.dataset.id)
      if (!el.dataset.id || id === touchStart.current.id) return
      const rect = el.getBoundingClientRect()
      const dist = Math.abs(e.clientY - (rect.top + rect.height / 2))
      if (dist < closestDist) {
        closestDist = dist
        closestId = id
      }
    })

    if (closestId !== null && closestId !== touchDragOverIdRef.current) {
      touchDragOverIdRef.current = closestId
      setTouchDragOverId(closestId)
    }
  }

  const endPointerDrag = () => {
    const reorder = pointerDragActiveRef.current
    pointerDragActiveRef.current = false

    if (reorder) {
      const fromIndex = deliveryData.findIndex((d) => d.id === touchStart.current.id)
      const toIndex = deliveryData.findIndex((d) => d.id === touchDragOverIdRef.current)
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        const moved = deliveryData[fromIndex]
        const newOrden = deliveryData[toIndex].orden
        reorderDelivery(moved.id, moved.numero, moved.orden, newOrden).then(({ error }) => {
          if (error) {
            console.error(error)
            return
          }
          getDelivery(selectedDelivery).then(({ data }) => {
            if (data) setDeliveryData(data)
          })
        })
      }
    }

    setTouchDraggingId(null)
    setTouchDragOverId(null)
    setTouchOffsetY(0)
    touchDragOverIdRef.current = null
    touchStart.current = {}
  }

	return (
    <div className="flex flex-col">
      <EditDeliveryForm showForm={showEditForm} setShowEditForm={setShowEditForm} delivery={editingDelivery} language={language} selectableDeliveries={selectableDeliveries} onEdit={editAddress} />
			<div className="flex p-4 justify-between">
        <div className="flex items-center gap-2">
          <UserForm profile={profile} setProfile={setProfile} language={language} />
          {profile && profile.canEdit && <AddDeliveryForm language={language} selectedDelivery={selectedDelivery} selectableDeliveries={selectableDeliveries} onAdd={handleAddDelivery} />}
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
          <div className="flex items-center gap-4">
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
            {deliveryData.length > 0 && (
              <p className="text-sm font-semibold">
                📰 {deliveryData.filter(r => shouldDeliver(r, selectedDay)).reduce((acc, r) => acc + (r[dayMap[selectedDay]] || 0), 0)} {translate('newspapers', language)}
                {selectedDay === 'sunday' && (() => {
                  const magazineTotal = deliveryData.filter(r => shouldDeliver(r, selectedDay) && r.revista).reduce((acc, r) => acc + (r.revista || 0), 0)
                  return magazineTotal > 0 ? <> · 📔 {magazineTotal} {translate('magazines', language)}</> : null
                })()}
              </p>
            )}
          </div>

        )}

          <div className="flex flex-col gap-2 my-4 items-stretch">
            <div className="flex gap-2 justify-between items-center">
              <div className="flex flex-wrap gap-2">
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
            </div>
            {profile && deliveryData.some((r) => r.baja) && (
              <Button
                variant={showBajas ? "default" : "outline"}
                onClick={() => setShowBajas((prev) => !prev)}
                className="text-xs md:hidden"
              >
                {translate('showbajas', language)}
              </Button>
            )}
          </div>

        <div ref={mobileListRef} className="grid gap-3 md:hidden">
          {deliveryData.map((r) => {
            const laregionCount = isHoliday(selectedDay) && r.dia_festivo === 'entregar' ? r.festivo : r[dayMap[selectedDay]]
            const hasLaregion = shouldDeliver(r, selectedDay)
            const hasVoz = (r.voz_de_galicia || 0) > 0
            const hasAtlantico = (r.atlantico || 0) > 0
            const hasMagazine = selectedDay === 'sunday' && r.revista
            const showCard = (r.baja && showBajas) || hasLaregion || hasVoz || hasAtlantico || hasMagazine
            const isTouchDragging = touchDraggingId === r.id
            const isTouchDragOver = touchDragOverId === r.id && touchDraggingId !== r.id

            if (!showCard) return null

            let accentClass = "bg-white"
            if (!hasLaregion) {
              if (hasVoz && hasAtlantico) accentClass = "bg-gradient-to-br from-red-100 via-white to-blue-100 ring-1 ring-red-200"
              else if (hasVoz) accentClass = "bg-gradient-to-br from-red-50 to-red-200 ring-1 ring-red-200"
              else if (hasAtlantico) accentClass = "bg-gradient-to-br from-blue-50 to-blue-200 ring-1 ring-blue-200"
              else if (hasMagazine) accentClass = "bg-gradient-to-br from-yellow-50 to-yellow-200 ring-1 ring-yellow-200"
            }

            return (
              <Card
                key={r.id}
                data-id={r.id}
                className={`rounded-2xl shadow-sm ${r.baja ? "bg-red-100" : accentClass} hover:shadow-md transition-shadow ${isTouchDragging ? 'opacity-50 ring-2 ring-blue-400 z-10' : ''} ${isTouchDragOver ? 'ring-2 ring-blue-400' : ''} ${touchDraggingId ? 'touch-action-none' : ''} ${profile?.canEdit ? 'select-none [-webkit-user-select:none]' : ''}`}
                style={{
                  WebkitTouchCallout: profile?.canEdit ? 'none' : undefined,
                  transform: isTouchDragging ? `translateY(${touchOffsetY}px)` : undefined,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-semibold">
                      {profile && profile.canEdit && (
                        <span
                          role="button"
                          title={translate('dragToReorder', language)}
                          className="text-gray-400 mr-1 cursor-grab select-none [-webkit-user-select:none] active:cursor-grabbing"
                          style={{ touchAction: 'none', WebkitTouchCallout: 'none' }}
                          onPointerDown={(e) => startPointerDrag(e, r)}
                          onPointerMove={movePointerDrag}
                          onPointerUp={endPointerDrag}
                          onPointerCancel={endPointerDrag}
                          onContextMenu={(e) => e.preventDefault()}
                        >⋮⋮</span>
                      )}
                      {translate('delivery', language)} {r.numero}{profile && profile.canEdit && (<span> · {translate('order', language)} {r.orden}</span>)}
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {r.baja && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">{translate('leave', language).toUpperCase()}</span>
                      )}
                      {hasVoz && (
                        <span className={`text-xs px-2 py-1 rounded font-bold ${hasLaregion ? 'bg-red-500 text-white' : 'bg-red-600 text-white'}`}>Voz de Galicia</span>
                      )}
                      {hasAtlantico && (
                        <span className={`text-xs px-2 py-1 rounded font-bold ${hasLaregion ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}`}>Atlántico</span>
                      )}
                      {selectedDay === 'sunday' && r.revista && (
                        <span className="text-xs bg-yellow-400 px-2 py-1 rounded font-bold">{translate('magazine', language).toUpperCase()}</span>
                      )}
                      {isHoliday(selectedDay) && r.dia_festivo === 'entregar' && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded font-bold">{translate('holiday', language).toUpperCase()}</span>
                      )}
                      {profile && profile.canEdit && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => editRow(r)}>{translate("edit", language)}</DropdownMenuItem>
                            {r.baja === true && <DropdownMenuItem onClick={() => subscribe(r)}>{translate("subscribe", language)}</DropdownMenuItem>}
                            {r.baja === false && <DropdownMenuItem onClick={() => unsubscribe(r)}>{translate("unsubscribe", language)}</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <div className="font-bold text-xl mb-1">
                    {r.direccion}
                  </div>

                  <div className="text-lg font-medium mb-2">
                    {hasLaregion ? (
                      <>📰 {laregionCount} {translate(laregionCount < 2 ? 'newspaper' : 'newspapers', language)}
                        {hasVoz && <span className="text-red-600 font-bold"> · {r.voz_de_galicia} Voz de Galicia</span>}
                        {hasAtlantico && <span className="text-blue-600 font-bold"> · {r.atlantico} Atlántico</span>}
                      </>
                    ) : (
                      <>
                        {hasVoz && <span className="text-red-600 font-bold">📰 {r.voz_de_galicia} Voz de Galicia</span>}
                        {hasVoz && hasAtlantico && <span className="text-gray-400 font-bold"> · </span>}
                        {hasAtlantico && <span className="text-blue-600 font-bold">📰 {r.atlantico} Atlántico</span>}
                      </>
                    )}
                  </div>
                  {r.extra && (
                    <div className="text-gray-800 font-semibold">
                      📝 {r.extra}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="hidden md:block">
          {deliveryData.length > 0 && (<table className="w-auto border-collapse mx-auto">
            <thead className="sticky top-0 bg-white">
              <tr>
                {profile && profile.canEdit && <th className="p-2 text-left">{translate('order', language)}</th>}
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
                const isDragging = draggingId === delivery.id
                const isDragOver = dragOverId === delivery.id
                return (
                  <tr
                    key={delivery.id}
                    draggable={!!profile?.canEdit}
                    onDragStart={(e) => { handleDragStart(e, delivery) }}
                    onDragOver={(e) => handleDragOver(e, delivery)}
                    onDrop={(e) => handleDrop(e, delivery)}
                    onDragEnd={handleDragEnd}
                    className={`${delivery.baja ? 'bg-red-100 rounded-md' : ''} ${profile?.canEdit ? 'cursor-grab' : ''} ${isDragging ? 'opacity-50' : ''} ${isDragOver && draggingId !== delivery.id ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    {profile && profile.canEdit && <td className="p-2">
                      <span className="inline-flex items-center gap-1" title="Drag to reorder">⋮⋮ {delivery.orden}</span>
                    </td>}
                    <td className="p-2">
                      <p>{delivery.direccion}</p>
                      {delivery.extra && <p className="text-sm text-gray-400">{delivery.extra}</p>}
                    </td>
                    {
                      days.map((day) => {
                        const isSelected = selectedDay === day
                        const isFestivo = isHoliday(day) && delivery.dia_festivo === 'entregar'
                        return <td key={day} className={`p-2
                              ${delivery.baja ? 'bg-red-100' :
                                isFestivo ? 'bg-purple-100' :
                                day === 'sunday' && delivery.revista ? 'bg-yellow-200' :
                                isSelected ? 'bg-blue-50' : ''}
                              ${isLastRow && isSelected ? 'rounded-b-md' : ''}`}>
                              {delivery[dayMap[day]] === 0 && isFestivo ? delivery.festivo : delivery[dayMap[day]]}
                            </td>
                      })
                    }
                    <td className={`p-2 ${delivery.voz_de_galicia > 0 ? 'bg-red-200' : ''}`}>{delivery.voz_de_galicia}</td>
                    <td className={`p-2 ${delivery.atlantico > 0 ? 'bg-blue-200' : ''}`}>{delivery.atlantico}</td>
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
