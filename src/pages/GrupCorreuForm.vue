<template>
  <q-page class="flex column q-gutter-lg" padding>
    <p class="text-h3">{{grup.gsuiteNom}}</p>
    <p class="text-h6">{{grup.gsuiteEmail}}</p>

    <q-input v-model="grup.gsuiteNom" label="Nom" />
    <q-input v-model="grup.gsuiteEmail" label="Email" type="email" hint="Correu electrònic complet" />

    <q-select
      filled
      :model-value="selected"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      @filter="filterFn"
      @input-value="setModel"
      label="Afegir usuaris de GSuite"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sense resultats
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select
      filled
      :model-value="grupSelected"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="grupOptions"
      @filter="grupFilterFn"
      @input-value="setGrupModel"
      label="Afegir grups de GSuite"
      class="q-mb-lg"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sense resultats
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select v-model="grup.grupCorreuTipus" :options="optionsGrupCorreuTipus" label="Tipus de grup" />

    <q-select
      v-if="grup.grupCorreuTipus==='ALUMNAT' || grup.grupCorreuTipus==='PROFESSORAT' || grup.grupCorreuTipus==='TUTORS'"
      v-model="grup.grups"
      :options="grupClasseOptions"
      multiple
      label="Grups classe associat"
    />

    <q-btn v-if="grup.grupCorreuTipus==='ALUMNAT' || grup.grupCorreuTipus==='PROFESSORAT' || grup.grupCorreuTipus==='TUTORS_FCT' || grup.grupCorreuTipus==='DEPARTAMENT'  || grup.grupCorreuTipus==='TUTORS'" label="Autoemplenar grup" color="primary" @click="confirmAutoemplenar = true" />

    <q-list bordered class="rounded-borders">

      <q-separator spaced v-if="grupMembers.length > 0" />
      <q-item-label header v-if="grupMembers.length > 0">Grups de correu</q-item-label>

      <q-item v-for="grup in grupMembers" clickable v-ripple>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm">{{grup.gsuiteNom}}</q-item-label>
          <q-item-label class="q-mt-sm">{{grup.gsuiteEmail}}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="12px" flat dense round icon="delete" @click="deleteGrupMember(grup)" />
          </div>
        </q-item-section>
      </q-item>

      <q-separator spaced v-if="members.length > 0" />
      <q-item-label header v-if="members.length > 0">Usuaris</q-item-label>

      <q-item v-for="user in members" clickable v-ripple>
        <q-item-section top class="col-10 gt-sm">
          <q-item-label class="q-mt-sm">{{user.gsuiteFamilyName}}, {{user.gsuiteGivenName}}</q-item-label>
          <q-item-label class="q-mt-sm">{{user.gsuiteEmail}}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="12px" flat dense round icon="delete" @click="deleteMember(user)" />
            <q-btn size="12px" flat dense round icon="lock" :color="(user.bloquejat)?'green':'gray'" @click="bloquejaMember(user)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn color="primary" icon="save" label="Desar" @click="save" />

    <q-dialog v-model="confirmAutoemplenar" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">Està segur que vol autoemplenar el grup d'usuaris?</span>
          <span class="q-ml-sm">Aquesta acció treurà els actuals membres i afegirà els nous a partir de l'arxiu de Gestib.</span>
          <span class="q-ml-sm">Aquesta acció no es pot desfer.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel·la" color="primary" v-close-popup />
          <q-btn flat label="Autoemplena" color="primary" @click="autoemplenaUsuaris" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageGrupCorreuForm',
  data() {
    return {
      grup: {},
      members: [],
      users: [],
      grupMembers: [],
      grups: [],
      grupsClasse:[],
      selected:[],
      grupSelected: [],
      options: [],
      grupOptions: [],
      optionsGrupCorreuTipus: [],
      grupClasseOptions: [],
      filterUsuaris: '',
      filterGrups: '',
      selectedUsuaris: [],
      selectedGrups: [],
      confirmAutoemplenar: false
    }
  },
  created() {
    this.get();
  },
  methods: {
    get: async function () {
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })


      const id = this.$route.params.id;

      if(id) {
        const response = await this.$axios.get(process.env.API + '/api/core/grupcorreu/grupambusuaris/' + id);
        const data = await response.data;
        this.grup = data;

        this.members = data.usuarisGrupCorreu
          .map(ug=>{
            ug.usuari.bloquejat = ug.bloquejat;
            return ug.usuari
          })
          .sort((a,b)=>{
          if(a.gsuiteFamilyName != b.gsuiteFamilyName){
            return a.gsuiteFamilyName.localeCompare(b.gsuiteFamilyName)
          }
          return a.gsuiteGivenName.localeCompare(b.gsuiteGivenName)
        });
        this.grupMembers = data.grupCorreus.sort((a,b)=>{
          return a.gsuiteEmail.localeCompare(b.gsuiteEmail)
        });
      }

      const responseUsers = await this.$axios.get(process.env.API + '/api/core/usuaris/llistat/actius');
      const dataUsers = await responseUsers.data;
      this.users = dataUsers;

      const responseGroups = await this.$axios.get(process.env.API + '/api/core/grupcorreu/llistat');
      const dataGroups = await responseGroups.data;
      this.grups = dataGroups;

      const responseGrupsClasse = await this.$axios.get(process.env.API + '/api/core/grup/llistat');
      const dataGrupsClasse = await responseGrupsClasse.data;
      /* TODO: PROMISE.ALL */
      const gClasse = dataGrupsClasse.map(async g=>{
        const responseCurs = await this.$axios.get(process.env.API + '/api/core/curs/getByCodiGestib/'+g.gestibCurs)
        const dataCurs = await responseCurs.data;
        g.curs = dataCurs;
        return g;
      });
      const grupsClasse = await Promise.all(gClasse);
      this.grupsClasse = grupsClasse.sort((a,b)=>{
        if((!a || !a.curs || !a.curs.gestibNom || !a.gestibNom) && (!b || !b.curs || !b.curs.gestibNom || !b.gestibNom)){
          return 0;
        }
        if(!a || !a.curs || !a.curs.gestibNom || !a.gestibNom){
          return -1;
        }
        if(!b || !b.curs || !b.curs.gestibNom || !b.gestibNom){
          return 1;
        }
        return (a.curs.gestibNom + a.gestibNom).localeCompare(b.curs.gestibNom + b.gestibNom)
      })


      this.options = this.users.map(user=>{
        return {
          label: user.gsuiteFamilyName + ', ' + user.gsuiteGivenName+ ' ('+user.gsuiteEmail+')',
          value: user.gsuiteEmail
        }
      })

      this.grupOptions = this.grups.map(grup=>{
        return {
          label: grup.gsuiteNom + ' ('+grup.gsuiteEmail+')',
          value: grup.gsuiteEmail
        }
      })
      this.optionsGrupCorreuTipus = ['GENERAL','ALUMNAT','CLAUSTRE','PROFESSORAT','TUTORS','TUTORS_FCT','DEPARTAMENT']

      this.grupClasseOptions = this.grupsClasse
        .map(g=>{
          return {
            label: g.curs.gestibNom + g.gestibNom,
            value: g.gestibIdentificador
          }
        })
        .sort((a,b)=>{
          if((!a || !a.curs || !a.curs.gestibNom || !a.gestibNom) && (!b || !b.curs || !b.curs.gestibNom || !b.gestibNom)){
            return 0;
          }
          if(!a || !a.curs || !a.curs.gestibNom || !a.gestibNom){
            return -1;
          }
          if(!b || !b.curs || !b.curs.gestibNom || !b.gestibNom){
            return 1;
          }
          return (a.curs.gestibNom + a.gestibNom).localeCompare(b.curs.gestibNom + b.gestibNom)
        })

      if(id){
        this.grup.grupCorreuTipus = this.optionsGrupCorreuTipus.find(tipus=>tipus==this.grup.grupCorreuTipus);
        this.grup.grups = this.grup.grups.map(g=>{
          return this.grupClasseOptions.find(gco=>gco.value===g.gestibIdentificador)
        })
      }

      dialog.hide();
    },
    deleteMember: function(member){
      this.members = this.members.filter(m=>{
        return m !== member
      })
    },
    deleteGrupMember: function(member){
      this.grupMembers = this.grupMembers.filter(m=>{
        return m !== member
      })
    },
    bloquejaMember: function(member){
      member.bloquejat = !member.bloquejat;
    },
    setModel (val) {
      let usuari = this.users.find(user=> {
        return user.gsuiteFamilyName + ', ' + user.gsuiteGivenName + ' ('+user.gsuiteEmail+')' === val
      })
      if(usuari){
        this.members.push(usuari)
        this.selected = [];
      }
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.users.map(user=>{
            return {
              label: user.gsuiteFamilyName + ', ' + user.gsuiteGivenName + ' ('+user.gsuiteEmail+')',
              value: user.gsuiteEmail
            }
          })
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.users.filter(v => {
          let cognoms = false;
          let nom = false;
          let email = false;

          if(v.gsuiteFamilyName) {
            cognoms = v.gsuiteFamilyName.toLowerCase().indexOf(needle) > -1
          }

          if(v.gsuiteGivenName) {
            nom = v.gsuiteGivenName.toLowerCase().indexOf(needle) > -1
          }

          if(v.gsuiteEmail) {
            email = v.gsuiteEmail.toLowerCase().indexOf(needle) > -1
          }
          return cognoms || nom || email;
        }).map(user=>{
          return {
            label: user.gsuiteFamilyName + ', ' + user.gsuiteGivenName + ' ('+user.gsuiteEmail+')',
            value: user.gsuiteEmail
          }
        })
      })
    },
    setGrupModel (val) {
      let grup = this.grups.find(grup=> {
        return grup.gsuiteNom + ' ('+grup.gsuiteEmail+')' === val
      })
      if(grup){
        this.grupMembers.push(grup)
        this.grupSelected = [];
      }
    },
    grupFilterFn (val, update) {
      if (val === '') {
        update(() => {
          this.grupOptions = this.grups.map(grup=>{
            return {
              label: grup.gsuiteNom + ' ('+grup.gsuiteEmail+')',
              value: grup.gsuiteEmail
            }
          })
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.grupOptions = this.grups.filter(v => {
          let nom = false;
          let email = false;

          if(v.gsuiteNom) {
            nom = v.gsuiteNom.toLowerCase().indexOf(needle) > -1
          }

          if(v.gsuiteEmail) {
            email = v.gsuiteEmail.toLowerCase().indexOf(needle) > -1
          }
          return nom || email;
        }).map(grup=>{
          return {
            label: grup.gsuiteNom + ' ('+grup.gsuiteEmail+')',
            value: grup.gsuiteEmail
          }
        })
      })
    },
    save: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      this.grup.usuaris = this.members;
      this.grup.grupCorreus = this.grupMembers;

      await this.$axios.post(process.env.API + '/api/core/grupcorreu/desar',this.grup);
      dialog.hide();
      //Redirect
      this.$router.push('/grupcorreu/list');
    },
    autoemplenaUsuaris: async function(){
      const dialog = this.$q.dialog({
        message: 'Carregant...',
        progress: true, // we enable default settings
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

      this.grup.usuaris = this.members;
      this.grup.grupCorreus = this.grupMembers;


      await this.$axios.post(process.env.API + '/api/core/grupcorreu/desar', this.grup);

      const response = await this.$axios.get(process.env.API + '/api/core/grupcorreu/grupambusuaris/' + this.grup.gsuiteEmail);
      const data = await response.data;
      this.grup = data;

      await this.$axios.post(process.env.API + '/api/core/grupcorreu/autoemplenar',this.grup);
      dialog.hide();
      //Redirect
      //this.$router.push('/grupcorreu/'+this.grup.gsuiteEmail);
      //this.reset();
      window.location.reload();
    },
    reset() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$options.created.call(this);
    }
  }
})
</script>
