import { Link, useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 px-10 py-5 border-b-2">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Home
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 items-center">
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
