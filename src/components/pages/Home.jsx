import styles from "./Home.module.css";
import homeImg from "../../imgs/home2.png";
import LinkButton from "../layout/LinkButton";

const Home = () => {
  return (
    <section className={styles.home_container}>
      <h1>
        Bem-Vindo ao <span>Projects Manager</span>
      </h1>
      <p>Comece a gerenciar os seus projetos agora mesmo!</p>
      <LinkButton to="/newproject" text="Criar Projeto" />
      <img src={homeImg} alt="Projects Manager" />
    </section>
  );
};

export default Home;
