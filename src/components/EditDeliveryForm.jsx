import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import DeliveryFormFields, {
  createEmptyDeliveryForm,
  normalizeDeliveryForm,
} from "@/components/DeliveryFormFields"
import FormModal, { FormMessage } from "@/components/FormModal"
import { translate } from "@/utils/translate"

export default function EditDeliveryForm({ showForm, setShowEditForm, delivery, language, selectableDeliveries, onEdit }) {
  const [form, setForm] = useState(createEmptyDeliveryForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [addressError, setAddressError] = useState("")

  useEffect(() => {
    if (delivery && showForm) {
      setForm({ ...createEmptyDeliveryForm(), ...delivery })
      setError("")
      setAddressError("")
      setSaving(false)
    }
  }, [delivery, showForm])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (field === "direccion" && addressError) setAddressError("")
  }

  const closeForm = () => {
    if (saving) return
    setShowEditForm(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (saving) return

    setError("")
    const normalized = normalizeDeliveryForm(form)

    if (!normalized.direccion) {
      setAddressError(translate("addressRequired", language))
      return
    }

    setSaving(true)
    let result
    try {
      result = await onEdit(normalized)
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

    setShowEditForm(false)
  }

  if (selectableDeliveries.length === 0) {
    return null
  }

  if (!showForm) {
    return null
  }

  const description = delivery
    ? `${translate("delivery", language)} ${form.numero || delivery.numero}`
    : ""

  return (
    <FormModal
      title={translate("editaddress", language)}
      description={description}
      closeLabel={translate("close", language)}
      onClose={closeForm}
      footer={
        <>
          <Button type="button" variant="outline" onClick={closeForm} disabled={saving}>
            {translate("close", language)}
          </Button>
          <Button type="submit" form="edit-delivery-form" disabled={saving}>
            {saving ? translate("saving", language) : translate("edit", language)}
          </Button>
        </>
      }
    >
      <form id="edit-delivery-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <DeliveryFormFields
          form={form}
          onChange={handleChange}
          language={language}
          disabled={saving}
          deliverySelectDisabled={saving}
          selectableDeliveries={selectableDeliveries}
          addressError={addressError}
        />
        {error && <FormMessage>{error}</FormMessage>}
      </form>
    </FormModal>
  )
}
