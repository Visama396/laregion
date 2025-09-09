import { useState, useEffect } from "react"
import { Client, Databases, Query } from "appwrite"

interface Props {
  day: number
}

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

let repartid = [
  {name: "Víctor", repartos: [], total: 0},
  {name: "Nícber", repartos: [], total: 0},
  {name: "Noemí", repartos: [], total: 0}
]

export const CheckRepartidores = ({day}: Props) => {
  const [repartidores, setRepartidores] = useState([])

  const fetchRepartos = async () => {
    for (let rep of repartos) {
      const result = await databases.listDocuments("666e1f2b000da5f62f9e", rep.id, [Query.limit(200)]).catch(error => {throw new Error(error)})
  
      if (result.documents[0]) {
        let total = 0;
        if (repartid.find(reps => reps.name == result.documents[0].repartidor.nombre)) {
          for(let document of result.documents) {
            if (!document.off) {
              console.log(document)
              switch(day) {
                case 1: total+=document.monday;break;
                case 2: total+=document.tuesday;break;
                case 3: total+=document.wednesday;break;
                case 4: total+=document.thursday;break;
                case 5: total+=document.friday;break;
                case 6: total+=document.saturday;break;
                case 0: total+=document.sunday;break;
              }
            }
          }
          if (!repartid.find(reps => reps.name == result.documents[0].repartidor.nombre).repartos.find( rpts => rpts.name == rep.name)) {
            repartid.find(reps => reps.name == result.documents[0].repartidor.nombre).repartos.push({name: rep.name, amount: total})
            repartid.find(reps => reps.name == result.documents[0].repartidor.nombre).total += total
          }
        }
        console.log(repartid.find(reps => reps.name == result.documents[0].repartidor.nombre))
      }
    }
  
    return repartid
  }

  useEffect(() => {
    fetchRepartos().then(res => {
      setRepartidores(res)
    })
  }, [])

  function hola() {
    fetch("https://script.google.com/macros/s/AKfycbxKVqZ3fxGXnIdA9n8CGzTc9QHaXQGeFEcYt-8JDJGagnwVYW6XGPpkTLJyAbXiomsxvw/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify([{ col1: "Noe", col2: "Vic", col3: "Mar" }]),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => res.text())
      .then(txt => console.log("Respuesta ", txt))
      .catch(err => console.error(err))
  }
  
  return (
    <section className="flex flex-col gap-4">
      <section className="flex flex-col text-white text-lg p-4 rounded-md bg-gray-800 w-[60%] mx-auto">
        { repartidores.length > 0 ?
          (
            repartidores.map(repartidor => 
              (
                <div className="flex gap-2">
                  <span className="text-xl font-semibold w-20">{repartidor.name}</span>
                  {
                    repartidor.repartos.map(reparto => 
                      <span>{reparto.name} ({reparto.amount})</span>
                    )
                  }
                </div>
              )
          )) : (<h2>Calculando resumen</h2>)
        }
      </section>
      <section className="flex flex-col text-white text-lg p-4 rounded-md bg-gray-800 w-[60%] mx-auto">
      { repartidores.length > 0 ?
          (
            repartidores.map(repartidor => 
              (
                <div className="flex gap-2">
                  <span className="text-xl font-semibold w-20">{repartidor.name}</span>
                  <span>{repartidor.total}</span>
                </div>
              )
          )) : (<h2>Calculando resumen</h2>)
        }
      </section>
      <section className="w-[60%] mx-auto text-right p-4 text-gray-800">
        <button className="bg-white px-4 py-2 rounded-md font-bold text-xl" onClick={() => hola()} disabled={repartidores.length == 0}>
          Validar
        </button>
      </section>
    </section>
  )
}