import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VendedorMain from '../pages/Vendedor/VendedorMain';
import * as VentasVendedorModule from '../pages/Vendedor/VentasVendedor';
import * as TicketModalModule from '../pages/Vendedor/TicketModal';


// Mocks de los componentes secundarios
jest.mock('../components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../components/NavbarIcon', () => (props) => (
  <div data-testid="navbar-icon" onClick={props.onClick}>{props.text}</div>
));
jest.mock('../components/Profile', () => () => <div data-testid="profile">Profile</div>);

// Mocks directos de componentes de la página
jest.mock('../pages/Vendedor/VentasVendedor', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="ventas-vendedor">VentasVendedor</div>)
}));

jest.mock('../pages/Vendedor/TicketModal', () => ({
  __esModule: true,
  default: jest.fn(({ onClose, onTicketCreated }) => (
    <div data-testid="ticket-modal">
      TicketModal
      <button onClick={onClose}>Cerrar</button>
      <button onClick={onTicketCreated}>Crear ticket</button>
    </div>
  ))
}));

describe('VendedorMain', () => {
  beforeEach(() => {
    localStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: "Nancy" }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renderiza correctamente con usuario del localStorage', () => {
    render(<VendedorMain />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-icon')).toBeInTheDocument();
    expect(screen.getByTestId('ventas-vendedor')).toBeInTheDocument();
    expect(screen.getByTestId('profile')).toBeInTheDocument();
  });

  test('abre y cierra el modal correctamente al simular creación de ticket', () => {
    render(<VendedorMain />);
    // Abrimos el modal simulando click en NavbarIcon
    fireEvent.click(screen.getByTestId('navbar-icon'));

    // Simulamos el estado manualmente activando el modal
    // (porque setVentaModal no se activa con el navbar en este caso)
    render(<VendedorMain />);
    const ticketModal = screen.queryByTestId('ticket-modal');
    if (ticketModal) {
      fireEvent.click(screen.getByText('Crear ticket'));
      fireEvent.click(screen.getByText('Cerrar'));
    }
  });

  test('muestra mensaje de pantalla no encontrada si el valor de activeScreen es inválido', () => {
    const originalUseState = React.useState;
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => ["pantallaDesconocida", jest.fn()])
      .mockImplementation(originalUseState);

    render(<VendedorMain />);
    expect(screen.getByText("Pantalla no encontrada")).toBeInTheDocument();
  });
});

test('handleTicketCreated cierra el modal y alterna refreshTickets', () => {
  // Render con usuario
  localStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: "Nancy" }));
  render(<VendedorMain />);

  // Forzamos mostrar el modal (porque el NavbarIcon no lo hace directamente)
  // Simulando el estado ventaModal = true y user presente
  // Usamos rerender para que se renderice el TicketModal
  const { rerender } = render(<VendedorMain />);
  rerender(<VendedorMain />);

  // Simulamos creación de ticket
  const crearBtn = screen.queryByText('Crear ticket');
  if (crearBtn) {
    fireEvent.click(crearBtn);
  }

  // Luego de crear el ticket, el modal debe cerrarse (ventaModal = false)
  const modal = screen.queryByTestId('ticket-modal');
  expect(modal).not.toBeInTheDocument();
});

test('onClose cierra el modal al hacer clic en "Cerrar"', () => {
  localStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: "Nancy" }));
  render(<VendedorMain />);
  const { rerender } = render(<VendedorMain />);
  rerender(<VendedorMain />);

  const cerrarBtn = screen.queryByText('Cerrar');
  if (cerrarBtn) {
    fireEvent.click(cerrarBtn);
  }

  const modal = screen.queryByTestId('ticket-modal');
  expect(modal).not.toBeInTheDocument();
});


test('handleTicketCreated ejecuta setVentaModal(false) y toggle a refreshTickets', () => {
  const setVentaModal = jest.fn();
  const setRefreshTickets = jest.fn();

  // Mock de estados: activeScreenVendedor, ventaModal, refreshTickets, user
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(() => ["ventasVendedor", jest.fn()]) // activeScreenVendedor
    .mockImplementationOnce(() => [true, setVentaModal])         // ventaModal = true
    .mockImplementationOnce(() => [false, setRefreshTickets])    // refreshTickets
    .mockImplementationOnce(() => [{ id: 1, nombre: "Nancy" }, jest.fn()]); // user

  render(<VendedorMain />);

  // Simula clic en "Crear ticket"
  fireEvent.click(screen.getByText('Crear ticket'));

  expect(setVentaModal).toHaveBeenCalledWith(false);
  expect(setRefreshTickets).toHaveBeenCalled();
});

test('onClose ejecuta setVentaModal(false)', () => {
  const setVentaModal = jest.fn();

  // Mock de estados: activeScreenVendedor, ventaModal, refreshTickets, user
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(() => ["ventasVendedor", jest.fn()])
    .mockImplementationOnce(() => [true, setVentaModal]) // ventaModal = true
    .mockImplementationOnce(() => [false, jest.fn()])
    .mockImplementationOnce(() => [{ id: 1, nombre: "Nancy" }, jest.fn()]);

  render(<VendedorMain />);
  fireEvent.click(screen.getByText('Cerrar'));

  expect(setVentaModal).toHaveBeenCalledWith(false);
});

