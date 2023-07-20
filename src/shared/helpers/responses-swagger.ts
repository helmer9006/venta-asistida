export const SW_RESPONSES = {
    createUserOkResponse: {
        description: 'Respuesta exitosa creación de usuario.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object', example: {
                                "id": 15,
                                "uid": "4bec7c83-79a3-41a1-b761-84a737567708",
                                "name": "jose",
                                "lastname": "pirela",
                                "identificationType": "CC",
                                "identification": "1051635343",
                                "email": "helmer90@outlook.com",
                                "address": "barrancabermeja",
                                "phone": "3013555186",
                                "isActive": true,
                                "roleId": 2,
                                "createdAt": "2023-07-10T01:55:20.176Z",
                                "updatedAt": "2023-07-14T00:12:00.708Z",
                                "roles": {
                                    "id": 2,
                                    "name": "superadministrador",
                                    "description": "test",
                                    "isActive": true,
                                    "createdAt": "2023-07-05T23:44:41.402Z",
                                    "updatedAt": "2023-07-17T22:03:54.774Z"
                                }
                            },
                        },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Usuario creado correctamente.' },
                    },
                },
            },
        }
    },
    createUserUnauthorizeResponse: {
        description: `Usuario no creado por falta de privilegios.`, content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {},
                        statusCode: { type: 'number', example: 401 },
                        message: { type: 'string', example: 'No tiene permisos necesario para acceder al recurso.' },
                    },
                },
            },
        },
    },
    errorServerResponse: {
        description: 'Error inesperado del servidor.', content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object', example: {}
                        },
                        statusCode: { type: 'number', example: 500 },
                        message: { type: 'string', example: 'Error inesperado del servidor' },
                    },
                },
            },
        },
    },
    userConflictResponse: {
        description: `Respuesta para usuarios duplicados por identificación o correo.`, content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {},
                        statusCode: { type: 'number', example: 409 },
                        message: { type: 'string', example: 'El usuario ya se encuentra registrado.' },
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
                            type: 'array', example: [{
                                "id": 15,
                                "uid": "4bec7c83-79a3-41a1-b761-84a737567708",
                                "name": "jose",
                                "lastname": "pirela",
                                "identificationType": "CC",
                                "identification": "1051635343",
                                "email": "helmer90@outlook.com",
                                "address": "barrancabermeja",
                                "phone": "3013555186",
                                "isActive": true,
                                "roleId": 2,
                                "createdAt": "2023-07-10T01:55:20.176Z",
                                "updatedAt": "2023-07-14T00:12:00.708Z",
                                "roles": {
                                    "id": 2,
                                    "name": "superadministrador",
                                    "description": "test",
                                    "isActive": true,
                                    "createdAt": "2023-07-05T23:44:41.402Z",
                                    "updatedAt": "2023-07-17T22:03:54.774Z"
                                }
                            },]
                        },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Usuarios encontrados.' },
                    },
                },
            },
        },
    },
    getTermUserOkResponse: {
        description: 'Respuesta consulta de usuario por id, uid o nombre.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array', example: [{
                                "id": 15,
                                "uid": "4bec7c83-79a3-41a1-b761-84a737567708",
                                "name": "jose",
                                "lastname": "pirela",
                                "identificationType": "CC",
                                "identification": "1051635343",
                                "email": "helmer90@outlook.com",
                                "address": "barrancabermeja",
                                "phone": "3013555186",
                                "isActive": true,
                                "roleId": 2,
                                "createdAt": "2023-07-10T01:55:20.176Z",
                                "updatedAt": "2023-07-14T00:12:00.708Z",
                                "roles": {
                                    "id": 2,
                                    "name": "superadministrador",
                                    "description": "test",
                                    "isActive": true,
                                    "createdAt": "2023-07-05T23:44:41.402Z",
                                    "updatedAt": "2023-07-17T22:03:54.774Z"
                                }
                            },]
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
                            type: 'object', example: {
                                "id": 15,
                                "uid": "4bec7c83-79a3-41a1-b761-84a737567708",
                                "name": "jose",
                                "lastname": "pirela",
                                "identificationType": "CC",
                                "identification": "1051635343",
                                "email": "helmer90@outlook.com",
                                "address": "barrancabermeja",
                                "phone": "3013555186",
                                "isActive": true,
                                "roleId": 2,
                                "createdAt": "2023-07-10T01:55:20.176Z",
                                "updatedAt": "2023-07-14T00:12:00.708Z",
                                "roles": {
                                    "id": 2,
                                    "name": "superadministrador",
                                    "description": "test",
                                    "isActive": true,
                                    "createdAt": "2023-07-05T23:44:41.402Z",
                                    "updatedAt": "2023-07-17T22:03:54.774Z"
                                }
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
        description: `Respuesta para usuario no actualizado.`, content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {},
                        statusCode: { type: 'number', example: 404 },
                        message: { type: 'string', example: 'El usuario no pudo ser actualizado.' },
                    },
                },
            },
        },
    },
    unauthorizeResponse: {
        description: `Falta de privilegios.`, content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {},
                        statusCode: { type: 'number', example: 401 },
                        message: { type: 'string', example: 'No tiene permisos necesario para acceder al recurso.' },
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
                            type: 'object', example: {
                                "id": 15,
                                "uid": "4bec7c83-79a3-41a1-b761-84a737567708",
                                "name": "jose",
                                "lastname": "pirela",
                                "identificationType": "CC",
                                "identification": "1051635343",
                                "email": "helmer90@outlook.com",
                                "address": "barrancabermeja",
                                "phone": "3013555186",
                                "isActive": true,
                                "roleId": 2,
                                "createdAt": "2023-07-10T01:55:20.176Z",
                                "updatedAt": "2023-07-14T00:12:00.708Z",
                                "roles": {
                                    "id": 2,
                                    "name": "superadministrador",
                                    "description": "test",
                                    "isActive": true,
                                    "createdAt": "2023-07-05T23:44:41.402Z",
                                    "updatedAt": "2023-07-17T22:03:54.774Z"
                                }
                            },
                        },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Usuario actualizado correctamente.' },
                    },
                },
            },
        }
    },
    getPermissionsOkResponse: {
        description: 'Respuesta consulta de permisos.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array', example: [
                                {
                                    "id": 7,
                                    "description": "Crear producto",
                                    "path": "/products/create",
                                    "createdAt": "2023-07-15T16:53:41.271Z",
                                    "updatedAt": "2023-07-15T22:36:00.000Z",
                                    "code": "PRO001",
                                    "moduleId": 2,
                                    "isActive": true
                                },],
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
                            type: 'array', example: [
                                {
                                    "id": 1,
                                    "description": "Crear usuario",
                                    "path": "/users/create",
                                    "createdAt": "2023-07-05T22:36:45.559Z",
                                    "updatedAt": "2023-07-05T22:36:00.000Z",
                                    "code": "USER001",
                                    "moduleId": 1,
                                    "isActive": true,
                                    "rolesPermission": [
                                        {
                                            "id": 1,
                                            "roleId": 1,
                                            "permissionId": 1,
                                            "createdAt": "2023-07-05T23:14:33.698Z",
                                            "updatedAt": "2023-07-05T23:14:00.000Z"
                                        }
                                    ]
                                }],
                        },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Lista de Permisos.' },
                    },
                },
            },
        },
    },
}
