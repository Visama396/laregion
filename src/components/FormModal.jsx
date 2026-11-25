import { useEffect, useId, useRef } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FormMessage({ type = "error", children }) {
  const styles =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800"

  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`rounded-md border px-3 py-2 text-sm font-medium ${styles}`}
    >
      {children}
    </p>
  )
}

export default function FormModal({ title, description, closeLabel, onClose, children, footer }) {
  const panelRef = useRef(null)
  const bodyRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const firstField = bodyRef.current?.querySelector(
      'input:not([disabled]), [role="combobox"]:not([disabled]), button:not([disabled])'
    )
    firstField?.focus()

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== "Tab") return

      const focusable = panelRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onCloseRef.current()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-semibold">
              {title}
            </h2>
            {description && <p className="mt-1 truncate text-sm text-gray-600">{description}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onCloseRef.current()}
            aria-label={closeLabel}
          >
            <XIcon />
          </Button>
        </div>

        <div ref={bodyRef} className="overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
