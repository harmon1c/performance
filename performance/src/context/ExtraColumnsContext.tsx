import React from 'react';

const ExtraColumnsContext = React.createContext<string[]>([]);

export function ExtraColumnsProvider(
  props: React.PropsWithChildren<{ value: string[] }>
): React.JSX.Element {
  const { value, children } = props;
  return (
    <ExtraColumnsContext.Provider value={value}>
      {children}
    </ExtraColumnsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExtraColumns(): string[] {
  return React.useContext(ExtraColumnsContext);
}

export default ExtraColumnsContext;
