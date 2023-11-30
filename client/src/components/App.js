import React from "react";
import Home from "./Home";
import Admin from "./Admin";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import Dashboard from "./Dashboard"
import UpdatePassword from "./UpdatePassword"
import { AuthProvider } from "../services/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  // return (
  //   // <div className="App">
  //   //   <header className="App-header">
  //   //     <p>{!data ? "Loading..." : data}</p>
  //   //   </header>
  //   // </div>
  // );
}

export default App;
