import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Calender from './components/Calender';
import HomePage from './components/HomePage';
import * as sessionActions from './store/session';
import CreateWorkoutForm from './components/CreateWorkoutForm';
import ViewWorkoutPage from './components/ViewWorkoutPage';
import CurrentWorkoutPage from './components/CurrentWorkoutPage';
import LoginFormModal from './components/LoginFormModal';
import LandingPage from './components/LandingPage';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => {
        setIsLoaded(true);
      });
  }, [dispatch]);

  return (
    <div className='nav-bar-outlet'>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage/>
  },
  {
    element: <Layout />,
    children: [
      // {
      //   path: '/',
      //   element: <LandingPage/>
      // },
      {
        path: '/home',
        element: <HomePage/>
      },
      {
        path: '/workouts',
        element: <CreateWorkoutForm/>
      },
      {
        path: '/workouts/view',
        element: <ViewWorkoutPage/>
      },
      {
        path: '/home/workouts/current',
        element: <CurrentWorkoutPage/>
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
