import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ProtectedRoute from "./components/Styles/auth/ProtectedRoute";
import LayoutLoader from "./components/loaders/LayoutLoader.jsx";
import Chats from "./pages/Chats.jsx";
import NewGroupMenu from "./components/specific/NewGroupMenu.jsx";
import Groups from "./pages/Groups.jsx";

import { Toaster} from "react-hot-toast";

import {useDispatch,useSelector} from "react-redux"

import axios from "axios";
import { server } from "./constants/config.js";
import { userExists, userNotExists } from "./redux/auth.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin.jsx"));

const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));

const AdminUsersMangement = lazy(() =>
  import("./pages/Admin/UsersManagement.jsx")
);

const AdminChatsMangement = lazy(() =>
  import("./pages/Admin/ChatsManagement.jsx")
);

const AdminMessages = lazy(() => import("./pages/Admin/Messages.jsx"));



function App() {

  const {user,loader}=useSelector((state)=>state.auth);

  const dispatch=useDispatch();

  useEffect(() => {
   

    axios
      .get(`${server}/api/v1/users/me`,{withCredentials:true})
      .then(({data}) => dispatch(userExists(data.user)))
      .catch((error) => dispatch(userNotExists()));
  }, [dispatch]);

  return ( loader? <LayoutLoader/>: 
    <>

      <BrowserRouter>
        <Suspense fallback={<LayoutLoader />}>
          <Routes>
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/" element={<Home />} />

              <Route path="/groups" element={<Groups />} />

              <Route path="/chat/:id" element={<Chats />} />
            </Route>

            <Route
              path="/login"
              element={
                <ProtectedRoute user={!user} redirectPath="/">
                  {" "}
                  <Login />{" "}
                </ProtectedRoute>
              }
            />

            <Route path="/admin" element={<AdminLogin />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route
              path="/admin/users-management"
              element={<AdminUsersMangement />}
            />

            <Route
              path="/admin/chats-management"
              element={<AdminChatsMangement />}
            />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center"/>
      </BrowserRouter>
    </>
  );
}

export default App;
