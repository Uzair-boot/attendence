import {baseUrl} from '../handleApi';
export const studentsUrls = {
  getallStudents: `${baseUrl}/student/students`,
  markAttendence: `${baseUrl}/student/attend`,
};
export default studentsUrls;
