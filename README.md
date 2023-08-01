<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://seeklogo.com/images/C/colmena-seguros-logo-5CB9AA6612-seeklogo.com.png" width="200" alt="Nest Logo" /></a>
</p>

🥼🧪 PROYECTO DE VENTA ASISTIDA COLMENA

Proyecto de venta asistida para la ejecución y gestión de ventas de productos de afinidad.

# Ejecutar proyecto

1. Clonar el repositorio

```
https://github.com/helmer9006/venta-asistida.git
```

2. Ejecutar

```
npm install
```

3. Tener Nest CLI instalado

```
npm install -g @nestjs/cli
```

4. Validar variables de entorno para conexión a la base de datos según ambiente.

```
DATABASE_URL=uriconexiondbaquí
```

5. Generar contenedor de api

```
docker-compose up -d
```

5. Clonar el archivo `.env.template` y renombrar la copia a `.env`

6. Llenar las variables de entorno definidas en el `.env`

7. Ejecutar aplicación en dev:
   ```
   npm start:dev
   ```

# Build de producción

1. Crear el archivo `.env.prod` y `docker-compose.prod.yaml`
2. Diligenciar los archivos según corresponda con las variables de entorno
3. Crear la nueva imagen

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Stack usado

- PostgreSQL
- NestJS
- Prisma ORM

# Notas

- **Modulo de prisma**:

Para acceso a base de datos, recordar ejecutar el comando de generacion antes de trabajar con los dtos y clases del cliente de prisma.

```sh
npx prisma generate
```

importante que cuando se haga cambios al modelo, regenerar las migraciones con los siguiente comandos:

```sh
npx prisma generate
npx prisma db push
```
