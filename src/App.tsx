import React from 'react';
import {
  createBrowserRouter,
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

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Prize />
      },
      {
        path: "users",
        element: <Users />
      },
      {
        path: "view-payment",
        element: <ViewPayment />
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
        path: "login",
        element: <Login />
      }
    ],
  },
]);


const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App;