import React, { useState, useRef, useEffect } from 'react';
import { InputWithLimit } from './InputWithLimit';
import CodeTable from './CodeTable';
import '../css/main.css';
import { fetchAPI, endpoint } from '../helpers/fetchAPI';

export default function Main() {
  // Estado de inputs ---> juntar todos em um obj mais tarde
  const [source, setSource] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [destiny, setDestiny] = useState('');
  const [amount, setAmount] = useState('');

  // Estado dos códigos gerados
  const [codes, setCodes] = useState(null);
  const [validCodes, setValidCodes] = useState(null);

  // Estado para serviços
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const codeTableRef = useRef(null);

  const getCodes = async () => {
    setError(false);
    setLoading(true);
    const codeList = [];
    const limitNumber = parseInt(amount, 10);
    if (!isNaN(limitNumber)) {
      for (let i = 0; i < limitNumber; i += 1) {
        codeList.push(`${source.toUpperCase()}${Number(trackingCode) + i}${destiny.toUpperCase()}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCodes(codeList);
    }
  };

  const isFilled = () => {
    const minCodeLength = 9;
    return !(
      source.length === 2 &&
      trackingCode.length === minCodeLength &&
      destiny.length === 2 &&
      amount > 0
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const listValidCodes = [];
      if (codes) {
        setLoading(true);

        // Divide os códigos em grupos de 100
        const codeGroups = [];
        const batchSize = 100;
        for (let i = 0; i < codes.length; i += batchSize) {
          codeGroups.push(codes.slice(i, i + batchSize));
        }

        // Envia as requisições em paralelo usando Promise.all()
        await Promise.all(
          codeGroups.map(async (codeGroup) => {
            let URL = endpoint;

            // Monta a URL para o grupo de códigos
            codeGroup.forEach((code, index) => {
              if (index === 0){
                return URL += `${code}`;
              }
              URL += `&mailNos=${code}`;
            });

            // Faz a requisição para a API
            const responses = await fetchAPI(URL);

            // Processa as respostas
            responses.module?.forEach(({ mailNo, status }) => {
              console.log(status);
              if (status && status === 'DELIVERING') {
                listValidCodes.push(mailNo);
              }

            // Error
              if (responses.data?.ret) {
                if (responses.data.ret[0] === 'FAIL_SYS_USER_VALIDATE') {
                  setLoading(false);
                  setError(true);
                  return;
                }
              }
            });
            console.log(responses);
          })
        );

        setValidCodes(listValidCodes);
        setLoading(false);
      }
    };

    fetchData();
  }, [codes]);

  return (
    <main className='main__container'>
      <section className='input__container'>
        <div className="input__row">
          <label htmlFor="source">Origem:</label>
          <InputWithLimit
            type={'text'}
            placeholder={'NL'}
            value={source.toUpperCase()}
            setValue={setSource}
            limit={2}
            id="source"
          />
        </div>

        <div className="input__row">
          <label htmlFor="trackingCode">Rastreio:</label>
          <InputWithLimit
            type={'number'}
            placeholder={'605823465'}
            value={trackingCode}
            setValue={setTrackingCode}
            limit={9}
            id="trackingCode"
          />
        </div>

        <div className="input__row">
          <label htmlFor="destiny">Destino:</label>
          <InputWithLimit
            type={'text'}
            placeholder={'BR'}
            value={destiny.toUpperCase()}
            setValue={setDestiny}
            limit={2}
            id="destiny"
          />
        </div>

        <div className="input__row">
          <label htmlFor="amount">Quantidade:</label>
          <InputWithLimit
            type={'number'}
            placeholder={'100'}
            value={amount}
            setValue={setAmount}
            limit={4}
            id="amount"
          />
        </div>
        <button className='get__codes' disabled={isFilled()} type="button" onClick={getCodes}>
          Gerar códigos
        </button>
      </section>

      {error && (<h2>Tomamos timeout da API<br></br>Tente novamente mais tarde!</h2>)}
      {isLoading ? <h2>...Carregando</h2> : null}

      <div className='codes__container'>
        <CodeTable
          title={'Códigos Válidos'}
          codes={validCodes}
          ref={codeTableRef}
          className="valid-codes-table"
        />
        <CodeTable
          title={'Códigos Gerados'}
          codes={codes}
          ref={codeTableRef}
          className="codes-table"
        />
      </div>
    </main>
  );
}
