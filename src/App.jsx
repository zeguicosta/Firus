import { Outlet } from "react-router-dom"
import Nav from "./components/Nav"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <ScrollToTop />
      <Nav open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'ml-[225px]' : 'ml-[76px]'
      }`}>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default App