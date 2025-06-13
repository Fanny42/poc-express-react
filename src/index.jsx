import React from 'react';
import { createRoot } from 'react-dom/client';
import Hello from './Hello';

const container = document.getElementById('react-root');
const props = JSON.parse(container.dataset.props);

createRoot(container).render(<Hello {...props} />);
