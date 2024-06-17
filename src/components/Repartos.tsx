import { Reparto } from "./Reparto";
import { useState } from "react";

export const Repartos = () => {
  const [rep, setRep] = useState("")

  return (
    <div>
      <section className="w-[200px] mb-4">
        <label htmlFor="reparto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecciona un reparto para mostarlo:</label>
        <select id="reparto" value={rep} onChange={(e)=>setRep(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Selecciona reparto</option>
          <option value="66705c860032a658f4f1">Repartos 4 y 6</option>
          <option value="666f42cb00341d7a4874">Reparto 10</option>
          <option value="66705c9f0001fbd1001e">Reparto 13</option>
          <option value="666f43bb0034c9cf42a6">Reparto 16</option>
          <option value="66705cc50012c4af1c6a">Reparto 18</option>
          <option value="666f449e000e4ab1c1d6">Reparto 19</option>
          <option value="66705ccb001dd7241a31">Reparto 21</option>
          <option value="66705ce900148514eae8">Reparto 24</option>
          <option value="666e221f00038b42c7a7">Reparto 129</option>
        </select>
      </section>
      <Reparto repartoID={rep} />
    </div>
  )
}