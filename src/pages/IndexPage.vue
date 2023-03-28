<template>
  <q-page class="">
    {{hola}}
    <q-btn color="red" icon="mail" icon-right="send" label="On Left and Right" />
    <Prova title="Example component"
           active
           :meta="meta"/>
    <Prova title="Example component"
           active
           :meta="meta"/>
    <Prova title="Example component"
           active
           :meta="meta"/>
    adeu
    awef
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import { defineComponent,defineAsyncComponent,ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    HomePage: defineAsyncComponent(()=> import('app_common/HomePage.vue')),
    Prova: defineAsyncComponent(()=> import('app_common/Prova.vue'))
  },
  data() {
    const meta: Meta = {
      totalCount: 1200
    };
    return {
      hola: 'hola',
      meta: meta
    };
  }
});
</script>
