import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createCampaign } from './actions';

export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: staffData } = await supabase.from('staff').select('branch_id').eq('id', user.id).single();
  const staff = staffData as any;

  // Fetch existing campaigns
  const { data: campaignsData } = await supabase
    .from('promotions')
    .select('*')
    .eq('branch_id', staff?.branch_id)
    .order('created_at', { ascending: false });
    
  const campaigns = campaignsData as any[] || [];

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-muted-foreground">Create and send WhatsApp campaigns</p>
        </div>
        <Link href="/dashboard" className="text-sm border px-4 py-2 rounded-md hover:bg-gray-50">
          Back to Dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="border rounded-lg p-6 bg-white shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">New Campaign</h2>
          
          <form action={createCampaign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Name (Internal)</label>
              <input name="name" type="text" required placeholder="e.g. Weekend Special" className="w-full border rounded-md p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <select name="audience" className="w-full border rounded-md p-2 bg-white">
                <option value="all">All Clients</option>
                <option value="inactive">Inactive (Haven't visited in 30 days)</option>
                <option value="birthday">Birthday (Today)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Message</label>
              <textarea 
                name="message" 
                required 
                rows={4}
                placeholder="Hi {{name}}! Come back this weekend for 10% off..."
                className="w-full border rounded-md p-2" 
              />
              <p className="text-xs text-gray-500 mt-1">Use {"{{name}}"} to insert the client's name.</p>
            </div>

            <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800">
              Create & Queue Campaign
            </button>
          </form>
        </div>

        {/* Campaign List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Campaigns</h2>
          {campaigns.length === 0 && (
            <p className="text-gray-500 text-sm">No campaigns created yet.</p>
          )}
          {campaigns.map((camp: any) => (
            <div key={camp.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{camp.name}</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded capitalize">{camp.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 truncate">{camp.message_template}</p>
              <div className="text-xs text-gray-500 flex gap-4">
                <span>Audience: {camp.audience_type}</span>
                <span>Queued: {camp.total_sent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
