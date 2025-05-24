# 🎮 GameStore - Plataforma de Venta de Videojuegos (41.3)


## 📌 Integrantes del proyecto

- Juan Francisco Del Rosario Machin
- Juan Boissier García
- Alberto José Rodríguez Ruano


## 📝 Descripción del proyecto

GameStore es una plataforma de comercio electrónico especializada en la venta de videojuegos digitales. Los usuarios pueden explorar un catálogo de juegos, ver detalles y reseñas, agregar productos al carrito y realizar compras de manera rápida y segura.


## 📋 Requisitos del proyecto

### Requisitos Funcionales (RF)

1. Los usuarios deben poder iniciar, cerrar sesión, y registrarse.
2. Los usuarios deben poder pagar con el método de pago definido que prefieran.
3. Los usuarios deben poder agregar y eliminar productos del carrito.
4. Los usuarios deben poder ver su historial de compras.
5. Los usuarios deben poder recuperar su contraseña en caso de olvido.
6. Los usuarios deben poder dejar una reseña en los juegos disponibles.
7. El sistema debe permitir a los usuarios buscar juegos por filtros.
8. Los usuarios podrán ordenar las reseñas por fecha.
9. Los usuarios deben poder cambiar los datos de su perfil.
10. Los usuarios deben poder cambiar el idioma.

### Requisitos No Funcionales (RNF)

1. La web debe manejar fuentes del alfabeto en inglés.
2. Se deben aceptar múltiples métodos de pago (tarjeta de crédito, PayPal, Bizum).
3. Cada videojuego debe tener una descripción, imágenes, precio y calificación de usuarios.
4. Se dispondrán juegos similares para cada videojuego, facilitando así la búsqueda.
5. El sistema debe calcular automáticamente el total de la compra.
6. Debe de tener una temática atractiva visualmente usando una escala de colores de rojo, azul y morado.
7. Permitir una fácil interacción.


## 📂 Estructura del proyecto IONIC

<pre>
GameStore-Ionic/
├── src/                 # Código fuente del proyecto
│   ├── app/             # Módulo principal de la aplicación Angular
│   │   ├── components/  # Componentes reutilizables de la aplicación
│   │   ├── models/      # Modelos de datos para la aplicación 
│   │   ├── pages/       # Páginas principales de la aplicación
│   │   ├── services/    # Servicios para lógica y comunicación 
│   │   ├── app.component.*  # Componente raíz de la aplicación (HTML, CSS, TS)
│   │   ├── app.config.ts    # Configuración de la aplicación
│   │   ├── app.routes.ts    # Rutas de la aplicación
│   ├── environments/    # Configuraciones de entorno (Firebase)
│   ├── assets/    # Recursos estáticos accesibles públicamente
|   |   ├── genos/           # Fuente Genos
│   |   ├── imgs/            # Imágenes del proyecto
│   |   ├── icon/            # Iconos del proyecto  
│   |   ├── fonts.css        # Estilos de fuentes personalizadas
│   ├── themes/          # Carpeta que contiene un archivo sccs donde se definen las variables 
│   ├── global.scss      # Archivo scss con las especificaciones defaults para toda la página
│   ├── index.html       # Archivo HTML principal de la aplicación
│   ├── main.ts          # Punto de entrada de la aplicación Angular
│   ├── styles.css       # Estilos globales del proyecto
</pre>


## 🔥 Estructura del proyecto FIREBASE STORE

<pre>
GameStore-Firestore-Database/
├── developers/              # Información sobre los desarrolladores del proyecto
├── games/              # Información sobre los juegos disponiblles en el catálogo
├── reviews/              # Reviews publicadas
├── users/              # Usuarios registrados
</pre>


## 📦 Estructura del proyecto FIREBASE STORAGE

<pre>
GameStore-Storage/
├── profilePictures/            # Imágenes de perfil de cada usuario
</pre>

## 📄 Páginas (Templates) del proyecto

Estas son las páginas de nuestra web. Estas carpetas contienen: name.html, name.css, name.ts, name.spec.ts.  

