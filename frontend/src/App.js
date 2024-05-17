import React from "react";
import { Outlet, Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './utils/protectedRoute';
import MainAppBar from './components/appBar';
import Home from "./pages/home";
import 'react-toastify/dist/ReactToastify.css'

const App = (props) => {

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Home />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainAppBar />
            </ProtectedRoute>
          }>
          <Route index element={<Home />} />
          <Route path="otra" element={<Home />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here! :(</p>
            </main>
          }
        ></Route>
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App;
