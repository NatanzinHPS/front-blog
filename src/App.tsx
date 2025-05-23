import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ArticleDetail from "./pages/ArticleDetails";
import CreateArticle from "./pages/CreateArticle";
import Layout from "./components/Layout";


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas sem navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rotas com navbar */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/api/articles/:id" element={<Layout><ArticleDetail /></Layout>} />
        <Route path="/create-article" element={<Layout><CreateArticle /></Layout>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
