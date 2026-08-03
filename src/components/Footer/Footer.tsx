export default function Footer() {
  return (
    <footer className="footer container">
      <div className="footer__social">
        <a href="https://vk.com" className="footer__link" target="_blank" rel="noopener noreferrer">
          <svg className="footer__social-icon" width="19" height="11" viewBox="0 0 19 11">
            <use href="/img/sprite.svg#vk"></use>
          </svg>
        </a>
        <a href="https://youtube.com" className="footer__link" target="_blank" rel="noopener noreferrer">
          <svg className="footer__social-icon" width="16" height="12" viewBox="0 0 16 12">
            <use href="/img/sprite.svg#youtube"></use>
          </svg>
        </a>
        <a href="https://ok.ru/" className="footer__link" target="_blank" rel="noopener noreferrer">
          <svg className="footer__social-icon" width="11" height="18" viewBox="0 0 11 18">
            <use href="/img/sprite.svg#ok"></use>
          </svg>
        </a>
        <a href="https://web.telegram.org" className="footer__link" target="_blank" rel="noopener noreferrer">
          <svg className="footer__social-icon" width="17" height="14" viewBox="0 0 17 14">
            <use href="/img/sprite.svg#telegram"></use>
          </svg>
        </a>
      </div>
    </footer>
  );
}
