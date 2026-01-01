import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import LoginForm from "../../components/auth/LoginForm";
import { useState } from "react";

export default function SignIn() {
  const [title, setTitle] = useState("Sign In");
  const [description, setDescription] = useState("Enter your email and password to sign in!");
  return (
    <>
      <PageMeta
        title={title}
        description={description}
      />
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
}
