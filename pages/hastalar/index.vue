<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Hasta Listesi</h1>
          <NuxtLink
            to="/hastalar/ekle"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Yeni Hasta Ekle
          </NuxtLink>
        </div>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="search"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Hasta ara... (Ad, soyad veya TC ile)"
            />
          </div>
        </div>

        <div v-if="pending" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="!filteredHastalar?.length" class="flex flex-col items-center justify-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-gray-500">
            {{ pending ? 'Hastalar yükleniyor...' : 'Henüz kayıtlı hasta bulunmamaktadır.' }}
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="kolon in kolonlar" :key="kolon.accessorKey || kolon.id" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ kolon.header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="hasta in filteredHastalar" :key="hasta.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hasta.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hasta.ad }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hasta.soyad }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hasta.tc }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hasta.telefon }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ new Date(hasta.dogumTarihi).toLocaleDateString('tr-TR') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      hasta.cinsiyet === 'Erkek'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                    ]"
                  >
                    {{ hasta.cinsiyet }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hasta.notlar }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex space-x-2">
                    <NuxtLink
                      :to="`/hastalar/${hasta.id}`"
                      class="text-gray-600 hover:text-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                      </svg>
                    </NuxtLink>
                    <NuxtLink
                      :to="`/hastalar/${hasta.id}/duzenle`"
                      class="text-yellow-600 hover:text-yellow-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </NuxtLink>
                    <button
                      class="text-red-600 hover:text-red-900"
                      @click="confirmDelete(hasta)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Silme Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6 border-b">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-lg font-medium">Hasta Silme Onayı</h3>
          </div>
        </div>

        <div class="p-6">
          <p>
            <span class="font-medium">{{ selectedHasta?.ad }} {{ selectedHasta?.soyad }}</span> adlı hastayı silmek istediğinize emin misiniz?
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Bu işlem geri alınamaz ve hastaya ait tüm takip ve randevu kayıtları da silinecektir.
          </p>
        </div>

        <div class="p-6 border-t flex justify-end gap-2">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="showDeleteModal = false"
          >
            İptal
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="deleting"
            @click="deleteHasta"
          >
            <span v-if="deleting" class="inline-block animate-spin mr-2">⌛</span>
            Hastayı Sil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Hasta = {
  id: number
  ad: string
  soyad: string
  tc: string
  telefon: string
  adres: string
  dogumTarihi: string
  cinsiyet: string
  notlar: string
}

const { data: hastalar2, pending } = await useFetch<Hasta[]>('/api/hastalar', {
  key: 'hasta-listesi',
  lazy: true
})

const kolonlar = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'ad', header: 'Adı' },
  { accessorKey: 'soyad', header: 'Soyadı' },
  { accessorKey: 'tc', header: 'TC' },
  { accessorKey: 'telefon', header: 'Telefon' },
  { accessorKey: 'dogumTarihi', header: 'Doğum Tarihi' },
  { accessorKey: 'cinsiyet', header: 'Cinsiyet' },
  { accessorKey: 'notlar', header: 'Notlar' },
  { id: 'action', header: 'İşlemler' }
]

definePageMeta({
  title: 'Hastalar'
})

const search = ref('')
const loading = ref(true)
const hastalar = ref([])
const showDeleteModal = ref(false)
const selectedHasta = ref<Hasta | null>(null)
const deleting = ref(false)

// Arama filtresi
const filteredHastalar = computed(() => {
  if (!search.value) return hastalar2.value || [];
  
  const searchLower = search.value.toLowerCase();
  return (hastalar2.value || []).filter(hasta => 
    hasta.ad.toLowerCase().includes(searchLower) ||
    hasta.soyad.toLowerCase().includes(searchLower) ||
    hasta.tc.includes(search.value)
  );
});

// Silme işlemi
function confirmDelete(hasta: Hasta) {
  selectedHasta.value = hasta;
  showDeleteModal.value = true;
}

async function deleteHasta() {
  if (!selectedHasta.value || !hastalar2.value) return;
  
  deleting.value = true;
  try {
    await $fetch(`/api/hastalar/${selectedHasta.value.id}`, {
      method: 'DELETE'
    });
    
    // Hasta listesinden sil
    hastalar2.value = hastalar2.value.filter(h => h.id !== selectedHasta.value?.id);
    showDeleteModal.value = false;
    selectedHasta.value = null;
    
    // Kullanıcıya bildirim göster
    toast.success('Hasta başarıyla silindi');
  } catch (error) {
    console.error('Hasta silinirken hata oluştu:', error);
    toast.error('Hasta silinirken bir hata oluştu');
  } finally {
    deleting.value = false;
  }
}

// Toast bildirimleri için global obje
const toast = {
  success: (message: string) => {
    // Toast bildirimi ekleme işlemi (ilerleyen aşamalarda eklenecek)
    alert(message)
  },
  error: (message: string) => {
    // Toast bildirimi ekleme işlemi (ilerleyen aşamalarda eklenecek)
    alert(message)
  }
}
</script> 