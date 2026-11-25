import { CopyIcon, MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translate } from "@/utils/translate"

export const dayFields = [
  { field: "lunes", labelKey: "monday" },
  { field: "martes", labelKey: "tuesday" },
  { field: "miercoles", labelKey: "wednesday" },
  { field: "jueves", labelKey: "thursday" },
  { field: "viernes", labelKey: "friday" },
  { field: "sabado", labelKey: "saturday" },
  { field: "domingo", labelKey: "sunday" },
]

export const createEmptyDeliveryForm = () => ({
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
  festivo: 1,
})

const toInt = (value) => {
  if (value === "" || value === null || value === undefined) return ""
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? "" : parsed
}

export const normalizeDeliveryForm = (form) => {
  const normalized = {
    ...form,
    direccion: (form.direccion || "").trim(),
    extra: (form.extra || "").trim(),
    numero: Math.max(0, toInt(form.numero) || 0),
    orden: Math.max(0, toInt(form.orden) || 0),
    voz_de_galicia: Math.max(0, toInt(form.voz_de_galicia) || 0),
    atlantico: Math.max(0, toInt(form.atlantico) || 0),
    baja: Boolean(form.baja),
    revista: Boolean(form.revista),
    dia_festivo: form.dia_festivo || "normal",
  }

  dayFields.forEach(({ field }) => {
    normalized[field] = Math.max(0, toInt(form[field]) || 0)
  })

  return normalized
}

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
      {children}
    </section>
  )
}

function Field({ id, label, required, help, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : help ? (
        <p className="text-xs text-gray-500">{help}</p>
      ) : null}
    </div>
  )
}

function NumberStepper({ id, label, value, onChange, disabled, min = 0 }) {
  const changeBy = (delta) => {
    if (disabled) return
    const base = value === "" || Number.isNaN(Number(value)) ? 0 : Number(value)
    onChange(Math.max(min, base + delta))
  }

  const handleInput = (event) => {
    const raw = event.target.value
    if (raw === "") {
      onChange("")
      return
    }
    const parsed = parseInt(raw, 10)
    onChange(Number.isNaN(parsed) ? "" : Math.max(min, parsed))
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <div
        className={`flex h-9 items-center overflow-hidden rounded-md border border-input bg-transparent shadow-xs ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => changeBy(-1)}
          disabled={disabled}
          aria-label={`${label} -1`}
          className="flex h-full w-8 shrink-0 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none"
        >
          <MinusIcon className="size-3.5" />
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          disabled={disabled}
          onChange={handleInput}
          className="h-full w-full min-w-0 border-0 bg-transparent text-center text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => changeBy(1)}
          disabled={disabled}
          aria-label={`${label} +1`}
          className="flex h-full w-8 shrink-0 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none"
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

function ToggleRow({ id, label, help, checked, onChange, disabled }) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={Boolean(checked)}
        onCheckedChange={onChange}
        disabled={disabled}
        className="mt-0.5"
      />
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {help && <p className="text-xs text-gray-500">{help}</p>}
      </div>
    </div>
  )
}

export default function DeliveryFormFields({
  form,
  onChange,
  language,
  disabled = false,
  deliverySelectDisabled = false,
  selectableDeliveries = [],
  addressError = "",
  showInactive = true,
}) {
  const applyMondayToAllDays = () => {
    const value = form.lunes
    dayFields.forEach(({ field }) => onChange(field, value))
  }

  return (
    <div className="flex flex-col gap-6">
      <Section title={translate("delivery", language)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="delivery-numero" label={translate("delivery", language)} required>
            <Select
              value={form.numero ? String(form.numero) : ""}
              onValueChange={(value) => {
                // Radix's hidden native select can emit an empty change while its
                // options register, which would clear the preselected delivery.
                if (value === "") return
                onChange("numero", Number(value))
              }}
              disabled={deliverySelectDisabled}
            >
              <SelectTrigger id="delivery-numero" className="w-full">
                <SelectValue placeholder={translate("selectdelivery", language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectableDeliveries.map((delivery) => (
                    <SelectItem key={delivery} value={String(delivery)}>
                      {translate("delivery", language)} {delivery}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field id="orden" label={translate("order", language)} help={translate("orderHelp", language)}>
            <Input
              id="orden"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              disabled={disabled}
              value={form.orden}
              onChange={(event) => onChange("orden", toInt(event.target.value))}
            />
          </Field>
        </div>

        {!form.numero && (
          <p className="text-xs text-gray-500">{translate("selectDeliveryFirst", language)}</p>
        )}
      </Section>

      <Section title={translate("address", language)}>
        <Field
          id="direccion"
          label={translate("streetAddress", language)}
          required
          error={addressError}
        >
          <Input
            id="direccion"
            autoComplete="street-address"
            placeholder={translate("addressPlaceholder", language)}
            disabled={disabled}
            value={form.direccion || ""}
            onChange={(event) => onChange("direccion", event.target.value)}
            aria-invalid={Boolean(addressError)}
          />
        </Field>

        <Field id="extra" label={translate("extra", language)}>
          <Input
            id="extra"
            placeholder={translate("extraholder", language)}
            disabled={disabled}
            value={form.extra || ""}
            onChange={(event) => onChange("extra", event.target.value)}
          />
        </Field>
      </Section>

      <Section title={translate("scheduleSection", language)}>
        <Field
          id="dia_festivo"
          label={translate("holidayoption", language)}
          help={translate("holidayHelp", language)}
        >
          <Select
            value={form.dia_festivo || "normal"}
            onValueChange={(value) => onChange("dia_festivo", value)}
            disabled={disabled}
          >
            <SelectTrigger id="dia_festivo" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="normal">{translate("festivo_normal", language)}</SelectItem>
                <SelectItem value="entregar">{translate("festivo_entregar", language)}</SelectItem>
                <SelectItem value="no_entregar">{translate("festivo_no_entregar", language)}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-gray-700">
              {translate("dailyQuantities", language)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={applyMondayToAllDays}
              disabled={disabled}
            >
              <CopyIcon data-icon="inline-start" />
              {translate("applyMondayToAll", language)}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {dayFields.map(({ field, labelKey }) => (
              <NumberStepper
                key={field}
                id={field}
                label={translate(labelKey, language)}
                value={form[field]}
                onChange={(value) => onChange(field, value)}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section title={translate("newspapers", language)}>
        <div className="grid grid-cols-2 gap-3">
          <NumberStepper
            id="voz_de_galicia"
            label="Voz de Galicia"
            value={form.voz_de_galicia}
            onChange={(value) => onChange("voz_de_galicia", value)}
            disabled={disabled}
          />
          <NumberStepper
            id="atlantico"
            label="Atlántico"
            value={form.atlantico}
            onChange={(value) => onChange("atlantico", value)}
            disabled={disabled}
          />
        </div>
      </Section>

      <Section title={translate("optionsSection", language)}>
        <ToggleRow
          id="revista"
          label={translate("magazine", language)}
          checked={form.revista}
          onChange={(value) => onChange("revista", value)}
          disabled={disabled}
        />
        {showInactive && (
          <ToggleRow
            id="baja"
            label={translate("leave", language)}
            help={translate("inactiveHelp", language)}
            checked={form.baja}
            onChange={(value) => onChange("baja", value)}
            disabled={disabled}
          />
        )}
      </Section>
    </div>
  )
}
