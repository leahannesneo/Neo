import { createContext, useContext, useState } from 'react';

const INITIAL_DATA = {
  displayName: '',
  gender: null,
  hasPartner: null,
  situation: null,
  entries: [],
  role: null,
  theme: null,
};

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [data, setData] = useState(INITIAL_DATA);

  function updateData(partial) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function addEntry(entry) {
    setData((prev) => ({ ...prev, entries: [...prev.entries, entry] }));
  }

  function removeEntry(id) {
    setData((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.id !== id) }));
  }

  function updateEntry(id, partial) {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    }));
  }

  function resetData() {
    setData(INITIAL_DATA);
  }

  return (
    <OnboardingContext.Provider value={{ data, updateData, addEntry, removeEntry, updateEntry, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return ctx;
}
