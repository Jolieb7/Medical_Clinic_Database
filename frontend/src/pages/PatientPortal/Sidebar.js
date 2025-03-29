import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Profile Page
          </Link>
        </li>
        <li>
          <Link to="/immunizations" className={location.pathname === '/immunizations' ? 'active' : ''}>
            Immunizations
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;