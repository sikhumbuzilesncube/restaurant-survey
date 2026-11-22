import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verify user is a platform admin
  const { data: staffData } = await supabase
    .from('staff')
    .select('role')
    .eq('id', user.id)
    .single();
    
  const staff = staffData as any;
  
  if (staff?.role !== 'platform_admin') {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Access Denied. You are not a Platform Admin.
      </div>
    );
  }

  // Fetch all restaurants and their branches
  const { data: restaurantsData } = await supabase
    .from('restaurants')
    .select(`
      id, 
      name, 
      created_at,
      branches (id, name, timezone)
    `)
    .order('created_at', { ascending: false });

  const restaurants = restaurantsData as any[] || [];

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Platform Admin</h1>
          <p className="text-muted-foreground">Manage your SaaS clients</p>
        </div>
        <Link href="/dashboard" className="text-sm border px-4 py-2 rounded-md hover:bg-gray-50">
          Manager View
        </Link>
      </div>

      <div className="grid gap-6">
        <h2 className="text-xl font-bold">Registered Restaurants ({restaurants.length})</h2>
        
        {restaurants.length === 0 && (
          <p className="text-gray-500">No restaurants registered yet.</p>
        )}

        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="border rounded-lg p-6 bg-white shadow-sm flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-2xl">
              🏪
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{restaurant.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Joined: {new Date(restaurant.created_at).toLocaleDateString()}</p>
              
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Branches:</h4>
                <ul className="space-y-1">
                  {restaurant.branches?.map((branch: any) => (
                    <li key={branch.id} className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded inline-block mr-2">
                      📍 {branch.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
