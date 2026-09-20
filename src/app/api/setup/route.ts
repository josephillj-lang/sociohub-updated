import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const demoTenantId = '11111111-1111-1111-1111-111111111111'

  // 1. Ensure a Demo Society exists
  await supabaseAdmin.from('societies').upsert({
    id: demoTenantId,
    name: 'Oasis Heights',
    address: '123 Main St',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    contact_email: 'admin@oasis.com',
    status: 'ACTIVE'
  })

  // 2. Create Society Admin
  const { data: socAuth, error: socErr } = await supabaseAdmin.auth.admin.createUser({
    email: 'society@sociohub.test',
    password: 'SecurePass123!',
    email_confirm: true,
  })

  if (!socErr) {
    await supabaseAdmin.from('profiles').upsert({
      id: socAuth.user.id,
      tenant_id: demoTenantId,
      role: 'SOCIETY_ADMIN',
      first_name: 'Society',
      last_name: 'Manager'
    })
  }

  // 3. Create Resident
  const { data: resAuth, error: resErr } = await supabaseAdmin.auth.admin.createUser({
    email: 'resident@sociohub.test',
    password: 'SecurePass123!',
    email_confirm: true,
  })

  if (!resErr) {
    await supabaseAdmin.from('profiles').upsert({
      id: resAuth.user.id,
      tenant_id: demoTenantId,
      role: 'RESIDENT',
      first_name: 'Rahul',
      last_name: 'Resident'
    })
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Test accounts created successfully!' 
  })
}
