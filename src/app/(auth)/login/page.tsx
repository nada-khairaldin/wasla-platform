import LoginForm from "../../../features/auth/components/LoginForm";
import AuthWrapper from './../../../features/auth/components/AuthWrapper';

function Page() {
  return (
  <AuthWrapper src={"/images/features/auth/login-bg.png"} alt={"Login background image"}>
    <LoginForm />
  </AuthWrapper>
  );
}

export default Page;
