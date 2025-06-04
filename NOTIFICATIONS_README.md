# Sistema de Notificaciones - FRESATERRA

## Descripción
Sistema completo de notificaciones que consume la API REST de Laravel para gestionar notificaciones de usuarios.

## Estructura de Archivos

### Servicios
- `src/Services/notificaciones.js` - Servicio principal para consumir la API de notificaciones

### Componentes
- `src/components/NotificationBell.jsx` - Campana de notificaciones para el navbar
- `src/components/NotificationsList.jsx` - Lista completa de notificaciones con filtros

### Páginas
- `src/pages/NotificationsPage.jsx` - Página principal de notificaciones

## Funcionalidades Implementadas

### NotificationBell Component
- ✅ Icono de campana con contador de notificaciones no leídas
- ✅ Dropdown con las 5 notificaciones más recientes
- ✅ Auto-refresh cada 30 segundos
- ✅ Marcar notificaciones como leídas
- ✅ Integrado en el Navbar (desktop y móvil)

### NotificationsList Component
- ✅ Lista completa de notificaciones del usuario
- ✅ Filtros: Todas, No leídas, Leídas
- ✅ Iconos diferenciados por tipo de notificación
- ✅ Marcar como leída individualmente
- ✅ Eliminar notificaciones
- ✅ Marcar todas como leídas (bulk action)
- ✅ Diseño responsivo

### Servicio de Notificaciones
- ✅ `getNotificaciones()` - Obtener todas las notificaciones
- ✅ `getNotificacion(id)` - Obtener notificación específica
- ✅ `getUserNotifications()` - Notificaciones del usuario autenticado
- ✅ `getUnreadNotifications()` - Notificaciones no leídas
- ✅ `crearNotificacion(data)` - Crear nueva notificación
- ✅ `notificarConMensaje(data)` - Crear notificación con mensaje existente
- ✅ `actualizarNotificacion(id, data)` - Actualizar notificación
- ✅ `marcarComoLeida(id)` - Marcar como leída
- ✅ `marcarTodasComoLeidas()` - Marcar todas como leídas
- ✅ `eliminarNotificacion(id)` - Eliminar notificación
- ✅ `getMensajes()` - Obtener mensajes disponibles

## Endpoints de la API Laravel

El servicio está configurado para consumir los siguientes endpoints:

```
GET    /api/v1/notifications           - Todas las notificaciones
GET    /api/v1/notifications/{id}      - Notificación específica
GET    /api/v1/notifications/user      - Notificaciones del usuario
GET    /api/v1/notifications/unread    - Notificaciones no leídas
POST   /api/v1/notifications           - Crear notificación
POST   /api/v1/notifications/notify-with-message - Crear con mensaje
PATCH  /api/v1/notifications/{id}      - Actualizar notificación
PATCH  /api/v1/notifications/{id}/mark-read - Marcar como leída
PATCH  /api/v1/notifications/mark-all-read - Marcar todas como leídas
DELETE /api/v1/notifications/{id}      - Eliminar notificación
GET    /api/v1/messages                - Obtener mensajes
```

## Tipos de Notificaciones Soportados

- **promocion** - Notificaciones de promociones y ofertas (icono verde)
- **pedido** - Notificaciones relacionadas con pedidos (icono azul)
- **sistema** - Notificaciones del sistema (icono gris)
- **alerta** - Notificaciones de alerta o importante (icono rojo)

## Integración en la Aplicación

### Navbar
- El `NotificationBell` está integrado en el navbar para usuarios autenticados
- Aparece entre el carrito de compras y el menú de usuario
- Disponible en versión desktop y móvil

### Rutas
- `/notifications` - Página principal de notificaciones (requiere autenticación)

### Menús
- Enlace en el dropdown del usuario (desktop)
- Enlace en el menú móvil
- Redirección automática a login si no está autenticado

## Configuración

### API URL
La URL base de la API se configura en `src/Services/notificaciones.js`:
```javascript
const API_URL = 'http://localhost:8000/api/v1/notifications';
```

### Polling
Las notificaciones se actualizan automáticamente cada 30 segundos cuando el componente `NotificationBell` está montado.

## Próximos Pasos Sugeridos

1. ✅ Integrar autenticación JWT para secure API calls
2. ✅ Implementar WebSockets para notificaciones en tiempo real
3. ✅ Agregar notificaciones push del navegador
4. ✅ Implementar sistema de preferencias de notificaciones
5. ✅ Agregar soporte para notificaciones con imágenes
6. ✅ Implementar archivado de notificaciones

## Uso

Para usar el sistema de notificaciones:

1. Asegúrate de que la API de Laravel esté ejecutándose
2. El usuario debe estar autenticado
3. Las notificaciones aparecerán automáticamente en la campana del navbar
4. Los usuarios pueden acceder a la página completa desde `/notifications`

## Dependencias

- React Router para navegación
- Axios para peticiones HTTP
- Lucide React para iconos
- Tailwind CSS para estilos
