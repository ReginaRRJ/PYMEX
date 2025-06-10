
//AddOrder.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOrder from '../pages/Sucursal/AddOrder';
import axios from 'axios';

jest.mock('axios');

test('muestra error si falta algún campo al crear pedido', async () => {
  render(<AddOrder onClose={jest.fn()} />);

  const crearBtn = screen.getByRole('button', { name: /crear/i });
  await userEvent.click(crearBtn);

  await waitFor(() => {
    expect(screen.getByText(/por favor llene todos los campos/i)).toBeInTheDocument();
  });
});

test('carga proveedores y productos y crea pedido correctamente', async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes('proveedores')) {
      return Promise.resolve({ data: [{ idProveedor: 1, nombreProveedor: 'Proveedor1' }] });
    }
    if (url.includes('productos')) {
      return Promise.resolve({ data: [{ idProducto: 10, nombreProducto: 'Producto1' }] });
    }
    return Promise.resolve({ data: [] });
  });

  axios.post.mockResolvedValue({ data: { success: true } });

  render(<AddOrder onClose={jest.fn()} />);

  // Seleccionar proveedor
  await userEvent.selectOptions(screen.getByRole('combobox', { name: /nombre del proveedor/i }), 'Proveedor1');

  // Esperar a que se carguen productos
  await waitFor(() => expect(axios.get).toHaveBeenCalledWith(
    expect.stringContaining('/productos/1'),
    expect.any(Object)
  ));

  // Seleccionar producto
  await userEvent.selectOptions(screen.getByRole('combobox', { name: /producto/i }), 'Producto1');

  // Completar otros campos
  await userEvent.type(screen.getByLabelText(/numero de piezas/i), '5');
  await userEvent.type(screen.getByLabelText(/tipo pedido/i), 'Electrónica');
  await userEvent.type(screen.getByLabelText(/telefono/i), '1234567890');
  await userEvent.type(screen.getByLabelText(/correo/i), 'test@mail.com');

  // Clic en crear
  await userEvent.click(screen.getByText(/crear/i));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
  });
});
