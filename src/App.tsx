import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import React from 'react'
import Dashboard from './components/pages/dashboard'
import ApiSyncList from './components/pages/apiSyncList'
import ScenConfig from './components/pages/sceneList'
import EditScene from './components/pages/editScene'
import TaskList from './components/pages/taskList'
import EditTask from './components/pages/editTask'
import ReportDetail from './components/models/interface_auto/task/reportDetail'
import Reports from './components/pages/reports'
import MultiDataSourceModal from './components/models/interface_auto/task/multiDataSourceModal'
import ProjectOverview from './components/pages/ProjectOverview'
import NotFound from './components/pages/404'
import DataManage from './components/pages/dataManage'
import IdlList from './components/pages/idlList'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/home" replace />} />
        <Route path='/home' element={<ProjectOverview />} />

        <Route path='/dashboard' element={<Dashboard />}>
          <Route index element={<Navigate to="/dashboard/api/task" replace />} />
          <Route path='/dashboard/api/scene' element = {<ScenConfig />} />
          <Route path='/dashboard/api/sync' element={<ApiSyncList  />} />
          <Route path='/dashboard/api/scene/edit' element={<EditScene />} />
          <Route path='/dashboard/api/task' element={<TaskList />} />
          <Route path='/dashboard/api/task/edit' element={<EditTask />} />
          <Route path='/dashboard/api/task/reportDetail' element={<ReportDetail />} />
          <Route path='/dashboard/api/task/reports' element={<Reports />} />
          <Route path='/dashboard/api/data' element={<DataManage />} />
          <Route path='/dashboard/idl' element={<IdlList />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
