import { createAdminClient } from '@/lib/supabase/server';
import { simulateReply } from './actions';

// These two lines force the page to fetch fresh data every single time you visit
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MockOutboxPage() {
  const supabase = createAdminClient();
  
  const { data: messagesData } = await supabase
    .from('mock_outbox')
    .select('*')
    .order('created_at', { ascending: false });

  const messages = messagesData as any[];

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mock WhatsApp Outbox</h1>
        <p className="text-muted-foreground">Simulate client replies or view Manager alerts.</p>
      </div>

      <div className="space-y-4">
        {(!messages || messages.length === 0) && (
          <p className="text-gray-500">No messages sent yet.</p>
        )}
        
        {messages?.map((msg) => {
          const isPromo = msg.message_type === 'promo';
          const isAlert = msg.is_manager_alert;

          let bgClass = 'bg-green-50 border-green-200';
          let titleClass = 'text-green-800';
          let label = 'SURVEY';

          if (isPromo) {
            bgClass = 'bg-blue-50 border-blue-200';
            titleClass = 'text-blue-800';
            label = 'PROMO';
          }
          if (isAlert) {
            bgClass = 'bg-red-100 border-red-300';
            titleClass = 'text-red-800';
            label = 'MANAGER ALERT';
          }

          return (
            <div key={msg.id} className={`border rounded-lg p-4 shadow-sm ${bgClass}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-semibold ${titleClass}`}>
                  To: {msg.to_phone} 
                  <span className="ml-2 text-xs font-normal bg-white px-2 py-0.5 rounded border uppercase">
                    {label}
                  </span>
                </span>
                <span className="text-xs text-gray-600">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap mb-4">{msg.body}</p>
              
              {/* ONLY SHOW EMOJIS FOR SURVEYS (NOT PROMOS OR ALERTS) */}
              {!isPromo && !isAlert && (
                <div className="border-t border-green-200 pt-3">
                  <p className="text-xs text-gray-500 mb-2">Simulate Client Reply:</p>
                  <div className="flex gap-2">
                    {['😡', '😕', '😐', '😊', '🤩'].map((emoji) => (
                      <form 
                        key={emoji}
                        action={async () => {
                          'use server';
                          await simulateReply(msg.to_phone, emoji);
                        }}
                      >
                        <button 
                          type="submit"
                          className="text-2xl hover:bg-green-200 p-2 rounded-md transition-colors"
                          title={`Reply with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
                       }
