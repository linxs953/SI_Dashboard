// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import 'antd/dist/reset.css';
import Dashboard from './components/pages/dashboard'
import ProjectOverview from './components/pages/ProjectOverview'
import NotFound from './components/pages/404'
import ImageBuild from './components/pages/imageBuild'
import ApiRuntimeListPage from './components/pages/apiRuntime';
import Demo from './components/pages/demo';
import Sync from './components/pages/Sync';
import { Login, Register } from './components/auth';
import TaskConfigPage from './components/pages/taskconfig';



function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path='/' element={<Navigate to="/home" replace />} />
      <Route path='/home' element={<ProjectOverview />} />
      <Route path='/taskconfig' element={<TaskConfigPage />} />
      <Route path='/dashboard' element={<Dashboard />}>
        <Route index element={<Navigate to="/dashboard/api/image-build" replace />} />
        <Route path='/dashboard/api/image-build' element={<ImageBuild />} />
        <Route path='/dashboard/api/automation' element={<ApiRuntimeListPage />} />
        <Route path='/dashboard/sync/config' element={<Sync />} />
        <Route path='/dashboard/login' element={<Login />} />
      </Route>
      {/* <Route path='/login' element={<Login />} /> */}
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Demo />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
  )
}

export default App
