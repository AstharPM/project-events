import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page not found
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Home className="h-4 w-4 mr-2" />
                Go to homepage
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="w-full">
                Browse events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 