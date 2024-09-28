import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainPage from "./pages/MainPage"
import LoginPage from "./pages/user-service/LoginPage"
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import EditQuestionPage from "./pages/question-service/EditQuestionPage";
import ViewQuestionPage from "./pages/question-service/ViewQuestionPage";
import ListQuestionPage from "./pages/question-service/ListQuestionPage";
import SignupPage from "./pages/user-service/SignupPage";
import ForgotPasswordPage from "./pages/user-service/ForgotPasswordPage";
import AccountSettingsPage from "./pages/user-service/AccountSettingsPage";
import ErrorPage from "./pages/ErrorPage";
import AddQuestionPage from "./pages/question-service/AddQuestionPage";

/**
 * A wrapper around routes that should only be accessed by logged-in users.
 * If a user is not logged in, automatically navigates to `/login`.
 * 
 * Usage:
 * ```
 * <PrivateRoute>
 *   <QuestionList />
 * </PrivateRoute>
 * ```
 */
function PrivateRoute({ children } : { children : React.ReactNode }) {
  const { auth } = useAuth();
  
  return ( auth.isLoggedIn ) ? (
    <>
      { children }
    </>
  ) : (
    <Navigate to="/login" />
  )
}


/**
 * A wrapper around routes that should only be accessed by not logged-in users.
 * If a user is logged in, automatically navigates to `/`.
 * 
 * Usage:
 * ```
 * <PublicRoute>
 *   <SignupPage />
 * </PublicRoute>
 * ```
 */
function PublicRoute({ children } : { children : React.ReactNode }) {
  const { auth } = useAuth();
  
  return ( !auth.isLoggedIn ) ? (
    <>
      { children }
    </>
  ) : (
    <Navigate to="/" />
  )
}

/**
 * A wrapper around routes that should only be accessed by admins. Admin routes
 * implicitly contain the `PrivateRoute` component, so you do not have to further
 * wrap the route around the `PrivateRoute` component.
 * 
 * If a user is an admin, navigates to the component represented by prop `adminRoute`.
 * 
 * If a user is not an admin, navigates to the component represented by prop `nonAdminRoute`.
 * 
 * Usage:
 * ```
 * <AdminRoute 
 *   adminRoute={ <EditQuestionPage /> }
 *   nonAdminRoute={ <ViewQuestionPage /> } 
 * />
 * ```
 */
function AdminRoute({ adminRoute, nonAdminRoute } : { adminRoute : React.ReactNode, nonAdminRoute : React.ReactNode }) {
  const { auth } = useAuth();
  
  return ( auth.isAdmin ) ? (
    <PrivateRoute>
      { adminRoute }
    </PrivateRoute>
  ) : (
    <PrivateRoute>
      { nonAdminRoute }
    </PrivateRoute>
  )
}

/**
 * @returns Main application, which routes different pages to different components.
 */
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <AccountSettingsPage />
            </PrivateRoute>
          } />
          <Route path="/questions/" element={
            <PrivateRoute>
              <ListQuestionPage />
            </PrivateRoute>
          } />
          <Route path="/questions/:id" element={
            <AdminRoute
              adminRoute={ <EditQuestionPage /> }
              nonAdminRoute={ <ViewQuestionPage /> }
            />
          } />
          <Route path="/questions/new" element={
            <AdminRoute
              adminRoute={ <AddQuestionPage /> }
              nonAdminRoute={ <Navigate to="/questions" /> }
            />
          } />
          <Route path="*" Component={ ErrorPage } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App