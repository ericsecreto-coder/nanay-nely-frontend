"use client";

import { FormEvent, useState, useTransition } from "react";
import { submitContactMessageAction } from "@/app/actions/contact";
import { useToast } from "@/components/ui/toast-provider";

type Props = {
  defaultName?: string;
  defaultEmail?: string;
};

export function ContactForm({ defaultName = "", defaultEmail = "" }: Props) {
  const { showToast } = useToast();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await submitContactMessageAction({ name, email, message });

      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      showToast("Message sent! We'll get back to you soon.", "success");
      setMessage("");
      if (!defaultName) setName("");
      if (!defaultEmail) setEmail("");
    });
  }

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <div className="fg">
        <label className="fl" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          className="fi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          disabled={isPending}
        />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          className="fi"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          disabled={isPending}
        />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          className="fi"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          required
          disabled={isPending}
        />
      </div>
      <button type="submit" className="btn btn-amber" disabled={isPending}>
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
