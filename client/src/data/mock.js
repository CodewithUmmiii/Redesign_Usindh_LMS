// SAMPLE DATA ONLY — every name, roll number and mark below is fictional.
// Shapes mirror the REST/Mongo documents the Express API is expected to return.

export const iso = (offsetDays = 0, hour = 9, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const USERS = {
  teacher: { id: 'u-t1', role: 'teacher', name: 'Dr. Ayesha Memon', designation: 'Assistant Professor', department: 'Institute of Mathematics & Computer Science', email: 'teacher@demo.usindh.local', phone: '+92 300 0000001' },
  student: { id: 'u-s1', role: 'student', name: 'Hamza Chandio', rollNo: '2K23/SWE/101', program: 'BS Software Engineering', semester: 7, email: 'student@demo.usindh.local', phone: '+92 300 0000002' },
  admin: { id: 'u-a1', role: 'admin', name: 'Sana Abro', designation: 'Academic Coordinator', department: 'Registrar Office', email: 'admin@demo.usindh.local', phone: '+92 300 0000003' },
};

export const COURSES = [
  { id: 'c1', code: 'SWE-401', title: 'Software Reengineering', semester: 7, section: 'A', credits: 3, students: 42, teacher: 'Dr. Ayesha Memon', schedule: 'Mon & Wed · 09:00', room: 'CS Lab 2', color: '#0d5b4c',
    topics: [
      ['Introduction to reengineering', true], ['Reverse engineering techniques', true], ['Code smells & refactoring', true],
      ['Legacy system migration', true], ['Architecture recovery', false], ['Data reengineering', false], ['Reengineering process models', false], ['Case studies & project review', false],
    ] },
  { id: 'c2', code: 'SWE-403', title: 'Web Engineering', semester: 7, section: 'A', credits: 3, students: 40, teacher: 'Dr. Ayesha Memon', schedule: 'Tue & Thu · 11:00', room: 'Room 14', color: '#1d5fb5',
    topics: [['HTTP & REST', true], ['React fundamentals', true], ['State management', true], ['Node & Express', true], ['MongoDB modelling', true], ['Authentication', false], ['Deployment', false]] },
  { id: 'c3', code: 'SWE-405', title: 'Software Quality Assurance', semester: 7, section: 'B', credits: 3, students: 38, teacher: 'Dr. Ayesha Memon', schedule: 'Fri · 10:00', room: 'Room 9', color: '#a15c07',
    topics: [['Quality models', true], ['Test design', true], ['Automation basics', false], ['Metrics', false], ['Audits & reviews', false]] },
  { id: 'c4', code: 'SWE-302', title: 'Database Systems', semester: 5, section: 'A', credits: 4, students: 45, teacher: 'Prof. Imran Soomro', schedule: 'Mon & Thu · 13:00', room: 'Room 3', color: '#7a3db8',
    topics: [['ER modelling', true], ['Relational algebra', true], ['SQL', true], ['Normalisation', true], ['Transactions', false], ['Indexing', false]] },
];

export const STUDENTS = [
  ['Hamza Chandio', '101'], ['Mehwish Kalhoro', '102'], ['Bilal Shaikh', '103'], ['Zainab Rind', '104'], ['Asad Jatoi', '105'],
  ['Farah Buriro', '106'], ['Kashif Lashari', '107'], ['Noor-ul-Ain Mangi', '108'], ['Saad Khuhro', '109'], ['Iqra Soomro', '110'],
  ['Danish Panhwar', '111'], ['Rabia Memon', '112'],
].map(([name, n], i) => ({ id: `st${i + 1}`, name, rollNo: `2K23/SWE/${n}`, attendance: [96, 88, 72, 91, 64, 98, 79, 85, 69, 93, 82, 90][i] }));

export const ASSIGNMENTS = [
  { id: 'a1', courseId: 'c1', title: 'Legacy code audit report', due: iso(3, 23, 59), total: 20, submitted: 31, of: 42, description: 'Audit the provided legacy module and document five code smells with proposed refactorings.', mine: { status: 'pending' } },
  { id: 'a2', courseId: 'c1', title: 'Reverse-engineering class diagram', due: iso(-4, 23, 59), total: 10, submitted: 40, of: 42, description: 'Recover a UML class diagram from the supplied Java project.', mine: { status: 'graded', marks: 8.5 } },
  { id: 'a3', courseId: 'c2', title: 'MERN CRUD mini-project', due: iso(6, 23, 59), total: 25, submitted: 12, of: 40, description: 'Build a CRUD app with auth using the MERN stack.', mine: { status: 'submitted' } },
  { id: 'a4', courseId: 'c3', title: 'Test plan for portal login', due: iso(1, 17, 0), total: 10, submitted: 25, of: 38, description: 'Write a test plan covering functional and non-functional cases.', mine: { status: 'pending' } },
];

export const QUIZ_BANK = [
  { q: 'Which activity recovers design information from existing code?', options: ['Forward engineering', 'Reverse engineering', 'Regression testing', 'Prototyping'], answer: 1 },
  { q: 'Refactoring is intended to…', options: ['Add features', 'Change external behaviour', 'Improve internal structure without changing behaviour', 'Reduce test coverage'], answer: 2 },
  { q: 'A "God class" is a code smell where…', options: ['A class has too many responsibilities', 'A class has no methods', 'A class is abstract', 'A class is final'], answer: 0 },
  { q: 'The strangler pattern is used to…', options: ['Delete a database', 'Incrementally replace a legacy system', 'Compress assets', 'Encrypt traffic'], answer: 1 },
  { q: 'Which metric commonly indicates complexity of a function?', options: ['Cyclomatic complexity', 'Bandwidth', 'Latency', 'Throughput'], answer: 0 },
  { q: 'Architecture recovery mainly produces…', options: ['Test data', 'A high-level structural view of a system', 'Marketing material', 'Hardware specs'], answer: 1 },
];

export const QUIZZES = [
  { id: 'q1', courseId: 'c1', title: 'Quiz 2 — Refactoring basics', duration: 15, status: 'published', opens: iso(-1, 10), questions: QUIZ_BANK.slice(0, 4), attempts: 36, avg: 7.4, mine: { status: 'available' } },
  { id: 'q2', courseId: 'c2', title: 'Quiz 1 — HTTP & REST', duration: 10, status: 'closed', opens: iso(-12, 10), questions: QUIZ_BANK.slice(2, 5), attempts: 40, avg: 8.1, mine: { status: 'done', score: 8 } },
  { id: 'q3', courseId: 'c3', title: 'Mid-term (draft)', duration: 60, status: 'draft', opens: iso(9, 9), questions: QUIZ_BANK.slice(0, 2), attempts: 0, avg: 0, mine: { status: 'upcoming' } },
];

export const ANNOUNCEMENTS = [
  { id: 'an1', courseId: 'c1', title: 'Assignment 3 deadline extended', body: 'Deadline moved to Friday 11:59 pm due to lab maintenance.', at: iso(-1, 14) },
  { id: 'an2', courseId: 'c2', title: 'Project demo schedule', body: 'Demo slots will be published on the calendar this week.', at: iso(-3, 11) },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Assignment deadline in 24 hours', detail: 'Test plan for portal login (SWE-405)', at: iso(0, 8), unread: true },
  { id: 'n2', title: 'Live class starting soon', detail: 'Software Reengineering · 09:00 today', at: iso(0, 7), unread: true },
  { id: 'n3', title: 'New message from Hamza Chandio', detail: 'Sir, may I get an extension?', at: iso(-1, 20), unread: true },
  { id: 'n4', title: 'Marks published', detail: 'Reverse-engineering class diagram', at: iso(-2, 12), unread: false },
];

export const THREADS = [
  { id: 't1', with: 'Hamza Chandio', role: 'Student · SWE-401', messages: [
    { from: 'them', text: 'Assalam o alaikum sir, may I get a short extension for the audit report?', at: iso(-1, 20) },
    { from: 'me', text: 'Wa alaikum assalam. Please share what is pending and I will review.', at: iso(-1, 21) },
  ] },
  { id: 't2', with: 'Mehwish Kalhoro', role: 'Student · SWE-403', messages: [{ from: 'them', text: 'Could you upload the React lecture slides?', at: iso(-2, 15) }] },
  { id: 't3', with: 'Registrar Office', role: 'Admin', messages: [{ from: 'them', text: 'Please confirm attendance sheets for October.', at: iso(-3, 10) }] },
];

export const LIVE_CLASSES = [
  { id: 'l1', courseId: 'c1', title: 'Architecture recovery — Part 1', start: iso(0, 9), minutes: 60, link: '#', status: 'live' },
  { id: 'l2', courseId: 'c2', title: 'Authentication with JWT', start: iso(1, 11), minutes: 60, link: '#', status: 'scheduled' },
  { id: 'l3', courseId: 'c3', title: 'Test automation workshop', start: iso(4, 10), minutes: 90, link: '#', status: 'scheduled' },
  { id: 'l4', courseId: 'c1', title: 'Code smells — recap', start: iso(-5, 9), minutes: 60, link: '#', status: 'ended' },
];

export const CAL_EVENTS = [
  { id: 'e1', date: iso(0, 9), title: 'SWE-401 Lecture', type: 'class' },
  { id: 'e2', date: iso(1, 17), title: 'Test plan due (SWE-405)', type: 'deadline' },
  { id: 'e3', date: iso(3, 23), title: 'Audit report due (SWE-401)', type: 'deadline' },
  { id: 'e4', date: iso(6, 23), title: 'MERN mini-project due', type: 'deadline' },
  { id: 'e5', date: iso(9, 9), title: 'SWE-405 Mid-term', type: 'exam' },
  { id: 'e6', date: iso(12, 10), title: 'Project demo — SWE-403', type: 'exam' },
  { id: 'e7', date: iso(5, 12), title: 'Department meeting', type: 'event' },
  { id: 'e8', date: iso(-2, 10), title: 'Quiz 2 — SWE-401', type: 'exam' },
];

// Marks distribution is editable per course (survey: "marks distribution", "name option should be editable").
export const DEFAULT_DISTRIBUTION = [
  { key: 'mid', label: 'Mid-term', weight: 30 },
  { key: 'assign', label: 'Assignments', weight: 10 },
  { key: 'quiz', label: 'Quizzes', weight: 10 },
  { key: 'final', label: 'Final exam', weight: 50 },
];

// Existing grading scale is intentionally kept as-is (survey Q23: "grading system" should NOT change).
export const GRADE_SCALE = [
  { min: 80, grade: 'A+', gp: 4.0 }, { min: 75, grade: 'A', gp: 3.7 }, { min: 70, grade: 'B+', gp: 3.3 },
  { min: 65, grade: 'B', gp: 3.0 }, { min: 60, grade: 'C+', gp: 2.5 }, { min: 55, grade: 'C', gp: 2.0 },
  { min: 50, grade: 'D', gp: 1.0 }, { min: 0, grade: 'F', gp: 0 },
];

const seedMarks = (i) => ({ mid: [26, 22, 18, 25, 15, 28, 20, 23, 17, 27, 21, 24][i], assign: [9, 8, 7, 9, 5, 10, 7, 8, 6, 9, 8, 9][i], quiz: [8, 7, 6, 9, 5, 9, 7, 8, 6, 8, 7, 8][i], final: [44, 38, 31, 42, 27, 46, 34, 39, 29, 43, 36, 41][i] });
export const MARKS = Object.fromEntries(['c1', 'c2', 'c3', 'c4'].map((cid, ci) => [cid, Object.fromEntries(STUDENTS.map((s, i) => [s.id, seedMarks((i + ci) % 12)]))]));

export const STUDENT_RESULTS = [
  { courseId: 'c1', code: 'SWE-401', title: 'Software Reengineering', credits: 3, total: 86, grade: 'A+', gp: 4.0 },
  { courseId: 'c2', code: 'SWE-403', title: 'Web Engineering', credits: 3, total: 78, grade: 'A', gp: 3.7 },
  { courseId: 'c3', code: 'SWE-405', title: 'Software Quality Assurance', credits: 3, total: 71, grade: 'B+', gp: 3.3 },
  { courseId: 'c4', code: 'SWE-302', title: 'Database Systems', credits: 4, total: 82, grade: 'A+', gp: 4.0 },
];

export const INTEGRATIONS = [
  { id: 'sis', name: 'Student Information System', desc: 'Profiles, enrolment and transcripts', status: 'connected', icon: 'GraduationCap', stat: 'Last sync 12 min ago' },
  { id: 'fee', name: 'Fee & Finance', desc: 'Challans, dues and payment status', status: 'connected', icon: 'Wallet', stat: 'No outstanding dues' },
  { id: 'mail', name: 'University Email', desc: 'Official mailbox and mail notifications', status: 'connected', icon: 'Mail', stat: '3 unread messages' },
  { id: 'lib', name: 'Library System', desc: 'Catalogue, issued books, e-resources', status: 'connected', icon: 'Library', stat: '2 books issued' },
  { id: 'exam', name: 'Examination System', desc: 'Date sheets, seating and result gazette', status: 'connected', icon: 'FileCheck2', stat: 'Mid-term sheet published' },
  { id: 'att', name: 'Attendance System', desc: 'Syncs class attendance with the department', status: 'connected', icon: 'CalendarCheck', stat: 'Auto-sync on save' },
  { id: 'trans', name: 'Transport', desc: 'Bus routes, timings and pass status', status: 'planned', icon: 'Bus', stat: 'Requested in survey' },
];

// ---------- Survey data (transcribed from the two paper forms) ----------
export const SURVEY = {
  respondents: [
    { id: 'R1', label: 'Respondent 1', designation: 'Assistant Professor', frequency: 'Several times a week', ease: 'Easy', navigation: 'Easy', learn: 'Average', design: 'Average / Good (two boxes ticked)', satisfaction: 'Neutral', prefer: 'Yes',
      speed: 'Average', errors: 'Sometimes', reliability: 'Average', mobile: 'Good', security: 'Good', integration: 'Extremely important',
      using: ['Course Management', 'Uploading Materials', 'Assignments', 'Attendance', 'Reports'], problems: ['Course Management'],
      wants: ['Attendance Management', 'Better Notifications', 'Teacher–Student Communication', 'Course Management (written in)'],
      integrate: ['Fee/Finance System', 'University Email', 'Library System'],
      missing: 'Course management, live classes, exam/quiz, assignment, transport, admin–teacher data, student notification',
      improve: 'Course management & progress tracking', biggest: 'Scalability', oneFeature: 'All mentioned above — admin–teacher data, student notification', keep: 'Grading system', suggestion: '(left blank)' },
    { id: 'R2', label: 'Respondent 2', designation: 'Visiting Faculty', frequency: 'Daily', ease: 'Difficult', navigation: 'Difficult', learn: 'Average', design: 'Good', satisfaction: 'Neutral', prefer: 'Yes',
      speed: 'Good', errors: 'Rarely', reliability: 'Unreliable', mobile: 'Average', security: 'Excellent', integration: 'Slightly important',
      using: ['Course Management', 'Uploading Materials', 'Attendance'], problems: ['Course Management', 'Uploading Materials', 'Assignments', 'Attendance'],
      wants: ['Better Assignment Management', 'Online Quizzes/Exams', 'Attendance Management', 'Mobile App'],
      integrate: ['Student Information System', 'Attendance System', 'Examination System'],
      missing: 'Student can download own marksheet; quiz assistant; live classes; marks distribution; name option should be editable',
      improve: 'Result system', biggest: 'Not more, but a few improvements are required', oneFeature: 'Downloading marksheet by the student themselves', keep: 'Current LMS already does it well — no need to change anything other than improvements', suggestion: 'Already mentioned above' },
  ],
  // Ticks that were hard to read on the photographs are noted in the `design`/`wants` fields above.
  traceability: [
    { finding: 'Both rated satisfaction "Neutral" and both want a reengineered LMS (Q7, Q8)', source: 'Q7–Q8', decision: 'Full UI/UX reengineering with a consistent design system', where: 'All pages', route: '/dashboard' },
    { finding: 'Navigation rated Easy by one and Difficult by the other (Q3–Q4)', source: 'Q3–Q4', decision: 'Role-based grouped sidebar, global search, breadcrumbs, dashboard shortcuts', where: 'Layout, Dashboard', route: '/dashboard' },
    { finding: 'Course management is a pain point and a top improvement area; progress tracking requested (Q10, Q20)', source: 'Q10, Q20', decision: 'Course workspace with syllabus-progress tracker, materials, roster and announcements', where: 'Courses', route: '/courses/c1' },
    { finding: 'Attendance causes problems and attendance management is wanted by both (Q10–Q11)', source: 'Q10–Q11', decision: 'One-screen attendance marking with bulk actions, live counters and low-attendance flags', where: 'Attendance', route: '/attendance' },
    { finding: 'Student should download own marksheet; result system needs improvement (Q19, Q20, Q22)', source: 'Q19–Q22', decision: 'Student self-service marksheet (print/PDF and CSV)', where: 'Results & Marks', route: '/results' },
    { finding: 'Marks distribution and editable name option requested (Q19)', source: 'Q19', decision: 'Editable marks-distribution editor; editable display name in profile', where: 'Results, Profile', route: '/results' },
    { finding: 'Online quizzes/exams and a "quiz assistant" requested (Q11, Q19)', source: 'Q11, Q19', decision: 'Quiz builder with question bank quick-build and timed student attempts', where: 'Quizzes & Exams', route: '/quizzes' },
    { finding: 'Live classes listed as missing by both (Q19)', source: 'Q19', decision: 'Live class scheduler with join links and "live now" status', where: 'Live Classes', route: '/live' },
    { finding: 'Better notifications, student notification and teacher–student communication (Q11, Q19, Q22)', source: 'Q11, Q19, Q22', decision: 'Notification centre, announcements broadcast and two-way messaging', where: 'Messages, Topbar', route: '/messages' },
    { finding: 'Integration with fee, email, library, SIS, exam and attendance systems; transport requested (Q17–Q19)', source: 'Q17–Q19', decision: 'Linked-services hub with status cards (transport shown as planned)', where: 'Linked Services', route: '/integrations' },
    { finding: 'Mobile app wanted by one; mobile experience rated Good/Average (Q11, Q15)', source: 'Q11, Q15', decision: 'Fully responsive layout with off-canvas navigation', where: 'All pages', route: '/dashboard' },
    { finding: 'Scalability named as the biggest problem (Q21)', source: 'Q21', decision: 'Service layer + paginated-ready API contract; lazy-loaded routes', where: 'Architecture', route: '/survey-insights' },
    { finding: 'Grading system should NOT be changed (Q23)', source: 'Q23', decision: 'Existing grade scale preserved and displayed unchanged', where: 'Results & Marks', route: '/results' },
  ],
};
