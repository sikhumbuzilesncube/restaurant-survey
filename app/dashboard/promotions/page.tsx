import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
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
          <form className="space-y-4">
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
                <option value="happy">Happy Clients (Rated 4-5)</option>
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

            <button type="button" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800">
              Create & Schedule Campaign
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">How it works</h3>
            <ul className="text-sm text-blue-700 space-y-2 list-disc pl-4">
              <li>Campaigns are sent via WhatsApp templates.</li>
              <li>We respect WhatsApp anti-spam rules (max 1 promo per client every 14 days).</li>
              <li>You can pause or cancel a campaign before it finishes sending.</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="font-semibold mb-2">Active Campaigns</h3>
            <p className="text-sm text-gray-500">No active campaigns yet.</p>
          </div>
        </div>
      </div>
    </main>
  );
        }
