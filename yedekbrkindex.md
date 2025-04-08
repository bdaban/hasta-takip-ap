<template>
  <div>
    
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Hasta Listesi</h1>
            <UButton color="primary" variant="outline"  to="/hastalar/ekle" icon="i-heroicons-plus">
              Yeni Hasta Ekle
            </UButton>
          </div>
        </template>

        <div class="my-4">
          <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Hasta ara... (Ad, soyad veya TC ile)" />
        </div>

        <UTable  :data="filteredHastalar" :loading="pending" :columns="kolonlar">
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-6">
              <UIcon name="i-heroicons-user-circle" class="text-gray-400 mb-2 h-10 w-10" />
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ pending ? 'Hastalar yükleniyor...' : 'Henüz kayıtlı hasta bulunmamaktadır.' }}
              </p>
            </div>
          </template>

          <template #cinsiyet-data="{ row }">
            <UBadge :color="row.cinsiyet === 'Erkek' ? 'blue' : 'pink'" size="sm" class="font-normal">
              {{ row.cinsiyet }}
            </UBadge>
          </template>

          <!-- <template #dogumTarihi-data="{ row }">
            {{ formatDate(row.dogumTarihi) }}
          </template> -->

         

          <template #action-cell="{ row }">
            <div class="flex space-x-2">
              <UButton 
                icon="i-heroicons-eye" 
                color="gray" 
                size="xs" 
                :to="`/hastalar/${row.original.id}`"
                variant="ghost"
              />
              <UButton 
                icon="i-heroicons-pencil-square" 
                color="warning" 
                size="xs" 
                :to="`/hastalar/${row.original.id}/duzenle`"
                variant="ghost"
              />
              <UButton 
                icon="i-heroicons-trash" 
                color="danger" 
                size="xs" 
                variant="ghost"
                @click="confirmDelete(row.original.id)"
              />
            </div>
          </template>
        </UTable>
         
       <!--  <UModal v-model="showDeleteModal">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="text-warning-500 h-5 w-5" />
                <h3 class="text-lg font-medium">Hasta Silme Onayı</h3>
              </div>
            </template>
            <p>
              <span class="font-medium">{{ selectedHasta?.ad }} {{ selectedHasta?.soyad }}</span> adlı hastayı silmek istediğinize emin misiniz?
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Bu işlem geri alınamaz ve hastaya ait tüm takip ve randevu kayıtları da silinecektir.
            </p>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton @click="showDeleteModal = false" color="gray" variant="soft">
                  İptal
                </UButton>
                <UButton @click="deleteHasta" color="danger" :loading="deleting">
                  Hastayı Sil
                </UButton>
              </div>
            </template>
          </UCard>
        </UModal> -->
      </UCard>
    
  </div>
  
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

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

const kolonlar: TableColumn<Hasta>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'ad', header: 'Adı' },
  { accessorKey: 'soyad', header: 'Soyadı' },
  { accessorKey: 'tc', header: 'TC' },
  { accessorKey: 'telefon', header: 'Telefon' },
  {
    accessorKey: 'dogumTarihi',
    header: 'Doğum Tarihi',
    cell: ({ row }) => new Date(row.original.dogumTarihi).toLocaleDateString('tr-TR')
  },
  { accessorKey: 'cinsiyet', header: 'Cinsiyet' },
  { accessorKey: 'notlar', header: 'Notlar' },
  { id:'action', header:'İşlemler'}
]


definePageMeta({
  title: 'Hastalar'
})

const search = ref('')
const loading = ref(true)
const hastalar = ref([])
const showDeleteModal = ref(false)
const selectedHasta = ref(null)
const deleting = ref(false)

// API'den hastaları yükle
async function fetchHastalar() {
  

/*   loading.value = true
  try {
    const response = await $fetch('/api/hastalar')
    hastalar.value = response
  } catch (error) {
    console.error('Hastalar alınırken hata oluştu:', error)
    toast.error('Hasta listesi yüklenirken bir hata oluştu.')
  } finally {
    loading.value = false
  } */
}

// Tarih formatla
// function formatDate(dateString) {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat('tr-TR', { 
//     day: '2-digit', 
//     month: '2-digit', 
//     year: 'numeric' 
//   }).format(date);
// }

// Arama filtresi
const filteredHastalar = computed(() => {
  if (!search.value) return hastalar2.value;
  
  const searchLower = search.value.toLowerCase();
  return hastalar2.value.filter(hasta => 
    hasta.ad.toLowerCase().includes(searchLower) ||
    hasta.soyad.toLowerCase().includes(searchLower) ||
    hasta.tc.includes(search.value)
  );
});

// Silme işlemi
function confirmDelete(hasta) {
  selectedHasta.value = hasta;
  showDeleteModal.value = true;
}

async function deleteHasta() {
  if (!selectedHasta.value) return;
  
  deleting.value = true;
  try {
    await $fetch(`/api/hastalar/${selectedHasta.value.id}`, {
      method: 'DELETE'
    });
    
    // Hasta listesinden sil
    hastalar2.value = hastalar2.value.filter(h => h.id !== selectedHasta.value.id);
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
  success: (message) => {
    // Toast bildirimi ekleme işlemi (ilerleyen aşamalarda eklenecek)
    alert(message)
  },
  error: (message) => {
    // Toast bildirimi ekleme işlemi (ilerleyen aşamalarda eklenecek)
    alert(message)
  }
}

// Sayfa yüklendiğinde hastaları getir
onMounted(() => {
  // fetchHastalar()
})





</script> 