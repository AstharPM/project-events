'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const { user, isLoaded } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    const info: any = {};

    try {
      // 1. Check user info
      info.user = {
        isLoaded,
        isSignedIn: user ? true : false,
        email: user?.emailAddresses?.[0]?.emailAddress,
            unsafeMetadata: user?.unsafeMetadata,
    tier: user?.unsafeMetadata?.tier
      };

      // 2. Test Supabase connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('events')
        .select('count')
        .limit(1);

      info.supabaseConnection = {
        success: !connectionError,
        error: connectionError?.message,
        data: connectionTest
      };

      // 3. Try to fetch events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .limit(5);

      info.eventsFetch = {
        success: !eventsError,
        error: eventsError?.message,
        count: events?.length || 0,
        sampleEvents: events?.slice(0, 2)
      };

      // 4. Check environment variables
      info.envVars = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
      };

    } catch (error) {
      info.generalError = error;
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded) {
      runDebug();
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <Button onClick={runDebug} disabled={loading} className="mb-6">
          {loading ? 'Running Debug...' : 'Refresh Debug Info'}
        </Button>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.user, null, 2)}
            </pre>
          </div>

          {/* Supabase Connection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Supabase Connection</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.supabaseConnection, null, 2)}
            </pre>
          </div>

          {/* Events Fetch */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Events Fetch</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.eventsFetch, null, 2)}
            </pre>
          </div>

          {/* Environment Variables */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.envVars, null, 2)}
            </pre>
          </div>

          {/* General Error */}
          {debugInfo.generalError && (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h2 className="text-xl font-semibold mb-4 text-red-800">General Error</h2>
              <pre className="bg-red-100 p-4 rounded text-sm overflow-auto text-red-800">
                {JSON.stringify(debugInfo.generalError, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 