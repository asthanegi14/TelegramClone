import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Reset from "./Components/Reset";
import ConfirmOTP from "./Components/ConfirmOTP";
import ChangePassword from "./Components/ChangePassword";
import Profile from "./Components/Profile";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const routers = createBrowserRouter([
    {
      path: '/home',
      element: <Home></Home>
    },
    {
      path: '/',
      element: <Login></Login>
    },
    {
      path: '/register',
      element: <Register></Register>
    },
    {
      path: '/reset',
      element: <Reset></Reset>
    },
    {
      path: '/confirmOTP',
      element: <ConfirmOTP></ConfirmOTP>
    },
    {
      path: '/changePassword',
      element: <ChangePassword></ChangePassword>
    },
    {
      path: '/profile',
      element: <Profile></Profile>
    },
  ]);

  return (
    <div>
      <RouterProvider router={routers} />
    </div>
  )
}

export default App