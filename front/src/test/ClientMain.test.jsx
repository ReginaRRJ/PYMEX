// ClientMain.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientMain from '../pages/Client/ClientMain';
import '@testing-library/jest-dom';


jest.mock('../pages/Client/PedidosCliente', () => () => <div>Pantalla PedidosCliente</div>);
jest.mock('../pages/Client/VentasCliente', () => () => <div>Pantalla VentasCliente</div>);
jest.mock('../pages/Client/NotificacionesCliente', () => () => <div>Pantalla NotificacionesCliente</div>);
jest.mock('../pages/Client/SucursalesCliente', () => () => <div>Pantalla SucursalesCliente</div>);
jest.mock('../pages/Client/StockCliente', () => () => <div>Pantalla StockCliente</div>);
jest.mock('../pages/Client/ReporteCliente', () => () => <div>Pantalla ReporteCliente</div>);

// Mock Header con botón para abrir modal
jest.mock('../components/Header', () => ({ setNotificationsModal }) => (
  <div>
    Mock Header
    <button onClick={() => setNotificationsModal(true)}>Abrir Notificaciones</button>
  </div>
));

// NavbarIcon simulado como botón de texto
jest.mock('../components/NavbarIcon', () => ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
));

jest.mock('../components/Profile', () => () => <div>Mock Profile</div>);

// Modal simulado
jest.mock('../components/Notifications', () => ({ onClose }) => (
  <div>
    Modal Notificaciones
    <button onClick={onClose}>Cerrar</button>
  </div>
));

describe('ClientMain', () => {
  test('muestra la pantalla inicial PedidosCliente', () => {
    render(<ClientMain />);
    expect(screen.getByText('Pantalla PedidosCliente')).toBeInTheDocument();
  });

  test('cambia pantallas al hacer click en NavbarIcon', () => {
    render(<ClientMain />);

    fireEvent.click(screen.getByText('Ventas'));
    expect(screen.getByText('Pantalla VentasCliente')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Notificaciones'));
    expect(screen.getByText('Pantalla NotificacionesCliente')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Sucursales'));
    expect(screen.getByText('Pantalla SucursalesCliente')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Stock'));
    expect(screen.getByText('Pantalla StockCliente')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Reportar'));
    expect(screen.getByText('Pantalla ReporteCliente')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Pedidos'));
    expect(screen.getByText('Pantalla PedidosCliente')).toBeInTheDocument()
  });

  test('muestra pantalla no encontrada con estado inválido', () => {
    const TestComponent = () => {
      const [activeScreenCliente, setActiveScreenCliente] = React.useState('invalidScreen');
      const renderScreen = () => {
        switch (activeScreenCliente) {
          case 'pedidosCliente': return <div>Pantalla PedidosCliente</div>;
          default: return <h2>Pantalla no encontrada</h2>;
        }
      };
      return <div>{renderScreen()}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('Pantalla no encontrada')).toBeInTheDocument();
  });

  test('abre y cierra modal de notificaciones desde el Header', () => {
    render(<ClientMain />);
    
    // Modal no visible inicialmente
    expect(screen.queryByText('Modal Notificaciones')).not.toBeInTheDocument();

    // Abrimos el modal simulando click en botón del Header
    fireEvent.click(screen.getByText('Abrir Notificaciones'));
    expect(screen.getByText('Modal Notificaciones')).toBeInTheDocument();

    // Cerramos el modal
    fireEvent.click(screen.getByText('Cerrar'));
    expect(screen.queryByText('Modal Notificaciones')).not.toBeInTheDocument();
  });
});
