import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get staff branch info
  const { data: staffData } = await supabase
    .from('staff')
    .select('branch_id, branches(name)')
    .eq('id', user.id)
    .single();
    
  const staff = staffData as any;

  // 1. Fetch KPIs (Aggregated data)
  const { data: surveysData } = await supabase
    .from('surveys')
    .select('rating, status')
    .eq('branch_id', staff?.branch_id);

  const surveys = surveysData as any[] || [];

  const totalSent = surveys.length;
  const totalResponded = surveys.filter(s => s.status === 'responded').length;
  const responseRate = totalSent > 0 ? Math.round((totalResponded / totalSent) * 100) : 0;
  
  const ratings = surveys.filter(s => s.rating).map(s => s.rating);
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
    : '0.0';

  // 2. Fetch recent survey responses (The Feed)
  const { data: recentSurveysData } = await supabase
    .from('surveys')
    .select('id, rating, emoji, comment, responded_at, clients(name, phone_number)')
    .eq('branch_id', staff?.branch_id)
    .eq('status', 'responded')
    .order('responded_at', { ascending: false })
    .limit(20);

  const recentSurveys = recentSurveysData as any[] || [];

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            {(staff?.branches as any)?.name || 'Loading...'}
          </p>
        </div>
        <Link href="/cashier" className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          Go to Cashier
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Surveys</p>
          <p className="text-3xl font-bold">{totalSent}</p>
        </div>
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Responses</p>
          <p className="text-3xl font-bold">{totalResponded}</p>
        </div>
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Response Rate</p>
          <p className="text-3xl font-bold">{responseRate}%</p>
        </div>
        <div className="border p-4 rounded-lg bg-green-50 shadow-sm border-green-200">
          <p className="text-sm text-green-700 font-medium">Avg Rating</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-800">{avgRating}</p>
            <span className="text-yellow-500 text-xl">★</span>
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Feedback</h2>
        <div className="space-y-4">
          {recentSurveys.length === 0 && (
            <div className="text-center p-8 bg-gray-50 border rounded-lg text-gray-500">
              No survey responses yet. Go to the Cashier page and check someone in!
            </div>
          )}

          {recentSurveys.map((survey) => (
            <div key={survey.id} className="border p-4 rounded-lg bg-white flex gap-4 shadow-sm items-start">
              <div className="text-4xl">{survey.emoji}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{(survey.clients as any)?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{(survey.clients as any)?.phone_number}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(survey.responded_at).toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">Rating: {survey.rating}/5</span>
                  {survey.rating <= 2 && (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Needs Attention</span>
                  )}
                </div>
                {survey.comment && (
                  <p className="mt-3 text-sm text-gray-700 italic border-l-2 pl-3">"{survey.comment}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
                       }
