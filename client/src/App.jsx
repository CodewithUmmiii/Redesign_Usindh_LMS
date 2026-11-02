import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { RequireAuth, RequireRole } from './components/layout/RouteGuards';
import { Skeleton } from './components/ui';

// Route-level code splitting (survey: scalability was named the biggest problem).
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Assignments = lazy(() => import('./pages/Assignments'));
const Quizzes = lazy(() => import('./pages/Quizzes'));
const Results = lazy(() => import('./pages/Results'));
const LiveClasses = lazy(() => import('./pages/LiveClasses'));
const Messages = lazy(() => import('./pages/Messages'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Reports = lazy(() => import('./pages/Reports'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Profile = lazy(() => import('./pages/Profile'));
const SurveyInsights = lazy(() => import('./pages/SurveyInsights'));
const NotFound = lazy(() => import('./pages/NotFound'));

const TS = ['teacher', 'student'];
const TA = ['teacher', 'admin'];

export default function App() {
  return (
    <Suspense fallback={<div className="content"><Skeleton h={120} n={3} /></div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/assignments" element={<RequireRole roles={TS}><Assignments /></RequireRole>} />
            <Route path="/quizzes" element={<RequireRole roles={TS}><Quizzes /></RequireRole>} />
            <Route path="/results" element={<Results />} />
            <Route path="/live" element={<RequireRole roles={TS}><LiveClasses /></RequireRole>} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reports" element={<RequireRole roles={TA}><Reports /></RequireRole>} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/survey-insights" element={<SurveyInsights />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
