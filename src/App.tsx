import { useState, useEffect } from 'react';
import { useCurrencyRates } from './Context/CurrencyRates';

const DefaultCurrency = 'AED';

const App = () => {
  const { rates, updateDate } = useCurrencyRates();
  const [currentCurrency, setCurrencyMode] = useState(DefaultCurrency);
  const [AED, setAED] = useState(0);
  const [KRW, setKRW] = useState(0);
  const [USD, setUSD] = useState(0);
  const [EUR, setEUR] = useState(0);

  const currencyValueAndSetter: { [key: string]: [number, (currency: number) => void]} = {
    AED: [AED, setAED],
    KRW: [KRW, setKRW],
    USD: [USD, setUSD],
    EUR: [EUR, setEUR],
  }

  const buttons = [
    'AED', 'KRW', 'USD', 'EUR',
    '7', '8', '9', '←',
    '4', '5', '6', ' ',
    '1', '2', '3', ' ',
    '0', '.', 'C', '🔄',
  ];

  const clearCurrencyValue = (currency: string) => {
    Object.entries(currencyValueAndSetter).forEach(([, [_, setCurrencyValue]]) => {
      setCurrencyValue(0);
    });

    setCurrencyMode(currency);
  }

  const onAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    const keyAction = event.currentTarget.innerText;

    if (keyAction === 'C') {      
      return clearCurrencyValue(currentCurrency);
    }

    if (Number.isInteger(+keyAction)) {
      const [currencyValue, setCurrencyValue] = currencyValueAndSetter[currentCurrency];
      const nextValue = Number(String(currencyValue) + keyAction)
      setCurrencyValue(nextValue);

      if (currentCurrency === 'AED') {                
        setKRW(Math.floor(rates.KRW * nextValue));
        setUSD(Math.floor(rates.USD * nextValue));
        setEUR(Math.floor(rates.EUR * nextValue));
      } else if (currentCurrency === 'KRW') {
        setAED(Math.floor(nextValue / rates.KRW));
        setUSD(Math.floor(rates.USD * (nextValue / rates.KRW)));
        setEUR(Math.floor(rates.EUR * (nextValue / rates.KRW)));
      } else if (currentCurrency === 'USD') {
        setAED(Math.floor(nextValue / rates.USD));    
        setKRW(Math.floor(rates.KRW * (nextValue / rates.USD)));
        setEUR(Math.floor(rates.EUR * (nextValue / rates.USD)));
      } else if (currentCurrency === 'EUR') {
        setAED(Math.floor(nextValue / rates.EUR));    
        setKRW(Math.floor(rates.KRW * (nextValue / rates.EUR)));
        setUSD(Math.floor(rates.USD * (nextValue / rates.EUR)));
      }

      return;
    }

    if (['KRW', 'AED', 'USD', 'EUR'].includes(keyAction)) {
      clearCurrencyValue(keyAction);
    }
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(
        (registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        },
        (error) => {
          console.error('Service Worker registration failed:', error);
        }
      );
    }
  }, []);
  
  if (rates === null) {
    return (
      <>
        <div>Loading...</div>
      </>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium">AED</span>
        </div>
        <div className="text-3xl font-light">{AED.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
      </div>
      
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium">KRW</span>
        </div>
        <div className="text-3xl font-light">{KRW.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
      </div>

      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium">USD</span>
        </div>
        <div className="text-3xl font-light">{USD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
      </div>

      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium">EUR</span>
        </div>
        <div className="text-3xl font-light">{EUR.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
      </div>

      <div className="grid grid-cols-4 gap-1 p-4">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={onAction}
            className={`py-6 text-2xl font-medium rounded ${
              ['☀️', '🌤️', '🌦️', '🌨️'].includes(btn)
                ? 'bg-gray-700 active:bg-yellow-500'
                : ['C'].includes(btn)
                ? 'bg-teal-900 active:bg-teal-600'
                : ['AED', 'KRW', 'USD', 'EUR'].includes(btn)
                ? (currentCurrency === btn ? 'bg-teal-200 text-lime-800' : 'bg-teal-900')
                : 'bg-gray-600 active:bg-gray-500'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-700">
        <div className="text-green-400 text-sm">
          {updateDate}
        </div>
        <div className="text-gray-400 text-sm">
          1 AED = {rates.KRW} KRW
        </div>
      </div>
    </div>
  );
};

export default App
