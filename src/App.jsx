// App.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routers/index.jsx';

function App() {
  const dispatch = useDispatch();

  return <RouterProvider router={router} />;
}

export default App;