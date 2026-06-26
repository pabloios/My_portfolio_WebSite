import CareerChat from "./components/career-chat";

const capabilities = [
  "Respuesta ante incidentes",
  "SIEM y correlación de eventos",
  "Análisis de logs e IOC",
  "Scripting Python y Bash básico",
  "QA funcional y documentación",
  "Automatización de procesos CRM",
  "Networking TCP/IP, DNS, HTTP",
  "Cloud security fundamentos"
];

const experience = [
  {
    period: "2026 - Actual",
    role: "Desarrollo de Automatizaciones",
    company: "Alfanet S.A.",
    place: "Santo Domingo, Ecuador",
    detail:
      "Automatización de procesos en CRM, validaciones de datos de entrada e investigación para implementar herramientas de QA en Jira."
  },
  {
    period: "2023 - 2025",
    role: "Operations Manager",
    company: "Empresa de Importación y Distribución",
    place: "Melbourne",
    detail:
      "Gestión de operaciones, supervisión de sistemas digitales, análisis de datos operativos y optimización de procesos logísticos."
  },
  {
    period: "2019 - 2021",
    role: "Software Tester",
    company: "UTest",
    place: "Remoto",
    detail:
      "Diseño y ejecución de casos de prueba funcionales, documentación de incidencias y colaboración con desarrolladores para acelerar resoluciones."
  },
  {
    period: "2016 - 2018",
    role: "Asistente de Operaciones en Logistica Internacional",
    company: "Repcontver S.A.",
    place: "Guayaquil",
    detail:
      "Coordinación de envíos, control de inventarios en tránsito, documentación aduanera y mejora de tiempos de entrega."
  }
];

const education = [
  "Ingeniería Informática, Universidad Internacional de La Rioja",
  "Advanced Diploma in Cybersecurity, Laneway Education",
  "Google Cybersecurity Professional Certificate",
  "Ingeniería en Telemática, ESPOL",
  "Desarrollo iOS y SwiftUI"
];

const focusAreas = [
  {
    title: "Security Operations",
    text:
      "Monitoreo de amenazas, revisión de logs, detección inicial y respuesta ante incidentes con mentalidad SOC."
  },
  {
    title: "Automation",
    text:
      "Scripts, flujos de trabajo y validaciones para reducir tareas repetitivas y mejorar trazabilidad operacional."
  },
  {
    title: "Agentic Engineering",
    text:
      "Uso práctico de herramientas de IA para acelerar desarrollo, QA, investigación técnica y documentación."
  }
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="intro-title">
        <nav className="topbar" aria-label="Navegación principal">
          <a className="brand" href="#top" aria-label="Inicio">
            <span>PS</span>
            <strong>Pablo Sarmiento</strong>
          </a>
          <div className="navlinks">
            <a href="#trayectoria">Trayectoria</a>
            <a href="#capacidades">Capacidades</a>
            <a href="#gemelo-ia">Gemelo IA</a>
            <a href="https://github.com/pabloios" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </nav>

        <div className="heroGrid" id="top">
          <div className="heroCopy">
            <p className="signal">Cybersecurity Analyst | SOC Analyst Junior | Agentic Engineer</p>
            <h1 id="intro-title">Seguridad operativa con IA y criterio empresarial.</h1>
            <p className="lead">
              Soy Pablo José Sarmiento Moreno, profesional de TI en Ecuador con foco en
              ciberseguridad, monitoreo SOC, automatización de procesos y desarrollo asistido por IA.
              Mi trayectoria combina logística, QA, datos operativos y sistemas digitales.
            </p>
            <div className="actions" aria-label="Acciones principales">
              <a className="button primary" href="mailto:pablo521@hotmail.com">
                Contactar por email
              </a>
              <a className="button secondary" href="/docs/Pablo_Sarmiento_CV_ES.pdf" target="_blank">
                Ver CV
              </a>
              <a className="button ghost" href="https://github.com/pabloios" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <aside className="profilePanel" aria-label="Perfil profesional">
            <div className="portraitWrap">
              <img src="/assets/pablo-profile.jpg" alt="Retrato profesional de Pablo José Sarmiento Moreno" />
            </div>
            <div className="identity">
              <span>Machala, Ecuador</span>
              <strong>Pablo José Sarmiento Moreno</strong>
              <a href="https://linkedin.com/in/pablo-jos%C3%A9-sarmiento-moreno-7041b0119" target="_blank" rel="noreferrer">
                Perfil de LinkedIn
              </a>
            </div>
            <dl className="quickStats">
              <div>
                <dt>Enfoque</dt>
                <dd>SOC, SIEM, automatización</dd>
              </div>
              <div>
                <dt>Idiomas</dt>
                <dd>ES nativo, EN C1, DE B1</dd>
              </div>
              <div>
                <dt>Disponibilidad</dt>
                <dd>Roles junior y proyectos técnicos</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="about section">
        <div className="sectionIntro">
          <p className="kicker">Acerca de mi</p>
          <h2>Un perfil técnico construido desde operaciones reales.</h2>
        </div>
        <div className="aboutBody">
          <p>
            Mi carrera empezó en entornos donde la precisión operativa importa: inventario,
            logística internacional, coordinación de proveedores y seguimiento de procesos. Esa base
            me llevó hacia QA, automatización y ciberseguridad, áreas donde la disciplina para mirar
            detalles, documentar y responder rápido se vuelve una ventaja técnica.
          </p>
          <p>
            Hoy estoy orientado a roles junior de ciberseguridad, SOC y automatización. Trabajo con
            fundamentos de SIEM, análisis de logs, detección de amenazas, scripting, networking y
            herramientas de IA aplicadas a investigación y desarrollo.
          </p>
        </div>
      </section>

      <section className="focus section" id="capacidades">
        <div className="sectionIntro wide">
          <p className="kicker">Especialización</p>
          <h2>Tres lineas de trabajo que se refuerzan entre si.</h2>
        </div>
        <div className="focusGrid">
          {focusAreas.map((area) => (
            <article className="focusItem" key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split" id="trayectoria">
        <div className="sectionIntro sticky">
          <p className="kicker">Trayectoria profesional</p>
          <h2>De procesos críticos a sistemas, seguridad y automatización.</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timelineItem" key={`${item.company}-${item.period}`}>
              <time>{item.period}</time>
              <div>
                <h3>{item.role}</h3>
                <p className="company">
                  {item.company} · {item.place}
                </p>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section credentials">
        <div>
          <p className="kicker">Base técnica</p>
          <h2>Capacidades listas para un entorno de seguridad moderno.</h2>
        </div>
        <div className="skillCloud" aria-label="Habilidades tecnicas">
          {capabilities.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="section learning">
        <div className="sectionIntro">
          <p className="kicker">Formacion</p>
          <h2>Aprendizaje continuo con foco en ciberseguridad e ingeniería.</h2>
        </div>
        <ul className="educationList">
          {education.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CareerChat />

      <section className="closing">
        <div>
          <p className="signal">Disponible para conversaciones tecnicas</p>
          <h2>Busco aportar en equipos que necesiten seguridad, automatización y criterio operativo.</h2>
        </div>
        <div className="closingActions">
          <a className="button primary" href="mailto:pablo521@hotmail.com">
            Escribir a Pablo
          </a>
          <a className="button secondary" href="https://github.com/pabloios" target="_blank" rel="noreferrer">
            Revisar GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
