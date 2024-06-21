import { useState } from "react"
import { RepartoItem } from "./RepartoItem"

import { Client, Databases, Query } from "appwrite"

const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("666df32a000334919ac3")

const databases = new Databases(client)

interface Props {
  repartoID: string
}

async function getDocuments(id) {
  return await databases.listDocuments("666e1f2b000da5f62f9e", id, [Query.limit(200)])
    .catch(error => {throw new Error(error)})
}

export const Reparto = ({repartoID}: Props) => {
  const [addresses, setAddresses] = useState([])
  if (repartoID == "") {
    return <h2 className="text-2xl text-white text-center p-6">No hay reparto seleccionado para cargar</h2>
  }

  getDocuments(repartoID).then(res => setAddresses(res.documents))

  return (
      <div className="relative overflow-x-auto">
        <table
          className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" className="px-6 py-3 rounded-s-lg"> Dirección </th>
              <th scope="col" className="px-6 py-3 text-center"> Lunes </th>
							<th scope="col" className="px-6 py-3 text-center"> Martes </th>
							<th scope="col" className="px-6 py-3 text-center"> Miércoles </th>
							<th scope="col" className="px-6 py-3 text-center"> Jueves </th>
							<th scope="col" className="px-6 py-3 text-center"> Viernes </th>
							<th scope="col" className="px-6 py-3 text-center"> Sábados </th>
							<th scope="col" className="px-6 py-3 text-center"> Domingos </th>
              <th scope="col" className="px-6 py-3 rounded-e-lg text-center"> ¿Revista? </th>
            </tr>
          </thead>
          <tbody>
						{addresses.map(document => 
							<RepartoItem 
                key={document.id}
                address={document.address} 
                monday={document.monday}
                tuesday={document.tuesday}
                wednesday={document.wednesday}
                thursday={document.thursday}
                friday={document.friday}
                saturday={document.saturday}
                sunday={document.sunday}
                magazine={document.magazine}
                off={document.off}
              />
						)}
          </tbody>
          <tfoot>
            <tr className="font-semibold bg-white text-gray-900 dark:text-white dark:bg-gray-800">
              <th scope="row" className="px-6 py-3 text-base">Total</th>
              <td className="px-6 py-3 text-center">{addresses.reduce((a, b) => a + b.monday, 0)}</td>
              <td className="px-6 py-3 text-center">{addresses.reduce((a, b) => a + b.tuesday, 0)}</td>
							<td className="px-6 py-3 text-center">{addresses.reduce((a, b) => a + b.wednesday, 0)}</td>
							<td className="px-6 py-3 text-center">{addresses.reduce((a, b) => a + b.thursday, 0)}</td>
							<td className="px-6 py-3 text-center">{addresses.reduce((a, b) => a + b.friday, 0)}</td>
							<td className="px-6 py-3 text-center">{addresses.reduce((a, b) => a + b.saturday, 0)}</td>
							<td className="px-6 py-3 text-center">{addresses.reduce((a, b) => a + b.sunday, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
  )
}