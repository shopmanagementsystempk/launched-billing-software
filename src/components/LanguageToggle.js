import React from 'react';
import { Button } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import translations from '../utils/translations';

function LanguageToggle({
  variant = 'outline-light',
  size = 'sm',
  className = '',
  isCompact = false,
  ...buttonProps
}) {
  const { language, toggleLanguage } = useLanguage();

  const label = isCompact
    ? (language === 'en' ? 'UR' : 'EN')
    : (language === 'en' ? translations.en.switchToUrdu : translations.ur.switchToEnglish);
  
  const classes = [
    'language-toggle-btn',
    isCompact ? 'language-toggle-btn--compact' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Button 
      variant={variant}
      className={classes}
      onClick={toggleLanguage}
      size={size}
      {...buttonProps}
    >
      {label}
    </Button>
  );
}

export default LanguageToggle;