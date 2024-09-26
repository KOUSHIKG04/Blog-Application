import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import { UserContextProvidesr } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <>
      <UserContextProvidesr>
        <ToastContainer />
        <Routes>
          <Route path={"/"} element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/create"} element={<CreatePost />} />
            <Route path={"/post/:id"} element={<PostPage />} />
            <Route path={"/edit/:id"} element={<EditPost />} />
          </Route>
        </Routes>
      </UserContextProvidesr>
    </>
  );
}

export default App;
