import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn forceRedirectUrl="/sync-user" fallbackRedirectUrl="/sync-user" />
    </div>
  );
}
