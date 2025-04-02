'use client';
import { useState } from 'react';
import './styles.css';

interface FilterButtonProps {
  text: string;
  handleClick: (type: string) => void;
}

function FilterButton({ text, handleClick }: FilterButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className='pd-10'>
      <button
        className={`button ${isActive ? 'active' : ''}`}
        onClick={() => {
          setIsActive(!isActive);
          handleClick(text);
        }}
      >
        {text}
      </button>
    </div>
  );
}

export default FilterButton;
