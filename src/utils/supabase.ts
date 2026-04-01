import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_URL
const supabaseKey = import.meta.env.PUBLIC_VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const checkAuth = async () => {
	const {
		data: { session },
	} = await supabase.auth.getSession()
	return session
}

export const getUser = async (name: string, password: string) => {
	const fakeEmail = `${name}@app.local`
	const {
		data: { user },
	} = await supabase.auth.signInWithPassword({ email: fakeEmail, password })
	return user
}

export const getProfile = async (userId: string) => {
	const { data, error } = await supabase.from('profiles').select().eq('id', userId)
	return { data, error }
}

export const getDelivery = async (deliveryId: string) => {
  const { data, error } = await supabase.from('deliveries').select().eq('numero', parseInt(deliveryId)).order('orden')
  return { data, error }
}
