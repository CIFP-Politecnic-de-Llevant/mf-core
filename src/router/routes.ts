import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UsuariList.vue') },
      { path: 'upload', component: () => import('pages/UploadFile.vue') },
      { path: 'grupcorreu/list', component: () => import('pages/GrupCorreuList.vue') },
      { path: 'grupcorreu', component: () => import('pages/GrupCorreuForm.vue') },
      { path: 'grupcorreu/:id', component: () => import('pages/GrupCorreuForm.vue') },
      { path: 'curs/list', component: () => import('pages/CursList.vue') },
      { path: 'curs', component: () => import('pages/CursForm.vue') },
      { path: 'curs/:id', component: () => import('pages/CursForm.vue') },
      { path: 'departament/list', component: () => import('pages/DepartamentList.vue') },
      { path: 'departament', component: () => import('pages/DepartamentForm.vue') },
      { path: 'departament/:id', component: () => import('pages/DepartamentForm.vue') },
      { path: 'calendari/list', component: () => import('pages/CalendariList.vue') },
      { path: 'calendari/:id', component: () => import('pages/CalendariForm.vue') },
      { path: 'usuari/list', component: () => import('pages/UsuariList.vue') },
      { path: 'llistats', component: () => import('pages/llistats/Llistats.vue') },
      { path: 'llistats/alumnatgrup', component: () => import('pages/llistats/AlumnatGrup.vue') },
      { path: 'llistats/alumnatgruppendents', component: () => import('pages/llistats/AlumnatGrupPendents.vue') },
      { path: 'llistats/usuarisgrupcorreu', component: () => import('pages/llistats/UsuarisGrupCorreu.vue') },
      { path: 'llistats/usuarisdispositiu', component: () => import('pages/llistats/UsuarisDispositiu.vue') },
      { path: 'llistats/usuariscustom', component: () => import('pages/llistats/UsuarisCustom.vue') },
      { path: 'administrador', component: () => import('pages/Administrador.vue') },
      { path: 'profile/:id', component: () => import('pages/Profile.vue') },
      { path: 'login', component: () => import('components/common/Login.vue'), props: { urlRedirect: "/usuari/list" } },
      { path: 'logout', component: () => import('components/common/Logout.vue') },
      { path: 'manteniment', component: () => import('components/common/Manteniment.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
