import { createAdminClient } from '@/lib/supabase/server';

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
          Messages here were "sent" by the background worker.
        </p>
      </div>

      <div className="space-y-4">
        {(!messages || messages.length === 0) && (
          <p className="text-gray-500">No messages sent yet.</p>
        )}
        
        {messages?.map((msg) => (
          <div key={msg.id} className="border rounded-lg p-4 bg-green-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-green-800">To: {msg.to_phone}</span>
              <span className="text-xs text-green-600">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{msg.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
            }
