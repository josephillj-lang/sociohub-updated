import { createClient } from '@/lib/supabase/server'

export default async function SecurityDashboard() {
  const supabase = createClient()
  const { data: expectedVisitors } = await supabase
    .from('visitor_passes')
    .select(`*, units(unit_number, building_name)`)
    .eq('status', 'EXPECTED')
    .order('expected_date', { ascending: true })

  return (
    <div className="mx-auto max-w-md min-h-screen bg-gray-900 p-4 text-white">
      <h1 className="mb-6 text-xl font-bold">Main Gate Security</h1>
      <div className="mb-8 rounded-xl bg-gray-800 p-6 text-center border border-gray-700">
        <h2 className="mb-2 text-lg font-semibold">Scan QR Pass</h2>
        <input type="text" placeholder="Enter 6-digit code..." className="w-full rounded bg-gray-900 border p-3 text-center text-white" />
        <button className="mt-4 w-full rounded bg-blue-600 py-3 font-bold">VERIFY PASS</button>
      </div>
      
      <h3 className="mb-4 text-sm font-semibold text-gray-400">Expected Today</h3>
      <div className="flex flex-col gap-3">
        {expectedVisitors?.map((visitor) => (
          <div key={visitor.id} className="flex justify-between rounded-lg bg-gray-800 p-4 border border-gray-700">
            <div>
              <p className="font-bold">{visitor.visitor_name}</p>
              <p className="text-xs text-gray-400">{visitor.visitor_type}</p>
            </div>
            <button className="rounded bg-green-600/20 px-4 py-2 text-sm font-bold text-green-400 border border-green-600/50">
              CHECK IN
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
