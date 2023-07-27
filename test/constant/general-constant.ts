
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

  rolesPermissions: [
    { roleId: 101, permissionId: 2 },
    { roleId: 101, permissionId: 3 },
    { roleId: 101, permissionId: 4 },
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
      isActive: true,
    },
  ],

  payloadCreateLog: {
    description: 'Nuevo rol creado en el sistema.',
    typeAction: 'ROLE_CREATE',
    data: '{"id":1000,"name":"Administrador test 2","description":"administra parte del sistema","permissions":[],"isActive":false,"createdAt":"2023-07-05 22:36:45.559","updatedAt":"2023-07-05 22:36:45.559"}',
    createdAt: new Date(),
    actionUserId: 1,
    model: 'Roles',
    modelId: 2,
  },
  payloadCreateLogError: {
    data: '{"id":1000,"name":"Administrador test 2","description":"administra parte del sistema","permissions":[],"isActive":false,"createdAt":"2023-07-05 22:36:45.559","updatedAt":"2023-07-05 22:36:45.559"}',
    createdAt: new Date(),
    model: 'Roles',
    modelId: 2,
  },

  payloadGetLogs: {
    modelId: 1,
    model: 'Users',
    startDate: new Date(),
    endDate: new Date(),
  },
  ErrorDatePayloadGetLogs: {
    modelId: 1,
    model: 'Users',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
  },
  pagination: {
    limit: 10,
    offset: 1,
  },

  payloadAllyFound: {
    id: 1,
    uid: 'asdf1asdf-a1sdfasd1f-asd1fa1dfs',
    name: 'Test',
    lastname: 'Pepito plaza',
    identificationType: 'CC',
    identification: '1051655348',
    phone: '3013555186',
    address: 'barrancabermeja',
    email: 'test123@vasscompany.com',
    roleId: 4,
    allyId: null,
    advisorEndDate: null,
    advisorStartDate: null,
    supervisorId: null,
    isActive: true,
    createdAt: new Date('2023-07-10T02:12:50.070Z'),
    updatedAt: new Date('2023-07-10T02:12:50.070Z'),
  },

  payloadCreateConfigAlly: {
    allyId: 6,
    attributes: "[{\"name\":\"firtsName\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"secondName\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"surname\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"secondSurname\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"birthdate\",\"required\":true,\"disabled\":false,\"type\":\"date\"},{\"name\":\"department\",\"required\":true,\"disabled\":false,\"type\":\"select\"},{\"name\":\"municipality\",\"required\":true,\"disabled\":false,\"type\":\"select\"},{\"name\":\"identificationType\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"identification\",\"required\":true,\"disabled\":false,\"type\":\"number\"},{\"name\":\"expeditionDate\",\"required\":true,\"disabled\":false,\"type\":\"date\"},{\"name\":\"expeditionPlace\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"gender\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"address\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"phoneNumber\",\"required\":true,\"disabled\":false,\"type\":\"number\"},{\"name\":\"email\",\"required\":true,\"disabled\":false,\"type\":\"text\"}]",
    dataPolicy: 'En cumplimiento de las disposiciones de la Ley 1581 de 2012 y del Decreto reglamentario 1377 de 2013 que desarrollan el derecho de habeas data...',
    noEssentialDataPolicy: "[{\"name\":\"Recibir notificaciones sms\",\"disabled\":true,\"type\":\"text\"},{\"name\":\"Recibir notificaciones whatsApp\",\"disabled\":false,\"type\":\"text\"}]",
  },

  payloadUpdateConfigAlly: {
    allyId: 6,
    attributes: "[{\"name\":\"firtsName\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"secondName\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"surname\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"secondSurname\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"birthdate\",\"required\":false,\"disabled\":false,\"type\":\"date\"},{\"name\":\"department\",\"required\":false,\"disabled\":false,\"type\":\"select\"},{\"name\":\"municipality\",\"required\":false,\"disabled\":false,\"type\":\"select\"},{\"name\":\"identificationType\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"identification\",\"required\":false,\"disabled\":false,\"type\":\"number\"},{\"name\":\"expeditionDate\",\"required\":false,\"disabled\":false,\"type\":\"date\"},{\"name\":\"expeditionPlace\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"gender\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"address\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"phoneNumber\",\"required\":false,\"disabled\":false,\"type\":\"number\"},{\"name\":\"email\",\"required\":false,\"disabled\":false,\"type\":\"text\"}]",
  },

  payloadAttributesIncomplete: "[{\"name\":\"secondName\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"surname\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"secondSurname\",\"required\":false,\"disabled\":false,\"type\":\"text\"},{\"name\":\"birthdate\",\"required\":true,\"disabled\":false,\"type\":\"date\"},{\"name\":\"department\",\"required\":true,\"disabled\":false,\"type\":\"select\"},{\"name\":\"municipality\",\"required\":true,\"disabled\":false,\"type\":\"select\"},{\"name\":\"identificationType\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"identification\",\"required\":true,\"disabled\":false,\"type\":\"number\"},{\"name\":\"expeditionDate\",\"required\":true,\"disabled\":false,\"type\":\"date\"},{\"name\":\"expeditionPlace\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"gender\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"address\",\"required\":true,\"disabled\":false,\"type\":\"text\"},{\"name\":\"phoneNumber\",\"required\":true,\"disabled\":false,\"type\":\"number\"},{\"name\":\"email\",\"required\":true,\"disabled\":false,\"type\":\"text\"}]",
  
  ATTRIBUTES_REQUIRED_FORM_BASE: [
    'firtsName',
    'secondName',
    'surname',
    'secondSurname',
    'birthdate',
    'department',
    'municipality',
    'identificationType',
    'identification',
    'expeditionDate',
    'expeditionPlace',
    'gender',
    'address',
    'phoneNumber',
    'email',
  ],
};


