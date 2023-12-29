import { useParams } from "react-router-dom";
import { parse, v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

import Loading from "../layout/Loading";
import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import Message from "../layout/Message";
import ServiceForm from "../service/ServiceForm";
import ServiceCard from "../service/ServiceCard";

import styles from "./Project.module.css";

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    fetch(`https://react-projects-manager-backend.onrender.com/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function editPost(project) {
    setMessage("");
    if (project.budget < project.cost) {
      setMessage("O orçamento nao pode ser menor que o custo do projeto!");
      setType("error");
      return;
    }
    fetch(`https://react-projects-manager-backend.onrender.com/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setMessage("Projeto atualizado!");
        setType("success");
        toggleProjectForm();
      })
      .catch((err) => console.log(err));
  }

  function createService(project) {
    const lastService = project.services[project.services.length - 1];
    lastService.id = uuidv4();

    const lastServiceCost = lastService.cost;
    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

    setMessage("");
    if (newCost > parseFloat(project.budget)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço");
      setType("error");
      project.services.pop();
      return false;
    }

    project.cost = newCost;

    fetch(`https://react-projects-manager-backend.onrender.com/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setMessage("Serviço adicionado com sucesso!");
        setType("success");
        toggleServiceForm();
      })
      .catch((err) => console.log(err));
  }

  function removeService(id, cost) {
    const serviceUpdated = project.services.filter((service) => service.id !== id);
    const projectUpdated = project;

    projectUpdated.services = serviceUpdated;
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

    setMessage("");
    fetch(`https://react-projects-manager-backend.onrender.com/projects/${projectUpdated.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(projectUpdated);
        setServices(serviceUpdated);
        setMessage("Serviço removido com sucesso!");
        setType("success");
      })
      .catch((err) => console.log(err));
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  function renderProject() {
    if (!project.name) {
      return <Loading />;
    }
    return (
      <div className={styles.project_details}>
        <Container customClass="column">
          {message && <Message type={type} msg={message} />}

          <div className={styles.details_container}>
            <h1>Projeto: {project.name}</h1>
            <button onClick={toggleProjectForm} className={styles.btn}>
              {!showProjectForm ? "Editar projeto" : "Fechar"}
            </button>

            {!showProjectForm ? (
              <div className={styles.project_info}>
                <p>
                  <span>Categoria:</span> {project?.category?.name}
                </p>
                <p>
                  <span>Total de Orçamento:</span> R${project.budget}
                </p>
                <p>
                  <span>Total Utlizado:</span> R${project.cost}
                </p>
              </div>
            ) : (
              <div className={styles.project_info}>
                <ProjectForm
                  handleSubmit={editPost}
                  btnText="Concluir edição"
                  projectData={project}
                />
              </div>
            )}
          </div>

          <div className={styles.service_form_container}>
            <h2>Adicionar um serviço:</h2>
            <button className={styles.btn} onClick={toggleServiceForm}>
              {!showServiceForm ? "Adicionar serviço" : "Fechar"}
            </button>
            <div className={styles.project_info}>
              {showServiceForm && (
                <ServiceForm
                  handleSubmit={createService}
                  btnText="Adicionar serviço"
                  projectData={project}
                />
              )}
            </div>
          </div>

          <h2>Serviços</h2>

          <Container customClass="start">
            {services.length > 0 &&
              services.map((service) => (
                <ServiceCard
                  id={service.id}
                  name={service.name}
                  cost={service.cost}
                  description={service.description}
                  handleRemove={removeService}
                  key={service.id}
                />
              ))}
            {services.length === 0 && <p>Não há serviços cadastrados</p>}
          </Container>
        </Container>
      </div>
    );
  }

  return <>{renderProject()}</>;
};

export default Project;
