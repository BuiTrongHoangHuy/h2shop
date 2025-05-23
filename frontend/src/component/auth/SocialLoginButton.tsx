type Props = {
    type: "google" | "facebook";
    disabled?: boolean;
};

export default function SocialLoginButton({ type, disabled = false }: Props) {
    const isGoogle = type === "google";
    const label = isGoogle ? "Continue with Google" : "Continue with Facebook";
    const iconSrc = isGoogle ? "/assets/icon/google.svg" : "/assets/icon/facebook.svg";

    return (
        <button disabled={disabled} className="w-full h-12 border border-gray-500 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
            <img src={iconSrc} alt={type} className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </button>
    );
}