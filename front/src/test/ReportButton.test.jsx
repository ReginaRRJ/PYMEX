//ReportButton.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportButton from '../components/ReportButton';

describe('ReportButton component', () => {
  const mockReporte = { idReporte: 123, resuelto: false };
  const token = 'mocked-token';

  beforeEach(() => {
    // Mock localStorage.getItem para token
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => {
      if (key === 'token') return token;
      return null;
    });

    // Mock fetch global
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renderiza correctamente y estado inicial', () => {
    render(<ReportButton reporte={mockReporte} />);

    // El botón debería tener clase de fondo negro porque isSelected false
    const button = screen.getByTestId('UpdateEstadoReport-button');
    expect(button).toHaveClass('bg-black');

    // Mostrar texto "Por resolver"
    expect(screen.getByText(/por resolver/i)).toBeInTheDocument();
  });

  test('al hacer click llama al fetch y cambia estado', async () => {
    // Mock de fetch exitoso
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Reporte actualizado' }),
    });

    render(<ReportButton reporte={mockReporte} />);

    const button = screen.getByTestId('UpdateEstadoReport-button');

    // Click para seleccionar
    fireEvent.click(button);

    // Espera a que el fetch sea llamado con la URL correcta
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/reportes/${mockReporte.idReporte}`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
        body: JSON.stringify({ resuelto: true }),
      })
    ));

    // El botón ahora debería tener clase 'bg-slate-100'
    expect(button).toHaveClass('bg-slate-100');
  });

  test('maneja error en fetch y revierte estado', async () => {
    // Mock fetch falla
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<ReportButton reporte={mockReporte} />);
    const button = screen.getByTestId('UpdateEstadoReport-button');

    fireEvent.click(button);

    // Esperar que el estado isSelected vuelva a false (bg-black)
    await waitFor(() => {
      expect(button).toHaveClass('bg-black');
    });
  });

  test('estado inicial true (resuelto)', () => {
    const reporteResuelto = { idReporte: 456, resuelto: true };
    render(<ReportButton reporte={reporteResuelto} />);

    const button = screen.getByTestId('UpdateEstadoReport-button');
    // Ya debe estar seleccionado, fondo claro
    expect(button).toHaveClass('bg-slate-100');

    // No debe mostrar texto "Por resolver"
    expect(screen.queryByText(/por resolver/i)).not.toBeInTheDocument();
  });
});
