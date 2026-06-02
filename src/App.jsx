import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./assets/component/Home";
import Login from "./assets/component/auth/Login";
import Final from "./assets/component/Final";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Final" element={<Final />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;