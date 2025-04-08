<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Muayene Listesi</h1>
          <NuxtLink
            to="/muayene/yeni"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Yeni Muayene
          </NuxtLink>
        </div>
      </div>

      <div class="p-6">
        <!-- Arama -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="search"
              type="text"
              placeholder="Hasta adı, doktor adı veya durum ile ara..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Yükleniyor -->
        <div v-if="pending" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Hata -->
        <div v-else-if="error" class="text-center py-8 text-red-500">
          {{ error }}
        </div>

        <!-- Boş Durum -->
        <div v-else-if="filteredMuayeneler.length === 0" class="text-center py-8 text-gray-500">
          Muayene bulunamadı
        </div>

        <!-- Tablo -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doktor</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="muayene in filteredMuayeneler" :key="muayene.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ muayene.hasta?.ad }} {{ muayene.hasta?.soyad }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ muayene.doktor?.ad }} {{ muayene.doktor?.soyad }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ new Date(muayene.tarih).toLocaleDateString('tr-TR') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
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
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <NuxtLink
                    :to="`/muayene/${muayene.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Görüntüle
                  </NuxtLink>
                  <NuxtLink
                    :to="`/muayene/${muayene.id}/duzenle`"
                    class="text-yellow-600 hover:text-yellow-900"
                  >
                    Düzenle
                  </NuxtLink>
                  <button
                    @click="handleDelete(muayene)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Silme Onay Modalı -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Muayene Sil</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Bu muayeneyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirmDelete"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Sil
            </button>
            <button
              type="button"
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

interface Muayene {
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
  hasta?: Hasta
  doktor?: Doktor
}

const search = ref('')
const showDeleteModal = ref(false)
const selectedMuayene = ref<Muayene | null>(null)

const { data: muayeneler, pending, error } = await useFetch<Muayene[]>('/api/muayeneler')

const filteredMuayeneler = computed(() => {
  if (!muayeneler.value) return []
  if (!search.value) return muayeneler.value

  const searchLower = search.value.toLowerCase()
  return muayeneler.value.filter(muayene => {
    const hastaAdi = `${muayene.hasta?.ad} ${muayene.hasta?.soyad}`.toLowerCase()
    const doktorAdi = `${muayene.doktor?.ad} ${muayene.doktor?.soyad}`.toLowerCase()
    const durum = muayene.durum.toLowerCase()

    return hastaAdi.includes(searchLower) ||
           doktorAdi.includes(searchLower) ||
           durum.includes(searchLower)
  })
})

const handleDelete = (muayene: Muayene) => {
  selectedMuayene.value = muayene
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedMuayene.value) return

  try {
    const { error } = await useFetch(`/api/muayeneler/${selectedMuayene.value.id}`, {
      method: 'DELETE'
    })
    if (error.value) {
      throw error.value
    }
    showDeleteModal.value = false
    selectedMuayene.value = null
    await refreshNuxtData()
  } catch (err: any) {
    console.error('Muayene silinirken hata oluştu:', err)
  }
}

definePageMeta({
  title: 'Muayene Listesi'
})
</script> 