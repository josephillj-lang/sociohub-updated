import { createClient } from '@/lib/supabase/server'
import { createVisitorPass } from '@/actions/visitors'

export default async function ResidentDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: passes } = await supabase
    .from('visitor_passes')
    .select('*')
    .eq('created_by', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="mx-auto max-w-md min-h-screen bg-gray-50 p-4">
      <h1 className="mb-6 text-2xl font-bold">My Home</h1>
      <div className="mb-8 rounded-xl bg-white p-5 shadow-sm border">
        <h2 className="mb-4 text-lg font-semibold">Generate Gate Pass</h2>
        <form action={createVisitorPass} className="flex flex-col gap-3">
          <input type="hidden" name="unit_id" value="00000000-0000-0000-0000-000000000000" />
          <input name="name" placeholder="Visitor Name" required className="rounded border p-2" />
          <input name="phone" placeholder="Phone Number" required className="rounded border p-2" />
          <select name="type" className="rounded border p-2 bg-white">
            <option value="Guest">Guest</option>
            <option value="Delivery">Delivery</option>
          </select>
          <input type="date" name="date" required className="rounded border p-2" />
          <button className="mt-2 rounded bg-gray-900 py-2 text-white">Create Pass</button>
        </form>
      </div>
      
      <h2 className="mb-3 text-lg font-semibold">Expected Visitors</h2>
      <div className="flex flex-col gap-3">
        {passes?.map((pass) => (
          <div key={pass.id} className="flex justify-between rounded-lg bg-white p-4 border">
            <div>
              <p className="font-medium">{pass.visitor_name}</p>
              <p className="text-xs text-gray-500">{pass.visitor_type}</p>
            </div>
            <div className="text-right">
              <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">{pass.status}</span>
              <p className="mt-1 font-mono font-bold">{pass.pass_code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
