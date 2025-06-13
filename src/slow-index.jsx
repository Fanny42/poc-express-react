import React from 'react';
import { createRoot } from 'react-dom/client';
import Slow from './Slow';

const container = document.getElementById('slow-root');
createRoot(container).render(<Slow />);
