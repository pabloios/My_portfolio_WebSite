import CareerChat from "./components/career-chat";
import HeroOrbit from "./components/hero-orbit";
import SiteNav from "./components/site-nav";
import {
  FadeIn,
  MotionLink,
  ScrollWords,
  Stagger
} from "./components/motion-primitives";

const domains = [
  {
    title: "Software empresarial",
    text:
      "Diseño interfaces, flujos y automatizaciones para operaciones internas: CRM, control horario, QA, tableros y procesos con trazabilidad.",
    points: ["Next.js", "React", "TypeScript", "Supabase", "Prisma", "QA funcional"]
  },
  {
    title: "Soluciones IA",
    text:
      "Construyo asistentes, prototipos agentic y productos con modelos de lenguaje para soporte, ventas, documentación y generación de UI.",
    points: ["OpenRouter", "Vercel AI SDK", "Anthropic", "n8n", "chatbots", "automatización"]
  },
  {
    title: "Ciberseguridad",
    text:
      "Aplico mentalidad SOC: análisis de logs, fundamentos SIEM, respuesta ante incidentes, networking y documentación operativa.",
    points: ["SOC junior", "SIEM", "logs", "IOC", "TCP/IP", "cloud security"]
  }
];

const projects = [
  {
    name: "Agencia IA Ecuador",
    type: "Producto IA / Automatización",
    description:
      "Base de servicios con Next.js, Supabase, Clerk, n8n, WhatsApp, pagos y flujos IA para productos empresariales.",
    stack: "Next.js · Supabase · Clerk · Anthropic · n8n · Stripe"
  },
  {
    name: "Chatbot Restaurante",
    type: "Asistente comercial",
    description:
      "Chatbot orientado a atención, pedidos y automatización de conversaciones para negocios de comida.",
    stack: "Next.js · TypeScript · Playwright · WhatsApp-ready"
  },
  {
    name: "UI Generator",
    type: "Herramienta agentic",
    description:
      "Generador de interfaces con editor, autenticación, base de datos y flujo de IA para acelerar prototipos funcionales.",
    stack: "Next.js · Prisma · Monaco · AI SDK · Vitest"
  },
  {
    name: "WorkTime Tracker",
    type: "Software empresarial",
    description:
      "Aplicación de control horario y visualización operativa para registrar tiempos, revisar métricas y apoyar decisiones.",
    stack: "Vite · Chart.js · JavaScript"
  }
];

const experience = [
  {
    period: "2026 - Actual",
    role: "Desarrollo de Automatizaciones",
    company: "Alfanet S.A.",
    detail:
      "Automatización de procesos CRM, validación de datos de entrada, investigación QA en Jira y mejora de flujos operativos."
  },
  {
    period: "2023 - 2025",
    role: "Operations Manager",
    company: "Empresa de Importación y Distribución",
    detail:
      "Gestión de operaciones, sistemas digitales, análisis de datos y optimización de procesos logísticos en Melbourne."
  },
  {
    period: "2019 - 2021",
    role: "Software Tester",
    company: "UTest",
    detail:
      "Ejecución de casos funcionales, documentación de incidencias y colaboración con equipos de desarrollo."
  },
  {
    period: "2016 - 2018",
    role: "Operaciones en Logística Internacional",
    company: "Repcontver S.A.",
    detail:
      "Coordinación de envíos, documentación aduanera, control de inventarios y seguimiento de procesos críticos."
  }
];

