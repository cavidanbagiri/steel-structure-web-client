import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-400 mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 ">
          Welcome, {user?.firstname} {user?.lastname}!
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Username</p>
            <p className="text-lg font-semibold text-gray-800">{user?.username}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">{user?.status}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">User ID</p>
            <p className="text-lg font-semibold text-gray-800">{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;