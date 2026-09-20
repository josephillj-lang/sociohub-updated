import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-500">Welcome, {profile?.first_name}!</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="rounded bg-red-100 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-200">
              Logout
            </button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <h3 className="text-lg font-semibold text-blue-900">Total Societies</h3>
            <p className="mt-2 text-4xl font-bold text-blue-600">1</p>
          </div>
          <div className="rounded-lg border border-green-100 bg-green-50 p-6">
            <h3 className="text-lg font-semibold text-green-900">Active Users</h3>
            <p className="mt-2 text-4xl font-bold text-green-600">4</p>
          </div>
          <div className="rounded-lg border border-purple-100 bg-purple-50 p-6">
            <h3 className="text-lg font-semibold text-purple-900">System Status</h3>
            <p className="mt-2 text-xl font-bold text-purple-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}
