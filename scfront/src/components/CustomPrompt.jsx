// src/components/CustomPrompt.jsx
import React, { useState } from 'react';
import '../css/customprompt.css'

const CustomPrompt = ({ title, message, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="custom-prompt-overlay">
      <div className="custom-prompt-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <input
          type="text"
          placeholder="입력해주세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="custom-prompt-buttons">
          <button onClick={() => onConfirm(inputValue)}>확인</button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default CustomPrompt;
