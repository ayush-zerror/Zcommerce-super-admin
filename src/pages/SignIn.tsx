import { addToast, Button, Input } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export function SignIn() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const ok = signIn(email, password);
    setSubmitting(false);
    if (!ok) {
      addToast({
        title: "Missing credentials",
        description: "Enter an email and password to continue.",
        color: "danger",
      });
      return;
    }
    addToast({
      title: "Signed in",
      description: "Welcome back to Zcommerce Admin.",
      color: "success",
    });
    navigate("/", { replace: true });
  };

  const inputClassNames = {
    input: "text-[13px] !text-zinc-100 placeholder:text-zinc-600",
    inputWrapper:
      "bg-zinc-900/80 border-zinc-800/90 shadow-none h-10 data-[hover=true]:bg-zinc-900 data-[hover=true]:border-zinc-700 group-data-[focus=true]:border-zinc-500 transition-colors",
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]"
      />

      <header className="relative z-10 flex h-14 shrink-0 items-center px-4 sm:px-6">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold tracking-[0.14em] text-white sm:text-base">
            ZCOMMERCE
          </span>
          <span className="text-[11px] font-medium text-white/60">
            Super admin panel
          </span>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-4">
        <div className="w-full max-w-[360px]">
          <div className="mb-7">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Sign in
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
              Access your workspace with your admin credentials.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signin-email"
                className="text-[12px] font-medium text-zinc-400"
              >
                Email
              </label>
              <Input
                id="signin-email"
                aria-label="Email"
                type="email"
                placeholder="you@company.com"
                variant="bordered"
                radius="md"
                value={email}
                onValueChange={setEmail}
                isRequired
                autoComplete="email"
                classNames={inputClassNames}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="signin-password"
                  className="text-[12px] font-medium text-zinc-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                  onClick={() =>
                    addToast({
                      title: "Contact your admin",
                      description:
                        "Password reset is handled by your workspace owner.",
                      color: "primary",
                    })
                  }
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="signin-password"
                aria-label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                variant="bordered"
                radius="md"
                value={password}
                onValueChange={setPassword}
                isRequired
                autoComplete="current-password"
                endContent={
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-zinc-500 transition-colors hover:text-zinc-300"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash size={15} />
                    ) : (
                      <HiOutlineEye size={15} />
                    )}
                  </button>
                }
                classNames={inputClassNames}
              />
            </div>

            <Button
              type="submit"
              radius="md"
              className="mt-1 h-10 w-full bg-white text-[13px] font-semibold text-zinc-950 data-[hover=true]:bg-zinc-200"
              isLoading={submitting}
              spinner={
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-950/20 border-t-zinc-950" />
              }
            >
              Continue
            </Button>
          </form>
        </div>
      </div>

      <p className="relative z-10 pb-6 text-center text-[11px] text-zinc-600">
        © {new Date().getFullYear()} Zcommerce ·{" "}
        <a
          href="https://www.zerrorstudios.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-white hover:underline"
        >
          Zerror Studios
        </a>
      </p>
    </div>
  );
}
