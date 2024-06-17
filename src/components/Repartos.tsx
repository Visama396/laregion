import { Reparto } from "./Reparto";
import { useState } from "react";

import { Client, Databases } from "appwrite"

const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("666df32a000334919ac3")

const databases = new Databases(client)

async function getDocuments(repartoID) {
  if (repartoID == "") return null

  const docs = await databases.listDocuments("666e1f2b000da5f62f9e", repartoID, [])
  return docs.documents
}

export const Repartos = () => {
  const [rep, setRep] = useState("")

  const handleChange = (e) => {
    setRep(e.target.value)
  }

  return (
    <div>
      <select value={rep} onChange={(e)=>setRep(e.target.value)}>
        <option value="">Selecciona reparto</option>
        <option value="666f42cb00341d7a4874">Reparto 10</option>
        <option value="666f43bb0034c9cf42a6">Reparto 16</option>
        <option value="666f449e000e4ab1c1d6">Reparto 19</option>
        <option value="666e221f00038b42c7a7">Reparto 129</option>
      </select>
      <Reparto repartoID={rep} />
    </div>
  )
}