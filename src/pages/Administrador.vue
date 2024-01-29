<template>
  <q-page class="flex column" padding>
    <h3>Eines d'administrador</h3>

    <q-btn :disable="!botoActiu" @click="backupDatabase" color="primary" class="q-ma-md">Backup Database</q-btn>
    <small class="text-center">Còpia de seguretat de la base de dades. Upload al bucket de Google.</small>

    <q-btn :disable="!botoActiu" @click="syncCalendaris" color="primary" class="q-ma-md">Sincronitza Calendaris</q-btn>
    <small class="text-center">Sincronitza calendaris</small>

    <q-btn :disable="!botoActiu" @click="importGSuiteUsers" color="primary" class="q-ma-md">Importar usuaris GSuite</q-btn>
    <small class="text-center">Importar còpia de GSuite a la BBDD</small>

    <q-btn :disable="!botoActiu" @click="reassignarGrupsGSuiteToBBDD" color="primary" class="q-ma-md">Reassignar grups de GSuite a la BBDD.</q-btn>
    <small class="text-center">No actualitza GSuite, només la BBDD</small>

    <q-btn :disable="!botoActiu" @click="cancelUpload" color="primary" class="q-ma-md">Cancel·la pujada de l'arxiu de sincronització.</q-btn>
    <small class="text-center">Cancel·lar l'arxiu pujat a GestSuite</small>

    <q-btn :disable="!botoActiu" @click="simula" color="primary" class="q-ma-md">Simulació</q-btn>
    <small class="text-center">Si hi ha fitxer pujat, comença la simulació. NO desa cap resultat a base de dades ni a GSuite.</small>

    <q-btn :disable="!botoActiu" @click="sync" color="primary" class="q-ma-md">Sincronitza</q-btn>
    <small class="text-center">Si hi ha fitxer pujat, comença la sincronització. Alerta, dura molt de temps.</small>

    <q-btn :disable="!botoActiu" @click="syncAlumnes" color="primary" class="q-ma-md">Reassigna grups alumnes</q-btn>
    <small class="text-center">Resincronitza els grups de TOTS els alumnes (Gestib i GSuite)</small>

    <q-btn :disable="!botoActiu" @click="syncAlumnesForce" color="primary" class="q-ma-md">Forçar reassignació grups alumnes</q-btn>
    <small class="text-center">Esborra i torna a crear els grups de TOTS els alumnes (Gestib i GSuite)</small>

    <q-btn :disable="!botoActiu" @click="syncProfessors" color="primary" class="q-ma-md">Reassigna grups professors</q-btn>
    <small class="text-center">Resincronitza els grups de TOTS els professors (Gestib i GSuite)</small>

    <q-btn :disable="!botoActiu" @click="syncProfessorsForce" color="primary" class="q-ma-md">Forçar reassignació grups professors</q-btn>
    <small class="text-center">Esborra i torna a crear els grups de TOTS els professors (Gestib i GSuite)</small>

    <q-btn :disable="!botoActiu" @click="normalitzarNoms" color="primary" class="q-ma-md">Normalitzar noms</q-btn>
    <small class="text-center">Normalitza els noms amb el format "Nom Cognom1 Cognom2"</small>

    <q-btn :disable="!botoActiu" @click="provaGmail" color="primary" class="q-ma-md">Prova Gmail</q-btn>
    <small class="text-center">Missatge de prova de Gmail</small>

    <q-btn :disable="!botoActiu" @click="mergeGSuiteGestib" color="primary" class="q-ma-md">Mescla usuaris GSuite i Gestib</q-btn>
    <small class="text-center">ALERTA! Només emprar en casos que es vulgui mesclar per NOM I GOGNOMS els usuaris. Per exemple: primera sincronització. </small>

    <div id="result" v-if="result">
      <div v-for="r in result" v-html="r"></div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import {CentreService} from "src/service/CentreService";

export default defineComponent({
  name: 'PageIndex',
  data(){
    return {
      result: [],
      botoActiu:true,
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
    },
    backupDatabase:async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + '/api/core/administrator/backupdatabase');
      this.botoActiu = true;
    },
    reassignarGrupsGSuiteToBBDD: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + '/api/core/sync/reassignarGrupsCorreuGSuiteToDatabase');
      this.botoActiu = true;
    },
    simula: async function(){
      const dialog = this.$q.dialog({
        message: 'Iniciant la simulació... (Resultat al final de la pàgina)',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })
      this.botoActiu = false;
      const resultat = await this.$axios.post(process.env.API + "/api/core/sync/simular");
      this.result = resultat.data;
      this.botoActiu = true;
      dialog.hide();
    },
    sync: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/sincronitza");
      window.location.reload();
    },
    syncAlumnes: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/reassignarGrupsAlumnes");
      this.botoActiu = true;
    },
    syncAlumnesForce: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/reassignarGrupsAlumnesForce");
      this.botoActiu = true;
    },
    syncProfessors: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/reassignarGrupsProfessors");
      this.botoActiu = true;
    },
    syncProfessorsForce: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/reassignarGrupsProfessorsForce");
      this.botoActiu = true;
    },
    provaGmail: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/proves/gmail");
      this.botoActiu = true;
    },
    normalitzarNoms: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/gsuite/normalize-noms");
      this.botoActiu = true;
    },
    importGSuiteUsers: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/importgsuiteusers");
      this.botoActiu = true;
    },
    cancelUpload: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/cancelupload");
      this.botoActiu = true;
    },
    syncCalendaris: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/calendari/sync");
      this.botoActiu = true;
    },
    mergeGSuiteGestib: async function(){
      this.botoActiu = false;
      await this.$axios.post(process.env.API + "/api/core/sync/mergegsuitegestib");
      this.botoActiu = true;
    }

  }
})
</script>

<style lang="scss">
#result h3{
  font-size: 24px;
}
</style>
