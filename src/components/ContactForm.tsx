"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    console.log("CONTACT FORM CLICKED");

    if (status === "loading") return;

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanCompany = company.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setStatus("error");
      setError("Please complete all required fields.");
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    console.log("Web3Forms key:", accessKey ? "FOUND" : "MISSING");

    if (!accessKey) {
      setStatus("error");
      setError("Contact form configuration is missing.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      console.log("Sending contact form...");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "New CarbonSutra Contact Form Submission",
          from_name: "CarbonSutra Website",
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          message: cleanMessage,
          replyto: cleanEmail,
        }),
      });

      const data = await response.json();

      console.log("Web3Forms response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send your message.");
      }

      console.log("CONTACT FORM SUCCESS");

      setStatus("success");

      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch (err) {
      console.error("CONTACT FORM ERROR:", err);

      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send your message. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-xl text-green-600">
          ✓
        </div>

        <h3 className="mt-4 text-xl font-semibold">
          Message sent successfully
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Thanks for reaching out. Our team will get back to you shortly.
        </p>

        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setError("");
          }}
          className="mt-6 text-sm font-medium underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border bg-card p-6 shadow-sm md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-medium"
          >
            Name
          </label>

          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            maxLength={100}
            className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-sm font-medium"
          >
            Email
          </label>

          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            maxLength={200}
            className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="contact-company"
            className="mb-2 block text-sm font-medium"
          >
            Company
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </label>

          <input
            id="contact-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            autoComplete="organization"
            maxLength={150}
            className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="contact-message"
            className="mb-2 block text-sm font-medium"
          >
            Message
          </label>

          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            maxLength={5000}
            placeholder="Tell us how we can help..."
            className="w-full resize-none rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          We’ll only use your details to respond to your enquiry.
        </p>

        <button
          type="button"
          // onClick={handleSubmit}
          onClick={() => {
            alert("hi");
          }}
          disabled={status === "loading"}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Send message"}
        </button>
      </div>
    </div>
  );
}
