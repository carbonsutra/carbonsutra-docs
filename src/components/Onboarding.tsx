import { FormEvent, useState } from "react";

const API_URL = `${import.meta.env.ZUDOKU_PUBLIC_API_URL}api/v1/register_user`;

export default function Onboarding() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.message || "Unable to create your account. Please try again.",
        );
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch {
      setError("Unable to connect to CarbonSutra. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="not-prose w-full">
      <div className="mx-auto flex min-h-[65vh] w-full items-center justify-center px-4 py-8">
        {!success ? (
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="px-6 py-4 sm:px-8">
              <div className="text-center">
                <h1 className="!m-0 !text-2xl !font-semibold !leading-tight !tracking-tight text-foreground">
                  Create your account
                </h1>

                <p className="!mt-2.5 !mb-0 text-sm leading-6 text-muted-foreground">
                  Get your API token and start using the CarbonSutra Playground.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    autoFocus
                    disabled={loading}
                    className="!m-0 h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="!my-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-sm leading-5 text-destructive"
                  >
                    {error}
                  </div>
                )}
                <div className="!m-0 flex w-full justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold !text-white no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/90 hover:shadow-lg dark:bg-white dark:!text-black dark:hover:bg-white/90"
                  >
                    {loading ? (
                      <span className="!m-0 !flex !items-center !gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="">Continue</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-border pt-6 text-center">
                <p className="!m-0 text-sm font-medium text-foreground">
                  100 free API requests
                </p>

                <p className="!mt-1 !mb-0 text-xs leading-5 text-muted-foreground">
                  Your API token will be sent to your email.
                </p>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4">
              <p className="!m-0 text-center text-xs text-muted-foreground">
                Already have an API token?{" "}
                <a
                  href="/api-playground"
                  className="font-medium text-foreground no-underline hover:underline"
                >
                  Open Playground
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="px-6 py-10 text-center sm:px-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5L9.5 17L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 dark:text-green-400"
                  />
                </svg>
              </div>

              <h1 className="!mt-5 !mb-0 !text-2xl !font-semibold !leading-tight !tracking-tight text-foreground">
                Check your email
              </h1>

              <p className="!mt-2.5 !mb-0 text-sm leading-6 text-muted-foreground">
                Your CarbonSutra API token has been sent to your email address.
              </p>

              <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4 text-left">
                <p className="!m-0 text-sm font-medium text-foreground">
                  What's next?
                </p>

                <div className="mt-3 space-y-2.5">
                  <div className="flex gap-3 text-sm">
                    <span className="shrink-0 text-muted-foreground">1.</span>
                    <span className="text-muted-foreground">
                      Check your inbox for the CarbonSutra email.
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <span className="shrink-0 text-muted-foreground">2.</span>
                    <span className="text-muted-foreground">
                      Copy your API token.
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <span className="shrink-0 text-muted-foreground">3.</span>
                    <span className="text-muted-foreground">
                      Open the Playground and start testing.
                    </span>
                  </div>
                </div>
              </div>

              <a
                href="/api-playground"
                className="mt-6 flex h-11 w-full items-center justify-center rounded-lg border border-black/10 bg-white/50 px-4 text-sm font-medium !text-foreground no-underline shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-xl hover:shadow-black/10 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15 dark:hover:shadow-white/5"
              >
                Open API Playground
              </a>

              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setError("");
                }}
                className="mt-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Use another email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
