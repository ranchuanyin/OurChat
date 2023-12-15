<template>
  <RecycleScroller
      class="scroller"
      :items="myObjectList"
      :item-size="32"
      key-field="value"
      v-slot="{ item }"
  >
    <div class="user">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>

<script setup>
import { ref } from 'vue'
import {RecycleScroller} from  'vue-virtual-scroller'
const count = ref(5)
const load = () => {
  count.value += 2
}

const myObjectList = [
  { name: "Item 1", value: 10 },
  { name: "Item 2", value: 20 },
  { name: "Item 3", value: 30 },
  { name: "Item 4", value: 40 },
  { name: "Item 5", value: 50 },
  { name: "Item 6", value: 60 },
  { name: "Item 7", value: 70 },
  { name: "Item 8", value: 80 },
  { name: "Item 1", value: 100 },
  { name: "Item 2", value: 200 },
  { name: "Item 3", value: 300 },
  { name: "Item 4", value: 400 },
  { name: "Item 5", value: 500 },
  { name: "Item 6", value: 600 },
  { name: "Item 7", value: 700 },
  { name: "Item 8", value: 800 }
];
</script>

<style scoped>
.scroller {
  height: 100%;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
</style>