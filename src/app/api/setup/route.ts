import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // 1. Connect to Supabase using the master admin key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 2. Create the user directly
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@sociohub.test',
    password: 'SecurePass123!',
    email_confirm: true,
  })

  if (authError) {
    // If user already exists, it will tell us
    return NextResponse.json({ step: 'Auth User Creation', error: authError.message })
  }

  // 3. Link them as a Super Admin in your profiles table
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: authData.user.id,
    role: 'SUPER_ADMIN',
    first_name: 'Super',
    last_name: 'Admin'
  })

  if (profileError) {
    return NextResponse.json({ step: 'Profile Creation', error: profileError.message })
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Admin account completely set up! You can now log in.' 
  })
}
