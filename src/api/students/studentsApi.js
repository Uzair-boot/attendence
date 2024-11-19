import {handleAPICall} from '../handleApi';

import studentsUrls from './studentsUrls';

export const getallStudentsApi = async () => {
  const res = await handleAPICall(`${studentsUrls.getallStudents}`, 'GET');
  return res;
};

// mark attendence
export const markAttendanceApi = async (id, image) => {
  const body = image;
  const res = await handleAPICall(
    `${studentsUrls.markAttendence}/${id}`,
    'POST',
    body,
  );
  return res;
};
