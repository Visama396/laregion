import { useState, useEffect } from "react";
import { supabase, getUser } from "../utils/supabase";

export default function UserForm({ profile, setProfile }) {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [userProfile, setUserProfile] = useState(profile);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const user = await getUser(name, password);

		if (user) {
			const { data, error } = await supabase
				.from("profiles")
				.select()
				.eq("id", user.id);

			if (error) {
				console.error(error);
				setShowForm(false);
				return;
			}
			if (data) {
				setUserProfile(data[0]);
				setProfile(data[0]);
			}
		}
		setShowForm(false);
	};

	if (showForm) {
		return (
			<div className="fixed flex inset-0 justify-center items-center">
				<div className="bg-emerald-500 p-4">
					<h1 className="text-white text-3xl font-bold">Form Usuario</h1>
					<form onSubmit={handleSubmit} className="flex flex-col gap-2">
						<input
							className="px-2 py-1 bg-emerald-700 text-white outline-0 rounded-md"
							type="text"
							name="name"
							placeholder="Nombre"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							className="px-2 py-1 bg-emerald-700 text-white outline-0 rounded-md"
							type="password"
							name="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							className="cursor-pointer bg-emerald-600 text-white rounded-md hover:bg-emerald-600/50"
							type="submit"
						>
							Entrar
						</button>
						<button
							className="cursor-pointer bg-red-400 text-white rounded-md hover:bg-red-400/90"
							onClick={() => setShowForm(false)}
						>
							Cancelar
						</button>
					</form>
				</div>
			</div>
		);
	} else {
		if (userProfile) {
			return <div className="text-white">Logged in as, {userProfile.name}</div>;
		} else {
			return (
				<button
					onClick={() => setShowForm(true)}
					className="cursor-pointer p-3 bg-amber-200 hover:bg-amber-200/90"
				>
					Mostrar Form
				</button>
			);
		}
	}
}
