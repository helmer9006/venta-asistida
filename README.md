## 📗 CS - venta-asistida

🥼🧪 LABORATORIO DIGITAL COLMENA

Plantilla base para proyectos de laboratorio digital, compuesto de los siguientes componentes

- 🛡️ **Autenticación**: Se tiene guard para validación sencilla de token JWT

- 👮‍♂️ **Autorización**: Se implementa validación de rol a partir de un JWT a través de un módulo para registrar roles que se necesiten.

- **Feature Flags**:

'''
docker run -e POSTGRES_PASSWORD=some_password -e POSTGRES_USER=unleash_user -e POSTGRES_DB=unleash --network unleash --name postgres postgres
docker run -p 4242:4242 -e DATABASE_HOST=postgres -e DATABASE_NAME=unleash -e DATABASE_USERNAME=unleash_user -e DATABASE_PASSWORD=some_password -e DATABASE_SSL=false --network unleash unleashorg/unleash-server
'''

- **Modulo de prisma**:

Para acceso a base de datos, recordar ejecutar el comando de generacion antes de trabajar con los dtos y clases del cliente de prisma 

```sh
npx prisma generate
```

importante que cuando se haga cambios al modelo, regenerar las migraciones con los siguiente

```sh
npx prisma generate
npx prisma db push
```

- **Modulo para consumos externo**:

Aqui se aloja un ejemplo de como hacer consumo externo hacia algun servicio en particular