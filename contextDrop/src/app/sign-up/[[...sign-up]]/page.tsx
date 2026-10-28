import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp forceRedirectUrl="/sync-user" fallbackRedirectUrl="/sync-user" />
    </div>
  );
}
