# Estructura del Proyecto

<!-- PROJECT_STRUCTURE_START -->
```
├── 📁 .astro/
│   ├── 📁 collections/
│   ├── 📄 content-assets.mjs
│   ├── 📄 content-modules.mjs
│   ├── 📄 data-store.json
│   ├── 📄 dev.json
│   ├── 📄 settings.json
│   └── 📄 types.d.ts
├── 📄 .gitignore
├── 📁 .vscode/
│   ├── 📄 extensions.json
│   └── 📄 launch.json
├── 📄 astro.config.mjs
├── 📄 copy.jsx
├── 📄 example.env
├── 📄 package.json
├── 📄 pnpm-lock.yaml
├── 📄 pnpm-workspace.yaml
├── 📄 postcss.config.cjs
├── 📁 public/
│   ├── 📄 delete.svg
│   ├── 📄 edit.svg
│   ├── 📄 eye.svg
│   ├── 📄 favicon.svg
│   ├── 📄 left.svg
│   ├── 📄 manifest.json
│   ├── 📁 sounds/
│   │   ├── 📄 error.wav
│   │   ├── 📄 info.wav
│   │   └── 📄 success.wav
│   └── 📄 sw.js
├── 📄 README.md
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 areas/
│   │   │   ├── 📄 AreasEditForm.jsx
│   │   │   ├── 📄 AreasForm.jsx
│   │   │   ├── 📄 AreasList.jsx
│   │   │   └── 📄 AreasView.jsx
│   │   ├── 📁 auth/
│   │   │   └── 📄 AuthGuard.jsx
│   │   ├── 📁 availability/
│   │   │   ├── 📄 AvailabilityEditForm.jsx
│   │   │   ├── 📄 AvailabilityForm.jsx
│   │   │   ├── 📄 AvailabilityList.jsx
│   │   │   ├── 📄 AvailabilityView.jsx
│   │   │   └── 📄 MyAvailabilityForm.jsx
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 DashboardEmployeesSummary.jsx
│   │   │   ├── 📄 DashboardHome.jsx
│   │   │   ├── 📄 DashboardKPIs.jsx
│   │   │   ├── 📄 DashboardPendingReplacements.jsx
│   │   │   ├── 📄 DashboardReplacementsStats.jsx
│   │   │   ├── 📄 DashboardShiftsStats.jsx
│   │   │   ├── 📄 DashboardTodayShifts.jsx
│   │   │   ├── 📁 ui/
│   │   │   │   ├── 📄 Card.jsx
│   │   │   │   ├── 📄 Section.jsx
│   │   │   │   ├── 📄 Table.jsx
│   │   │   │   └── 📄 Title.jsx
│   │   │   └── 📄 ui.md
│   │   ├── 📁 employees/
│   │   │   ├── 📄 EmployeeEditForm.jsx
│   │   │   ├── 📄 EmployeeForm.tsx
│   │   │   ├── 📄 EmployeesTable.tsx
│   │   │   └── 📄 EmployeeView.jsx
│   │   ├── 📁 forms/
│   │   │   ├── 📄 LoginForm.jsx
│   │   │   └── 📄 RegisterForm.jsx
│   │   ├── 📄 InitClient.astro
│   │   ├── 📁 layouts/
│   │   │   ├── 📄 BaseLayout.astro
│   │   │   ├── 📄 CustomTimePicker.jsx
│   │   │   ├── 📄 DashboardLayout.astro
│   │   │   └── 📄 ListContainer.jsx
│   │   ├── 📁 profile/
│   │   │   └── 📄 UserProfile.jsx
│   │   ├── 📁 public/
│   │   │   ├── 📄 PublicFeatures.jsx
│   │   │   ├── 📄 PublicHero.astro
│   │   │   └── 📄 PublicLayout.astro
│   │   ├── 📁 replacements/
│   │   │   ├── 📄 ReplacementCreateForm.jsx
│   │   │   ├── 📄 ReplacementsEditForm.jsx
│   │   │   ├── 📄 ReplacementsList.jsx
│   │   │   └── 📄 ReplacementsView.jsx
│   │   ├── 📁 schedules/
│   │   │   ├── 📄 AutomaticMode.jsx
│   │   │   ├── 📄 BulkManualMode.jsx
│   │   │   ├── 📄 EmployeeScheduleView.jsx
│   │   │   ├── 📄 ManualMode.jsx
│   │   │   ├── 📄 ScheduleDayCard.jsx
│   │   │   ├── 📄 ScheduleEditForm.jsx
│   │   │   ├── 📄 ScheduleForm.jsx
│   │   │   ├── 📄 ScheduleList.jsx
│   │   │   ├── 📄 SchedulePublicView.jsx
│   │   │   └── 📄 ScheduleView.jsx
│   │   ├── 📁 shifts/
│   │   │   ├── 📄 ShiftList.jsx
│   │   │   ├── 📄 ShiftsEditForm.jsx
│   │   │   ├── 📄 ShiftsForm.jsx
│   │   │   └── 📄 ShiftsView.jsx
│   │   ├── 📁 stats/
│   │   │   ├── 📄 DateFilter.jsx
│   │   │   ├── 📄 EmployeeStatsTable.jsx
│   │   │   ├── 📄 StatsOverview.jsx
│   │   │   └── 📄 StatsPage.jsx
│   │   └── 📁 ui/
│   │       ├── 📄 ActionButtom.tsx
│   │       ├── 📄 AnimatedMascot.jsx
│   │       ├── 📄 Button.jsx
│   │       ├── 📄 CreateButton.jsx
│   │       ├── 📄 CustomDatePicker.jsx
│   │       ├── 📄 DashboardButton.jsx
│   │       ├── 📄 deleteButtom.tsx
│   │       ├── 📄 Field.jsx
│   │       ├── 📄 Input.jsx
│   │       ├── 📄 Loading.tsx
│   │       ├── 📄 PublicHeader.astro
│   │       ├── 📄 SelectCard.jsx
│   │       ├── 📄 SessionExpiredModal.astro
│   │       ├── 📄 Sidebar.jsx
│   │       ├── 📄 SidebarDrawer.jsx
│   │       └── 📄 Topbar.jsx
│   ├── 📁 hooks/
│   │   └── 📄 useScheduleFormData.js
│   ├── 📁 lib/
│   │   ├── 📁 api/
│   │   │   ├── 📄 auth.js
│   │   │   ├── 📄 availability.js
│   │   │   ├── 📄 employees.js
│   │   │   ├── 📄 replacements.js
│   │   │   ├── 📄 schedules.js
│   │   │   ├── 📄 seasons.js
│   │   │   ├── 📄 settings.js
│   │   │   ├── 📄 shifts.js
│   │   │   └── 📄 specialDates.js
│   │   ├── 📁 rules/
│   │   │   └── 📄 scheduleAreas.ts
│   │   ├── 📁 stores/
│   │   │   ├── 📄 settingsStore.js
│   │   │   └── 📄 userStore.js
│   │   └── 📁 utils/
│   │       ├── 📄 alert.js
│   │       ├── 📄 apiAction.js
│   │       ├── 📄 auth.js
│   │       ├── 📄 exportSchedule.js
│   │       ├── 📄 fetch.js
│   │       ├── 📄 footerPhrases.js
│   │       ├── 📄 loading.ts
│   │       ├── 📄 modal.js
│   │       ├── 📄 navigation.js
│   │       └── 📄 quotes.js
│   ├── 📄 middleware.js
│   ├── 📁 pages/
│   │   ├── 📁 areas/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 auth/
│   │   │   ├── 📄 login.astro
│   │   │   └── 📄 register.astro
│   │   ├── 📁 availability/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 dashboard/
│   │   │   └── 📄 index.astro
│   │   ├── 📁 employees/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 horario/
│   │   │   └── 📄 index.astro
│   │   ├── 📄 index.astro
│   │   ├── 📁 mi-disponibilidad/
│   │   │   └── 📄 index.astro
│   │   ├── 📁 mi-horario/
│   │   │   └── 📄 index.astro
│   │   ├── 📁 profile/
│   │   │   └── 📄 index.astro
│   │   ├── 📁 replacements/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 schedules/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 seasons/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 settings/
│   │   │   └── 📄 index.astro
│   │   ├── 📁 shifts/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 special-dates/
│   │   │   ├── 📄 create.astro
│   │   │   ├── 📁 edit/
│   │   │   │   └── 📄 index.astro
│   │   │   ├── 📄 index.astro
│   │   │   └── 📁 view/
│   │   │       └── 📄 index.astro
│   │   ├── 📁 stats/
│   │   │   └── 📄 index.astro
│   │   ├── 📄 unauthorized.astro
│   │   └── 📄 _prerender.ts
│   ├── 📄 prueba.js
│   ├── 📁 styles/
│   │   └── 📄 global.css
│   └── 📁 types/
│       └── 📄 area.ts
├── 📄 structure.md
├── 📄 tailwind.config.js
└── 📄 tsconfig.json
```
<!-- PROJECT_STRUCTURE_END -->
