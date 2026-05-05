import AuthWrapper from "../../../../../features/auth/components/AuthWrapper"
import BasicInfoForm from "../../../../../features/auth/components/BasicInfoForm"
import Stepper from "../../../../../features/auth/components/Stepper"

function page() {
    return (
        <div>
            <AuthWrapper src={"/images/features/auth/basic-info.png"} alt={"basic user information background image"}>
            <Stepper currentStep={1} />
           <BasicInfoForm />
            </AuthWrapper>
        </div>
    )
}

export default page
