import { useState, useEffect } from "react"
import { getProfile, getUser, getCachedUser } from "../utils/supabase"
import { translate } from "../utils/translate"

export default function UserForm({ profile, setProfile, language }) {
	const [name, setName] = useState("")
	const [password, setPassword] = useState("")
	const [showForm, setShowForm] = useState(true)
  const [userProfile, setUserProfile] = useState(profile)
  const [isLoging, setIsLoging] = useState(false)
  const [errorUsername, setErrorUsername] = useState("")
	const [errorPassword, setErrorPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoging(true)
    setErrorUsername("")
    setErrorPassword("")

    if (name.length === 0) {
      setErrorUsername("Username is required")
    }
    if (password.length === 0) {
      setErrorPassword("Password is required")
    }

    if (errorUsername.length > 0 || errorPassword.length > 0) {
      setIsLoging(false)
      return
    }

		const user = await getUser(name, password)

		if (user) {
			const { data, error } = await getProfile(user.id)

			if (error) {
        console.error(error)
        setIsLoging(false)
				return
			}
			if (data) {
				setUserProfile(data)
        setProfile(data)
        setShowForm(false)
				setIsLoging(false)
			}
		}
  }

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await getCachedUser()

      if (error) {
        console.error(error)
        return
      }

      if (data?.user) {
        const { data: profile, error: profError } = await getProfile(data.user.id)

        if (profError) {
          console.error(profError)
          return
        }

        if (profile && profile.length > 0) {
          setUserProfile(profile[0])
          setProfile(profile[0])
          setShowForm(false)
        }
      }
    }

    loadUser()
  }, [])

	if (showForm) {
		return (
			<div className="fixed flex inset-0 justify-center items-center bg-black/95">
				<div className="bg-white p-4">
					<h1 className="text-3xl font-bold">{translate("login", language)}</h1>
					<div className="flex flex-col mt-4">
						<input
							className="px-2 py-1 bg-gray-500/30 outline-0 rounded-md"
							type="text"
							name="name"
							placeholder={translate("username", language)}
							value={name}
							onChange={(e) => setName(e.target.value)}
            />
            {errorUsername.length > 0 && <p className="text-red-500 font-semibold text-sm">{errorUsername}</p>}
						<input
							className="px-2 py-1 bg-gray-500/30 outline-0 rounded-md mt-4"
							type="password"
							name="password"
							placeholder={translate("password", language)}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
            />
						{errorPassword.length > 0 && <p className="text-red-500 font-semibold text-sm">{errorPassword}</p>}
            <button onClick={handleSubmit}
							className="cursor-pointer mt-4 py-2 bg-amber-200 font-semibold rounded-md hover:bg-amber-300 transition duration-300"
            >
              {isLoging && <span className="loader"></span>}
							{!isLoging && translate("loginbtn", language)}
            </button>
					</div>
				</div>
			</div>
		)
	} else {
		if (userProfile) {
      return (
        <div>{translate("loggedIn", language)} {userProfile.name}</div>
			)
		}
	}
}
