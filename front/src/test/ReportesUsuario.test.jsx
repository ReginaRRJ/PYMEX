import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ReportesUsuarios from '../../pages/Admin/ReportesUsuarios';
import '@testing-library/jest-dom';
import * as fetchMock from 'node-fetch';
import { Response } from 'node-fetch';

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
      Promise.resolve(
        new Response(JSON.stringify(reportesMock), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    render(<ReportesUsuarios />);

    // Espera que se muestre el reporte
    await waitFor(() => {
      expect(screen.getByText('Error de carga')).toBeInTheDocument();
      expect(screen.getByText('Bug en UI')).toBeInTheDocument();
    });
  });

  test('muestra mensaje de error si falla el fetch', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(<ReportesUsuarios />);

    // Espera a que se renderice fallback
    await waitFor(() => {
      expect(screen.getByText('No hay reportes disponibles.')).toBeInTheDocument();
    });
  });
});
