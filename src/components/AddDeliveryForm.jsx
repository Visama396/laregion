import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { getDeliveryCount } from "@/utils/supabase"
import { translate } from "@/utils/translate"

export default function AddDeliveryForm({ language, selectableDeliveries, onAdd }) {
  const dayMap = {lunes: "monday", martes: "tuesday", miercoles: "wednesday", jueves: "thursday", viernes: "friday", sabado: "saturday", domingo: "sunday"}
  const [form, setForm] = useState({
    direccion: "",
    extra: "",
    numero: 0,
    orden: 1,
    lunes: 1,
    martes: 1,
    miercoles: 1,
    jueves: 1,
    viernes: 1,
    sabado: 1,
    domingo: 1,
    baja: false,
    revista: false,
    voz_de_galicia: 0,
    atlantico: 0,
    dia_festivo: "normal",
    festivo: 1
  })

  const [showForm, setShowForm] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(form)
    resetForm()
  }

  const resetForm = (resetNumero = false) => {
    if (resetNumero) {
      setForm({...form, numero: 0, direccion: "", extra: "", revista: false, baja: false, lunes: 1, martes: 1, miercoles: 1, jueves: 1, viernes: 1, sabado: 1, domingo: 1})
    } else {
      setForm({...form, direccion: "", extra: "", revista: false, baja: false, lunes: 1, martes: 1, miercoles: 1, jueves: 1, viernes: 1, sabado: 1, domingo: 1, orden: form.orden + 1})
    }
  }

  useEffect(() => {
    const updateOrden = async () => {
      const { count, error } = await getDeliveryCount(form.numero)
      if (error) {
        console.error(error)
        return
      }

      if (count != null || count != undefined) {
        setForm(prev => ({ ...prev, orden: count + 1 }))
        setCanEdit(true)
      }
    }

    if (form.numero > 0) {
      updateOrden()
    }
  }, [form.numero])

  if (selectableDeliveries.length === 0) {
    return null
  }

  if (showForm) {
    return (
      <div className="fixed flex inset-0 justify-center items-center bg-black/95 z-10">
        <div className="bg-white p-4">
          <h2 className="text-3xl font-semibold">{translate("addaddress", language)}</h2>
          <div className="flex flex-col mt-4 gap-4">
            <div className="flex items-end gap-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="" onValueChange={(value) => handleChange("numero", value)}>
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
                <div className="flex gap-2 items-center">
                  <Checkbox disabled={!canEdit} id="revista" checked={form.revista} onCheckedChange={(value) => handleChange("revista", value)} />
                  <label htmlFor="revista">{translate("magazine", language)}</label>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox disabled={!canEdit} id="baja" checked={form.baja} onCheckedChange={(value) => handleChange("baja", value)} />
                  <label htmlFor="baja">{translate("leave", language)}</label>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="orden">{translate("order", language)}</label>
                <Input disabled={!canEdit} id="orden" type="number" placeholder={form.orden} value={form.orden} onChange={(e) => handleChange("orden", e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Input disabled={!canEdit} placeholder={translate("address", language)} value={form.direccion} onChange={(e) => handleChange("direccion", e.target.value)} />
              <Input disabled={!canEdit} placeholder={translate("extra", language)} value={form.extra} onChange={(e) => handleChange("extra", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"].map((day) => (
                <div key={day}>
                  <label htmlFor={day}>{translate(dayMap[day], language)}</label>
                  <Input disabled={!canEdit} id={day} type="number" placeholder={form[day]} value={form[day]} onChange={(e) => handleChange(day, e.target.value)} />
                </div>
              ))}
              <div>
                <label htmlFor="">Voz de Galicia</label>
                <Input disabled={!canEdit} id="voz_de_galicia" type="number" placeholder={form.voz_de_galicia} value={form.voz_de_galicia} onChange={(e) => handleChange("voz_de_galicia", e.target.value)} />
              </div>
              <div>
                <label htmlFor="">Atlántico</label>
                <Input disabled={!canEdit} id="atlantico" type="number" placeholder={form.atlantico} value={form.atlantico} onChange={(e) => handleChange("atlantico", e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button disabled={!canEdit} onClick={handleSubmit}>{translate('add', language)}</Button>
              <Button className="bg-red-400 hover:bg-red-400/80" onClick={() => {resetForm(true); setShowForm(false)}}>{translate('close', language)}</Button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <Button variant="default" onClick={() => {resetForm(true); setShowForm(true)}}>{translate("addaddress", language)}</Button>
    )
  }
}
