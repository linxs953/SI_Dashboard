import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import ListPage from './pages/ListPage'
import EditPage from './pages/EditPage'
import React from 'react'
import Dashboard from './pages/PsuTool'
import Maker from './components/tools/maker'
import UserManager from './components/tools/userManager'
import ApiSyncList from './components/interface_auto/apiSyncList'
import MyListComponent from './components/interface_auto/apiAutoSceneConfig'
import ScenConfig from './components/interface_auto/apiAutoSceneConfig'
import DragDemo from './components/interface_auto/dragList'
import EditScene from './components/interface_auto/editScene'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<RequireAuth />}>
          <Route index element={
            <Navigate to="/list" />
          } />
          <Route path='list' element={<ListPage />} />
        </Route>
        <Route path='/edit' element={<EditPage />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='/dashboard/tool/maker' element = {<Maker />} />
          <Route path='/dashboard/api/scene' element = {<ScenConfig />} />
          <Route path='/dashboard/tool/user' element = {<UserManager />} />
          <Route path='/dashboard/api/sync' element={<ApiSyncList  />} />
          <Route path='/dashboard/api/scene/edit' element={<EditScene />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
