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
  createUserOkResponse: {
    description: 'Respuesta exitosa creación de usuario.',
    content: {
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
            message: {
              type: 'string',
              example: 'Usuario creado correctamente.',
            },
          },
        },
      },
    },
  },
  createUserUnauthorizeResponse: {
    description: `Usuario no creado por falta de privilegios.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {},
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

  userConflictResponse: {
    description: `Respuesta para usuarios duplicados por identificación o correo.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {},
            statusCode: { type: 'number', example: 409 },
            message: {
              type: 'string',
              example: 'El usuario ya se encuentra registrado.',
            },
          },
        },
      },
    },
  },
  getUserOkResponse: {
    description: 'Respuesta exitosa consulta de usuarios.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 6,
                  uid: '4bec7c83-79a3-41a1-b761-84a737567708',
                  name: 'Helmer',
                  lastname: 'Villarreal ',
                  identificationType: 'CC',
                  identification: '1051635340',
                  email: 'helmer90@outlook.com',
                  address: 'cra e3',
                  phone: '32015151',
                  isActive: true,
                  roleId: 2,
                  allyId: null,
                  supervisorId: null,
                  advisorStartDate: null,
                  advisorEndDate: null,
                  createdAt: '2023-07-21T18:35:22.315Z',
                  updatedAt: '2023-07-21T18:33:00.000Z',
                  ally: null,
                  roles: {
                    id: 2,
                    name: 'superadministrador',
                    description: null,
                    isActive: true,
                    createdAt: '2023-07-21T18:27:04.982Z',
                    updatedAt: '2023-07-21T18:25:43.177Z',
                  },
                  supervisor: null,
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Usuarios encontrados.' },
          },
        },
      },
    },
  },
  getTermUserOkResponse: {
    description:
      'Respuesta consulta de usuario por identificación, nombre o aliado.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 6,
                  uid: '4bec7c83-79a3-41a1-b761-84a737567708',
                  name: 'Helmer',
                  lastname: 'Villarreal ',
                  identificationType: 'CC',
                  identification: '1051635340',
                  email: 'helmer90@outlook.com',
                  address: 'cra e3',
                  phone: '32015151',
                  isActive: true,
                  roleId: 2,
                  allyId: null,
                  supervisorId: null,
                  advisorStartDate: null,
                  advisorEndDate: null,
                  createdAt: '2023-07-21T18:35:22.315Z',
                  updatedAt: '2023-07-21T18:33:00.000Z',
                  ally: null,
                  roles: {
                    id: 2,
                    name: 'superadministrador',
                    description: null,
                    isActive: true,
                    createdAt: '2023-07-21T18:27:04.982Z',
                    updatedAt: '2023-07-21T18:25:43.177Z',
                  },
                  supervisor: null,
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Usuario encontrado.' },
          },
        },
      },
    },
  },
  getMailUserOkResponse: {
    description: 'Respuesta consulta de usuario por correo.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              example: {
                id: 6,
                uid: '4bec7c83-79a3-41a1-b761-84a737567708',
                name: 'Helmer',
                lastname: 'Villarreal ',
                identificationType: 'CC',
                identification: '1051635340',
                email: 'helmer90@outlook.com',
                address: 'cra e3',
                phone: '32015151',
                isActive: true,
                roleId: 2,
                allyId: null,
                supervisorId: null,
                advisorStartDate: null,
                advisorEndDate: null,
                createdAt: '2023-07-21T18:35:22.315Z',
                updatedAt: '2023-07-21T18:33:00.000Z',
                ally: null,
                roles: {
                  id: 2,
                  name: 'superadministrador',
                  description: null,
                  isActive: true,
                  createdAt: '2023-07-21T18:27:04.982Z',
                  updatedAt: '2023-07-21T18:25:43.177Z',
                },
                supervisor: null,
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Usuario encontrado.' },
          },
        },
      },
    },
  },
  updateUserNotFoundResponse: {
    description: `Respuesta para usuario no actualizado.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {},
            statusCode: { type: 'number', example: 404 },
            message: {
              type: 'string',
              example: 'El usuario no pudo ser actualizado.',
            },
          },
        },
      },
    },
  },
  updateUserOkResponse: {
    description: 'Respuesta exitosa actualización de usuario.',
    content: {
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
            message: {
              type: 'string',
              example: 'Usuario actualizado correctamente.',
            },
          },
        },
      },
    },
  },
  getPermissionsOkResponse: {
    description: 'Respuesta consulta de permisos.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 7,
                  description: 'Crear producto',
                  path: '/products/create',
                  createdAt: '2023-07-15T16:53:41.271Z',
                  updatedAt: '2023-07-15T22:36:00.000Z',
                  code: 'PRO001',
                  moduleId: 2,
                  isActive: true,
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Lista de Permisos.' },
          },
        },
      },
    },
  },
  getByRolPermissionsOkResponse: {
    description: 'Respuesta consulta de permisos por rol.',
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
                  description: 'Crear usuario',
                  path: '/users/create',
                  createdAt: '2023-07-05T22:36:45.559Z',
                  updatedAt: '2023-07-05T22:36:00.000Z',
                  code: 'USER001',
                  moduleId: 1,
                  isActive: true,
                  rolesPermission: [
                    {
                      id: 1,
                      roleId: 1,
                      permissionId: 1,
                      createdAt: '2023-07-05T23:14:33.698Z',
                      updatedAt: '2023-07-05T23:14:00.000Z',
                    },
                  ],
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Lista de Permisos.' },
          },
        },
      },
    },
  },
  getByRoleIdUserOkResponse: {
    description: 'Respuesta exitosa consulta de usuarios por id de rol.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 473,
                  uid: '108bf273-3184-4a08-925a-3ede1c8264e7',
                  name: 'daniel',
                  lastname: 'tejeda',
                  identificationType: 'CC',
                  identification: '1143168652',
                  email: 'jfrodriguez@fundaciongruposocial.co',
                  address: 'recreo',
                  phone: '3504664166',
                  isActive: true,
                  roleId: 1,
                  allyId: 560,
                  createdAt: '2023-07-17T15:09:12.959Z',
                  updatedAt: '2023-07-17T15:33:15.633Z',
                  ally: {
                    id: 560,
                    uid: null,
                    name: 'exito',
                    lastname: '',
                    identificationType: 'CC',
                    identification: '105163539230',
                    email: 'helmervillarreald@gmail.com',
                    address: 'barrancabermeja',
                    phone: '3013555186',
                    isActive: true,
                    roleId: 2,
                    allyId: null,
                    createdAt: '2023-07-21T16:48:51.002Z',
                    updatedAt: '2023-07-21T16:51:56.097Z',
                  },
                  roles: {
                    id: 1,
                    name: 'administrador',
                    description: '',
                    isActive: true,
                    createdAt: '2023-07-05T23:41:52.888Z',
                    updatedAt: '2023-07-15T15:58:19.840Z',
                  },
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Usuarios encontrados.' },
          },
        },
      },
    },
  },
  getUserAndTokenByCodeOkResponse: {
    status: 200,
    description: 'Login exitoso.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              example: {
                user: {
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
                token:
                  'eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2Z1bmRhY2lvbmdydXBvc29jaWFsMWIyY3BvYy5iMmNsb2dpbi5jb20vMzJmYjc5YWQtYzdmOS00YzMwLThjYTMtMDViNzU2NTdkZGYxL3YyLjAvIiwic3ViIjoiNGJlYzdjODMtNzlhMy00MWExLWI3NjEtODRhNzM3NTY3NzA4IiwiYXVkIjoiOTg5MzM5MjktYWU2ZC00ZGI4LWFjYmYtNDIxNjVjNGQyYzNjIiwiZXhwIjoxNjg5NzY3NDI3LCJpYXQiOjE2ODk3Mzg2MjcsImF1dGhfdGltZSI6MTY4OTczODE4NSwib2lkIjoiNGJlYzdjODMtNzlhMy00MWExLWI3NjEtODRhNzM3NTY3NzA4IiwiZW1haWxzIjpbImhlbG1lcjkwQG91dGxvb2suY29tIl0sInRmcCI6IkIyQ18xX3NhbGVzLXNpZ25pbi1zaWdudXAiLCJuYmYiOjE2ODk3Mzg2Mjd9.iTLAMio4vd5EY2z0-RImvwcTdpDDJdhsKfqsev98SBJsEa1Y8pM3ewdechsrWtzd49O4gtY6Al0Qez_muspcREF6fnAQzS-6RhHtLhNrnFlg4okZ9E-9TRtDY1t_kr2LKm43xvpPTS-lfSqw6ojL4h_-BW4Wf30s8ycE2_KSQh8ACjd-BgZ4f7LYuVdH1dGfEJnwEXVgyVSuU0sJUEzLHsEbfaZT_W8knFFbHYCyY_hWnOsVMAbKsdDCF_LoOcExnWsGXTXMtAxV9iMKh2HRqxF7pTOKk31qkn2WKDwbwPPqo0Gn20cMmQAnbjkFl34D7S1f8wDOqfKkBecMXEadGw',
                idTokenClaims: {
                  ver: '1.0',
                  iss: 'https://fundaciongruposocial1b2cpoc.b2clogin.com/32fb79ad-c7f9-4c30-8ca3-05b75657ddf1/v2.0/',
                  sub: '4bec7c83-79a3-41a1-b761-84a737567708',
                  aud: '98933929-ae6d-4db8-acbf-42165c4d2c3c',
                  exp: 1689767427,
                  iat: 1689738627,
                  auth_time: 1689738185,
                  oid: '4bec7c83-79a3-41a1-b761-84a737567708',
                  emails: ['helmer90@outlook.com'],
                  tfp: 'B2C_1_sales-signin-signup',
                  nbf: 1689738627,
                },
                modules: [
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
                    ],
                  },
                ],
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Login exitoso.' },
          },
        },
      },
    },
  },
  getUserAndTokenByCodeUnauthorized: {
    description: 'Error al validar autenticación del usuario en B2C',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: { type: 'object', example: {} },
            statusCode: { type: 'number', example: 401 },
            message: {
              type: 'string',
              example:
                'No es posible validar la identidad del usuario, usuario inactivo o rol de usuario inactivo.',
            },
          },
        },
      },
    },
  },
  getAuthOkReponse: {
    description: `Url encontrada exitosamente.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'string',
              example:
                'https://fundaciongruposocial1b2cpoc.b2clogin.com/fundaciongruposocial1b2cpoc.onmicrosoft.com/b2c_1_sales-signin-signup/oauth2/v2.0/authorize?client_id=98933929-ae6d-4db8-acbf-42165c4d2c3c&scope=openid%20profile%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2F&client-request-id=1d8a3ffa-90b8-41eb-bc3d-c74648e2960d&response_mode=query&response_type=code&x-client-SKU=msal.js.node&x-client-VER=1.18.0&x-client-OS=win32&x-client-CPU=x64&client_info=1&state=login',
            },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Url encontrada exitosamente.',
            },
          },
        },
      },
    },
  },
  createLogsOkResponse: {
    description: 'Creacion del log exitosa.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              example: {
                actionUserId: 1,
                description: 'El Rol fue actualizado.',
                typeAction: 'ROLE_UPDATE',
                data: {
                  name: 'administrador-',
                  description: '',
                  isActive: true,
                },
                model: 'Roles',
                modelId: 1,
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Log creado correctamente.' },
          },
        },
      },
    },
  },
  badRequestResponse: {
    description: `Solicitud incorrecta.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            message: {
              type: 'array',
              example: [
                'actionUserId must be a positive number',
                'actionUserId must be a number conforming to the specified constraints',
              ],
            },
            error: {
              type: 'string',
              example: 'Solicitud incorrecta, retorna parámetros incorrectos.',
            },
          },
        },
      },
    },
  },
  getLogsUsersOkResponse: {
    description: 'Respuesta consulta de logs por usuario.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 15,
                  actionUserId: 1,
                  description: 'El usuario fue actualizado',
                  typeAction: 'USER_UPDATE',
                  data: '{"isActive":true,"advisorEndDate":null}',
                  model: 'Users',
                  modelId: 6,
                  createdAt: '2023-07-24T17:02:55.338Z',
                  users: {
                    id: 1,
                    uid: '108bf273-3184-4a08-925a-3ede1c8264e7',
                    name: 'Jamer',
                    lastname: 'Rodriguez',
                    identificationType: 'CC',
                    identification: '12345678',
                    email: 'jfrodriguez@fundaciongruposocial.co',
                    address: 'alle 20',
                    phone: '626546116',
                    isActive: true,
                    roleId: 2,
                    allyId: 1,
                    supervisorId: null,
                    advisorStartDate: null,
                    advisorEndDate: null,
                    createdAt: '2023-07-21T18:35:22.315Z',
                    updatedAt: '2023-07-24T03:54:07.351Z',
                  },
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Lista de logs.' },
          },
        },
      },
    },
  },
  createAlliesAdvisorOkResponse: {
    description:
      'Respuesta exitosa creación de registro de aliado asociado al asesor.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              id: 9,
              advisorId: 23,
              allyId: 24,
              createdAt: '2023-07-28T02:48:52.723Z',
              updatedAt: '2023-07-28T02:48:52.723Z',
            },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Registro creado correctamente.',
            },
          },
        },
      },
    },
  },
  conflictResponse: {
    description: `Respuesta para registros existentes.`,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: { type: 'object', example: {} },
            statusCode: { type: 'number', example: 409 },
            message: {
              type: 'string',
              example: 'Existe un registro con la misma información.',
            },
          },
        },
      },
    },
  },
  getAlliesAdvisorOkReponse: {
    description: 'Respuesta exitosa para consulta de aliados por id de asesor.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              example: [
                {
                  id: 25,
                  name: 'Exito',
                  lastname: '',
                  email: 'aliado4@aliado.com',
                  phone: '3504664166',
                },
                {
                  id: 24,
                  name: 'aliado 2',
                  lastname: 'aliado 3',
                  email: 'aliado3@aliado.com',
                  phone: '3504664166',
                },
              ],
            },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Registros encontrados.',
            },
          },
        },
      },
    },
  },
  deleteOkReponse: {
    description: 'Respuesta exitosa eliminación de registros.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          properties: {
            data: {},
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Registro eliminado correctamente.',
            },
          },
        },
      },
    },
  },
};
