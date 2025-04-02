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
        className='button'
        data-active={isActive ? 'true' : 'false'}
        onClick={() => {
          setIsActive(!isActive);
          handleClick(text);
        }}
        style={{
          backgroundColor: isActive ? '#7F1D1D' : 'white',
          color: isActive ? 'white' : '#7F1D1D',
        }}
      >
        {text}
      </button>
    </div>
  );
}

export default FilterButton;
