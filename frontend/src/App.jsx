import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

import HomePage from './components/HomePage';
import * as sessionActions from './store/session';
import CreateWorkoutForm from './components/CreateWorkoutForm';
import ViewWorkoutPage from './components/ViewWorkoutPage';
import CurrentWorkoutPage from './components/CurrentWorkoutPage';

import LandingPage from './components/LandingPage';
import WeightLog from './components/WeightLog/WeightLog';


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
        path: '/workouts/current',
        element: <CurrentWorkoutPage/>
      },
      {
        path: '/weightLog',
        element: <WeightLog/>
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
