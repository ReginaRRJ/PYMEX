//Pedido.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Pedido from '../Pages/Distribuidor/Pedido';

// Mock framer-motion para que no interfiera con el test
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef((props, ref) => <div ref={ref} {...props} />)
    },
    AnimatePresence: ({ children }) => <>{children}</>
  };
});

describe('Pedido.jsx', () => {
  beforeEach(() => {
    // Simula un token válido
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('muestra "Cargando pedido..." cuando pedidoData es null', async () => {
    // Mock para evitar fetch real y hacer que tarde
    global.fetch = jest.fn(() =>
      new Promise(() => {}) // No resuelve para mantener pedidoData en null
    );

    const pedidoMock = { id: 1 };
    render(<Pedido pedido={pedidoMock} onClose={() => {}} />);

    expect(await screen.findByText('Cargando pedido...')).toBeInTheDocument();
  });
});
