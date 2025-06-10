import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ReportesUsuarios from '../pages/Admin/ReportesUsuarios';
import '@testing-library/jest-dom';

// Mock del componente Report para evitar renderización real
jest.mock('../components/Report', () => ({ reporte, index }) => (
  <div data-testid={`reporte-${index}`}>{reporte.descripcion}</div>
));

// Simula localStorage
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => 'fake-token');
});

describe('ReportesUsuarios', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renderiza reportes cuando fetch es exitoso', async () => {
    const reportesMock = [
      { idReporte: 1, descripcion: 'Error de carga', resuelto: 0 },
      { idReporte: 2, descripcion: 'Bug en UI', resuelto: 1 }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(reportesMock)
      })
    );

    render(<ReportesUsuarios />);

    await waitFor(() => {
      expect(screen.getByText('Error de carga')).toBeInTheDocument();
      expect(screen.getByText('Bug en UI')).toBeInTheDocument();
    });
  });

  test('muestra mensaje si no hay reportes', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    );

    render(<ReportesUsuarios />);

    await waitFor(() => {
      expect(screen.getByText('No hay reportes disponibles.')).toBeInTheDocument();
    });
  });

  test('maneja error si falla el fetch', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(<ReportesUsuarios />);

    await waitFor(() => {
      expect(screen.getByText('No hay reportes disponibles.')).toBeInTheDocument();
    });
  });
});
