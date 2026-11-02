import {
  LayoutDashboard, BookOpen, CalendarCheck, ClipboardList, FileQuestion, Award,
  Video, MessageSquare, CalendarDays, BarChart3, Plug, UserCircle, Lightbulb,
} from 'lucide-react';

// Single source of truth for sidebar + route guards. `roles` limits visibility.
export const NAV = [
  { group: 'Main', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['teacher', 'student', 'admin'] },
    { to: '/courses', label: 'Courses', icon: BookOpen, roles: ['teacher', 'student', 'admin'] },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays, roles: ['teacher', 'student', 'admin'] },
  ]},
  { group: 'Teaching & Learning', items: [
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck, roles: ['teacher', 'student', 'admin'] },
    { to: '/assignments', label: 'Assignments', icon: ClipboardList, roles: ['teacher', 'student'] },
    { to: '/quizzes', label: 'Quizzes & Exams', icon: FileQuestion, roles: ['teacher', 'student'] },
    { to: '/results', label: 'Results & Marks', icon: Award, roles: ['teacher', 'student', 'admin'] },
    { to: '/live', label: 'Live Classes', icon: Video, roles: ['teacher', 'student'] },
  ]},
  { group: 'Communication', items: [
    { to: '/messages', label: 'Messages', icon: MessageSquare, roles: ['teacher', 'student', 'admin'] },
    { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['teacher', 'admin'] },
  ]},
  { group: 'University', items: [
    { to: '/integrations', label: 'Linked Services', icon: Plug, roles: ['teacher', 'student', 'admin'] },
    { to: '/profile', label: 'My Profile', icon: UserCircle, roles: ['teacher', 'student', 'admin'] },
    { to: '/survey-insights', label: 'Survey Insights', icon: Lightbulb, roles: ['teacher', 'student', 'admin'] },
  ]},
];
