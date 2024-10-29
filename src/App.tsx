import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";
import Layout from './common/layout/Layout';
import Prize from './pages/prize/prize';
import './App.css';
import Users from './pages/users/Users';
import Register from './pages/register/Register';
import ViewPayment from './pages/view-payment/ViewPayment';
import Login from './pages/login/Login';
import AddPayment from './pages/add-payment/AddPayment';
import Prizes from './pages/prizes/Prizes';
import AddWinner from './pages/add-winner/AddWinner';
import LoaderProvider from './context/loaderProvider';
import IsAdmin from './hooks/Admin.hook';
import { About } from './pages/About';
const App: React.FC = () => {
  const [isAdmin, , user] = IsAdmin();

  const guestRoute = [
    {
      path: "/",
      element: <Prize />
    },
    {
      path: "prizes",
      element: <Prizes />
    },
    {
      path: "login",
      element: <Login />
    },
    {
      path: "about",
      element: <About />
    },
    {
      path: "*",
      element: <Navigate replace to="/" />
    }
  ]

  const  userRoute = [
    {
      path: "view-payment",
      element: <ViewPayment />
    }
  ]

  const adminRoutes = [
    {
      path: "users",
      element: <Users />
    },
    {
      path: "add-payment",
      element: <AddPayment />
    },
    {
      path: "register",
      element: <Register />
    },
    {
      path: "add-winner",
      element: <AddWinner />
    }]

  const getRoutes = () => {
    console.log(user, isAdmin)
    if(user && isAdmin) return [...guestRoute, ...userRoute, ...adminRoutes];
    if(user && !isAdmin) return [...guestRoute, ...userRoute]

    return guestRoute;
  }

  const router = React.useMemo(() => createBrowserRouter([
    {
      element: <Layout />,
      children: getRoutes()
    },
  ]),[isAdmin, user]);


  return (
    <LoaderProvider>
      <RouterProvider router={router} />
    </LoaderProvider>
  );
}

export default App;
