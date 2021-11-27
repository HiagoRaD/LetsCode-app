import React, { ChangeEvent } from 'react';
import './text-input.scss';

interface ITextInputProps {
  title?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

export function TextInput(props: ITextInputProps) {
  const { title, placeholder, value, onChange, error } = props;

  return (
    <div className={`text-input-container ${error && 'error'}`}>
      {title && <label>{title}</label>}
      <input
        type={'text'}
        value={value}
        placeholder={!!placeholder ? placeholder : ''}
        onChange={onChange}
        maxLength={255}
      />
    </div>
  );
}
