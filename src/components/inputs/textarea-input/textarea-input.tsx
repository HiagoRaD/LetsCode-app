import React, { ChangeEvent } from 'react';
import './textarea-input.scss';

interface ITextInputProps {
  title?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
}

export function TextareaInput(props: ITextInputProps) {
  const { title, placeholder, value, onChange, error } = props;

  return (
    <div className={`textarea-input-container ${error && 'error'}`}>
      {title && <label>{title}</label>}
      <textarea
        value={value}
        placeholder={!!placeholder ? placeholder : ''}
        onChange={onChange}
        maxLength={255}
      />
    </div>
  );
}