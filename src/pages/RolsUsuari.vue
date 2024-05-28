<template>
  <q-page class="flex column" padding>

    <q-table
      title="Rols d'usuari"
      :rows="usuaris"
      :columns="columnes"
      row-key="id"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Cerca">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-accions="props">
        <q-td :props="props">
          <div>
            <q-btn-group push>
              <q-btn icon="edit" color="primary" dense :to="'/rolsusuari/'+props.value">
                <q-tooltip>
                  Rols
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </div>
        </q-td>
      </template>

    </q-table>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {QTableColumn} from "quasar";
import { UsuariService } from 'src/service/UsuariService';
import { Usuari } from 'src/model/Usuari';

export default defineComponent({
  name: 'PageRolsUsuariList',
  data() {
    return {
      usuaris: [] as Usuari[],
      columnes: [] as QTableColumn[],
      filter: '',
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      this.columnes = [
        {
          name: 'nom',
          required: true,
          label: 'Nom',
          align: 'left',
          field: row => row.gestibNom,
          sortable: true
        },
        {
          name: 'cognom1',
          required: true,
          label: 'Cognom 1',
          align: 'left',
          field: row => row.gestibCognom1,
          sortable: true
        },
        {
          name: 'cognom2',
          required: true,
          label: 'Cognom 2',
          align: 'left',
          field: row => row.gestibCognom2,
          sortable: true
        },
        {
          name: 'email',
          required: true,
          label: 'Correu electrònic',
          align: 'left',
          field: row => row.gsuiteEmail,
          sortable: true
        },
        {
          name: 'rols',
          required: true,
          label: 'Rols',
          align: 'left',
          field: row => {
            console.log(row);
            if(row.rols){
              return row.rols.map((g:String)=>g).join(", ")
            }
            return "";
          },
          sortable: true
        },
        {
          name: 'accions',
          required: true,
          label: 'Accions',
          align: 'center',
          field: row => row.idusuari,
          sortable: false
        }
      ]

      // let usuaris:Usuari[] = await UsuariService.findUsuarisActius(false);
      let responseUsersActius = await this.$axios.get(process.env.API + '/api/core/usuaris/llistat/actius');
      let dataUsersActius = await responseUsersActius.data;
      this.usuaris = dataUsersActius;

      console.log(this.usuaris)
    }
  }
})
</script>
