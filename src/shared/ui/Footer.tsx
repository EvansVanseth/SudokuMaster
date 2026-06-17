
declare const __APP_VERSION__: string;
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', color: 'white' }}>
      <p style={{ opacity: 0.5 }}>SudokuMaster - v{__APP_VERSION__}</p>
    </footer>
  );
};
