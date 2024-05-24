import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Root() {
  return (
    <div>
      <Header />
      <div className="p-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Root;
