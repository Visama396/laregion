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
}

export const RepartoItem = ({address, monday, tuesday, wednesday, thursday, friday, saturday, sunday, magazine}: Props) => {
  return (
    <tr className="bg-white dark:bg-gray-800">
			<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
				{address}
			</th>
			<td className="px-6 py-4">{monday}</td>
			<td className="px-6 py-4">{tuesday}</td>
			<td className="px-6 py-4">{wednesday}</td>
			<td className="px-6 py-4">{thursday}</td>
			<td className="px-6 py-4">{friday}</td>
			<td className="px-6 py-4">{saturday}</td>
			<td className="px-6 py-4">{sunday}</td>
      <td className="px-6 py-4"><input type="checkbox" checked={magazine} disabled /></td>
		</tr>
  )
}