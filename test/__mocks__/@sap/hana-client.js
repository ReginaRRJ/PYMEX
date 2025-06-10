// __mocks__/@sap/hana-client.js
export default {
  createConnection: () => ({
    connect: jest.fn(),
    prepare: jest.fn((query, cb) => {
      const stmt = {
        exec: (params, cb) => {
          if (query.includes("SELECT")) {
            cb(null, [{ leida: false }]); // Caso simulado
          } else {
            cb(null); // Simula éxito
          }
        },
        drop: jest.fn()
      };
      cb(null, stmt);
    }),
    commit: jest.fn((cb) => cb(null)),
    rollback: jest.fn((cb) => cb(null)),
    disconnect: jest.fn()
  })
};