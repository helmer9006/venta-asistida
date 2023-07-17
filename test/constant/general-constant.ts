export const GeneralTestConstant = {
  ONCE: 1,
  ZERO: 0,
};

export const testExpectValues = {
  genericResponse: {
    GenericResponse: {
      statusCode: 500,
      message: 'Error del servidor.',
      data: [],
    },
  },

  user: {
    id: 21,
    uid: 'asdf1asdf-a1sdfasd1f-asd1fa1dfs',
    name: 'Helmer',
    lastname: 'Villareal',
    identificationType: 'CC',
    identification: '1051635340',
    phone: '3013555186',
    address: 'barrancabermeja',
    email: 'helmervillarreal@gmail.com',
    roleId: 2,
    isActive: true,
    createdAt: new Date('2023-07-10T02:12:50.070Z'),
    updatedAt: new Date('2023-07-10T02:12:50.070Z'), 
  },

  userFake: {
    id: 20,
    uid: 'asdf1asdf-a1sdfasd1f-asd1fa1dfs',
    name: 'Test',
    lastname: 'Pepito plaza',
    identificationType: 'CC',
    identification: '1051655348',
    phone: '3013555186',
    address: 'barrancabermeja',
    email: 'test123@vasscompany.com',
    roleId: 2,
    isActive: false,
    createdAt: new Date('2023-07-10T02:12:50.070Z'),
    updatedAt: new Date('2023-07-10T02:12:50.070Z'),
  },

  createRoleDto: {
    name: 'test_role',
    description: 'test admistrador del sistema',
    permissions: [],
    isActive: false,
    createdAt: undefined,
    updatedAt: undefined,
  },

  role: {
    id: 1000,
    name: 'test_role',
    description: 'test admistrador del sistema',
    permissions: [],
    isActive: false,
    createdAt: undefined,
    updatedAt: undefined,
  },


  paginationDto: {
    limit: 3,
    offset: 0,
  },

  createUserDto: {
    uid: 'asdf1asdf-a1sdfasd1f-asd1fa1dfs',
    name: 'Test',
    lastname: 'Pepito plaza',
    identificationType: 'CC',
    identification: '1051655348',
    phone: '3013555186',
    address: 'barrancabermeja',
    email: 'test123@vasscompany.com',
    roleId: 2,
    isActive: false,
    createdAt: undefined,
    updatedAt: undefined,
  },

  rolesPermissions:[
    { roleId: 101, permissionId: 2 },
    { roleId: 101, permissionId: 3 },
    { roleId: 101, permissionId: 4 }
  ],

  userUpdated: {
    id: 20,
    uid: 'asdf1asdf-a1sdfasd1f-asd1fa1dfs',
    name: 'Nuevo Nombre',
    lastname: 'Nuevo Apellido',
    identificationType: 'CC',
    identification: '1051655348',
    phone: '3013555186',
    address: 'barrancabermeja',
    email: 'test123@vasscompany.com',
    roleId: 2,
    isActive: false,
    createdAt: new Date('2023-07-10T02:12:50.070Z'),
    updatedAt: new Date('2023-07-10T02:12:50.070Z'),
  },

  dataUpdateUserDto: {
    name: 'Nuevo Nombre',
    lastname: 'Nuevo Apellido',
    isActive: false,
  },

  dataUpdateRoleDto: {
    name: 'Administrador test 2',
    description: 'administra parte del sistema',
    permissions: [],
  },

  permissions: [
    {
      id: 1,
      description: 'crear usuarios',
      path: '/user/create',
      createdAt: '2023-07-05 22:36:45.559',
      updatedAt: '2023-07-05 22:36:45.559',
      code: 'USER001',
      moduleId: 1,
      isActive: true
    }
  ],

};
