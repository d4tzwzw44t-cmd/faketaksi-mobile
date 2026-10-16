# FakeTaksi 🚕

Eğlence amaçlı, gerçek taksi göndermeyen mobil taksi simülasyonu.

## Özellikler
- İzin verilirse GPS konumu, aksi halde İstanbul örnek konumu
- Harita üzerinde kurgusal taksiler
- 5/10 dakika seçimi ve hareket eden sanal araç
- Kurgusal sürücü kartı, iptal ve geri sayım

**Not:** Araç ilk prototipte düz çizgide ilerler, gerçek yol rotası değildir. Gerçek sürücü veya ödeme bulunmaz.

## Çalıştırma
Node.js bulunan bir geliştirme ortamında:

```bash
npm install
npx expo start --tunnel
```

Expo Go ile terminaldeki bağlantıyı açın. Bu depo tek başına çalışan bir sunucu sağlamaz. iOS ve Android cihaz testleri henüz tamamlanmamıştır.
