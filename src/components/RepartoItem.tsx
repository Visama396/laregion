interface Props {
  address: string
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
  magazine: boolean
  off: boolean
  help: string
}

export const RepartoItem = ({address, monday, tuesday, wednesday, thursday, friday, saturday, sunday, magazine, off, help}: Props) => {
  return (
    <tr className={`bg-white dark:bg-gray-800 ${(off)? 'bg-red-400' : 'bg-white'} ${(off)? 'dark:bg-red-800' : 'dark:bg-gray-800'}`}>
			<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
				<p className="text-lg">{address}</p>
        <p className="font-base text-sm">{help}</p>
			</th>
			<td className="px-6 py-4 text-center">{monday}</td>
			<td className="px-6 py-4 text-center">{tuesday}</td>
			<td className="px-6 py-4 text-center">{wednesday}</td>
			<td className="px-6 py-4 text-center">{thursday}</td>
			<td className="px-6 py-4 text-center">{friday}</td>
			<td className="px-6 py-4 text-center">{saturday}</td>
			<td className="px-6 py-4 text-center">{sunday}</td>
      <td className="px-6 py-4 text-center">
        {magazine && (
          <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked disabled />
        )}
      </td>
		</tr>
  )
}