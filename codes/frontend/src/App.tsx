import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import ServiceRequest from './pages/ServiceRequest';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Announcements from './pages/Announcements';
import RequestHistory from './pages/RequestHistory';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request" element={<ServiceRequest />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/history" element={<RequestHistory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chat/:requestId" element={<Chat />} />
        </Routes>
      </Layout>
      <Chatbot />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;

