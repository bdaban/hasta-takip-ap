<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Muayene Detayı</h1>
          <div class="flex space-x-3">
            <NuxtLink
              :to="`/muayene/${id}/duzenle`"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-600 bg-white border border-yellow-600 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Düzenle
            </NuxtLink>
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
      </div>

      <div v-if="pending" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="p-6 text-center text-red-500">
        {{ error }}
      </div>

      <div v-else-if="muayene" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Hasta Bilgileri -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Hasta Bilgileri</h3>
            <dl class="space-y-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Ad Soyad</dt>
                <dd class="text-sm text-gray-900">{{ muayene.hasta?.ad }} {{ muayene.hasta?.soyad }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">TC Kimlik No</dt>
                <dd class="text-sm text-gray-900">{{ muayene.hasta?.tc }}</dd>
              </div>
            </dl>
          </div>

          <!-- Doktor Bilgileri -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Doktor Bilgileri</h3>
            <dl class="space-y-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Ad Soyad</dt>
                <dd class="text-sm text-gray-900">{{ muayene.doktor?.ad }} {{ muayene.doktor?.soyad }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Uzmanlık</dt>
                <dd class="text-sm text-gray-900">{{ muayene.doktor?.uzmanlik }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Muayene Detayları -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Muayene Detayları</h3>
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Tarih</dt>
              <dd class="text-sm text-gray-900">{{ new Date(muayene.tarih).toLocaleDateString('tr-TR') }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Durum</dt>
              <dd class="text-sm">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    muayene.durum === 'Tamamlandı'
                      ? 'bg-green-100 text-green-800'
                      : muayene.durum === 'Beklemede'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ muayene.durum }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Şikayet</dt>
              <dd class="text-sm text-gray-900">{{ muayene.sikayet }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Tanı</dt>
              <dd class="text-sm text-gray-900">{{ muayene.tani }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Tedavi</dt>
              <dd class="text-sm text-gray-900">{{ muayene.tedavi }}</dd>
            </div>
            <div v-if="muayene.notlar">
              <dt class="text-sm font-medium text-gray-500">Notlar</dt>
              <dd class="text-sm text-gray-900">{{ muayene.notlar }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Muayene = {
  id: number
  hastaId: number
  doktorId: number
  tarih: string
  sikayet: string
  tani: string
  tedavi: string
  durum: string
  notlar: string
  createdAt: string
  hasta?: {
    id: number
    ad: string
    soyad: string
    tc: string
  }
  doktor?: {
    id: number
    ad: string
    soyad: string
    uzmanlik: string
  }
}

const route = useRoute()
const id = route.params.id

const { data: muayene, pending, error } = await useFetch<Muayene>(`/api/muayeneler/${id}`, {
  key: `muayene-${id}`,
  lazy: true
})

definePageMeta({
  title: 'Muayene Detayı'
})
</script> 