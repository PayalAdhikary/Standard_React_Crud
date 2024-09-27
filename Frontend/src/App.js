// App.js
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Layout from "./components/Layout"; // Import the Layout component
import PrivateRoute from "./components/PrivateRoute";
import ImageUpload from "./components/ImageUpload";
import NotFound from "./components/NotFound";
import ForgetPassword from "./components/ForgetPassword";
import SignIn from "./components/SignIn";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignIn />} />
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route element={<Layout />}>
            <Route path="/*" element={<NotFound />} />
          </Route>
          {/* Protected Routes Wrapped with Layout */}
          <Route element={<Layout />}>
            {/* All these components will have the same layout */}
            <Route
              index
              path="/dashboard"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
