import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { receipts } from '../services/api';
import { FileText } from 'lucide-react';

function Receipts() {
  const navigate = useNavigate();
  const { data: receiptsList = [], isLoading } = useQuery({
    queryKey: ['receipts'],
    queryFn: receipts.getAll
    
  });
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
        <button 
          onClick={() => navigate('/add-receipt')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Receipt
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {Array.isArray(receiptsList) && receiptsList.map((receipt: any) => (
            <li key={receipt.receipt_number}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <p className="ml-3 text-sm font-medium text-gray-900">
                      {receipt.subject}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(receipt.receipt_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Receipt #: {receipt.receipt_number}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Reference #: {receipt.reference_number}
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

export default Receipts;