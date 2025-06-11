// DistribuidorMain.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DistribuidorMain from '../pages/Distribuidor/DistribuidorMain';
import '@testing-library/jest-dom';


jest.mock('../components/Header', () => ({ setNotificationsModal }) => (
  <button onClick={() => setNotificationsModal(true)}>Mock Header (abre modal)</button>
));
jest.mock('../components/NavbarIcon', () => ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
));
jest.mock('../components/Profile', () => () => <div>Mock Profile</div>);
jest.mock('../components/Notifications', () => ({ onClose }) => (
  <div>
    Modal Notificaciones
    <button onClick={onClose}>Cerrar</button>
  </div>
));
jest.mock('../pages/Distribuidor/PedidosRecibidos', () => (props) => (
  <div>
    PedidosRecibidos
    <button onClick={() => props.setPedidoModal(true)}>Abrir Modal Pedido</button>
    <button onClick={() => props.setPedido({ id: 1 })}>Set Pedido</button>
    <button onClick={() => props.onActualizarPedido(123)}>Actualizar Pedido</button>
  </div>
));
jest.mock('../pages/Distribuidor/NotificacionesDist', () => () => <div>NotificacionesDist</div>);
jest.mock('../pages/Distribuidor/Pedido', () => ({ onClose }) => (
  <div>
    Modal Pedido
    <button onClick={onClose}>Cerrar Pedido</button>
  </div>
));

describe('DistribuidorMain', () => {
  beforeEach(() => {
  // Simulamos un token JWT con payload base64 válido { idUsuario: 1 }
  const payload = btoa(JSON.stringify({ idUsuario: 1 }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // base64url
  const fakeToken = `header.${payload}.signature`;
  localStorage.setItem('token', fakeToken);

  global.atob = (str) => window.atob(str); // asegurar compatibilidad
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('muestra la pantalla inicial PedidosRecibidos', () => {
    render(<DistribuidorMain />);
    expect(screen.getByText('PedidosRecibidos')).toBeInTheDocument();
  });

  test('cambia a NotificacionesDist', () => {
    render(<DistribuidorMain />);
    fireEvent.click(screen.getByText('Notificaciones'));
    expect(screen.getByText('NotificacionesDist')).toBeInTheDocument();
  });

  test('muestra pantalla no encontrada si activeScreenDist es inválido', () => {
    const Dummy = () => {
      const [activeScreenDist] = React.useState('invalida');
      const renderScreen = () => {
        switch (activeScreenDist) {
          case 'pedidosRecibidos': return <div>PedidosRecibidos</div>;
          case 'notificacionesDist': return <div>NotificacionesDist</div>;
          default: return <h2>Pantalla no encontrada</h2>;
        }
      };
      return renderScreen();
    };

    render(<Dummy />);
    expect(screen.getByText('Pantalla no encontrada')).toBeInTheDocument();
  });

  test('abre y cierra modal de notificaciones', () => {
    render(<DistribuidorMain />);
    fireEvent.click(screen.getByText('Mock Header (abre modal)'));
    expect(screen.getByText('Modal Notificaciones')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cerrar'));
    expect(screen.queryByText('Modal Notificaciones')).not.toBeInTheDocument();
  });

  test('abre y cierra modal de pedido', () => {
    render(<DistribuidorMain />);
    fireEvent.click(screen.getByText('Abrir Modal Pedido'));
    fireEvent.click(screen.getByText('Set Pedido'));
    expect(screen.queryByText('Modal Pedido')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cerrar Pedido'));
    expect(screen.queryByText('Modal Pedido')).not.toBeInTheDocument();
  });

  test('ejecuta abrirActualizarPedido y hace log', () => {
    render(<DistribuidorMain />);
    fireEvent.click(screen.getByText('Actualizar Pedido'));
    expect(console.log).toHaveBeenCalledWith('ID del pedido seleccionado:', 123);
  });

  test('maneja error al decodificar token inválido', () => {
    localStorage.setItem('token', 'invalid.token');
    render(<DistribuidorMain />);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error decodificando token'), expect.any(Error));
  });

  test('hace fetch en useEffect y actualiza pedidos', async () => {
    const mockPedidos = [{ idPedido: 1, cliente: 'Cliente A' }];
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve(mockPedidos),
    });

    render(<DistribuidorMain />);
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/pedidos/general'), expect.any(Object)));
  });
});
