# 🚀 Desplegar funcionalitats noves (29/05/2026)

## Què s'ha afegit

1. **`handleCompletar`** — quan un equip ompli el formulari `completar.html`:
   - Es guarda al Sheet (pestanya `completar_dades`, es crea automàticament)
   - **T'arriba un email visualment maco** amb totes les dades omplertes
   - Funciona també per a inscripcions individuals

2. **`crearEsborranysCompletar`** — funció executable des de l'editor que crea
   esborranys de Gmail (un per equip) amb link personalitzat al formulari.

## Passos per desplegar (5 minuts)

### 1. Iniciar sessió a clasp
```bash
clasp login
```
S'obrirà el navegador. Inicia sessió amb **voluntarisgrupbarna@gmail.com**
i autoritza els permisos.

### 2. Pujar els canvis
```bash
cd "/Users/ana/VIDEO DEMOTION DEV/3x3-glories-vercel/appsscript-inscripcio"
clasp push
```
Hauria de sortir: `└─ CompletarDades.gs  └─ Code.gs ...`

### 3. Obrir l'editor del script
```bash
clasp open
```
O directament: https://script.google.com/u/1/home/projects/1h0ETtGnw74sT8yS2eu_KRTEhxDMqvIUqrqduxG3S1HUAWCyRcKS0S59B/edit

### 4. Provar la notificació
- A la barra superior, selecciona la funció `testNotificacioCompletar`
- Clica **Executar** (▶️)
- Si demana permisos: **Revisar permisos** → tria voluntarisgrupbarna → **Permetre**
- En 5 segons rebràs un email de prova a voluntarisgrupbarna@gmail.com amb el format complet

### 5. Crear esborranys per a TOTS els equips
- Selecciona la funció `crearEsborranysCompletar`
- Clica **Executar**
- Triga ~30 segons
- Vés a Visualitza → Logs d'execució per veure el resultat
- Hauria de dir: `Total: 67 creats, 0 saltats`

### 6. Redesplegar el Web App (per activar handleCompletar)
- Al editor, clica **Desplegar** → **Gestionar desplegaments**
- Edita el desplegament actiu (el del 3x3)
- Versió: **Nova versió**
- Descripció: `v2 - completar + notificacions Ana`
- Clica **Desplegar**

### 7. Revisar i enviar els 67 esborranys
- Obre Gmail
- Barra lateral → **Esborranys** (veuràs 67 nous)
- Filtra per subject: `3x3 Westfield Glòries 2026 — Confirma`
- Revisa'n un o dos
- Envia'ls un per un, o usa l'enviament massiu (vegeu sota)

## 🎯 Si vols enviar tots els esborranys de cop

Crea una funció nova al editor:
```js
function enviarTotsEsborranysCompletar() {
  const drafts = GmailApp.getDrafts();
  let enviats = 0;
  drafts.forEach(d => {
    const msg = d.getMessage();
    if (msg.getSubject().indexOf('3x3 Westfield Glòries 2026 — Confirma') === 0) {
      d.send();
      enviats++;
      Utilities.sleep(500); // evitar rate limit
    }
  });
  Logger.log('Enviats: ' + enviats);
}
```
Compte: això envia REAL. Verifica primer.

## Si clasp no funciona

Si `clasp login` no et deixa, fes-ho manualment:
1. Obre https://script.google.com/u/1/home (compte voluntarisgrupbarna)
2. Obre el projecte 3x3
3. Crea fitxer nou: `CompletarDades.gs`
4. Enganxa el contingut del fitxer local
5. A `Code.gs`, busca la línia `if (payload.action === "lead") {` i afegeix
   abans del `handleInscripcio`:
   ```js
   if (payload.action === "completar" || payload.action === "completar_dades") {
     const result = handleCompletar(payload);
     return jsonResponse(result);
   }
   ```
6. Desa, executa `testNotificacioCompletar`, redeploya.

## Test final

Un cop desplegat tot:
1. Obre el dashboard
2. Pica qualsevol equip → copia el seu link de completar
3. Obre el link en una pestanya privada
4. Omple el formulari
5. Verifica que reps l'email de notificació

🎉
