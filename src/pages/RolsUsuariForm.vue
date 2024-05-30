<template>
  <q-page class="flex column q-gutter-lg" padding>
    <p class="text-h3">Rols: {{ usuari.gsuiteFullName }}</p>

    <div class="q-pa-md">
      <div class="q-gutter-lg">
        <q-checkbox v-for="rol in rolsDisponibles" :key="rol" v-model="usuari.rols" :val="rol" :label="rol" size="lg" />
      </div>

    </div>

    <q-btn color="primary" icon="save" label="Desar" @click="save" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Rol } from 'src/model/Rol'; 

export default defineComponent({
  name: 'PageRolsUsuariForm',
  data() {
    return {
      usuari: {},
    }
  },
  created() {
    this.get();
  },
  computed: {
    rolsDisponibles() {
      return Object.values(Rol);
    }
  },
  methods: {
    get: async function () {
      const idusuari = this.$route.params.id;

      if (idusuari) {
        const responseProfile = await this.$axios.get(process.env.API + '/api/core/usuaris/profile/' + idusuari);
        const dataProfile = await responseProfile.data;
        this.usuari = dataProfile;
      }
    },
    save: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })


      await this.$axios.post(process.env.API + '/api/core/usuaris/desaRols',this.usuari);
      dialog.hide();
      //Redirect
      this.$router.push('/rolsusuari/list');
    }
  }
})
</script>
