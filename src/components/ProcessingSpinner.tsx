import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProcessingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-6 p-12">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-gray-600 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-black rounded-full animate-pulse" />
      </div>
      
      <div className="text-center">
        <h3 className="text-2xl font-southpark font-bold text-gray-800 mb-2">
          💪 Lad-ifying Your Image!
        </h3>
        <p className="text-gray-600">
          Transforming your virgin photo into Lad energy...
        </p>
      </div>
      
              <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gray-600 to-black animate-pulse" />
      </div>
    </div>
  );
};