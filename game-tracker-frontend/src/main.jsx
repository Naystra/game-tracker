import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./context/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";



import Home from "./pages/Home";
import Login from "./pages/Login";
import Library from "./pages/Library";
import Search from "./pages/Search";
import Stats from "./pages/Stats";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import GameDetails from "./pages/GameDetails";



ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/game/:id" element={<GameDetails />} />


        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
      </Routes>
    </UserProvider>
  </BrowserRouter>
);
