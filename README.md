# ⏳ Anımsat

> **Zarif, modern, gizlilik odaklı ve tamamen ücretsiz geri sayım & widget uygulaması.**  
> *An elegant, privacy-first, ad-free countdown & iOS/Android widget app built with Expo & React Native.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB.svg?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-brightgreen.svg)]()

---

## 🌟 Özellikler (Features)

- 🔒 **%100 Gizlilik ve Çevrimdışı (100% Offline & Private):** Hesap oluşturma yok, oturum açma yok, arka uç sunucu yok. Tüm etkinlikleriniz, notlarınız ve fotoğraflarınız cihazınızdaki yerel **SQLite** veritabanında saklanır.
- 🚫 **Reklamsız & Ücretsiz:** Abonelik yok, uygulama içi satın alma yok, reklam yok.
- 📱 **Yerel iOS Widget Desteği (`expo-widgets`):**
  - **Ana Ekran Widget'ları:** Küçük (Small), Orta (Medium) ve Büyük (Large) boyutlarda pinlenen etkinlikleri canlı geri sayımla gösterir.
  - **Kilit Ekranı (Lock Screen) Widget'ı:** Kilit ekranında dikdörtgen alanda yaklaşan etkinliği gösterir.
- 🔔 **Yerel Akıllı Bildirimler:** Yaklaşan tarihler için internete ihtiyaç duymadan cihaz üzerinde zamanlanan yerel hatırlatmalar (`expo-notifications`).
- 🎨 **Kişiselleştirilebilir Tasarım:**
  - Özel renk paletleri ve degradeler (gradients)
  - Etkinliklere özel kırpılabilir arka plan fotoğrafları
  - Açık ve koyu tema (Dark / Light mode) uyumu
- 🌍 **Kapsamlı Dil Desteği:** Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Japonca, Korece dahil **30'dan fazla dilde** yerelleştirme (`src/i18n`).

---

## 🛠️ Teknoloji Yığını (Tech Stack)

- **Framework:** [Expo](https://expo.dev/) (SDK 57) & [React Native](https://reactnative.dev/) (0.86)
- **Router:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Veritabanı:** [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Widget Altyapısı:** [expo-widgets](https://github.com/bndkt/expo-widgets)
- **Animasyon & Etkileşim:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Tarih İşleme:** [date-fns](https://date-fns.org/)
- **Tip Güvenliği:** TypeScript

---

## 🚀 Başlarken (Getting Started)

### Gereksinimler (Prerequisites)
- [Node.js](https://nodejs.org/) (v20 veya v22 önerilir)
- [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) veya iOS Simülatörü / Android Emülatörü

### Kurulum (Installation)

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/serhatkochan/animsat.git
   cd animsat
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run start
   ```

> **Not:** Widget'lar yerel kod gerektirdiğinden, widget'ları tam fonksiyonel test etmek için bir Development Build (`npx expo run:ios` veya `npx expo run:android`) oluşturmanız önerilir.

---

## ⚙️ Yapılandırma & Dağıtım (Configuration & Deployment)

Bu proje açık kaynaklıdır; bu nedenle kişisel API anahtarları, sertifikalar ve gizli kimlik bilgileri Git deposunda tutulmaz (`.gitignore` ile korunur). Projeyi kendi Expo / Apple hesabınızla derlemek için aşağıdaki adımları takip edin:

### 1. `eas.json` Yapılandırması (EAS Build & Submit)

Projeyi App Store'a göndermek veya EAS üzerinde derlemek istiyorsanız:

1. Proje kökündeki `eas.json.example` dosyasını `eas.json` olarak kopyalayın:
   ```bash
   cp eas.json.example eas.json
   ```
2. `eas.json` dosyasındaki ilgili alanları kendi Apple Developer ve App Store Connect bilgilerinizle doldurun:
   - `appleTeamId`: Apple Geliştirici Ekip Kimliğiniz (10 haneli alfanümerik kod).
   - `ascAppId`: App Store Connect'teki uygulamanızın Apple ID numarası.
   - `ascApiKeyId`: App Store Connect API Anahtar ID'si.
   - `ascApiKeyIssuerId`: App Store Connect Issuer ID (UUID formatında).
   - `ascApiKeyPath`: İndirdiğiniz `.p8` özel anahtar dosyasının yolu (Örn: `./AuthKey_XXXXXX.p8`).

> **Güvenlik Uyarısı:** `eas.json` ve `*.p8` dosyaları `.gitignore` dosyasında tanımlıdır ve **asla** Git'e commit edilmemelidir!

### 2. `app.json` Yapılandırması

Uygulamayı kendi adınıza yayınlamak için [app.json](app.json) dosyasındaki şu alanları kendi hesap bilgilerinize göre güncelleyin:
- `expo.owner`: Kendi Expo kullanıcı adınız veya organizasyonunuz.
- `expo.extra.eas.projectId`: Kendi projeniz için `npx eas project:init` komutunu çalıştırarak alacağınız yeni proje kimliği.
- `expo.ios.bundleIdentifier`: Uygulamanızın benzersiz iOS Bundle ID'si (Örn: `com.sirketiniz.animsat`).
- `expo.android.package`: Uygulamanızın benzersiz Android paket adı.

---

## 📁 Proje Mimarisi (Project Structure)

```text
animsat/
├── app/                  # Expo Router sayfaları (Tabs, dinamik event rotaları)
│   ├── (tabs)/           # Alt menü sekmeleri (Ana sayfa, Ekle, Ayarlar)
│   └── event/            # Etkinlik detay ve düzenleme sayfaları
├── assets/               # İkonlar, yazı tipleri, splash görselleri
├── components/           # Genel UI bileşenleri
├── src/
│   ├── components/       # Uygulamaya özel bileşenler (Kartlar, Seçiciler, Modallar)
│   ├── constants/        # Sabitler (Marka, renkler, kategoriler)
│   ├── hooks/            # Özel React hook'ları (useEvents, useSettings)
│   ├── i18n/             # Çoklu dil çeviri katalogları ve yöneticisi
│   ├── lib/              # Yerel SQLite veritabanı, bildirimler ve yardımcı fonksiyonlar
│   ├── theme/            # Tema sağlayıcısı ve tasarım token'ları
│   └── types/            # TypeScript tip tanımları
├── widgets/              # iOS WidgetKit bileşenleri (CountdownWidget)
├── app.json              # Expo uygulama yapılandırması
├── eas.json.example      # EAS derleme ve gönderim şablonu
└── package.json          # Proje bağımlılıkları ve scriptler
```

---

## 🤝 Katkıda Bulunma (Contributing)

Katkılarınızı memnuniyetle kabul ediyoruz! Bir hata bulduysanız veya yeni bir özellik eklemek istiyorsanız:

1. Bu repoyu Fork'layın (`Fork`).
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/harika-ozellik`).
3. Değişikliklerinizi commit edin (`git commit -m 'feat: harika bir özellik eklendi'`).
4. Dalınıza push yapın (`git push origin feature/harika-ozellik`).
5. Bir **Pull Request** açın.

---

## 📄 Lisans (License)

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.
