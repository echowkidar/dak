import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dispatches } from '../services/api';
import { Send } from 'lucide-react';

function Dispatches() {
  const navigate = useNavigate();
  const { data: dispatchesList = [], isLoading } = useQuery({
    queryKey: ['dispatches'],
    queryFn: dispatches.getAll
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dispatches</h1>
        <button 
          onClick={() => navigate('/add-dispatch')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Dispatch
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {Array.isArray(dispatchesList) && dispatchesList.map((dispatch: any) => (
            <li key={dispatch.dispatch_number}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Send className="h-5 w-5 text-gray-400" />
                    <p className="ml-3 text-sm font-medium text-gray-900">
                      {dispatch.subject}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(dispatch.dispatch_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Dispatch #: {dispatch.dispatch_number}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Reference #: {dispatch.reference_number}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dispatches;