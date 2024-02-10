import './App.css';
import LoginPage from './Login/LoginPage';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './Layout';
import Dashboard from './Dashboard/Dashboard';

function App() {
  return (
    <Router>
    <Layout>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Layout>
</Router>
  );
}

export default App;