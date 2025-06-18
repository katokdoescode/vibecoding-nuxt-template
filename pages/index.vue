<template>
  <div>
    <h1 class="text-2xl font-bold">Study Cases</h1>
    <div v-if="cases">
    <ul v-if="cases.length > 0">
      <li v-for="caseItem in cases" :key="caseItem.id">
        <h2 class="text-lg font-bold">{{ caseItem.title }}</h2>
        <p class="text-sm text-gray-500">{{ caseItem.description }}</p>
        </li>
      </ul>
      <p v-else>No cases found</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Cases } from '~/server/types';

const { data: cases } = await useAsyncData('cases', () => $fetch<Cases[]>('/api/cases'));
</script>
