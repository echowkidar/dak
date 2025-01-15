import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { receipts, departments } from '../services/api';

function AddReceipt() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  

  const [allDepartments, setAllDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAssistantDropdown, setShowAssistantDropdown] = useState(false);
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [isOtherDocType, setIsOtherDocType] = useState(false);


  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format


  const dealingAssistants = [
    'M.Talib Subhani',
    'M. Sajid Khan',
    'Ahmad Abbas',
    'Shahnawaz Ahmad',
    'M. Sadaf H. M.',
    'Salman Khalil',
    'Qasim Ali Khan',
    'Hilal Ahmad',
    'Mulkun Nabi',
    'Zeeshanul Haque',
    'M Danish Siddiqui',
    'Zafar Ali Khan'
  ];



  // Handle assistant selection
  const toggleAssistant = (assistant: string) => {
    setSelectedAssistants(prev => {
      const isSelected = prev.includes(assistant);
      const updated = isSelected 
        ? prev.filter(a => a !== assistant)
        : [...prev, assistant];
      setValue('dealing_assistant', updated.join(', '));
      return updated;
    });
  };
//

const documentTypes = [
  'Office Memo',
  'Circular',
  'Appoint Order',
  'Extension Order',
  'Joining Report',
  'Attendance report',
  'Application',
  'File',
  'CEA Bill',
  'Conveyance Allowance Bill',
  'Add. Academic Bill',
  'EDA',
  'HRA Form',
  'Pay Fixation',
  'RTI',
  'Other'
];

// Handle document type change
const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  setIsOtherDocType(value === 'Other');
  // setValue('document_type', value);
};


  
//start
  const departmentSearch = watch('department_search', '');

  
//

useEffect(() => {
  async function fetchDepartments() {
    try {
      const response = await departments.getAll(); // Assuming `getAll` fetches all departments
      setAllDepartments(response);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  }
  fetchDepartments();
}, []);



useEffect(() => {
  if (departmentSearch.length >= 2) {
    const filtered = allDepartments.filter((dept:any) =>
      dept.department_name.toLowerCase().includes(departmentSearch.toLowerCase())
    );
    setFilteredDepartments(filtered);
    setShowDropdown(filtered.length > 0);
  } else {
    setFilteredDepartments([]);
    setShowDropdown(false);
  }
}, [departmentSearch, allDepartments]);



  // Select department handler
  const handleSelectDepartment = (department:any) => {
    setValue('department_id', department.department_id);
    setValue('department_search', department.name);
    setValue('department_name', department.department_name);
    setShowDropdown(false);
  };


  // ... (keep existing generateReceiptNumber useEffect)

  

  useEffect(() => {
    const generateReceiptNumber = async () => {
      try {
        const latestNumber = await receipts.getLatestNumber();
        let newNumber;        
        if (!latestNumber) {
          newNumber = 'R-0001';          
        } else {
          const numericPart = parseInt(latestNumber.replace('R-', ''));
          newNumber = `R-${String(numericPart + 1).padStart(1, '0')}`;          
        }
        
        setValue('receipt_number', newNumber);
      } catch (error) {
        toast.error('Failed to generate receipt number');
      }
    };

    generateReceiptNumber();
  }, [setValue]);




  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      if (data.concerned_emp_id === "") {
        data.concerned_emp_id = "0";
      }
      console.log("zafar",data);
      
      Object.keys(data).forEach(key => {
        if (key !== 'document_image') {
          formData.append(key, data[key]);
        }
      });
      
      if (data.document_image?.[0]) {
        formData.append('document_image', data.document_image[0]);
      }

      await receipts.create(formData);
      toast.success('Receipt added successfully');
      navigate('/receipts');
    } catch (error) {
      console.error('Upload error:', error);
      
      if (data.department_name === "") {
        toast.error(<div><b>DEPARTMENT NOT SELECTED</b><br /><br />If the department name is not mentioned then select NA.<br /> <br />If the document is from outside the AMU, select External.<br /> <br />If the department name is not showing in the list, please add the department name first.<br /> </div>,    );
      }
      toast.error('Failed to add receipt');
      
     
      
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Add New Receipt</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Receipt Number</label>
            <input
              type="text"
              {...register('receipt_number')}
              required
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              {...register('date')}
              defaultValue={today}
              required
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Number</label>
            <input
              type="text"
              {...register('reference_number')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Date</label>
            <input
              type="date"
              {...register('reference_date')}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID (if available)</label>
            <input
              type="number"
              {...register('concerned_emp_id')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Concerned Person Name (if individual)</label>
            <input
              type="text"
              {...register('concerned_person_name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
            {/* Department search dropdown */}
          <div>
          <div className="relative">
          <label className="block text-sm font-medium text-gray-700"></label>
          <input
            type="text"
            {...register('department_search')}
            placeholder="Search department..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="hidden"
            {...register('department_id')}
          />
          
          {/* Department search results dropdown */}

          {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
            {filteredDepartments.map((dept:any) => (
              <div
                key={dept.department_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectDepartment(dept)}
              >
                <div className="text-sm text-gray-900">{dept.department_name}</div>
              </div>
            ))}
          </div>
        )}
        </div> 
        {/* end Department search dropdown */}

            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              {...register('department_name')}              
              readOnly
              
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <div className="mt-1 space-y-2">
              <select
                {...register('document_type')}
                onChange={handleDocTypeChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Document Type</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              
              {isOtherDocType && (
                <input
                  type="text"
                  {...register('document_type')}
                  placeholder="Enter document type"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              {...register('subject')}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Dealing Assistant(s)</label>
            <input
              type="text"
              {...register('dealing_assistant')}
              readOnly
              onClick={() => setShowAssistantDropdown(!showAssistantDropdown)}
              placeholder="Select dealing assistant(s)..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
            />
            
            {showAssistantDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                {dealingAssistants.map((assistant) => (
                  <div
                    key={assistant}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => toggleAssistant(assistant)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAssistants.includes(assistant)}
                      onChange={() => {}}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 mr-2"
                    />
                    <span className="text-sm text-gray-900">{assistant}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Image</label>
            <input
              type="file"
              accept="image/*"
              {...register('document_image')}
              className="mt-1 block w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              {...register('remarks')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/receipts')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Save Receipt
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddReceipt