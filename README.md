# Astro Starter Kit: Minimal

```sh
pnpm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

public/
│ ├── delete.svg
│ ├── edit.svg
│ ├── eye.svg
│ ├── favicon.svg
│ ├── left.svg
src/
│ ├── components/
│ │     ├── areas/
│ │     │     ├── AreasEditForm.jsx
│ │     │     ├── AreasForm.tsx
│ │     │     ├── AreasList.tsx
│ │     │     ├── AreasView.jsx
│ │     ├── availability/
│ │     │     ├── AvailabilityEditForm.jsx
│ │     │     ├── AvailabilityForm.tsx
│ │     │     ├── AvailabilityList.tsx
│ │     │     ├── AvailabilityView.jsx
│ │     ├── cards/
│ │     ├── dashboard/
│ │     │     ├── ui/
│ │     │     │   ├── Card.jsx
│ │     │     │   ├── Section.jsx
│ │     │     │   ├── Table.jsx
│ │     │     │   ├── Title.jsx
│ │     │     ├── DashboardEmployeesSummary.jsx
│ │     │     ├── DashboardHome.jsx
│ │     │     ├── DashboardKPis.jsx
│ │     │     ├── DashboardPendingReplacements.jsx
│ │     │     ├── DashboardReplacementsStats.jsx
│ │     │     ├── DashboardShiftsStats.jsx
│ │     │     ├── DashboardTodayShifts.jsx
│ │     ├── employees/
│ │     │     ├── EmployeeEditForm.jsx
│ │     │     ├── EmployeeForm.tsx
│ │     │     ├── EmployeesTable.tsx
│ │     │     ├── EmployeeView.jsx
│ │     ├── forms/
│ │     │     ├── LoginForm.jsx
│ │     │     ├── RegisterForm.jsx
│ │     ├── layouts/
│ │     │     ├── BaseLayout.astro
│ │     │     ├── DashboardLayout.astro
│ │     ├── public/
│ │     │     ├── PublicFeature.jsx
│ │     │     ├── PublicHero.astro
│ │     │     ├── PublicLayout.astro
│ │     ├── employees/
│ │     │     ├── ReplacementsEditForm.jsx
│ │     │     ├── ReplacementCreateForm.tsx
│ │     │     ├── ReplacementsList.tsx
│ │     │     ├── ReplacementsView.jsx
│ │     ├── schedules/
│ │     │     ├── ScheduleForm.jsx
│ │     │     ├── ScheduleList.jsx
│ │     │     ├── ScheduleEditForm.jsx
│ │     │     ├── ScheduleView.jsx
│ │     │     ├── SchedulePublicView.jsx
│ │     ├── shifts/
│ │     │     ├── ShiftList.jsx
│ │     │     ├── ShiftsEditForm.jsx
│ │     │     ├── ShiftsForm.jsx
│ │     │     ├── ShiftsView.jsx
│ │     ├── stats/
│ │     │     ├── DateFilter.jsx
│ │     │     ├── EmployeeStatsTable.tsx
│ │     │     ├── StatsOverview.jsx
│ │     │     ├── StatsPage.jsx
│ │     ├── ui/
│ │     │     ├── ActionButtons.jsx
│ │     │     ├── Buttons.jsx
│ │     │     ├── CreateButtons.jsx
│ │     │     ├── DeleteButtons.jsx
│ │     │     ├── Field.jsx
│ │     │     ├── Input.jsx
│ │     │     ├── SelectCard.jsx
│ │     │     ├── SessionExpiredModal.astro
│ │     │     ├── Sidebar.jsx
│ │     │     ├── SidebarDrawer.jsx
│ │     │     ├── Topbar.jsx
│ │     └── initClient.astro
│ │
│ ├── pages/
│ │     ├── api/
│ │     │     ├── delete-shift/
│ │     │     │     ├── [id].js
│ │     │     ├── delete-availability/
│ │     │     │     ├── [id].js
│ │     │     ├── delete-replacement/
│ │     │     │     ├── [id].js
│ │     │     ├── delete-schedule/
│ │     │     │     ├── [id].js
│ │     │     ├── delete-special-date/
│ │     │     │     ├── [id].js
│ │     │     ├── delete-season/
│ │     │     │     ├── [id].js
│ │     │     └── update-settings.js
│ │     ├── areas/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── create.astro
│ │     │     ├── index.astro
│ │     ├── auth/
│ │     │     ├── login.astro
│ │     │     ├── register.astro
│ │     ├── availability/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── create.astro
│ │     │     ├── index.astro
│ │     ├── dashboard/
│ │     │     ├── index.astro
│ │     ├── employees/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── create.astro
│ │     │     ├── index.astro
│ │     ├── replacements/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── create.astro
│ │     │     ├── index.astro
│ │     ├── schedules/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── create.astro
│ │     │     ├── index.astro
│ │     ├── seasons/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── create.astro
│ │     │     ├── index.astro
│ │     ├── settings/
│ │     │     ├── index.astro
│ │     ├── shifts/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── create.astro
│ │     │     ├── index.astro
│ │     ├── special-dates/
│ │     │     ├── edit/
│ │     │     │   ├── [id].astro
│ │     │     ├── view/
│ │     │     │   ├── [id].astro
│ │     │     ├── index.astro
│ │     │     ├── create.astro
│ │     ├── stats/
│ │     │     ├── index.astro
│ │     ├── index.astro
│ │     └── modal-template.astro
│ │
│ ├── middleware/
│ │     ├── auth.js
│ ├── lib/
│ │     ├── api/
│ │     │   ├── auth.js
│ │     │   ├── employees.js
│ │     │   ├── shifts.js
│ │     │   ├── schedules.js
│ │     │   ├── availability.js
│ │     │   ├── specialDates.js
│ │     │   ├── seasons.js
│ │     │   ├── replacements.js
│ │     │   └── settings.js
│ │     ├── stores/
│ │     │   ├── userStore.js
│ │     │   └── settingsStore.js
│ │     └── utils/
│ │         ├── fetch.js
│ │         ├── modal.js
│ │         └── auth.js
│ └── styles/
│       └── global.css
.env
.gitignore
astro.config.mjs
package.json
pnpm-lock.yaml
postcss.config.cjs
README.md
tailwind.config.js
tsconfig.json


pront para css Perfecto, ya te entendí 🔥
“Estilo Stripe / ChatGPT” = minimalista, aire, tipografía limpia, bordes suaves, sombras casi invisibles, mucho espacio en blanco, acentos sutiles (no cajas pesadas).

Vamos a hacerlo elegante, silencioso y premium.
Nada gritón. Nada Bootstrap. Nada admin feo.
❌ <select > → cards 

❌ <options> → cards 