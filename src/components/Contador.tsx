import { useState } from "react"

export const Contador = () => {
  const [suma, setSuma] = useState(0)

  const handleSumar = () => {
    setSuma(suma + 1)
  }

  const handleReiniciar = () => {
    setSuma(0)
  }

  return (
    <div>
      <p>{suma}</p>
      <button onClick={handleSumar}>Sumar</button>
      <button onClick={handleReiniciar}>Reiniciar</button>
    </div>
  )

}