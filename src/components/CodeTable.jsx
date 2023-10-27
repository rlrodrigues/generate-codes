import React, { useState, useRef } from 'react';

export default function CodeTable({ codes, title }) {
  const [isCopied, setIsCopied] = useState(false);
  const codeTableRef = useRef(null);
  
  const handleCopyCodes = async () => {
    const codeTableElement = codeTableRef.current;
    const range = document.createRange();
    range.selectNodeContents(codeTableElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    setIsCopied(true);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setIsCopied(false);
  };

  return (
    <section className='table__container'>
      {isCopied && (
        <span><strong>Códigos copiados para<br></br>a área de transferência❗</strong></span>
      )}
      <h2>{ title }</h2>

      {codes && (
        <button className='btn__copy' type="button" onClick={handleCopyCodes}>
          Copiar códigos
        </button>
      )}
      <ul className='code__table' ref={codeTableRef}>
        {codes === null ? null : codes.map((code) => (<li key={code + 1}>{code}</li>))}
      </ul>
    </section>
  );
}
