import { SignUpPanel } from "@/components/auth/sign-up-panel";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <div className="section-padding">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md">
          <SignUpPanel />
        </div>
      </div>
    </div>
  );
}
