import { useState } from "react"
import { Client, Databases, Query } from "appwrite"

const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("666df32a000334919ac3")

const databases = new Databases(client)

const repartos = [
  {id:"666f42cb00341d7a4874", name:"Reparto 10"},
  {id:"66705c9f0001fbd1001e", name:"Reparto 13"},
  {id:"666f43bb0034c9cf42a6", name:"Reparto 16"},
  {id:"66705cc50012c4af1c6a", name:"Reparto 18"},
  {id:"666f449e000e4ab1c1d6", name:"Reparto 19"},
  {id:"66705ccb001dd7241a31", name:"Reparto 21"},
  {id:"66705ce900148514eae8", name:"Reparto 24"},
  {id:"666e221f00038b42c7a7", name:"Reparto 129"},
]

export const CheckRepartidores = () => {
  const [repartidores, setRepartidores] = useState([])

  const fetchRepartos = async () => {
    const documentos = await databases.listDocuments("666e1f2b000da5f62f9e", "66705cc50012c4af1c6a").catch(error => {throw new Error(error)})
  
    if (documentos.total == 0) return
  
    for (let documento of documentos.documents) {
      if (!documento.off) {
        console.log(documento)
      }
    }

    setRepartidores([
      {id: "66758d34002497a1ec99", name: "Noemí", repartos: [], total: 0},
      {id: "66758d740010dc80cc3d", name: "Víctor", repartos: [], total: 0},
      {id: "66759b5c0021f82ada66", name: "Enrique", repartos: [], total: 0},
      {id: "66758d9c00086a7ae906", name: "Rebeca", repartos: [], total: 0},
      {id: "66759b6600066881cead", name: "Nícber", repartos: [], total: 0},
      {id: "6675a387002c2e774bbe", name: "Natalia", repartos: [], total: 0},
      {id: "6675a38e0016d5e76191", name: "Ramón", repartos: [], total: 0},
      {id: "6675a39a003e70f21d45", name: "Celia", repartos: [], total: 0},
      {id: "6675a37b0035575fa841", name: "Mochi", repartos: [], total: 0}
    ])
  }

  fetchRepartos()

  return (
    <section className="flex flex-col gap-4">
      <section className="flex flex-col text-white text-lg p-4 rounded-md bg-gray-800 w-[60%] mx-auto">
        {
          repartidores.map(repartidor => 
            <div className="flex gap-2">
              <span className="text-xl font-semibold w-20">{repartidor.name}</span>
              <span>{repartidor.total}</span>
            </div>
          )
        }
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Enrique</span>
          <span>Reparto 7 (39)</span>
          <span>Reparto 9 (24)</span>
          <span>Reparto 12 (47)</span>
          <span>Reparto 21 (33)</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Ramón</span>
          <span>Reparto 17 (81)</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Celia</span>
          <span>Reparto 13 (28)</span>
          <span>Reparto 28 (77)</span>
          <span>Reparto 29 (35)</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Noemí</span>
          <span>Reparto 13 (19)</span>
          <span>Reparto 23 (144)</span>
          <span>Reparto 30 (56)</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Nícber</span>
          <span>Reparto 10 (39)</span>
          <span>Reparto 16 (35)</span>
          <span>Reparto 19 (37)</span>
          <span>Reparto 129 (29)</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Natalia</span>
          <span>Reparto 5 (22)</span>
          <span>Reparto 11 (36)</span>
          <span>Reparto 26 (75)</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Mochi</span>
          <span>Reparto 8 (44)</span>
          <span>Reparto 14 (10)</span>
          <span>Reparto 15 (27)</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xl font-semibold w-20">Rebeca</span>
          <span>Reparto 22 (66)</span>
          <span>Reparto 31 (70)</span>
        </div>
      </section>
      <section className="flex flex-col text-white text-lg p-4 rounded-md bg-gray-800 w-[60%] mx-auto">

      </section>
      <section className="w-[60%] mx-auto text-right p-4">
        <button>
          Validar
        </button>
      </section>
    </section>
  )
}