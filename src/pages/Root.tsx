import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function Root() {
  return (
    <div>
      <Header />
      <div className="p-10">
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
