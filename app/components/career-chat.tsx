"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickQuestions = [
  "¿Cuál es el perfil profesional de Pablo?",
  "¿Qué experiencia tiene en ciberseguridad?",
  "¿Por qué puede aportar en un equipo SOC?"
];

export default function CareerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Soy el gemelo digital profesional de Pablo. Puedo responder sobre su carrera, experiencia, habilidades, formación y encaje para roles junior de ciberseguridad, SOC, automatización y agentic engineering."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const canSubmit = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages.slice(-8)
        })
      });

      const data = (await response.json()) as { message?: string; error?: string };

      const assistantMessage = data.message;

      if (!response.ok || !assistantMessage) {
        throw new Error(data.error || "No se pudo obtener una respuesta.");
      }

      setMessages((current) => [...current, { role: "assistant", content: assistantMessage }]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Ocurrió un problema al conectar con el gemelo digital."
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  return (
    <section className="chatSection" id="gemelo-ia" aria-labelledby="chat-title">
      <div className="chatIntro">
        <p className="kicker">Gemelo digital</p>
        <h2 id="chat-title">Pregúntale a la IA sobre mi carrera.</h2>
        <p>
          Este chat usa OpenRouter y responde con contexto de mi CV, LinkedIn y trayectoria
          profesional. Está pensado para reclutadores, líderes técnicos y equipos de seguridad.
        </p>
      </div>

      <div className="chatShell">
        <div className="chatHeader">
          <div>
            <span className="statusDot" aria-hidden="true" />
            <strong>Pablo AI</strong>
          </div>
          <span>openai/gpt-oss-120b</span>
        </div>

        <div className="quickQuestions" aria-label="Preguntas sugeridas">
          {quickQuestions.map((question) => (
            <button
              type="button"
              key={question}
              onClick={() => void submitQuestion(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>

        <div className="messages" aria-live="polite" aria-label="Conversación con gemelo digital">
          {messages.map((message, index) => (
            <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role === "assistant" ? "Pablo AI" : "Tú"}</span>
              <p>{message.content}</p>
            </article>
          ))}
          {isLoading ? (
            <article className="message assistant thinking">
              <span>Pablo AI</span>
              <p>Analizando la trayectoria profesional...</p>
            </article>
          ) : null}
        </div>

        {error ? <p className="chatError">{error}</p> : null}

        <form className="chatForm" onSubmit={handleSubmit}>
          <label htmlFor="career-question">Pregunta sobre Pablo</label>
          <div>
            <input
              id="career-question"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ej. ¿Qué fortalezas tiene para un rol SOC junior?"
              maxLength={320}
            />
            <button type="submit" disabled={!canSubmit}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
