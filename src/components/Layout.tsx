import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ""}>List</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? styles.active : ""}>Gallery</NavLink>
        </nav>
      </header>
      <Outlet />
      <footer className={styles.footer}>
        <small>MP2 • React + TS + Router + Axios</small>
      </footer>
    </div>
  );
}
