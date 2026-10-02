import { addToast, Button, Input } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { Link, Navigate, useNavigate } from "react-router-dom";
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

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-white lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-black lg:block">
        <img
          src="/signin.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-left"
        />
      </aside>

      <main className="relative flex min-h-dvh flex-col px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#1e293b] sm:text-3xl">
            Yooo, welcome back!
          </h1>
          <p className="mt-1.5 text-xs text-default-500 sm:text-sm">
            Sign in to access your dashboard
          </p>

          <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              variant="underlined"
              value={email}
              onValueChange={setEmail}
              isRequired
              autoComplete="email"
              classNames={{
                label: "text-default-500",
                input: "text-foreground",
                inputWrapper:
                  "border-b border-default-300 shadow-none after:!bg-primary",
              }}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="underlined"
              value={password}
              onValueChange={setPassword}
              isRequired
              autoComplete="current-password"
              endContent={
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-default-400 transition-colors hover:text-default-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash size={18} />
                  ) : (
                    <HiOutlineEye size={18} />
                  )}
                </button>
              }
              classNames={{
                label: "text-default-500",
                input: "text-foreground",
                inputWrapper:
                  "border-b border-default-300 shadow-none after:!bg-primary",
              }}
            />

            <Button
              type="submit"
              color="primary"
              radius="lg"
              size="sm"
              className="h-10 w-full text-sm font-semibold"
              isLoading={submitting}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-default-500">
            You acknowledge that you have read and agreed to our{" "}
            <Link to="#" className="font-medium text-foreground underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="font-medium text-foreground underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-foreground">
          Developed by <span className="font-semibold">Zerror Studios</span>
        </p>
      </main>
    </div>
  );
}
