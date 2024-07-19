import { useState, useEffect } from "react";
import { RepartoItem } from "./RepartoItem";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("666df32a000334919ac3");

const databases = new Databases(client);

async function getDocuments(id) {
  return await databases
    .listDocuments("666e1f2b000da5f62f9e", id, [Query.limit(200)])
    .catch((error) => {
      throw new Error(error);
    });
}

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
  </svg>
);

export const Repartos = () => {
  const [addresses, setAddresses] = useState([]);
  const [rep, setRep] = useState("");+

  useEffect(() => {
    getDocuments(rep).then(res => {
      setAddresses(res.documents)
    })
  }, [rep])

  return (
    <div>
      <button
        type="button"
        className="px-6 py-3.5 text-base font-medium text-white inline-flex gap-2 items-center bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800 mb-4 mr-4"
      >
        <UserIcon />
        Iniciar Sesión
      </button>
      <section className="inline-block w-[200px]">
        <label
          htmlFor="reparto"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Selecciona un reparto para mostarlo:
        </label>
        <select
          id="reparto"
          value={rep}
          onChange={(e) => setRep(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
        >
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
      {rep ? (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg">
                  {" "}
                  Dirección{" "}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {" "}
                  Lunes{" "}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {" "}
                  Martes{" "}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {" "}
                  Miércoles{" "}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {" "}
                  Jueves{" "}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {" "}
                  Viernes{" "}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {" "}
                  Sábados{" "}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  {" "}
                  Domingos{" "}
                </th>
                <th scope="col" className="px-6 py-3 rounded-e-lg text-center">
                  {" "}
                  ¿Revista?{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((document) => (
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
                  help={document.help}
                />
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-white text-gray-900 dark:text-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-3 text-base">
                  Total
                </th>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.monday), 0)}
                </td>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.tuesday), 0)}
                </td>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.wednesday), 0)}
                </td>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.thursday), 0)}
                </td>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.friday), 0)}
                </td>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.saturday), 0)}
                </td>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.sunday), 0)}
                </td>
                <td className="px-6 py-3 text-center">
                  {addresses.reduce((a, b) => a + (b.off ? 0 : b.magazine), 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <h2 className="text-2xl text-white text-center p-6">
          No hay reparto seleccionado para cargar
        </h2>
      )}
    </div>
  );
};
