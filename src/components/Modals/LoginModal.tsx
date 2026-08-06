import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { validateField } from "../../utils/validation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setErrors({});
    setGeneralError("");
    onClose();
  };

  // Обработка изменения полей
  const handleFieldChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    else setPassword(value);

    if (generalError) setGeneralError(""); // Сбрасываем общую ошибку
    setErrors((prev) => ({ ...prev, [field]: undefined })); // Сбрасываем ошибку поля при вводе
  };

  // Обработка blur (пользователь вышел из поля)
  const handleBlur = (field: "email" | "password", value: string) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидируем все поля
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError || passwordError) {
      setErrors({ email: emailError || undefined, password: passwordError || undefined });

      if (emailError && emailInputRef.current) {
        // Фокусируемся на первом поле с ошибкой
        emailInputRef.current.focus();
      } else if (passwordError && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      await login(email, password);
      onClose();
      // Очищаем форму
      setEmail("");
      setPassword("");
      setErrors({});
    } catch {
      setGeneralError("Неверный email или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  // Закрытие по клику на оверлей
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal--login" id="login-modal" hidden>
      <div className="modal__overlay" onClick={handleOverlayClick}></div>
      <div className="modal__container">
        <button className="modal__close-btn" type="button" aria-label="Закрыть" onClick={handleClose}>
          <svg width="18" height="18" viewBox="0 0 13 13">
            <use href="/img/sprite.svg#close"></use>
          </svg>
        </button>
        <div className="modal__content">
          <div className="modal__logo">
            <img className="modal__logo-img" src="/img/logo.png" alt="логотип ВК Маруся" />
            <svg className="modal__logo-title" width="100" height="21" viewBox="0 0 100 21">
              <use href="/img/sprite.svg#logo-title"></use>
            </svg>
          </div>
          <form className="modal__form" id="login-form" onSubmit={handleSubmit}>
            <div className="modal__field-group">
              <svg className="modal__input-icon" width="24" height="24" viewBox="0 0 24 24">
                <use href="/img/sprite.svg#mail"></use>
              </svg>
              <input
                ref={emailInputRef}
                className={`modal__input ${errors.email ? "modal__input--error" : ""}`}
                type="email"
                id="login-email"
                name="email"
                placeholder="Электронная почта"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                disabled={isLoading}
                title={errors.email || ""}
              />
            </div>
            <div className="modal__field-group">
              <svg className="modal__input-icon" width="24" height="24" viewBox="0 0 24 24">
                <use href="/img/sprite.svg#key"></use>
              </svg>
              <input
                ref={passwordInputRef}
                className={`modal__input ${errors.password ? "modal__input--error" : ""}`}
                type="password"
                id="login-password"
                name="password"
                placeholder="Пароль"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                disabled={isLoading}
                title={errors.password || ""}
              />
            </div>
            <button className="modal__submit-btn btn btn--primary" type="submit" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>
          <button
            className="modal__login-link"
            id="switch-to-register"
            type="button"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Регистрация
          </button>
        </div>
      </div>
    </div>
  );
}
