import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { registerClient } from './actions';

export default async function CashierPage() {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get staff branch info (cast as any to bypass strict type checking on joins)
  const { data: staff } = await supabase
    .from('staff')
    .select('branch_id, branches(name)')
    .eq('id', user.id)
    .single() as any;

  // Fetch today's visits for this branch
  const today = new Date().toISOString().split('T')[0];
  const { data: visits } = await supabase
    .from('visits')
    .select('id, visited_at, clients(name, phone_number)')
    .eq('branch_id', staff?.branch_id)
    .gte('visited_at', `${today}T00:00:00Z`)
    .order('visited_at', { ascending: false }) as any;

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Cashier Check-in</h1>
        <p className="text-muted-foreground">
          {(staff?.branches as any)?.name || 'Loading branch...'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: Check-in Form */}
        <div className="border rounded-lg p-6 bg-white shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">New Client</h2>
          <form action={registerClient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                placeholder="+254712345678"
                className="w-full border rounded-md p-2" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Name (Optional)</label>
              <input 
                name="name" 
                type="text" 
                placeholder="Alice"
                className="w-full border rounded-md p-2" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth (Optional)</label>
              <input 
                name="dob" 
                type="date" 
                className="w-full border rounded-md p-2" 
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input name="consent" type="checkbox" required className="mt-1" />
              <label className="text-sm text-gray-700">
                Client agrees to receive WhatsApp survey messages.
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800"
            >
              Save & Schedule Survey
            </button>
          </form>
        </div>

        {/* RIGHT: Today's Check-ins */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Today's Check-ins ({visits?.length || 0})</h2>
          <div className="space-y-3">
            {visits?.length === 0 && (
              <p className="text-muted-foreground text-sm">No check-ins yet today.</p>
            )}
            {visits?.map((visit: any) => (
              <div key={visit.id} className="bg-white p-3 rounded border flex justify-between items-center">
                <div>
                  <p className="font-medium">{(visit.clients as any)?.name || 'Unknown Client'}</p>
                  <p className="text-sm text-gray-500">{(visit.clients as any)?.phone_number}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(visit.visited_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
            }
