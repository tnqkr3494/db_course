import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "../pages/Profile";
import axios from "axios";
function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null); // 사용자 상태 추가

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div className="navbar bg-base-100 px-10 py-5 border-b-2">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Home
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 items-center">
          {!user ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <li>
              <button className="bg-red-500" onClick={handleClick}>
                Logout
              </button>
            </li>
          )}
          <li>
            <Link to="/tickets">Tickets</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <details>
              <summary>Cinema</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li>
                  <Link to="/cinema/1">Hello Cinema</Link>
                </li>
                <li>
                  <Link to="/cinema/2">Welcome Cinema</Link>
                </li>
                <li>
                  <Link to="/cinema/3">Wolrd Cinema</Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Header;
