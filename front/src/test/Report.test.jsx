//Report.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Report from '../components/Report';

describe('Report component', () => {

  const baseReporte = {
    idReporte: 1,
    titulo: 'Título de prueba',
    fechaReporte: '2025-06-11T00:00:00Z',
    descripcion: 'Descripción de prueba',
    resuelto: false,
  };

  const urgencias = [
    { urgencia: 3, color: 'text-red-500', importancia: '!!!' },
    { urgencia: 2, color: 'text-yellow-500', importancia: '!!' },
    { urgencia: 1, color: 'text-green-500', importancia: '!' },
    { urgencia: 0, color: 'text-gray-500', importancia: '' },  // default
    { urgencia: 5, color: 'text-gray-500', importancia: '!!!!!' }, // default también
  ];

  urgencias.forEach(({ urgencia, color, importancia }) => {
    test(`muestra importancia y color correctos para urgencia=${urgencia}`, () => {
      const reporte = { ...baseReporte, urgencia };

      render(<Report reporte={reporte} index={0} />);

      // Verifica que aparezca la cadena con signos de admiración
      if (importancia.length > 0) {
        expect(screen.getByText(importancia)).toBeInTheDocument();
      } else {
        // Cuando urgencia=0 no debe mostrar signos de admiración
        expect(screen.queryByText('!')).not.toBeInTheDocument();
      }

      // Verifica que el div que contiene importancia tenga la clase de color correcta
      const importanciaDiv = screen.getByText(importancia.length > 0 ? importancia : '', { selector: 'div' });
      expect(importanciaDiv.className).toContain(color);

      // Verifica que el título se muestre
      expect(screen.getByText(/título:/i)).toBeInTheDocument();
      expect(screen.getByText(reporte.titulo)).toBeInTheDocument();

      // Verifica que la fecha se muestre en formato local
      const fechaFormateada = new Date(reporte.fechaReporte).toLocaleDateString();
      expect(screen.getByText(/fecha:/i)).toBeInTheDocument();
      expect(screen.getByText(fechaFormateada)).toBeInTheDocument();

      // Verifica que la descripción se muestre
      expect(screen.getByText(/contenido:/i)).toBeInTheDocument();
      expect(screen.getByText(reporte.descripcion)).toBeInTheDocument();
    });
  });

});
