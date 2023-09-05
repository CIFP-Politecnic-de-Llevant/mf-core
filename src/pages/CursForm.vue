<template>
  <q-page class="flex column q-gutter-lg" padding>
    <p class="text-h3">Curs: {{curs.nom}}</p>

    <q-table
      title="Grups"
      :rows="grups"
      :columns="columnesGrup"
      row-key="id"
    >
      <template v-slot:body-cell-unitatorganitzativa="props">
        <q-td key="name" :props="props" title="Click per editar" style="cursor:pointer;">
          <div class="row no-wrap">
              <q-input class="col-9" v-model="props.row.unitatOrganitzativa" dense autofocus counter/>
              <q-btn class="col-3" flat icon="save" @click="saveGrup(props.row.unitatOrganitzativa,props.row.id)" />
          </div>
        </q-td>
      </template>
    </q-table>

    <q-btn color="primary" icon="save" label="Desar" @click="save" />

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Grup} from "src/model/gestib/Grup";
import {Curs} from "src/model/gestib/Curs";
import {CursService} from "src/service/CursService";
import {GrupService} from "src/service/GrupService";
import {QTableColumn} from "quasar";

export default defineComponent({
  name: 'PageGrupCorreuForm',
  data() {
    return {
      curs: {} as Curs,
      grups: [] as Grup[],
      columnesGrup: [] as QTableColumn[]
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {

      this.columnesGrup = [
        {
          name: 'nom',
          required: true,
          label: 'Nom',
          align: 'left',
          field: row => row.nom,
          sortable: true
        },
        {
          name: 'tutor1',
          required: true,
          label: 'Tutor 1',
          align: 'left',
          field: row => {
            if(row.tutor1){
              return row.tutor1.nomComplet
            }
          },
          sortable: true
        },
        {
          name: 'tutor2',
          required: true,
          label: 'Tutor 2',
          align: 'left',
          field: row => {
            if(row.tutor2){
              return row.tutor2.nomComplet
            }
          },
          sortable: true
        },
        {
          name: 'tutor3',
          required: true,
          label: 'Tutor 3',
          align: 'left',
          field: row => {
            if(row.tutor3){
              return row.tutor3.nomComplet
            }
          },
          sortable: true
        },
        {
          name: 'unitatorganitzativa',
          required: true,
          label: 'Unitat Organitzativa',
          align: 'left',
          field: row => {
            if(row.gsuiteUnitatOrganitzativa){
              return row.gsuiteUnitatOrganitzativa
            }
          },
          sortable: true
        }
      ]

      const id:string = (this.$route.params.id)?this.$route.params.id+'':'';

      if(id && id!='') {
        this.curs = await CursService.getCursById(id);

        let grups:Grup[] = await GrupService.getGrupsByCurs(this.curs,true);
        this.grups = grups;

      }

    },
    saveGrup: async function(uo:string,idgrup:string){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      await this.$axios.post(process.env.API + '/api/core/grup/desaUO',{uo:uo,idgrup:idgrup});
      dialog.hide();
    },
    save: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      await this.$axios.post(process.env.API + '/api/core/curs/desa',this.curs);
      dialog.hide();
      //Redirect
      this.$router.push('/curs/list');
    }
  }
})
</script>
