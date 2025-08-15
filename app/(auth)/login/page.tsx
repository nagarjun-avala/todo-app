import { Suspense } from "react";
import { LoginForm } from "./_componenets/login-form";
import { Loader } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div><Loader className="animate-spin" /> Loading</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
