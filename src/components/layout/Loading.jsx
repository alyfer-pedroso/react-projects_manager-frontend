import loadingImg from "../../imgs/loading.svg";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loader_container}>
      <img className={styles.loader} src={loadingImg} alt="loading" />
    </div>
  );
};

export default Loading;
