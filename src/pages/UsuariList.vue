<template>
  <q-page class="flex column" padding>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="actius" label="Actius"/>
      <q-tab name="pendents" label="Per suspendre"/>
      <q-tab name="suspesos" label="Suspesos"/>
      <q-tab name="eliminats" label="Eliminats"/>
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="actius">
        <q-btn class="q-ma-md" label="Reassignar grups" color="primary" @click="confirmReassignarGrups = true"/>
        <div class="row">
          <div class="col-12">
            <q-table
              :table-style="{ width: '100%' }"
              :dense="$q.screen.lt.lg"
              :grid="$q.screen.lt.sm"
              title="Usuaris actius"
              :rows="actius"
              :columns="columnes"
              row-key="idusuari"
              selection="multiple"
              :filter="filterActius"
              v-model:selected="selectedActius"
            >
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filterActius" placeholder="Cerca">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </template>
              <template v-slot:body-cell-accions="props">
                <q-td :props="props">
                  <div>
                    <q-btn-group push>
                      <q-btn icon="visibility" color="primary" dense :to="'/profile/'+props.value">
                        <q-tooltip>
                          Veure Perfil
                        </q-tooltip>
                      </q-btn>
                    </q-btn-group>
                  </div>
                </q-td>
              </template>
              <!-- Slot per modificar la taula quan està en mode grid -->
              <template v-slot:item="props">
                <div
                  class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                  :style="props.selected ? 'transform: scale(0.95);' : ''"
                >
                  <q-card :class="props.selected ? 'bg-grey-2' : ''">
                    <q-card-section>
                      <q-checkbox dense v-model="props.selected" :label="props.row.name"></q-checkbox>
                      {{props.row.name}}
                    </q-card-section>
                    <q-separator></q-separator>
                    <q-list dense>
                      <q-item v-for="col in props.cols" :key="col.name">
                        <q-item-section>
                          <q-item-label>{{ col.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn v-if="col.name === 'accions'" dense flat color="primary" field="edit" icon="edit" @click="editItem(props.row)" ></q-btn>
                          <q-item-label v-else caption :class="col.classes ? col.classes : ''">{{ col.value }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="pendents">
        <q-btn class="q-ma-md" label="Suspendre usuaris" color="primary" @click="confirmSuspendre = true"/>
        <q-table
          title="Usuaris pendents de suspendre"
          :rows="pendents"
          :columns="columnes"
          row-key="idusuari"
          selection="multiple"
          :filter="filterSetPendents"
          :filter-method="customFilterPendents"
          v-model:selected="selectedPendents"
        >

          <template v-slot:top-right>
            <q-select 
              v-model="pendentsCategoria" 
              :options="pendentsCategoriaOptions"
              label="Categoria"
              class="q-mr-md"
              style="min-width: 150px"
             />

            <q-input borderless dense debounce="300" v-model="filterPendents" placeholder="Cerca">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-accions="props">
            <q-td :props="props">
              <div>
                <q-btn-group push>
                  <q-btn icon="visibility" color="primary" dense :to="'/profile/'+props.value">
                    <q-tooltip>
                      Veure Perfil
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="suspesos">
        <q-btn class="q-ma-md" label="Tornar a realitzar el procés de suspendre usuaris" color="primary" @click="confirmSuspendreSuspesos = true"/>
        <q-btn class="q-ma-md" label="Reactivar usuaris" color="primary" @click="confirmReactivar = true"/>
        <q-table
          title="Usuaris suspesos"
          :rows="suspesos"
          :columns="columnes"
          row-key="idusuari"
          selection="multiple"
          :filter="filterSuspesos"
          v-model:selected="selectedSuspesos"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterSuspesos" placeholder="Cerca">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-accions="props">
            <q-td :props="props">
              <div>
                <q-btn-group push>
                  <q-btn icon="visibility" color="primary" dense :to="'/profile/'+props.value">
                    <q-tooltip>
                      Veure Perfil
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="eliminats">
        <q-table
          title="Usuaris eliminats de GSuite"
          :rows="eliminats"
          :columns="columnes"
          row-key="idusuari"
          selection="multiple"
          :filter="filterEliminats"
          v-model:selected="selectedEliminats"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterEliminats" placeholder="Cerca">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-accions="props">
            <q-td :props="props">
              <div>
                <q-btn-group push>
                  <q-btn icon="visibility" color="primary" dense :to="'/profile/'+props.value">
                    <q-tooltip>
                      Veure Perfil
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="confirmSuspendre" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white"/>
          <span class="q-ml-sm">Està segur que vol suspendre {{ selectedPendents.length }} usuaris?</span>
          <span class="q-ml-sm">Aquesta acció no es pot desfer.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel·la" color="primary" v-close-popup/>
          <q-btn flat label="Suspèn" color="primary" @click="suspenUsuaris" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmSuspendreSuspesos" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white"/>
          <span class="q-ml-sm">Està segur que vol tornar a realitzar el procés de suspendre a {{ selectedSuspesos.length }} usuaris?</span>
          <span class="q-ml-sm">Aquesta acció no es pot desfer.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel·la" color="primary" v-close-popup/>
          <q-btn flat label="Suspèn" color="primary" @click="suspenUsuarisSuspesos" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmReassignarGrups" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white"/>
          <span class="q-ml-sm">Està segur que vol reassignar {{ selectedActius.length }} usuaris?</span>
          <span class="q-ml-sm">Aquesta acció no es pot desfer. Es reassignaran els grups d'alumnat i professorat automàtic. Els grups introduits manualment no es modificaran.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel·la" color="primary" v-close-popup/>
          <q-btn flat label="Reagrupa" color="primary" @click="reagruparUsuaris" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmReactivar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white"/>
          <span class="q-ml-sm">Està segur que vol tornar activar {{ selectedSuspesos.length }} usuaris?</span>
          <span class="q-ml-sm">Aquesta acció no es pot desfer.</span>
          <span class="q-ml-sm text-accent">IMPORTANT! El procés NO reassigna grups, només reactiva l'usuari.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel·la" color="primary" v-close-popup/>
          <q-btn flat label="Reactiva compte" color="primary" @click="reactivarUsuaris" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue';

export default defineComponent({
  name: 'PageGrupCorreuForm',
  data() {
    return {
      columnes: [],
      actius: [],
      pendents: [],
      suspesos: [],
      eliminats: [],
      selectedActius: [],
      selectedPendents: [],
      selectedSuspesos: [],
      selectedEliminats: [],
      filterActius: '',
      filterPendents: '',
      pendentsCategoria: '',
      pendentsCategoriaOptions: [],
      filterSuspesos: '',
      filterEliminats: '',
      tab: ref('actius'),
      confirmSuspendre: false,
      confirmSuspendreSuspesos: false,
      confirmReassignarGrups: false,
      confirmReactivar: false
    }
  },
  created() {
    this.get();
  },
  computed: {
    filterSetPendents() {
      return {
        filterPendents: this.filterPendents,
        pendentsCategoria: this.pendentsCategoria,      
      }
    }
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
          name: 'gsuitenom',
          required: true,
          label: 'Nom GSuite',
          align: 'left',
          field: row => row.gsuiteFullName,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'accions',
          required: true,
          label: 'Accions',
          align: 'center',
          field: row => row.idusuari,
          sortable: true
        }
      ]

      let responseUsersActius = await this.$axios.get(process.env.API + '/api/core/usuaris/llistat/actius');
      let dataUsersActius = await responseUsersActius.data;
      this.actius = dataUsersActius;

      let responseUsersPendents = await this.$axios.get(process.env.API + '/api/core/usuaris/llistat/pendentssuspendre');
      let dataUsersPendents = await responseUsersPendents.data;
      this.pendents = dataUsersPendents;
      this.pendentsCategoriaOptions = ['Tots', 'Professors', 'Alumnes']
      this.pendentsCategoria = 'Tots'

      let responseUsersSuspesos = await this.$axios.get(process.env.API + '/api/core/usuaris/llistat/suspesos');
      let dataUsersSuspesos = await responseUsersSuspesos.data;
      this.suspesos = dataUsersSuspesos;

      let responseUsersEliminats = await this.$axios.get(process.env.API + '/api/core/usuaris/llistat/eliminats');
      let dataUsersEliminats = await responseUsersEliminats.data;
      this.eliminats = dataUsersEliminats;
    },
    suspenUsuaris: async function () {
      const usuaris = this.selectedPendents;
      await this.$axios.post(process.env.API + '/api/core/usuaris/suspendre', usuaris);
      //Redirect
      this.reset();
    },
    suspenUsuarisSuspesos: async function () {
      const usuaris = this.selectedSuspesos;
      await this.$axios.post(process.env.API + '/api/core/usuaris/suspendre', usuaris);
      //Redirect
      this.reset();
    },
    reagruparUsuaris: async function () {
      const usuaris = this.selectedActius;
      await this.$axios.post(process.env.API + '/api/core/sync/reassignarGrups', usuaris);
      //Redirect
      this.reset();
    },
    reactivarUsuaris: async function () {
      const usuaris = this.selectedSuspesos;
      await this.$axios.post(process.env.API + '/api/core/usuaris/reactivar', usuaris);
      //Redirect
      this.reset();
    },
    reset() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$options.created.call(this);
    },
    customFilterPendents(rows, terms){
      let lowerSearch = terms.filterPendents ? terms.filterPendents.toLowerCase() : ""
      const filteredRows = rows.filter((row, i) =>{
        
        // filtre per categoria
        let categoryMatch = true;
        if (terms.pendentsCategoria === 'Professors') {
          categoryMatch = row.gestibProfessor === true;
        } else if (terms.pendentsCategoria === 'Alumnes') {
          categoryMatch = row.gestibAlumne === true;
        }

        //criteri de cerca per filtre de text (lowercase)
        let searchMath = true

        if(lowerSearch != ""){
          searchMath = false
          let sc_values = Object.values(row)
          let sc_lower = sc_values.map(x => x?.toString().toLowerCase())
        
          for (let val = 0; val<sc_lower.length; val++){
            if (sc_lower[val]?.includes(lowerSearch)){
              searchMath = true
              break
            }
          }
        }

        return categoryMatch && searchMath
      })

      return filteredRows
    }
  },
})
</script>