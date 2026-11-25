import { useState, useEffect } from "react"
import { getProfile, getUser, getCachedUser, changePassword } from "../utils/supabase"
import { translate } from "../utils/translate"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserForm({ profile, setProfile, language, setLanguage }) {
	const [name, setName] = useState("")
	const [password, setPassword] = useState("")
	const [showForm, setShowForm] = useState(true)
  const [userProfile, setUserProfile] = useState(profile)
  const [isLoging, setIsLoging] = useState(false)
  const [errorUsername, setErrorUsername] = useState("")
	const [errorPassword, setErrorPassword] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const openPasswordForm = () => {
    setShowPasswordForm(true)
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setPasswordMessage("")
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordMessage("")

    if (newPassword.length < 4) {
      setPasswordError(translate("passwordMin", language))
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(translate("passwordMismatch", language))
      return
    }

    setPasswordLoading(true)
    const { error, othersSignedOut } = await changePassword(newPassword)
    setPasswordLoading(false)
    if (error) {
      setPasswordError(error.message)
      return
    }

    setNewPassword("")
    setConfirmPassword("")
    setPasswordMessage(translate(othersSignedOut ? "passwordUpdated" : "passwordUpdatedPartial", language))
  }

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
    } else {
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
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={openPasswordForm}
            title={translate("changePassword", language)}
            aria-label={translate("changePassword", language)}
            className="cursor-pointer self-start px-3 py-1.5 bg-amber-200 font-semibold rounded-md hover:bg-amber-300 transition duration-300"
          >
            {userProfile.name}
          </button>

          {showPasswordForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <form onSubmit={handlePasswordSubmit} className="flex w-full max-w-sm flex-col gap-3 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold">{translate("changePassword", language)}</h2>
                <p className="text-sm text-gray-600">{translate("changePasswordHelp", language)}</p>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">{translate("selectlanguage", language)}</label>
                  <Select defaultValue={language} onValueChange={(value) => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={translate("selectlanguage", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="es">{translate("spanish", language)}</SelectItem>
                        <SelectItem value="en">{translate("english", language)}</SelectItem>
                        <SelectItem value="de">{translate("german", language)}</SelectItem>
                        <SelectItem value="ja">{translate("japanese", language)}</SelectItem>
                        <SelectItem value="ko">{translate("korean", language)}</SelectItem>
                        <SelectItem value="uk">{translate("ukrainian", language)}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="new-password" className="text-sm font-semibold">{translate("newPassword", language)}</label>
                  <input
                    id="new-password"
                    className="px-2 py-1 bg-gray-500/30 outline-0 rounded-md"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="confirm-password" className="text-sm font-semibold">{translate("confirmPassword", language)}</label>
                  <input
                    id="confirm-password"
                    className="px-2 py-1 bg-gray-500/30 outline-0 rounded-md"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {passwordError && <p className="text-red-500 font-semibold text-sm">{passwordError}</p>}
                {passwordMessage && <p className="text-green-600 font-semibold text-sm">{passwordMessage}</p>}

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="cursor-pointer px-3 py-2 font-semibold rounded-md hover:bg-gray-100 transition duration-300"
                  >
                    {translate("close", language)}
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="cursor-pointer px-3 py-2 bg-amber-200 font-semibold rounded-md hover:bg-amber-300 transition duration-300 disabled:opacity-50"
                  >
                    {passwordLoading ? translate("updating", language) : translate("updatePassword", language)}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
			)
		}
	}
}
