import React from "react";
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './utils/protectedRoute';
import MainAppBar from './components/appBar';
import Tournaments from "./pages/tournaments";
import TournamentDetail from "./pages/tournamentDetail";
import TournamentResume from "./pages/tournamentResume";
import Login from "./pages/login";
import Register from "./pages/register";
import 'react-toastify/dist/ReactToastify.css'

const App = (props) => {

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainAppBar />
            </ProtectedRoute>
          }>
          <Route index element={<Tournaments />} />
          <Route path="tournament/:tournamentId" element={<TournamentDetail />} />
          <Route path="tournament/:tournamentId/dashboard" element={<TournamentResume />} />
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
