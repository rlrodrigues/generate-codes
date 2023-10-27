import React from 'react';

export const InputWithLimit = ({ type, value, setValue, limit, placeholder }) => {
    const handleChange = ({ target }) => {
      if (target.value.length <= limit) {
        setValue(target.value);
      }
  };
  return (
      <input
        className='input__'
        placeholder={ placeholder }
        type={ type }
        value={value}
        onChange={handleChange}
      />
    );
};
