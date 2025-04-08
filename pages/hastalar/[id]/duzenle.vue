<template>
  <div>
    <UContainer>
      <UCard v-if="hasta">
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Hasta Düzenle: {{ hasta.ad }} {{ hasta.soyad }}</h1>
            <UButton :to="`/hastalar/${$route.params.id}`" color="gray" variant="soft" icon="i-heroicons-arrow-left">
              Geri Dön
            </UButton>
          </div>
        </template>

        <UForm :schema="formSchema" :state="form" class="space-y-4" @submit="onSubmit">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Adı" name="ad">
              <UInput v-model="form.ad" placeholder="Hastanın adını girin" />
            </UFormGroup>

            <UFormGroup label="Soyadı" name="soyad">
              <UInput v-model="form.soyad" placeholder="Hastanın soyadını girin" />
            </UFormGroup>

            <UFormGroup label="TC Kimlik No" name="tc">
              <UInput v-model="form.tc" placeholder="TC Kimlik Numarası" maxlength="11" />
            </UFormGroup>

            <UFormGroup label="Telefon" name="telefon">
              <UInput v-model="form.telefon" placeholder="Telefon Numarası" />
            </UFormGroup>

            <UFormGroup label="Doğum Tarihi" name="dogumTarihi">
              <UInput type="date" v-model="form.dogumTarihi" />
            </UFormGroup>

            <UFormGroup label="Cinsiyet" name="cinsiyet">
              <USelect 
                v-model="form.cinsiyet" 
                :options="[
                  { label: 'Erkek', value: 'Erkek' },
                  { label: 'Kadın', value: 'Kadın' }
                ]" 
                placeholder="Cinsiyet seçin" 
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Adres" name="adres">
            <UTextarea v-model="form.adres" placeholder="Hastanın adresini girin" rows="3" />
          </UFormGroup>

          <UFormGroup label="Notlar" name="notlar">
            <UTextarea v-model="form.notlar" placeholder="Hasta hakkında notlar" rows="3" />
          </UFormGroup>

          <div class="flex justify-end space-x-2">
            <UButton :to="`/hastalar/${$route.params.id}`" color="gray">İptal</UButton>
            <UButton type="submit" color="primary" :loading="submitting">Güncelle</UButton>
          </div>
        </UForm>
      </UCard>

      <UCard v-else-if="loading" class="py-12">
        <div class="flex flex-col items-center justify-center">
          <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-primary-500 mb-4" />
          <p class="text-lg font-medium">Hasta bilgileri yükleniyor...</p>
        </div>
      </UCard>

      <div v-else class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-warning-500 mb-4" />
        <h2 class="text-xl font-bold mb-2">Hasta Bulunamadı</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Düzenlemek istediğiniz hasta kayıtlarda mevcut değil.</p>
        <UButton to="/hastalar" color="primary">Hasta Listesine Dön</UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const id = route.params.id

definePageMeta({
  title: 'Hasta Düzenle'
})

const hasta = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref(null)

// Form verilerini başlat (formun başlangıç değerleri)
const form = reactive({
  ad: '',
  soyad: '',
  tc: '',
  telefon: '',
  dogumTarihi: '',
  cinsiyet: '',
  adres: '',
  notlar: ''
})

const formSchema = z.object({
  ad: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  soyad: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  tc: z.string()
    .length(11, 'TC Kimlik numarası 11 haneli olmalıdır')
    .regex(/^[0-9]+$/, 'TC Kimlik numarası sadece rakamlardan oluşmalıdır'),
  telefon: z.string().regex(/^05[0-9]{9}$/, 'Geçerli bir telefon numarası girin'),
  dogumTarihi: z.string().min(1, 'Doğum tarihi zorunludur'),
  cinsiyet: z.string().min(1, 'Cinsiyet seçimi zorunludur'),
  adres: z.string().optional(),
  notlar: z.string().optional()
})

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

// Hasta verilerini getir
async function fetchHastaDetay() {
  loading.value = true
  error.value = null
  
  try {
    const data = await $fetch(`/api/hastalar/${id}`)
    hasta.value = data
    
    // Form verilerini hasta nesnesi ile doldur
    const dogumTarihi = new Date(data.dogumTarihi)
    const formattedDate = dogumTarihi.toISOString().split('T')[0] // YYYY-MM-DD formatı
    
    Object.assign(form, {
      ad: data.ad,
      soyad: data.soyad,
      tc: data.tc,
      telefon: data.telefon || '',
      dogumTarihi: formattedDate,
      cinsiyet: data.cinsiyet,
      adres: data.adres || '',
      notlar: data.notlar || ''
    })
  } catch (err) {
    console.error('Hasta bilgileri alınamadı:', err)
    error.value = err.data?.statusMessage || 'Hasta bilgileri alınamadı'
  } finally {
    loading.value = false
  }
}

// Form gönderildiğinde
const onSubmit = async () => {
  submitting.value = true
  
  try {
    // API'ye güncellenecek hasta verilerini gönder
    const response = await $fetch(`/api/hastalar/${id}`, {
      method: 'PUT',
      body: form
    })
    
    // Başarılı güncelleme sonrası hasta detay sayfasına yönlendirme
    toast.success('Hasta bilgileri başarıyla güncellendi')
    router.push(`/hastalar/${id}`)
  } catch (error) {
    console.error('Hasta güncellenirken hata oluştu:', error)
    
    // Hata mesajını göster
    const errorMessage = error.data?.statusMessage || 'Hasta güncellenirken bir hata oluştu'
    toast.error(errorMessage)
  } finally {
    submitting.value = false
  }
}

// Sayfa yüklendiğinde hasta bilgilerini getir
onMounted(() => {
  fetchHastaDetay()
})
</script> 