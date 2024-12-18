import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Calender from './components/Calender';
import HomePage from './components/HomePage';
import * as sessionActions from './store/session';
import CreateWorkoutForm from './components/CreateWorkoutForm';
import ViewWorkoutPage from './components/ViewWorkoutPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: '/workouts',
        element: <CreateWorkoutForm/>
      },
      {
        path: '/workouts/view',
        element: <ViewWorkoutPage/>
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
