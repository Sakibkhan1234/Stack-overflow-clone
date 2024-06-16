import { NavLink } from 'react-router-dom';
import Globe from '../../assest/Globe.svg';
import './LeftSidebar.css';

const LeftSidebar = ({ isNavOpen, toggleNav }) => {
  return (
    <div className={`left-sidebar ${isNavOpen ? 'open' : ''}`}>
      <nav className="side-nav">
        <button className="close-btn" onClick={toggleNav}>&times;</button>
        <NavLink to="/" className="side-nav-links" activeclassname="active">
          <p>Home</p>
        </NavLink>
        <div className="side-nav-div">
          <div>
            <p>PUBLIC</p>
          </div>
          <NavLink to="/Questions" className="side-nav-links" activeclassname="active">
            <img src={Globe} alt="Globe" />
            <p style={{ paddingLeft: '10px' }}>Questions</p>
          </NavLink>
          <NavLink to="/Tags" className="side-nav-links" activeclassname="active" style={{ paddingLeft: '40px' }}>
            <p>Tags</p>
          </NavLink>
          <NavLink to="/Users" className="side-nav-links" activeclassname="active" style={{ paddingLeft: '40px' }}>
            <p>Users</p>
          </NavLink>
          <NavLink to="/Video" className="side-nav-links" activeclassname="active" style={{ paddingLeft: '40px' }}>
            <p>VideoPlayer</p>
          </NavLink>
          <NavLink to="/ChatRoom" className="side-nav-links" activeclassname="active" style={{ paddingLeft: '40px' }}>
            <p>PrivateChatRoom</p>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default LeftSidebar;
