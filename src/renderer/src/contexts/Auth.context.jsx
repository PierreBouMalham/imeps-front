import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import useApi from "../hooks/useApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const loginApi = useApi({ action: "login", entity: "auth" });
  const forgotPasswordApi = useApi({
    action: "forgot password",
    entity: "auth",
  });
  const resetPasswordApi = useApi({ action: "reset password", entity: "auth" });
  // const recaptchaApi = useApi({ action: "recaptcha", entity: "auth" });
  const userApi = useApi({ action: "read me", entity: "user" });

  const verifyRecaptcha = async () => {
    return true;
    /* const captchaValue = await recaptchaRef.current.executeAsync();
    if (!captchaValue) {
      alert("Please verify the reCAPTCHA!");
      return false;
    } else {
      const response = await recaptchaApi.call({
        body: { captchaValue },
        disableToast: true,
      });
      if (!response.ok || !response.data.success) {
        alert("Please verify the reCAPTCHA!");
        return false;
      }
    }
    return true;*/
  };

  const login = async (credentials) => {
    const verified = await verifyRecaptcha();
    if (!verified) return;

    const response = await loginApi.call({
      body: credentials,
      disableToast: true,
    });
    if (response.ok) {
      localStorage.setItem("token", response.data);

      await fetchUser();
      navigate("/");
    }

    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const forgotPassword = async (credentials) => {
    const verified = await verifyRecaptcha();
    if (!verified) return;
    const response = await forgotPasswordApi.call({
      body: credentials,
      disableToast: true,
    });

    return response;
  };

  const resetPassword = async (credentials) => {
    const verified = await verifyRecaptcha();
    if (!verified) return;
    const response = await resetPasswordApi.call({
      body: credentials,
      disableToast: true,
    });

    return response;
  };

  const fetchUser = async () => {
    setLoading(true);
    const response = await userApi.call({});
    if (response.ok) {
      setUser(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      setUser(event.detail.user);
    };

    window.addEventListener("user", handleMessage);

    return () => {
      window.removeEventListener("user", handleMessage);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        recaptchaRef,
        permissions:
          user?.role?.permissions?.map?.((permission) =>
            permission.name.replace("get", "read").replace("update", "edit")
          ) || [],
        login,
        logout,
        forgotPassword,
        resetPassword,
        loading:
          //recaptchaApi.loading ||
          resetPasswordApi.loading ||
          forgotPasswordApi.loading ||
          loginApi.loading ||
          userApi.loading ||
          loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    //throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
