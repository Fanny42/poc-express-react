import React, { useEffect, useState } from 'react';

export default function Slow() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000); // 3 secondes pour simuler un composant lent

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ border: '1px solid red', padding: '1rem' }}>
      {visible ? (
        <p>⏱️ Composant lent affiché après 3 secondes.</p>
      ) : (
        <p>Chargement du composant lent...</p>
      )}
    </div>
  );
}
