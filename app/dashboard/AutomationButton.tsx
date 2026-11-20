'use client';

import { useState } from 'react';
import { runDailyAutomations } from './automations';
import { useRouter } from 'next/navigation';

export default function AutomationButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      await runDailyAutomations();
      router.refresh(); // Refresh the dashboard data
      alert('Automations ran successfully! Check your Outbox or Job Queue.');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleClick}
      disabled={loading}
      className={`text-sm px-4 py-2 rounded-md text-white ${loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}
    >
      {loading ? 'Running...' : 'Run Daily Automations'}
    </button>
  );
}
