import { createAdminClient } from '@/lib/supabase/server';
import { simulateReply } from './actions';

export const dynamic = 'force-dynamic';

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
        <p className="text-muted-foreground">
          Click an emoji to simulate the client replying to a survey.
        </p>
      </div>

      <div className="space-y-4">
        {(!messages || messages.length === 0) && (
          <p className="text-gray-500">No messages sent yet.</p>
        )}
        
        {messages?.map((msg) => (
          <div key={msg.id} className={`border rounded-lg p-4 shadow-sm ${msg.message_type === 'promo' ? 'bg-blue-50' : 'bg-green-50'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`font-semibold ${msg.message_type === 'promo' ? 'text-blue-800' : 'text-green-800'}`}>
                To: {msg.to_phone} 
                <span className="ml-2 text-xs font-normal bg-white px-2 py-0.5 rounded border uppercase">
                  {msg.message_type || 'survey'}
                </span>
              </span>
              <span className="text-xs text-gray-600">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap mb-4">{msg.body}</p>
            
            {/* ONLY SHOW EMOJIS FOR SURVEYS */}
            {msg.message_type !== 'promo' && (
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
        ))}
      </div>
    </main>
  );
            }
