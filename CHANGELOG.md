# Changelog

Totes les canvis notables d'aquest projecte estan documentats en aquest fitxer.

Format: [Keep a Changelog](https://keepachangelog.com/ca/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/lang/ca/)

---

## [Unreleased]

---

## [1.2.0] - 2026-05-18

Auditoria UX professional completa — qualitat iOS/Android, accessibilitat WCAG i estabilitat visual.

### Fixed
- **iOS anti-zoom**: `font-size: 16px` mínim a tots els `input`, `select` i `textarea` (`.solo-field`, `.wa-reg-field`, `.wizard-rival-code-input`, `.wizard-early-email-input`) — evita el zoom automàtic de Safari al focus
- **SiteNav overlap**: `.wa-reg-header` i `.page-nav` ara usen `top: 56px` (desktop) / `top: 50px` (mòbil) per no quedar tapats per la barra de navegació
- **IBAN overflow mòbil**: a `≤600px` `.wizard-iban-row` passa a `flex-direction: column` per evitar desbordament a iPhone SE i similars
- **Touch targets**: `.wa-reg-player-name`, `.wa-reg-player-year`, `.wa-reg-player-size` augmenten a `min-height: 44px` (mínim iOS HIG / WCAG)
- **Padding fantasma**: `.wa-reg-player-club` eliminat el `padding-left: 30px` heretat sense ús
- **Scroll wizard**: `scrollToWizard()` usa `scrollIntoView` + `scroll-margin-top: 64px` en comptes de `window.scrollTo` — el pas sempre és visible sota la SiteNav
- **Error semàntic**: 3 missatges d'error de wizard marquen `role="alert"` per a lectors de pantalla (WCAG 2.4.3)
- **Color error**: `.wizard-error` canvia de verd a vermell (`rgba(239,68,68,…)`) — coherència semàntica
- **Input any jugador**: `type="number"` → `type="text" inputMode="numeric"` — elimina les fletxes spinner d'iOS a `/wa-registre`
- **Autofill mòbil**: `autoComplete="tel"` i `autoComplete="email"` + `inputMode="email"` a `IndividualSignupForm`

### Added
- **Focus-visible global**: `outline: 2px solid #25d366` a tots els elements interactius (WCAG 2.4.7 — teclat i lectors de pantalla)
- **Desktop card wa-reg**: `.wa-reg-shell` a `≥769px` limitat a `max-width: 560px` centrat amb ombra — millora estètica desktop
- **Bank info overflow**: `.wa-reg-bank p` amb `overflow-wrap: anywhere` per trencar textos llargs

---

## [1.1.0] - 2026-05-17

Nous canals d'inscripció i descomptes Early Bird.

### Added
- **Pàgina `/wa-registre`**: formulari d'estètica WhatsApp per inscriure equips directament des d'un link WA
- **Early Bird -10%**: descompte automàtic al preu mostrat i al missatge WA si s'activa la promoció
- **Camp Club obligatori**: tots els formularis d'inscripció (wizard, individual, wa-registre) requereixen club d'origen
- **Abandoned leads**: notificació a `voluntarisgrupbarna@gmail.com` quan un usuari omple email/telèfon però no finalitza la inscripció (debounce 5 min)
- **CTAs WhatsApp directes**: botons WA a totes les CTAs del site

### Fixed
- **Capità menor**: capità/a opcional en categories formatives (sub-12, sub-14, sub-16)
- **Social share simplificat**: 1 botó WA + checkbox confirmació (en comptes de 5 contactes individuals)
- **Env vars Vercel**: `APPSCRIPT_INSCRIPCIO_URL` i `APPS_SCRIPT_WEBHOOK_URL` apunten a Script 2 @12 (URL correcta)

---

## [1.0.0] - 2026-05-15

Llançament inicial a producció. Microsite complet 3×3 Westfield Glòries 2026.

### Added
- **Wizard d'inscripció** (`/inscripcion`): 4 passos — dades equip, jugadors, resum, confirmació
- **Formulari individual** (`/inscripcio-individual`): inscripció jugadors sense equip format
- **Pàgina check-in** (`/check-in/[code]`): verificació QR en temps real via Apps Script
- **Pàgina jugador** (`/jugador/[code]`): fitxa personal del jugador
- **Porta un rival** (`/porta-un-rival`): flux de descompte per referència
- **SiteNav + StickyCtaBar**: navegació global amb botons flotants (exclosos en pàgines de formulari)
- **Secció Premis, Patrocinadors, Venue, FAQ**: contingut estàtic de la home
- **Backend Apps Script v2**: webhook `action=team` → Google Sheets "Inscripcions 2026" + email de confirmació automàtic
- **QR de check-in**: generat via `api.qrserver.com` i inclòs a l'email de confirmació

---

[Unreleased]: https://github.com/voluntarisgrupbarna-pixel/3x3-glories-vercel/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/voluntarisgrupbarna-pixel/3x3-glories-vercel/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/voluntarisgrupbarna-pixel/3x3-glories-vercel/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/voluntarisgrupbarna-pixel/3x3-glories-vercel/releases/tag/v1.0.0
