export interface User {
  emp_id: number;
  username: string;
  email: string;
  department_id: number;
  role_id: number;
}

export interface Receipt {
  receipt_number: string;
  receipt_date: string;
  reference_number: string;
  reference_date: string;
  concerned_emp_id: number;
  concerned_person_name: string;
  department_id: number;
  document_type: string;
  subject: string;
  dealing_assistant: string;
  document_image?: string;
  remarks: string;
}

export interface Dispatch {
  dispatch_number: string;
  dispatch_date: string;
  reference_number: string;
  reference_date: string;
  addressee_name: string;
  addressee_designation: string;
  department_id: number;
  action: string;
  subject: string;
  dealing_assistant: string;
  document_image?: string;
}