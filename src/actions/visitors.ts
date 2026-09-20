'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createVisitorPass(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
  const passCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const { error } = await supabase.from('visitor_passes').insert({
    tenant_id: profile?.tenant_id,
    created_by: user.id,
    unit_id: formData.get('unit_id'),
    visitor_name: formData.get('name'),
    visitor_phone: formData.get('phone'),
    visitor_type: formData.get('type'),
    expected_date: formData.get('date'),
    pass_code: passCode
  })

  if (error) throw new Error(error.message)
  revalidatePath('/resident')
  return { success: true, passCode }
}
