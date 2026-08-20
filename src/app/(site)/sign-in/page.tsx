import { SignInPanel } from "@/components/auth/sign-in-panel";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="section-padding">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md">
          <SignInPanel />
        </div>
      </div>
    </div>
  );
}