|  Página         | Notas                              |
| ---------------  | ---------------------------------- |
| `landing-page`  | Página de inicio                   |
| `advanced-search-page`    | Página de busqueda avanzada                  |
| `game-showcae-page`    | Página del título seleccionado                   |
| `view-more-section-page` | Página de ver más                   |
| `login-page`    | Página de login de usuario                   |
| `forgot-password-page` | Página de contraseña olvidada                   |
| `otp-verification-page`    | Página de verificación de código                   |
| `sign-up-page`    | Página de signUp                   |
| `reset-password-page` | Página de cambio de contraseña                   |
| `user-settings-page`  | Página de configuración de usuario                   |
| `my-reviews` | Página de reseñas de usuario                   |
| `my-orders`  | Página de pedidos de usuario                   |
| `cart` | Página de carrito                   |
| `checkout`  | Página de pago                   |
| `about-us-page`  | Página de AboutUs                   |

## 🖼️ Componentes (Templates) utilizados

Estos son los componentes que son cargados en las páginas de la web. Estas carpetas contienen: name.html, name.css, name.ts, name.spec.ts.  

| Componente     | Componente de página en el que se carga (Componentes situados en /src/app/pages)      |
| -------------------- | ------------------------------- |
| `main-header`        | Todas las páginas menos en advanced-search-page               |
| `secondary-header`        | advanced-search-page               |
| `footer`        | Todos los componentes de página               |
| `game-card`        | Páginas que usan games-gallery y games-card-section|
| `item-cart-component`        | En el componente cart               |
| `order`        | En el componente cart               |
| `developer-card`        | about-us               |
| `user-nav-bar`        | user-settings-page, my-orders y my-reviews               |
| `review-with-game-info`        | my-reviews               |
| `review-with-user-info`        | my-reviews               |
| `game-gallery`        | advanced-search-page y view-more-sections-page               |
| `game-card-section`        | landing-page y game-showcase-page               |


## 🖥️ Modelos (Interfaces) utilizados

A continuación, se describen los modelos utilizados en el proyecto, los cuales definen la estructura de datos para las entidades principales de la aplicación.  

| Modelo     | Propósito      |
| -------------------- | ------------------------------- |
| `Developer`        |  Representa a un desarrollador del equipo   |
| `Game`        |  Representa un juego en la tienda |
| `Review`        | Representa una reseña de un juego  |
| `User`        | Representa un usuario de la plataforma |

## ⚙️ Servicios utilizados

Estos son los servicios del proyecto, encargados de la lógica de negocio y la comunicación con el backend. Cada uno contiene un archivo ts y spec.ts

| Servicio     | Propósito      |
| -------------------- | ------------------------------- |
| `auth`        |  Gestiona la autenticación de usuarios (Register y login)   |
| `firestorage`        |  Maneja el almacenamiento de archivos |
| `firestore`        | Administra la base de datos en tiempo real  |
| `game-search`        | Facilita la búsqueda de juegos |
| `game-section-transfer`        | Transfiere datos entre secciones de juegos |


## ➕ Otros aspectos

Hemos implementado Bootstrap en nuestro proyecto, siguiendo la recomendación del profesorado, lo que ha enriquecido significativamente nuestro trabajo. Bootstrap, un framework front-end de código abierto, nos ha permitido desarrollar una interfaz responsive y visualmente atractiva de manera eficiente. Gracias a su sistema de cuadrícula flexible, componentes predefinidos como botones, formularios y barras de navegación, y estilos CSS optimizados, hemos logrado una experiencia de usuario consistente y adaptable a diferentes dispositivos, acelerando el desarrollo y asegurando un diseño moderno y funcional que cumple con los estándares actuales de la web.

## 🔗 Enlaces

- **Figma**: [https://www.figma.com/design/cce85AsKYbHsWryGC4aJGa/MOCKUPS-PWM?m=auto&t=PlizMet0r5Rgm5UZ-6](#)
- **Trello**: [https://trello.com/b/eEGWSKRv/tablero-pwm-sprint-4](#)
- **PowerPoint**: [https://alumnosulpgc-my.sharepoint.com/:p:/g/personal/alberto_rodriguez136_alu_ulpgc_es/ESOs6h63a-FInuf2RN01HvEBbM0Iv3EO8yjkpIpmClzWrQ ](#)
