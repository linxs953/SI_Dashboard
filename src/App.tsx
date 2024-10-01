import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import React from 'react'
import Dashboard from './components/dashboard'
import ApiSyncList from './pages/apiSyncList'
import ScenConfig from './pages/sceneList'
import EditScene from './pages/editScene'
import TaskList from './pages/taskList'
import EditTask from './pages/editTask'
import ReportDetail from './components/interface_auto/task/reportDetail'
import Reports from './pages/reports'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='/dashboard/api/scene' element = {<ScenConfig />} />
          <Route path='/dashboard/api/sync' element={<ApiSyncList  />} />
          <Route path='/dashboard/api/scene/edit' element={<EditScene />} />
          <Route path='/dashboard/api/task' element={<TaskList />} />
          <Route path='/dashboard/api/task/edit' element={<EditTask />} />
          <Route path='/dashboard/api/task/reportDetail' element={<ReportDetail />} />
          <Route path='/dashboard/api/task/reports' element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
