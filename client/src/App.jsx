import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout
import Layout from './components/Layout/Layout'
import PrivateRoute from './components/Auth/PrivateRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import PublishTestimony from './pages/PublishTestimony'
import Profile from './pages/Profile'
import CollectiveMemory from './pages/CollectiveMemory'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import PostDetail from './pages/PostDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="feed" element={<Feed />} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="collective-memory" element={<CollectiveMemory />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />

            {/* Protected Routes */}
            <Route path="publish" element={
              <PrivateRoute>
                <PublishTestimony />
              </PrivateRoute>
            } />
            <Route path="profile/:userId?" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
