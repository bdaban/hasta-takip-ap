<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Yeni Muayene</h1>
          <NuxtLink
            to="/muayene"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Geri Dön
          </NuxtLink>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Hasta Seçimi -->
          <div>
            <label for="hastaId" class="block text-sm font-medium text-gray-700">Hasta</label>
            <select
              id="hastaId"
              v-model="form.hastaId"
              required
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Hasta Seçin</option>
              <option v-for="hasta in hastalar" :key="hasta.id" :value="hasta.id">
                {{ hasta.ad }} {{ hasta.soyad }}
              </option>
            </select>
          </div>

          <!-- Doktor Seçimi -->
          <div>
            <label for="doktorId" class="block text-sm font-medium text-gray-700">Doktor</label>
            <select
              id="doktorId"
              v-model="form.doktorId"
              required
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Doktor Seçin</option>
              <option v-for="doktor in doktorlar" :key="doktor.id" :value="doktor.id">
                {{ doktor.ad }} {{ doktor.soyad }}
              </option>
            </select>
          </div>

          <!-- Tarih -->
          <div>
            <label for="tarih" class="block text-sm font-medium text-gray-700">Tarih</label>
            <input
              id="tarih"
              type="datetime-local"
              v-model="form.tarih"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Durum -->
          <div>
            <label for="durum" class="block text-sm font-medium text-gray-700">Durum</label>
            <select
              id="durum"
              v-model="form.durum"
              required
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="Beklemede">Beklemede</option>
              <option value="Devam Ediyor">Devam Ediyor</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="İptal">İptal</option>
            </select>
          </div>
        </div>

        <!-- Şikayet -->
        <div>
          <label for="sikayet" class="block text-sm font-medium text-gray-700">Şikayet</label>
          <textarea
            id="sikayet"
            v-model="form.sikayet"
            rows="3"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <!-- Tanı -->
        <div>
          <label for="tani" class="block text-sm font-medium text-gray-700">Tanı</label>
          <textarea
            id="tani"
            v-model="form.tani"
            rows="3"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <!-- Tedavi -->
        <div>
          <label for="tedavi" class="block text-sm font-medium text-gray-700">Tedavi</label>
          <textarea
            id="tedavi"
            v-model="form.tedavi"
            rows="3"
            required
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <!-- Notlar -->
        <div>
          <label for="notlar" class="block text-sm font-medium text-gray-700">Notlar</label>
          <textarea
            id="notlar"
            v-model="form.notlar"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <!-- Butonlar -->
        <div class="flex justify-end space-x-3">
          <NuxtLink
            to="/muayene"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İptal
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'

interface Hasta {
  id: number
  ad: string
  soyad: string
  tc: string
}

interface Doktor {
  id: number
  ad: string
  soyad: string
  uzmanlik: string
}

const loading = ref(false)
const error = ref<string | null>(null)
const hastalar = ref<Hasta[]>([])
const doktorlar = ref<Doktor[]>([])

const form = ref({
  hastaId: 0,
  doktorId: 0,
  tarih: '',
  sikayet: '',
  tani: '',
  tedavi: '',
  durum: '',
  notlar: ''
})

const { data: hastalarData } = await useFetch<Hasta[]>('/api/hastalar')
const { data: doktorlarData } = await useFetch<Doktor[]>('/api/doktorlar')

watchEffect(() => {
  if (hastalarData.value) {
    hastalar.value = hastalarData.value
  }
  if (doktorlarData.value) {
    doktorlar.value = doktorlarData.value
  }
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const { error } = await useFetch('/api/muayeneler', {
      method: 'POST',
      body: form.value
    })
    if (error.value) {
      throw error.value
    }
    navigateTo('/muayene')
  } catch (err: any) {
    console.error('Muayene oluşturulurken hata oluştu:', err)
  } finally {
    loading.value = false
  }
}

definePageMeta({
  title: 'Yeni Muayene'
})
</script> 