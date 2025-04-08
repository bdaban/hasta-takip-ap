<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Yeni Randevu</h1>
      <NuxtLink to="/randevular" class="text-blue-600 hover:text-blue-800">
        <span class="flex items-center">
          <i class="fas fa-arrow-left mr-2"></i>
          Randevulara Dön
        </span>
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Hasta Seçimi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hasta
            </label>
            <select
              v-model="form.hastaId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Hasta Seçin</option>
              <option v-for="hasta in hastalar" :key="hasta.id" :value="hasta.id">
                {{ hasta.ad }} {{ hasta.soyad }}
              </option>
            </select>
          </div>

          <!-- Doktor Seçimi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Doktor
            </label>
            <select
              v-model="form.doktorId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Doktor Seçin</option>
              <option v-for="doktor in doktorlar" :key="doktor.id" :value="doktor.id">
                {{ doktor.ad }} {{ doktor.soyad }}
              </option>
            </select>
          </div>

          <!-- Tarih Seçimi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tarih
            </label>
            <input
              type="datetime-local"
              v-model="form.tarih"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Randevu Tipi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Randevu Tipi
            </label>
            <select
              v-model="form.tip"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option v-for="tip in randevuTipleri" :key="tip.value" :value="tip.value">
                {{ tip.label }}
              </option>
            </select>
          </div>

          <!-- Randevu Durumu -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              v-model="form.durum"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option v-for="durum in randevuDurumlari" :key="durum.value" :value="durum.value">
                {{ durum.label }}
              </option>
            </select>
          </div>

          <!-- Notlar -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notlar
            </label>
            <textarea
              v-model="form.notlar"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <NuxtLink
            to="/randevular"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            İptal
          </NuxtLink>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Kaydediliyor...
            </span>
            <span v-else>Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Hasta {
  id: number
  ad: string
  soyad: string
}

interface Doktor {
  id: number
  ad: string
  soyad: string
  uzmanlik: string
  telefon: string
  email: string
}

const loading = ref(false)
const error = ref<string | null>(null)
const hastalar = ref<Hasta[]>([])
const doktorlar = ref<Doktor[]>([])

const form = ref({
  hastaId: '',
  doktorId: '',
  tarih: '',
  tip: 'MUAYENE',
  durum: 'BEKLIYOR',
  notlar: ''
})

// Randevu tipleri
const randevuTipleri = [
  { value: 'MUAYENE', label: 'Muayene' },
  { value: 'MUAYENE_TEKRARI', label: 'Muayene Tekrarı' },
  { value: 'KONTROL', label: 'Kontrol' },
  { value: 'ACIL', label: 'Acil' }
]

// Randevu durumları
const randevuDurumlari = [
  { value: 'BEKLIYOR', label: 'Beklemede' },
  { value: 'TAMAMLANDI', label: 'Tamamlandı' },
  { value: 'IPTAL', label: 'İptal' }
]

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
  console.log('Form verileri:', form.value)
  
  try {
    // Tarih formatını düzelt
    let tarih = form.value.tarih
    if (tarih && !tarih.includes('Z') && !tarih.includes('+')) {
      // Eğer tarih ISO formatında değilse, sonuna Z ekleyerek UTC olarak işaretle
      tarih = tarih + 'Z'
    }
    
    // API şemasına uygun veri hazırla
    const apiData = {
      hastaId: form.value.hastaId,
      doktorId: form.value.doktorId,
      tarih: tarih,
      tip: form.value.tip,
      durum: form.value.durum,
      notlar: form.value.notlar || ''
    }
    
    console.log('API isteği gönderiliyor...', apiData)
    const response = await fetch('/api/randevular/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiData)
    })

    console.log('API yanıtı:', response)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API hata yanıtı:', errorData)
      throw new Error(`Randevu oluşturulurken bir hata oluştu: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Başarılı yanıt:', data)
    
    navigateTo('/randevular')
  } catch (err: any) {
    console.error('Randevu oluşturulurken hata oluştu:', err)
    console.error('Hata detayları:', {
      message: err.message,
      stack: err.stack,
      response: err.response
    })
  } finally {
    loading.value = false
  }
}

definePageMeta({
  title: 'Yeni Randevu'
})
</script> 