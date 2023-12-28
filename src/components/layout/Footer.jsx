import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ul className={styles.social_list}>
        <li>
          <FaFacebook />
        </li>
        <li>
          <FaInstagram />
        </li>
        <li>
          <FaGithub />
        </li>
      </ul>
      <p className={styles.copy_right}>
        <span>Projects Manager</span> &copy; 2023
      </p>
    </footer>
  );
};

export default Footer;
