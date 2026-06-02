import { useState, useEffect, useRef } from 'react';

export interface LanguageSwitcherProps {
  currentLang?: 'zh' | 'en' | 'ja';
}

interface Language {
  code: 'zh' | 'en' | 'ja';
  label: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function LanguageSwitcher({ currentLang = 'zh' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(
    languages.find((l) => l.code === currentLang) || languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && ['zh', 'en', 'ja'].includes(savedLang)) {
      const lang = languages.find((l) => l.code === (savedLang as 'zh' | 'en' | 'ja'));
      if (lang && lang.code !== currentLang) {
        setSelectedLang(lang);
      }
    }
  }, [currentLang]);

  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    setIsOpen(false);

    // Save preference to localStorage
    localStorage.setItem('preferred-language', lang.code);

    // Update body data attribute
    document.body.setAttribute('data-lang', lang.code);

    // Reload page with ?lang=xx URL parameter
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('lang', lang.code);
    window.location.href = `${currentPath}?${searchParams.toString()}`;
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="选择语言 / Select language"
      >
        <span className="flag">{selectedLang.flag}</span>
        <span className="label">{selectedLang.label}</span>
        <svg
          className={`arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="dropdown" role="listbox" aria-label="可用语言">
          {languages.map((lang) => (
            <li key={lang.code} role="option">
              <button
                className={`dropdown-item ${selectedLang.code === lang.code ? 'selected' : ''}`}
                onClick={() => handleLanguageChange(lang)}
                aria-selected={selectedLang.code === lang.code}
              >
                <span className="flag">{lang.flag}</span>
                <span className="label">{lang.label}</span>
                {selectedLang.code === lang.code && (
                  <svg
                    className="checkmark"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7L5.5 10.5L12 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }

        .language-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background-color: var(--color-white);
          border: 3px solid var(--color-border);
          box-shadow: 4px 4px 0 var(--color-border);
          font-family: var(--font-pixel);
          font-size: 0.625rem;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.1s ease;
          white-space: nowrap;
        }

        .language-btn:hover {
          background-color: var(--color-accent);
        }

        .language-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 var(--color-border);
        }

        .flag {
          font-size: 1rem;
          line-height: 1;
        }

        .label {
          display: none;
        }

        @media (min-width: 768px) {
          .label {
            display: inline;
          }
        }

        .arrow {
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 150px;
          background-color: var(--color-white);
          border: 3px solid var(--color-border);
          box-shadow: 4px 4px 0 var(--color-border);
          list-style: none;
          margin: 0;
          padding: 4px;
          z-index: 1000;
          animation: dropdownSlide 0.15s ease-out;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown::before {
          content: '';
          position: absolute;
          top: -8px;
          right: 16px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid var(--color-border);
        }

        .dropdown::after {
          content: '';
          position: absolute;
          top: -4px;
          right: 19px;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid var(--color-white);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          background-color: var(--color-white);
          border: 2px solid transparent;
          font-family: var(--font-pixel);
          font-size: 0.625rem;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.1s ease;
          text-align: left;
        }

        .dropdown-item:hover {
          background-color: var(--color-primary);
          color: var(--color-white);
          border-color: var(--color-border);
        }

        .dropdown-item.selected {
          background-color: var(--color-secondary);
          color: var(--color-white);
          border-color: var(--color-border);
        }

        .dropdown-item .checkmark {
          margin-left: auto;
          flex-shrink: 0;
        }

        /* Focus styles */
        .language-btn:focus-visible,
        .dropdown-item:focus-visible {
          outline: 3px solid var(--color-accent);
          outline-offset: 2px;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .language-btn,
          .arrow,
          .dropdown-item {
            transition: none;
          }

          .dropdown {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