const credentials = [
  "Ingeniería Informática, UNIR",
  "Advanced Diploma in Cybersecurity, Laneway Education",
  "Google Cybersecurity Professional Certificate",
  "Ingeniería en Telemática, ESPOL",
  "Desarrollo iOS y SwiftUI",
  "Español nativo · Inglés C1 · Alemán B1"
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="intro-title">
        <HeroOrbit />
        <SiteNav />

        <div className="heroStage" id="top">
          <div className="heroCopy">
            <FadeIn delay={0.15}>
              <p className="eyeline">Desarrollador de software empresarial, soluciones IA y ciberseguridad</p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <h1 id="intro-title">Sistemas inteligentes para operaciones que no pueden fallar.</h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="lead">
                Soy Pablo José Sarmiento Moreno. Construyo software empresarial, automatizaciones,
                asistentes IA y experiencias digitales con criterio operativo, enfoque en seguridad y
                capacidad para convertir procesos complejos en productos claros.
              </p>
            </FadeIn>
            <FadeIn delay={0.55}>
              <div className="actions" aria-label="Acciones principales">
                <MotionLink href="mailto:pablo521@hotmail.com">Contactar</MotionLink>
                <MotionLink variant="secondary" href="/docs/Pablo_Sarmiento_CV_ES.pdf" target="_blank">
                  Ver CV
                </MotionLink>
                <MotionLink variant="ghost" href="https://github.com/pabloios" target="_blank" rel="noreferrer">
                  GitHub
                </MotionLink>
              </div>
            </FadeIn>
          </div>

          <FadeIn className="heroFrameSlot" delay={0.35} y={56}>
            <div className="motionFrame" aria-label="Resumen visual del perfil">
              <div className="deviceChrome">
                <span />
                <span />
                <span />
              </div>
              <div className="profileScene">
                <div className="portraitCard">
                  <img src="/assets/pablo-profile.jpg" alt="Retrato profesional de Pablo José Sarmiento Moreno" />
                  <div>
                    <strong>Pablo José Sarmiento Moreno</strong>
                    <span>Machala, Ecuador</span>
                  </div>
                </div>
                <div className="signalStack" aria-hidden="true">
                  <span>CRM automation</span>
                  <span>AI assistants</span>
                  <span>SOC readiness</span>
                </div>
                <div className="consolePanel" aria-hidden="true">
                  <code>deploy: enterprise_workflow</code>
                  <code>scan: logs + ioc + qa</code>
                  <code>agent: business_ai_online</code>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
        <div className="scrollCue" aria-hidden="true">
          <span />
        </div>
      </section>

      <div className="transitionDeck" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <section className="introBand" aria-label="Resumen profesional">
        <ScrollWords text="Mi diferencial está en unir tres mundos: la disciplina de operaciones reales, el desarrollo de software moderno y la mentalidad de seguridad que exige revisar, validar y documentar." />
      </section>

      <section className="section domains" id="especialidades" aria-labelledby="domains-title">
        <div className="sectionHeader">
          <FadeIn>
            <h2 id="domains-title">Tres líneas técnicas, una misma forma de resolver.</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              Desarrollo soluciones que sirven a empresas: rápidas de usar, bien estructuradas y listas
              para crecer con procesos, datos e IA.
            </p>
          </FadeIn>
        </div>
        <Stagger className="domainGrid" step={0.14}>
          {domains.map((domain) => (
            <article className="domainPanel" key={domain.title}>
              <h3>{domain.title}</h3>
              <p>{domain.text}</p>
              <ul>
                {domain.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </Stagger>
      </section>

      <section className="showcase" id="proyectos" aria-labelledby="projects-title">
        <div className="sectionHeader">
          <FadeIn>
            <h2 id="projects-title">Proyectos y laboratorios de trabajo.</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              Una selección desde mis carpetas locales y repositorios: productos IA, herramientas
              empresariales, automatizaciones y prototipos con intención de producto.
            </p>
          </FadeIn>
        </div>
        <Stagger className="projectRail" step={0.12} y={44}>
          {projects.map((project, index) => (
            <article className="projectCard" key={project.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{project.type}</p>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <small>{project.stack}</small>
            </article>
          ))}
        </Stagger>
      </section>

      <section className="section narrative" id="trayectoria">
        <div className="stickyCopy">
          <FadeIn>
            <h2>Experiencia construida en procesos donde el detalle importa.</h2>
            <p>
              Antes del código hubo operaciones, logística, QA y mejora continua. Esa base me permite
              pensar el software como una herramienta para reducir fricción, controlar riesgo y dar
              visibilidad al negocio.
            </p>
          </FadeIn>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <FadeIn key={`${item.company}-${item.period}`} y={40} amount={0.35}>
              <article className="timelineItem">
                <time>{item.period}</time>
                <div>
                  <h3>{item.role}</h3>
                  <p className="company">{item.company}</p>
                  <p>{item.detail}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="learning" aria-labelledby="learning-title">
        <div>
          <FadeIn>
            <h2 id="learning-title">Formación técnica y aprendizaje continuo.</h2>
            <p>
              Una base académica y práctica orientada a ingeniería, ciberseguridad, QA, cloud y
              productos digitales modernos.
            </p>
          </FadeIn>
        </div>
        <Stagger as="ul" itemAs="li" className="educationList" step={0.09} y={24}>
          {credentials.map((item) => (
            <span key={item} className="educationItem">
              {item}
            </span>
          ))}
        </Stagger>
      </section>

      <CareerChat />

      <section className="closing">
        <div>
          <FadeIn>
            <h2>Hablemos de software, IA o seguridad con impacto real.</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              Estoy disponible para roles, colaboraciones y proyectos donde haga falta construir con
              velocidad, claridad técnica y responsabilidad operativa.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.25}>
          <div className="closingActions">
            <MotionLink href="mailto:pablo521@hotmail.com">Escribir a Pablo</MotionLink>
            <MotionLink
              variant="secondary"
              href="https://linkedin.com/in/pablo-jos%C3%A9-sarmiento-moreno-7041b0119"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </MotionLink>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
