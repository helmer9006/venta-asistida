import { ApiProperty } from '@nestjs/swagger';

export const SW_RESPONSES = {
  createUserOkReponse: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            example: {
              id: 15,
              uid: '4bec7c83-79a3-41a1-b761-84a737567708',
              name: 'jose',
              lastname: 'pirela',
              identificationType: 'CC',
              identification: '1051635343',
              email: 'helmer90@outlook.com',
              address: 'barrancabermeja',
              phone: '3013555186',
              isActive: true,
              roleId: 2,
              createdAt: '2023-07-10T01:55:20.176Z',
              updatedAt: '2023-07-14T00:12:00.708Z',
              roles: {
                id: 2,
                name: 'superadministrador',
                description: 'test',
                isActive: true,
                createdAt: '2023-07-05T23:44:41.402Z',
                updatedAt: '2023-07-17T22:03:54.774Z',
              },
            },
          },
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'Usuario creado correctamente.' },
        },
      },
    },
  },

  errorServerResponse: {
    description: `Error de servidor.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              example: {},
            },
            statusCode: { type: 'number', example: 500 },
            message: { type: 'string', example: 'Error de servidor' },
          },
        },
      },
    },
  },

  unauthorizeResponse: {
    description: `Falta de privilegios.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: { type: 'object', example: {} },
            statusCode: { type: 'number', example: 401 },
            message: {
              type: 'string',
              example: 'No tiene permisos necesario para acceder al recurso.',
            },
          },
        },
      },
    },
  },

  conflictRoleResponse: {
    description: `Respuesta para roles duplicados.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: { type: 'object', example: {} },
            statusCode: { type: 'number', example: 409 },
            message: {
              type: 'string',
              example: 'El rol ya se encuentra registrado',
            },
          },
        },
      },
    },
  },

  createRoleOkResponse: {
    description: 'Creacion del rol exitosa.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              example: {
                id: 1,
                name: 'Administrador',
                description: 'Administrador del sistema.',
                isActive: true,
                permissions: [1, 2],
                createdAt: '2023-07-20T16:16:48.052Z',
                updatedAt: '2023-07-20T16:16:48.052Z',
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Rol creado correctamente.' },
          },
        },
      },
    },
  },

  listRolesResponse: {
    description: 'Lista de roles',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 1,
                  name: 'Administrador',
                  description: 'Administrador del sistema.',
                  isActive: true,
                  permissions: [1, 2],
                  createdAt: '2023-07-20T16:16:48.052Z',
                  updatedAt: '2023-07-20T16:16:48.052Z',
                },
                {
                  id: 2,
                  name: 'Asesor',
                  description: 'Asesor de ventas externo.',
                  isActive: true,
                  permissions: [],
                  createdAt: '2023-07-20T16:16:48.052Z',
                  updatedAt: '2023-07-20T16:16:48.052Z',
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Roles encontrados.' },
          },
        },
      },
    },
  },

  updateRoleOkResponse: {
    description: 'Actualizacion del rol exitosa.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              example: {
                id: 1,
                name: 'Super Administrator',
                description: 'Administrador de todo el sistema.',
                isActive: true,
                permissions: [1, 2, 3, 4],
                createdAt: '2023-07-20T16:16:48.052Z',
                updatedAt: '2023-07-20T16:16:48.052Z',
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Rol actualizado correctamente.',
            },
          },
        },
      },
    },
  },

  getModulesByRoleResponse: {
    description: 'Actualizacion del rol exitosa.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 1,
                  name: 'administración',
                  createdAt: '2023-07-05T23:47:42.603Z',
                  updatedAt: '2023-07-05T23:00:00.000Z',
                  permissions: [
                    {
                      id: 1,
                      description: 'Crear usuario',
                      path: '/users/create',
                      createdAt: '2023-07-05T22:36:45.559Z',
                      updatedAt: '2023-07-05T22:36:00.000Z',
                      code: 'USER001',
                      moduleId: 1,
                      isActive: true,
                    },
                    {
                      id: 2,
                      description: 'Editar usuario',
                      path: '/users/update',
                      createdAt: '2023-07-05T22:36:45.559Z',
                      updatedAt: '2023-07-05T22:36:00.000Z',
                      code: 'USER002',
                      moduleId: 1,
                      isActive: true,
                    },
                  ],
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Modulos encontrados.',
            },
          },
        },
      },
    },
  },
};
