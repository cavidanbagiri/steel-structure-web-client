import { div } from 'framer-motion/client';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='p-3'>
      <span className='text-5xl font-bold'>Dashboard</span>
    </div>
  );
};

export default Dashboard;