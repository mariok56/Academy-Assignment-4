export interface User {
  id: string;  
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  status: 'active' | 'locked'; 
  dob: string;
}