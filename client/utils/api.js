export const getTutors () => fetch('api/tutors').then(r => r.json())
export const getStudents () => fetch('api/students').then(r => r.json())
