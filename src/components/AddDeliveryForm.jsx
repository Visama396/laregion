import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import DeliveryFormFields, {
  createEmptyDeliveryForm,
  normalizeDeliveryForm,
} from "@/components/DeliveryFormFields"
import FormModal, { FormMessage } from "@/components/FormModal"
import { getDeliveryCount } from "@/utils/supabase"
import { translate } from "@/utils/translate"

export default function AddDeliveryForm({ language, selectedDelivery, selectableDeliveries, onAdd }) {
  const [form, setForm] = useState(createEmptyDeliveryForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [addressError, setAddressError] = useState("")

  const fieldsDisabled = saving || !form.numero

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (success) setSuccess("")
    if (field === "direccion" && addressError) setAddressError("")
  }

  const updateOrden = async (numero) => {
    const { count, error: countError } = await getDeliveryCount(numero)
    if (countError) {
      console.error(countError)
      return
    }

    if (count != null) {
      setForm((prev) => ({ ...prev, orden: count + 1 }))
    }
  }

  useEffect(() => {
    if (form.numero > 0) {
      updateOrden(form.numero)
    }
  }, [form.numero])

  const openForm = () => {
    setForm({
      ...createEmptyDeliveryForm(),
      numero: selectedDelivery > 0 ? selectedDelivery : 0,
    })
    setError("")
    setSuccess("")
    setAddressError("")
    setSaving(false)
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return
    setShowForm(false)
    setError("")
    setSuccess("")
    setAddressError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (saving) return

    setError("")
    setSuccess("")

    const normalized = normalizeDeliveryForm(form)
    let hasError = false

    if (!normalized.numero) {
      setError(translate("deliveryRequired", language))
      hasError = true
    }

    if (!normalized.direccion) {
      setAddressError(translate("addressRequired", language))
      hasError = true
    }

    if (hasError) return

    setSaving(true)
    let result
    try {
      result = await onAdd(normalized)
    } catch (saveError) {
      console.error(saveError)
      result = { error: saveError }
    } finally {
      setSaving(false)
    }

    if (result?.error) {
      setError(translate("saveError", language))
      return
    }

    setSuccess(translate("addressAdded", language))
    setForm({ ...createEmptyDeliveryForm(), numero: normalized.numero })
    updateOrden(normalized.numero)
  }

  if (selectableDeliveries.length === 0) {
    return null
  }

  if (!showForm) {
    return (
      <Button type="button" onClick={openForm}>
        {translate("addaddress", language)}
      </Button>
    )
  }

  return (
    <FormModal
      title={translate("addaddress", language)}
      description={translate("addAddressHelp", language)}
      closeLabel={translate("close", language)}
      onClose={closeForm}
      footer={
        <>
          <Button type="button" variant="outline" onClick={closeForm} disabled={saving}>
            {translate("close", language)}
          </Button>
          <Button
            type="submit"
            form="add-delivery-form"
            disabled={fieldsDisabled || saving}
          >
            {saving ? translate("saving", language) : translate("add", language)}
          </Button>
        </>
      }
    >
      <form id="add-delivery-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <DeliveryFormFields
          form={form}
          onChange={handleChange}
          language={language}
          disabled={fieldsDisabled}
          deliverySelectDisabled={saving}
          selectableDeliveries={selectableDeliveries}
          addressError={addressError}
        />
        {error && <FormMessage>{error}</FormMessage>}
        {success && <FormMessage type="success">{success}</FormMessage>}
      </form>
    </FormModal>
  )
}
