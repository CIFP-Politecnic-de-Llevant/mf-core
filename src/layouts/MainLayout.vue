<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          GestSuite - Gestió d'usuaris Gestib i GSuite
        </q-toolbar-title>

        <Menuapp v-if="enableApps && (rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS || rol===rols.ADMINISTRATIU || rol===rols.WEB))"></Menuapp>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item clickable to="/usuari/list" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS)">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Usuaris</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/curs/list" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS)">
          <q-item-section avatar>
            <q-icon name="menu_book" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cursos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/departament/list" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS)">
          <q-item-section avatar>
            <q-icon name="workspaces" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Departaments</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/grupcorreu/list" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS)">
          <q-item-section avatar>
            <q-icon name="contact_mail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Grups de correu</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/calendari/list" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR)">
          <q-item-section avatar>
            <q-icon name="calendar_today" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendaris</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/llistats" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS)">
          <q-item-section avatar>
            <q-icon name="summarize" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Llistats</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/upload" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR)">
          <q-item-section avatar>
            <q-icon name="file_upload" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pujar fitxer Gestib</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sortir</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script setup>

import {ref, onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {Rol} from '../model/Rol.ts'
import Menuapp from '../components/common/AppsMenu.vue'

const leftDrawerOpen = ref(false)
const rolsUser =  ref([]); //Inicialitzem a un array buit si no existeix cap rol
const router = useRouter()
const route = useRoute()
const rols = Rol;

const enableGrupsCooperatius = (process.env.APP_ENABLE_GRUPSCOOPERATIUS==='true');
const enableConvalidacions=(process.env.APP_ENABLE_CONVALIDACIONS==='true');
const enableProfessoratManager=(process.env.APP_ENABLE_PROFESSORATMANAGER==='true');

const enableApps = enableGrupsCooperatius || enableConvalidacions || enableProfessoratManager;

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goBack(){
  router.go(-1);
}

onMounted(()=>{
  rolsUser.value = JSON.parse(localStorage.getItem("rol")) || [];
})

</script>

