"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "./motion-primitives";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickQuestions = [
  "¿Qué soluciones empresariales desarrolla Pablo?",
  "¿Qué experiencia tiene en IA y automatización?",
  "¿Por qué puede aportar en ciberseguridad?"
];

export default function CareerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Soy el gemelo digital profesional de Pablo. Puedo responder sobre su carrera, proyectos, software empresarial, soluciones IA, automatización, formación y enfoque en ciberseguridad."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const canSubmit = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  useEffect(() => {
    const node = messagesRef.current;

    if (node) {
      node.scrollTo({ top: node.scrollHeight, behavior: reduced ? "auto" : "smooth" });
    }
  }, [messages, isLoading, reduced]);

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
        <motion.h2
          id="chat-title"
          initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE_OUT }}
        >
          Un gemelo IA para explorar mi perfil.
        </motion.h2>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.12, ease: EASE_OUT }}
        >
          Este chat responde con contexto de mi trayectoria, capacidades técnicas y proyectos. Está
          pensado para reclutadores, líderes técnicos, equipos de producto y áreas de seguridad.
        </motion.p>
      </div>

      <motion.div
        className="chatShell"
        initial={reduced ? false : { opacity: 0, y: 56, scale: 0.97, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <div className="chatHeader">
          <div>
            <span className="statusDot" aria-hidden="true" />
            <strong>Pablo AI</strong>
          </div>
          <span>openai/gpt-oss-120b</span>
        </div>

        <div className="quickQuestions" aria-label="Preguntas sugeridas">
          {quickQuestions.map((question, index) => (
            <motion.button
              type="button"
              key={question}
              onClick={() => void submitQuestion(question)}
              disabled={isLoading}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.08, ease: EASE_OUT }}
              whileHover={isLoading ? undefined : { y: -2 }}
              whileTap={isLoading ? undefined : { scale: 0.95 }}
            >
              {question}
            </motion.button>
          ))}
        </div>

        <div className="messages" ref={messagesRef} aria-live="polite" aria-label="Conversación con gemelo digital">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.article
                className={`message ${message.role}`}
                key={`${message.role}-${index}`}
                initial={reduced ? false : { opacity: 0, y: 18, scale: 0.96, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
              >
                <span>{message.role === "assistant" ? "Pablo AI" : "Tú"}</span>
                <p>{message.content}</p>
              </motion.article>
            ))}
            {isLoading ? (
              <motion.article
                className="message assistant thinking"
                key="thinking"
                initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
              >
                <span>Pablo AI</span>
                <p className="thinkingDots" aria-label="Generando respuesta">
                  <motion.span
                    animate={reduced ? undefined : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    animate={reduced ? undefined : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                  />
                  <motion.span
                    animate={reduced ? undefined : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                </p>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error ? (
            <motion.p
              className="chatError"
              key="chat-error"
              initial={reduced ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              role="alert"
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>

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
            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileHover={canSubmit ? { scale: 1.04 } : undefined}
              whileTap={canSubmit ? { scale: 0.94 } : undefined}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              Enviar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
