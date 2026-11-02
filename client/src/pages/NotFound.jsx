import { Link } from 'react-router-dom';
import { Card, Empty } from '../components/ui';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return <Card><Empty icon={Compass} title="Page not found" hint="The page you are looking for doesn't exist." /><div style={{ textAlign: 'center', paddingBottom: 30 }}><Link className="btn primary" to="/dashboard">Back to dashboard</Link></div></Card>;
}
