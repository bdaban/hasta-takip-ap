export interface Doktor {
  id: number
  ad: string
  soyad: string
  tc: string
  telefon: string | null
  cinsiyet: string
  dogumTarihi: Date
  createdAt: Date
}

export interface Hasta {
  id: number
  ad: string
  soyad: string
  tc: string
  telefon: string | null
  adres: string | null
  dogumTarihi: Date
  cinsiyet: string
  notlar: string | null
  createdAt: Date
}

export interface Muayene {
  id: number
  hastaId: number
  doktorId: number
  tarih: Date
  sikayet: string | null
  tani: string | null
  tedavi: string | null
  notlar: string | null
  durum: 'DEVAM_EDIYOR' | 'TAMAMLANDI' | 'IPTAL'
  createdAt: Date
  hasta: Hasta
  doktor: Doktor
  tetkikler: Tetkik[]
}

export interface Tetkik {
  id: number
  muayeneId: number
  ad: string
  sonuc: string | null
  tarih: Date
  createdAt: Date
  muayene: Muayene
}

export interface Takip {
  id: number
  hastaId: number
  doktorId: number
  tarih: Date
  sikayet: string | null
  tani: string | null
  tedavi: string | null
  notlar: string | null
  durum: 'DEVAM_EDIYOR' | 'TAMAMLANDI' | 'IPTAL'
  createdAt: Date
  hasta: Hasta
  doktor: Doktor
} 