import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './Components/Login';
import { Register } from './Components/Register';
import { AuthProvider } from './Components/AuthContext';
import { JobListing } from './Components/JobListing';
import { JobPosting } from './Components/JobPosting';
import AdminBoard from './Components/AdminBoard';

function App() {
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/joblisting' element={<JobListing/>}/>
          <Route path='/jobposting' element={<JobPosting/>}/>
          <Route path='/admin' element={<AdminBoard/>}/>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
