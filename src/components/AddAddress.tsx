import { useState } from "react"

import { Client, Databases, ID } from "appwrite"

const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("666df32a000334919ac3")

const databases = new Databases(client)

export const AddAddress = () => {

  const [formData, setFormData] = useState({
    address: "",
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 1,
    friday: 1,
    saturday: 1,
    sunday: 1,
    help: "",
    route: "",
    magazine: false
  })

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(formData)

    const todos = await databases.listDocuments("666e1f2b000da5f62f9e", formData.route, [])
    const newID = todos.documents.length
    const result = await databases.createDocument(
      "666e1f2b000da5f62f9e", 
      formData.route,
      ID.unique(),
      {
        id: newID, 
        address: formData.address, 
        monday: formData.monday, 
        tuesday: formData.tuesday,
        wednesday: formData.wednesday,
        thursday: formData.thursday,
        friday: formData.friday,
        saturday: formData.saturday,
        sunday: formData.sunday,
        help: formData.help,
        magazine: formData.magazine
      }
    )

    if (result.$id) {
      setFormData({address: "", help: "", route: "", magazine: false, monday: 1, tuesday: 1, wednesday: 1, thursday: 1, friday: 1, saturday: 1, sunday: 1})
    } else {
      console.log("Fallo al añadir")
    }
    
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Añadir dirección</h2>
        <form action="#" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-7 sm:gap-6">
              <div className="sm:col-span-7">
                <label htmlFor="address" 
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Dirección</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Escribe la dirección" required autoComplete="off" />
              </div>
              <div className="w-full">
                <label htmlFor="monday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lunes</label>
                <input type="number" name="monday" id="monday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.monday} onChange={(e) => setFormData({...formData, monday: parseInt(e.target.value)})} required />
              </div>
              <div className="w-full">
                <label htmlFor="tuesday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Martes</label>
                <input type="number" name="tuesday" id="tuesday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.tuesday} onChange={(e) => setFormData({...formData, tuesday: parseInt(e.target.value)})} required />
              </div>
              <div className="w-full">
                <label htmlFor="wednesday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miércoles</label>
                <input type="number" name="wednesday" id="wednesday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.wednesday} onChange={(e) => setFormData({...formData, wednesday: parseInt(e.target.value)})} required />
              </div>
              <div className="w-full">
                <label htmlFor="thursday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jueves</label>
                <input type="number" name="thursday" id="thursday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.thursday} onChange={(e) => setFormData({...formData, thursday: parseInt(e.target.value)})} required />
              </div>
              <div className="w-full">
                <label htmlFor="friday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Viernes</label>
                <input type="number" name="friday" id="friday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.friday} onChange={(e) => setFormData({...formData, friday: parseInt(e.target.value)})} required />
              </div>
              <div className="w-full">
                <label htmlFor="saturday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sábado</label>
                <input type="number" name="saturday" id="saturday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.saturday} onChange={(e) => setFormData({...formData, saturday: parseInt(e.target.value)})} required />
              </div>
              <div className="w-full">
                <label htmlFor="sunday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Domingo</label>
                <input type="number" name="sunday" id="sunday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.sunday} onChange={(e) => setFormData({...formData, sunday: parseInt(e.target.value)})} required />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repartos</label>
                <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={formData.route} onChange={(e) => setFormData({...formData, route: e.target.value})} required>
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
              </div> 
              <div className="sm:col-span-3">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Instrucciones</label>
                  <textarea id="description" value={formData.help} onChange={(e) => setFormData({...formData, help: e.target.value})} rows={2} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Escribe aquí instrucciones adicionales"></textarea>
              </div>
              <div className="w-full">
                <label htmlFor="magazine" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">¿Revista?</label>
                <input type="checkbox" checked={formData.magazine} onChange={(e) => setFormData({...formData, magazine: e.target.checked})} className="size-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              </div>
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2">Enviar</button>
      </form>
  </div>
</section>
  )
}