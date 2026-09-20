import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role === 'SUPER_ADMIN') redirect('/admin')
    if (profile?.role === 'SOCIETY_ADMIN') redirect('/society')
    if (profile?.role === 'SECURITY_GUARD') redirect('/security')
    if (profile?.role === 'RESIDENT') redirect('/resident')
  }

  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return redirect('/login?message=Could not authenticate user')
    
    revalidatePath('/', 'layout')
    redirect('/')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-600">SOCIOHUB</h1>
        <form action={signIn} className="flex flex-col gap-4">
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-md border p-2" />
          <input name="password" type="password" placeholder="Password" required className="w-full rounded-md border p-2" />
          {searchParams?.message && <p className="text-sm text-red-500">{searchParams.message}</p>}
          <button className="mt-4 rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700">Sign In</button>
        </form>
      </div>
    </div>
  )
}
