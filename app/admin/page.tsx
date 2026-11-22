import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { registerRestaurant } from './actions';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have Platform Admin privileges.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
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
      branches (id, name)
    `)
    .order('created_at', { ascending: false });

  const restaurants = restaurantsData as any[] || [];

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Platform Admin</h1>
            <p className="text-gray-500 mt-1">Manage your SaaS clients and tenants</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              Manager View
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Form to add a new restaurant */}
          <div className="md:col-span-1 border border-gray-200 rounded-xl p-6 bg-white shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4">Register New Shop</h2>
            <form action={registerRestaurant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <input name="name" type="text" required placeholder="e.g. Pizza Inn" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Branch Name</label>
                <input name="branchName" type="text" required placeholder="e.g. Main Branch" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Add Restaurant
              </button>
            </form>
          </div>

          {/* List of restaurants */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Registered Restaurants ({restaurants.length})</h2>
            
            {restaurants.length === 0 && (
              <div className="p-8 text-center bg-white border border-gray-200 rounded-xl text-gray-500">
                No restaurants registered yet. Add your first client using the form!
              </div>
            )}

            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 shrink-0">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">Joined: {new Date(restaurant.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {restaurant.branches?.map((branch: any) => (
                      <span key={branch.id} className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {branch.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
    }
