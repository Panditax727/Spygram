<h1 align="center">🕵️ Spygram</h1>

<p align="center">
  <b>Descubre quién no te sigue de vuelta en Instagram.</b><br>
  Script para el navegador con panel en español, sin instalar nada.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versión-1.2-ff6a98" alt="Versión 1.2">
  <img src="https://img.shields.io/badge/idioma-español-c8285e" alt="Idioma: español">
  <img src="https://img.shields.io/badge/JavaScript-puro-f7df1e?logo=javascript&logoColor=black" alt="JavaScript puro">
  <img src="https://img.shields.io/badge/plataformas-PC%20·%20Android%20·%20iPhone-555" alt="Plataformas">
</p>

---

## ✨ Qué hace

- **No te siguen:** cuentas que sigues pero que no te siguen de vuelta.
- **No sigues de vuelta:** cuentas que te siguen y tú no sigues.
- **Te dejaron de seguir:** compara con tu escaneo anterior y te dice quién se fue.
- **Lista blanca (★):** marca famosos, marcas o amigos para que nunca aparezcan como candidatos.
- **Dejar de seguir con pausas seguras:** esperas aleatorias, descansos cada 10 cuentas y límite por sesión. *(experimental, ver abajo)*
- **Buscador y filtros:** por usuario o nombre, y ocultar cuentas verificadas.
- **Copiar la lista** de usuarios con un clic.
- **Todo en español** y sin servidores: tus datos no salen de tu navegador.

## 📦 Archivos

| Archivo | Para qué sirve |
|---|---|
| [`spygram.js`](spygram.js) | El script. Se pega en la consola del navegador en instagram.com. |
| [`spygram-marcador.txt`](spygram-marcador.txt) | El mismo script en formato marcador (bookmarklet), para usarlo en el móvil. |
| [`index.html`](index.html) | Versión web sin iniciar sesión: analiza la descarga de datos que te da Instagram. |

---

## 🖥️ Uso en el ordenador (Chrome, Edge, Brave, Firefox)

1. Abre **[instagram.com](https://www.instagram.com)** e inicia sesión.
2. Pulsa **`F12`** (o `Ctrl + Mayús + J`) y ve a la pestaña **Consola**.
3. La primera vez, el navegador no te dejará pegar código. Escribe `allow pasting` (o `permitir pegar`) y pulsa Intro.
4. Copia todo el contenido de [`spygram.js`](spygram.js), pégalo en la consola y pulsa Intro.
5. En el panel que aparece a la derecha, pulsa **Escanear**.

> 💡 **Tip:** en Chrome/Brave/Edge puedes guardarlo como *Snippet* (DevTools → Sources → Snippets) y ejecutarlo con `Ctrl + Enter` cada vez que quieras.

## 📱 Uso en el móvil

<details>
<summary><b>Android (Chrome)</b></summary>

1. Copia todo el contenido de [`spygram-marcador.txt`](spygram-marcador.txt).
2. Guarda cualquier página como marcador (☆), edítalo, ponle de nombre `spygram` y pega el texto en el campo **URL**.
3. Abre **instagram.com** en Chrome (no en la app) con tu sesión iniciada.
4. Escribe `spygram` en la barra de direcciones y **toca la sugerencia del marcador**. Si pulsas Intro, Chrome hace una búsqueda y no funciona.
</details>

<details>
<summary><b>iPhone (Safari)</b></summary>

1. Copia todo el contenido de [`spygram-marcador.txt`](spygram-marcador.txt).
2. Añade cualquier página a Marcadores → **Editar** → toca el marcador nuevo.
3. Cambia el nombre a `Spygram` y reemplaza la dirección con el texto copiado.
4. Abre **instagram.com** en Safari con tu sesión iniciada, abre Marcadores y toca **Spygram**.
</details>

## 🔒 Modo sin iniciar sesión (100 % seguro)

Si no quieres ejecutar nada en tu cuenta, abre [`index.html`](index.html) en el navegador y usa la descarga oficial de tus datos:

1. En Instagram: **Configuración** → **Centro de cuentas** → **Tu información y permisos** → **Descargar tu información**.
2. Elige **Parte de tu información** → **Seguidores y seguidos**.
3. Formato **JSON**, intervalo **Desde el principio** → **Crear archivos**.
4. Cuando te llegue el correo, descarga el `.zip` y arrástralo a la página.

Este modo no toca tu cuenta en absoluto, así que no hay ningún riesgo de bloqueo.

---

## ⚠️ Cómo usarlo sin que Instagram te limite

| Recomendación | Por qué |
|---|---|
| No pases de **100–150 unfollows al día** | Instagram limita las cuentas con actividad masiva. |
| Hazlo en **tandas de 30–40** separadas por horas | Parece actividad normal. |
| Usa el modo **"Muy seguro" (45–90 s)** | Sobre todo si tu cuenta es nueva o tiene poca actividad. |
| Si ves **"Intenta más tarde"**, para y espera **24–48 h** | Insistir alarga la limitación. Spygram se detiene solo si lo detecta. |
| No lo uses a la vez que otras apps de seguidores | Suma actividad y aumenta el riesgo. |

> **Estado del unfollow automático: experimental.** Instagram cambia sus rutas internas a menudo. Si ves `No se pudo con @usuario` en el registro del panel, el escaneo sigue funcionando: usa la lista y deja de seguir a mano desde el enlace de cada perfil. Spygram se detiene solo tras 3 fallos seguidos.

## ❓ Preguntas frecuentes

<details>
<summary><b>¿Es seguro pegar esto en la consola?</b></summary>

El código es abierto y puedes leerlo entero en [`spygram.js`](spygram.js). Solo se comunica con `instagram.com` usando tu propia sesión y no envía datos a ningún otro sitio. Aun así, **nunca pegues en la consola código de fuentes en las que no confíes.**
</details>

<details>
<summary><b>¿Dónde se guardan la lista blanca y los escaneos?</b></summary>

En el `localStorage` de tu navegador, dentro de instagram.com. No salen de tu equipo. Si borras los datos del sitio, se pierden.
</details>

<details>
<summary><b>No aparecen las fotos de perfil</b></summary>

Algunos navegadores (como Brave con el escudo activado) bloquean las imágenes de Instagram. En ese caso, Spygram muestra un círculo de color con la inicial de la cuenta.
</details>

<details>
<summary><b>Pegué el script dos veces y no pasa nada</b></summary>

Si el panel ya está abierto, el script solo lo vuelve a mostrar. Recarga la página con `F5` para empezar de cero.
</details>

---

## 👤 Autor

Hecho por **[Panditax727](https://github.com/Panditax727)**.

Si te sirvió, deja una ⭐ en el repo.

## 📄 Aviso legal

© 2026 Panditax727. Todos los derechos reservados.

Spygram no está afiliado, asociado ni respaldado por Instagram ni por Meta Platforms, Inc. "Instagram" es una marca registrada de Meta Platforms, Inc. Úsalo bajo tu propia responsabilidad y respetando las [Condiciones de uso de Instagram](https://help.instagram.com/581066165581870).
