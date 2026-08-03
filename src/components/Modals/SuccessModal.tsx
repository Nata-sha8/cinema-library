interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function SuccessModal({ isOpen, onClose, onLogin }: SuccessModalProps) {
  if (!isOpen) return null;

   const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal modal--success" id="registration-successful" hidden>
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
          <h2 className="modal__title">Регистрация завершена</h2>
          <p className="modal__text">Используйте вашу электронную почту для входа</p>
          <button className="modal__submit-btn btn btn--primary" type="button" onClick={onLogin}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
