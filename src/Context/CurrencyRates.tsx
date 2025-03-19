import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/AED';
const InitializeRates = {
  AED: 1,
  KRW: 0,
  USD: 0,
  EUR: 0,
};

interface CurrencyRatesContextType {
  rates: Record<string, number>;
  updateDate: string;
}

const CurrencyRatesContext = createContext<CurrencyRatesContextType | undefined>(undefined);

export const useCurrencyRates = () => {
  const context = useContext(CurrencyRatesContext);
  if (!context) {
    throw new Error('useCurrencyRates must be used within a CurrencyRatesProvider');
  }
  return context;
};

const CurrencyRatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<Record<string, number>>(InitializeRates);
  const [updateDate, setUpdateDate] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      const today = new Date().toISOString().split('T')[0];
      const storedRates = localStorage.getItem(`currencyRates-${today}`);

      if (storedRates) {
        setRates(JSON.parse(storedRates));
        setUpdateDate(today);
      } else {
        try {
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
          }
          const data = await response.json();

          // 필요한 데이터만 필터링
          const filteredRates = {
            AED: data.rates.AED,
            KRW: data.rates.KRW,
            USD: data.rates.USD,
            EUR: data.rates.EUR
          };

          setRates(filteredRates);
          setUpdateDate(today);
          localStorage.setItem(`currencyRates-${today}`, JSON.stringify(filteredRates));
        } catch (error) {
          console.error('Error fetching exchange rates:', error);
        }
      }
    };

    fetchRates();
  }, []);

  return (
    <CurrencyRatesContext.Provider value={{ rates, updateDate }}>
      {children}
    </CurrencyRatesContext.Provider>
  );
};

export default CurrencyRatesProvider;
