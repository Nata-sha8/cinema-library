import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { validateField } from "../../utils/validation";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

interface RegisterErrors {
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  confirmPassword?: string;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onSuccess }: RegisterModalProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const surnameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  // Сброс ошибок при открытии/закрытии
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setGeneralError("");
    }
  }, [isOpen]);

  // Обработка изменения полей
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (generalError) setGeneralError(""); // Сбрасываем общую ошибку
    setErrors((prev) => ({ ...prev, [field]: undefined })); // Сбрасываем ошибку поля при вводе

    // Если меняется пароль, проверяем подтверждение
    if (field === "password" && formData.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError || undefined }));
    }
  };

  // Обработка blur (пользователь вышел из поля)
  const handleBlur = (field: keyof typeof formData, value: string) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Валидируем все поля
    const emailError = validateField("email", formData.email);
    const nameError = validateField("name", formData.name);
    const surnameError = validateField("surname", formData.surname);
    const passwordError = validateField("password", formData.password);
    const confirmError = validateField("confirmPassword", formData.confirmPassword);

    if (emailError || nameError || surnameError || passwordError || confirmError) {
      setErrors({
        email: emailError || undefined,
        name: nameError || undefined,
        surname: surnameError || undefined,
        password: passwordError || undefined,
        confirmPassword: confirmError || undefined,
      });

      // Фокусируемся на первом поле с ошибкой
      if (emailError && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (nameError && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (surnameError && surnameInputRef.current) {
        surnameInputRef.current.focus();
      } else if (passwordError && passwordInputRef.current) {
        passwordInputRef.current.focus();
      } else if (confirmError && confirmPasswordInputRef.current) {
        confirmPasswordInputRef.current.focus();
      }
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
      });
      onSuccess();
      onClose();
      // Очищаем форму
      setFormData({
        email: "",
        password: "",
        name: "",
        surname: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      setGeneralError("Ошибка регистрации. Возможно, пользователь с таким email уже существует.");
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
    <div className="modal modal--register" id="register-modal" hidden>
      <div className="modal__overlay" onClick={handleOverlayClick}></div>
      <div className="modal__container">
        <button className="modal__close-btn" type="button" aria-label="Закрыть" onClick={onClose}>
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
          <h2 className="modal__title">Регистрация</h2>
          <form className="modal__form" id="register-form" onSubmit={handleSubmit}>
            <div className="modal__field-group">
              <svg className="modal__input-icon" width="24" height="24" viewBox="0 0 24 24">
                <use href="/img/sprite.svg#mail"></use>
              </svg>
              <input
                ref={emailInputRef}
                className={`modal__input ${errors.email ? "modal__input--error" : ""}`}
                type="email"
                id="register-email"
                name="email"
                placeholder="Электронная почта"
                autoComplete="username"
                required
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                disabled={isLoading}
                title={errors.email || ""}
              />
            </div>
            <div className="modal__field-group">
              <svg className="modal__input-icon" width="24" height="24" viewBox="0 0 24 24">
                <use href="/img/sprite.svg#user"></use>
              </svg>
              <input
                ref={nameInputRef}
                className={`modal__input ${errors.name ? "modal__input--error" : ""}`}
                type="text"
                id="register-first-name"
                name="first-name"
                placeholder="Имя"
                autoComplete="given-name"
                required
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={(e) => handleBlur("name", e.target.value)}
                disabled={isLoading}
                title={errors.name || ""}
              />
            </div>
            <div className="modal__field-group">
              <svg className="modal__input-icon" width="24" height="24" viewBox="0 0 24 24">
                <use href="/img/sprite.svg#user"></use>
              </svg>
              <input
                ref={surnameInputRef}
                className={`modal__input ${errors.surname ? "modal__input--error" : ""}`}
                type="text"
                id="register-last-name"
                name="last-name"
                placeholder="Фамилия"
                autoComplete="family-name"
                required
                value={formData.surname}
                onChange={(e) => handleFieldChange("surname", e.target.value)}
                onBlur={(e) => handleBlur("surname", e.target.value)}
                disabled={isLoading}
                title={errors.surname || ""}
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
                id="register-password"
                name="password"
                placeholder="Пароль"
                autoComplete="new-password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                disabled={isLoading}
                title={errors.password || ""}
              />
            </div>
            <div className="modal__field-group">
              <svg className="modal__input-icon" width="24" height="24" viewBox="0 0 24 24">
                <use href="/img/sprite.svg#key"></use>
              </svg>
              <input
                ref={confirmPasswordInputRef}
                className={`modal__input ${errors.confirmPassword ? "modal__input--error" : ""}`}
                type="password"
                id="register-confirm-pass"
                name="confirm-pass"
                autoComplete="new-password"
                placeholder="Подтвердите пароль"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                disabled={isLoading}
                title={errors.confirmPassword || ""}
              />
            </div>
            <button className="modal__submit-btn btn btn--primary" type="submit" disabled={isLoading}>
              {isLoading ? "Создание..." : "Создать аккаунт"}
            </button>
          </form>
          <button
            className="modal__login-link"
            id="switch-to-login"
            type="button"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            У меня есть пароль
          </button>
        </div>
      </div>
    </div>
  );
}
