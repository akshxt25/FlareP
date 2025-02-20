import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Login from './components/Login';
import EditorHome from './components/editorComponents/Home';
import CreatorHome from './components/creatorComponents/Home';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = useSelector((state) => state.user);

  if (!user.user || !user.role) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    console.log(`Role mismatch: expected ${allowedRole}, got ${user.role}`);
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Creator Routes */}
            <Route
              path="/creator/home"
              element={
                <ProtectedRoute allowedRole="creator">
                  <CreatorHome />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Editor Routes */}
            <Route
              path="/editor/home"
              element={
                <ProtectedRoute allowedRole="editor">
                  <EditorHome />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route - redirects to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;