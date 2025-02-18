import React from 'react'
import {Routes, Route} from "react-router-dom"
import Home from "../editorComponents/Home"

const Routes = () => {
  return (
    <div>
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute
                    component={Home}
                    />
                }
            />
        </Routes>
    </div>
  )
}

export default Routes