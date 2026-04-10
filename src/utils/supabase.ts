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

export const getCachedUser = async () => {
	const { data, error } = await supabase.auth.getUser()
	return { data, error }
}

export const getUser = async (name: string, password: string) => {
	const fakeEmail = `${name}@app.local`
	const {
		data: { user },
	} = await supabase.auth.signInWithPassword({ email: fakeEmail, password })
	return user
}

export const getProfile = async (userId: string) => {
	const { data, error } = await supabase.from('profiles').select().eq('id', userId).single()
	return { data, error }
}

export const getDelivery = async (deliveryId: number) => {
  const { data, error } = await supabase.from('deliveries').select().eq('numero', deliveryId).order('orden')
  return { data, error }
}

export const insertAddress = async (address: any) => {
  const { error: shiftError } = await supabase.rpc('shift_orden', {
    p_numero: address.numero,
    p_desde: address.orden
  })
  if (shiftError) return { data: null, error: shiftError }

  const { data, error } = await supabase.from('deliveries').insert(address).select()
  return { data, error }
}

export const getDeliveryCount = async (deliveryId: number) => {
  const { count, error } = await supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('numero', deliveryId)
  return { count, error }
}

export const updateAddress = async (address: any) => {
  const { data: original, error: fetchError } = await supabase.from('deliveries').select('orden, numero').eq('id', address.id).single()
  if (fetchError) return { data: null, error: fetchError }

  if (original.orden !== address.orden) {
    await supabase.rpc('reorder_delivery', {
      p_id: address.id,
      p_numero: address.numero,
      p_orden_viejo: original.orden,
      p_orden_nuevo: address.orden
    })
  }

  const { data, error } = await supabase.from('deliveries').update(address).eq('id', address.id).select()
  return { data, error }
}

export const getHolidays = async () => {
  const { data, error } = await supabase.from('holidays').select()
  return { data, error }
}
