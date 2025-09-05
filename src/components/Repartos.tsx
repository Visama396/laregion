import { useState, useEffect } from "react";
import { RepartoItem } from "./RepartoItem";
import { Databases, Query } from "appwrite";
import { appwriteAccount, appwriteClient} from "../services/appwriteSession";

const client = appwriteClient;

const databases = new Databases(client);

async function getDocuments(id) {
  return await databases
    .listDocuments("666e1f2b000da5f62f9e", id, [Query.limit(200)])
    .catch((error) => {
      throw new Error(error);
    });
}

const UserIcon = ({ show }) => (
  <svg
    className={`${show ? 'hidden': ''}`}
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

const ArrowIcon = ({ show }) => (
  <svg className={`${show ? '': 'hidden'}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 16.9998C6 17.3511 6 17.5268 6.01567 17.6795C6.14575 18.9473 7.0626 19.9945 8.30206 20.291C8.45134 20.3267 8.6255 20.3499 8.97368 20.3963L15.5656 21.2753C17.442 21.5254 18.3803 21.6505 19.1084 21.361C19.7478 21.1068 20.2803 20.6406 20.6168 20.0405C21 19.3569 21 18.4104 21 16.5174V7.48232C21 5.58928 21 4.64275 20.6168 3.95923C20.2803 3.35911 19.7478 2.89288 19.1084 2.63868C18.3803 2.34914 17.442 2.47423 15.5656 2.72442L8.97368 3.60335C8.62546 3.64978 8.45135 3.67299 8.30206 3.7087C7.0626 4.0052 6.14575 5.05241 6.01567 6.32018C6 6.47288 6 6.64854 6 6.99984M12 7.99984L16 11.9998M16 11.9998L12 15.9998M16 11.9998H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

export const Repartos = () => {
  const [addresses, setAddresses] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [rep, setRep] = useState("");+

  useEffect(() => {
    getDocuments(rep).then(res => {
      setAddresses(res.documents)
    })
  }, [rep])

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        <section className={`${showLogin ? '': 'hidden'} flex flex-col gap-2`}>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              id="username"
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
            <label htmlFor="username" className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
              Usuario
            </label>
          </div>
          <div className="relative w-full max-w-sm">
          <input
              type="password"
              id="pass"
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
            <label htmlFor="pass" className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
              Contraseña
            </label>
          </div>
        </section>
        <button
          onClick={() => setShowLogin(!showLogin)}
          type="button"
          className="px-6 py-3.5 text-base font-medium text-white inline-flex gap-2 items-center bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800 mb-4 mr-4"
        >
          <UserIcon show={showLogin} />
          Iniciar Sesión
          <ArrowIcon show={showLogin} />
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
      </div>
      
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
