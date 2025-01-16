import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { receipts, dispatches } from '../services/api';
import { FileText, Send, Clock } from 'lucide-react';

function Dashboard() {
  const { data: receiptsList } = useQuery({
    queryKey: ['receipts'],
    queryFn: receipts.getAll
  });

  const { data: dispatchesList } = useQuery({
    queryKey: ['dispatches'],
    queryFn: dispatches.getAll
  });

  const recentDocuments = [...(receiptsList || []), ...(dispatchesList || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 150);
console.log("log",recentDocuments);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Receipts</dt>
                  <dd className="text-lg font-medium text-gray-900">{receiptsList?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Send className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Dispatches</dt>
                  <dd className="text-lg font-medium text-gray-900">{dispatchesList?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Documents</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {recentDocuments.map((doc: any) => (
              <li key={doc.id} className="px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-center">
                {/* First Div: Icon and Number */}
                <div className="flex items-center w-full sm:w-1/10 mb-2 sm:mb-0">
                  {doc.receipt_number ? (
                    <FileText className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Send className="h-5 w-5 text-gray-400" />
                  )}
                  <p className="ml-3 text-sm font-medium text-gray-900 truncate">
                    {doc.receipt_number ? doc.receipt_number : doc.dispatch_number || "N/A"}
                  </p>
                </div>
            
                {/* Second Div: Date */}
                <div className="flex items-center w-full sm:w-1/10 mb-2 sm:mb-0 text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(doc.date).toLocaleDateString("en-IN")}
                </div>
                {/* Third Div: Department (25% width) */}
                <div className="flex items-center w-full sm:w-1/10 text-sm font-medium text-gray-900 text-left truncate">
                    {/* Assuming a 'department' property exists in 'doc' */}
                    {doc.department_name ? doc.department_name : doc.department_name || "N/A"}
                  </div>
                {/* Fourth Div: Subject */}
                <div className="flex items-center w-full sm:w-3/5">
                  <p className="text-sm font-medium text-gray-900 text-left truncate">
                    {doc.subject}
                  </p>
                </div>
                
              </div>
            </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;