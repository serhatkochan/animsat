import { APP_NAME, SUPPORT_EMAIL } from '@/src/constants/branding';
import type { AppLocale } from '@/src/i18n/locales';

export type PrivacySection = {
  title: string;
  body: string;
  linkUrl?: string;
  linkLabel?: string;
};

export type PrivacyDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
};

const docs: Partial<Record<AppLocale, PrivacyDoc>> = {
  tr: {
    title: 'Gizlilik Politikası',
    updated: 'Son güncelleme: 27 Eylül 2026',
    intro: `${APP_NAME}, gizliliğinize tam saygı duyar. Uygulama tamamen ücretsiz ve reklamsızdır; kişisel verilerinizi toplamaz, izlemez veya sunuculara göndermez.`,
    sections: [
      {
        title: '1. Topladığımız veriler',
        body: 'Doğrudan senin girdiğin veriler: Eklediğin tarihler, başlıklar, konumlar ve fotoğraflar yalnızca bu cihazda yerel olarak saklanır. Geliştiriciye veya herhangi bir üçüncü taraf sunucusuna asla gönderilmez. Uygulama hiçbir kişisel veri, kullanım analitiği veya reklam kimliği toplamaz.',
      },
      {
        title: '2. Reklamsız ve takipsiz',
        body: 'Uygulama tamamen ücretsizdir ve hiçbir reklam içermez. Apple’ın App Tracking Transparency (ATT) izni veya reklam kimliği (IDFA) kullanılmaz; kullanım alışkanlıklarınız asla takip edilmez.',
      },
      {
        title: '3. Verilerin kullanım amacı',
        body: 'Girdiğin bilgiler yalnızca cihazındaki gün sayacını, ana ekran ve kilit ekranı widget’larını ve cihazında ayarladığın yerel hatırlatıcı bildirimlerini çalıştırmak amacıyla kullanılır.',
      },
      {
        title: '4. Veri paylaşımı',
        body: 'Girdiğin tarih verileri hiçbir üçüncü tarafla paylaşılmaz, satılmaz veya aktarılmaz. Uygulamada üçüncü taraf reklam veya analitik kütüphanesi (SDK) bulunmaz.',
      },
      {
        title: '5. Veri saklama ve silme',
        body: 'Tarihlerin, sen silene veya uygulamayı kaldırana kadar yalnızca cihazında durur. Geliştirici tarafında kullanıcı verisi tutan hiçbir sunucu veya veri tabanı yoktur. Uygulamayı kaldırarak yerel verileri anında tamamen temizleyebilirsin.',
      },
      {
        title: '6. Çocukların gizliliği',
        body: 'Uygulama herhangi bir kişisel veri toplamadığı için çocukların gizliliğine yönelik bir risk barındırmaz.',
      },
      {
        title: '7. Hakların',
        body: 'Cihazındaki verileri dilediğin an uygulama içinden silebilir veya uygulamayı kaldırarak yerel kayıtları temizleyebilirsin.',
      },
      {
        title: '8. İletişim',
        body: 'Bu politika hakkında sorularınız için:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'en-US': {
    title: 'Privacy Policy',
    updated: 'Last updated: 27 September 2026',
    intro: `${APP_NAME} respects your privacy completely. The app is 100% free and ad-free; it does not collect, track, or transmit any personal data.`,
    sections: [
      {
        title: '1. Data we collect',
        body: 'Data you enter: Dates, titles, locations, and photos stay on this device only. They are never sent to the developer or any server. The app collects no personal data, usage analytics, or advertising identifiers.',
      },
      {
        title: '2. No ads and no tracking',
        body: 'The app is completely free and contains no advertisements. We do not use Apple’s App Tracking Transparency (ATT) or advertising identifiers (IDFA), and we never track your activity.',
      },
      {
        title: '3. How we use data',
        body: 'Your information is used solely to operate the countdown, Home Screen and Lock Screen widgets, and local reminder notifications set on your device.',
      },
      {
        title: '4. Sharing',
        body: 'The dates and photos you enter are never shared, sold, or transferred to third parties. The app contains no third-party advertising or analytics SDKs.',
      },
      {
        title: '5. Retention and deletion',
        body: 'Your dates remain on the device until you delete them or uninstall the app. The developer does not operate servers that store user data. Uninstalling the app clears all local data immediately.',
      },
      {
        title: '6. Children',
        body: 'The app does not collect personal data from anyone, including children under 13.',
      },
      {
        title: '7. Your choices',
        body: 'You can delete data inside the app at any time, or uninstall the app to erase all stored data locally.',
      },
      {
        title: '8. Contact',
        body: 'Questions about this policy:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'de-DE': {
    title: 'Datenschutz',
    updated: 'Zuletzt aktualisiert: 27. September 2026',
    intro: `${APP_NAME} respektiert deine Privatsphäre. Die App ist vollständig kostenlos und werbefrei; sie sammelt keine personenbezogenen Daten und sendet nichts an Server.`,
    sections: [
      {
        title: '1. Welche Daten wir erfassen',
        body: 'Von dir eingegebene Daten: Daten, Titel, Orte und Fotos bleiben ausschließlich auf diesem Gerät. Sie gehen niemals an uns oder einen Server. Die App erfasst keine Analysen oder Werbe-IDs.',
      },
      {
        title: '2. Keine Werbung und kein Tracking',
        body: 'Die App ist völlig werbefrei. Weder App Tracking Transparency noch Werbe-IDs (IDFA) werden genutzt; es findet kein Tracking statt.',
      },
      {
        title: '3. Zwecke',
        body: 'Ausschließlich für den Countdown, die Widgets auf dem Home- und Sperrbildschirm sowie lokale Erinnerungen auf deinem Gerät.',
      },
      {
        title: '4. Weitergabe',
        body: 'Deine Termine werden niemals an Dritte weitergegeben, verkauft oder übertragen. Es gibt keine Drittanbieter-Werbe- oder Analyse-SDKs.',
      },
      {
        title: '5. Speicherung und Löschung',
        body: 'Termine bleiben auf dem Gerät, bis du sie löschst oder die App deinstallierst. Der Entwickler betreibt keinen Server für Nutzerdaten.',
      },
      {
        title: '6. Kinder',
        body: 'Die App sammelt wissentlich keinerlei personenbezogene Daten von Kindern.',
      },
      {
        title: '7. Deine Rechte',
        body: 'Du kannst Daten jederzeit in der App löschen oder die App entfernen, um alle lokalen Daten zu löschen.',
      },
      {
        title: '8. Kontakt',
        body: 'Fragen zu dieser Richtlinie:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'fr-FR': {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : 27 septembre 2026',
    intro: `${APP_NAME} respecte votre vie privée. L’application est entièrement gratuite et sans publicité ; aucune donnée personnelle n’est collectée ni envoyée à des serveurs.`,
    sections: [
      {
        title: '1. Données collectées',
        body: 'Données que vous saisissez : dates, titres, lieux et photos restent uniquement sur cet appareil. Elles ne sont jamais envoyées au développeur ni à un serveur.',
      },
      {
        title: '2. Sans pub ni suivi',
        body: 'L’application est sans publicité. Ni l’App Tracking Transparency ni l’IDFA ne sont utilisés ; aucune activité n’est suivie.',
      },
      {
        title: '3. Finalités',
        body: 'Uniquement pour faire fonctionner le compte à rebours, les widgets de l’écran d’accueil et de verrouillage, et les rappels locaux.',
      },
      {
        title: '4. Partage',
        body: 'Vos données ne sont jamais partagées, vendues ou cédées à des tiers. Aucun SDK publicitaire ou d’analyse n’est présent.',
      },
      {
        title: '5. Conservation et suppression',
        body: 'Vos dates restent sur l’appareil jusqu’à suppression ou désinstallation. Aucun serveur ne conserve de données utilisateur.',
      },
      {
        title: '6. Enfants',
        body: 'L’application ne collecte aucune donnée personnelle, y compris auprès des enfants.',
      },
      {
        title: '7. Vos droits',
        body: 'Vous pouvez supprimer des données dans l’application ou désinstaller l’app pour tout effacer.',
      },
      {
        title: '8. Contact',
        body: 'Questions sur cette politique :',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'es-ES': {
    title: 'Política de privacidad',
    updated: 'Última actualización: 27 de septiembre de 2026',
    intro: `${APP_NAME} respeta tu privacidad. La aplicación es totalmente gratuita y sin anuncios; no recopila datos personales ni los envía a ningún servidor.`,
    sections: [
      {
        title: '1. Datos que recopilamos',
        body: 'Lo que introduces: fechas, títulos, lugares y fotos se quedan exclusivamente en este dispositivo. No se envían al desarrollador ni a ningún servidor.',
      },
      {
        title: '2. Sin anuncios ni seguimiento',
        body: 'La aplicación no contiene publicidad. No se utiliza App Tracking Transparency ni identificadores publicitarios (IDFA). No se rastrea tu actividad.',
      },
      {
        title: '3. Para qué se usan',
        body: 'Únicamente para el funcionamiento de la cuenta atrás, los widgets de pantalla de inicio y bloqueo, y los recordatorios locales.',
      },
      {
        title: '4. Cesión',
        body: 'Tus fechas no se comparten ni venden a terceros. No contiene bibliotecas (SDKs) de publicidad o analítica de terceros.',
      },
      {
        title: '5. Conservación y borrado',
        body: 'Las fechas permanecen en el dispositivo hasta que las borres o desinstales la aplicación.',
      },
      {
        title: '6. Menores',
        body: 'La app no recopila datos personales de menores de edad.',
      },
      {
        title: '7. Tus opciones',
        body: 'Puedes borrar datos dentro de la app o desinstalarla para limpiar todo el contenido local.',
      },
      {
        title: '8. Contacto',
        body: 'Sobre esta política:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  it: {
    title: 'Informativa sulla privacy',
    updated: 'Ultimo aggiornamento: 27 settembre 2026',
    intro: `${APP_NAME} rispetta la tua privacy. L’app è completamente gratuita e senza pubblicità; non raccoglie dati personali né li invia a server esterni.`,
    sections: [
      {
        title: '1. Dati raccolti',
        body: 'Dati inseriti: date, titoli, luoghi e foto restano solo su questo dispositivo. Non vengono mai inviati allo sviluppatore o a un server.',
      },
      {
        title: '2. Senza annunci e senza tracciamento',
        body: 'L’app non contiene pubblicità. Non fa uso di App Tracking Transparency o identificatori pubblicitari (IDFA). Nessun tracciamento.',
      },
      {
        title: '3. Finalità',
        body: 'I dati servono unicamente a far funzionare il conto alla rovescia, i widget su schermata Home e di blocco e i promemoria locali.',
      },
      {
        title: '4. Condivisione',
        body: 'I tuoi dati non vengono condivisi o venduti a terzi. Non sono presenti librerie esterne di tracciamento o annunci.',
      },
      {
        title: '5. Conservazione e cancellazione',
        body: 'I dati restano sul dispositivo finché non li elimini o disinstalli l’app.',
      },
      {
        title: '6. Minori',
        body: 'L’app non raccoglie dati personali di minori.',
      },
      {
        title: '7. Le tue scelte',
        body: 'Puoi eliminare i dati nell’app o disinstallarla per cancellare tutto in locale.',
      },
      {
        title: '8. Contatti',
        body: 'Domande su questa informativa:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'nl-NL': {
    title: 'Privacybeleid',
    updated: 'Laatst bijgewerkt: 27 september 2026',
    intro: `${APP_NAME} respecteert je privacy. De app is volledig gratis en advertentievrij; er worden geen gegevens verzameld of verzonden naar servers.`,
    sections: [
      {
        title: '1. Welke gegevens',
        body: 'Wat jij invoert: data, titels, locaties en foto’s blijven alleen op dit apparaat. Ze gaan nooit naar de maker of naar een server.',
      },
      {
        title: '2. Geen reclame en geen tracking',
        body: 'De app bevat geen advertenties. We gebruiken geen App Tracking Transparency of advertentie-ID’s (IDFA). Geen tracking.',
      },
      {
        title: '3. Doelen',
        body: 'Uitsluitend om de countdown, de widgets op het start- en vergrendelscherm en lokale herinneringen te laten werken.',
      },
      {
        title: '4. Delen',
        body: 'Jouw data worden nooit met derden gedeeld of verkocht. Geen advertentie- of analyse-SDK’s van derden.',
      },
      {
        title: '5. Bewaartermijn en verwijderen',
        body: 'Data blijven op het apparaat tot jij ze wist of de app verwijdert.',
      },
      {
        title: '6. Kinderen',
        body: 'De app verzamelt geen persoonsgegevens van kinderen.',
      },
      {
        title: '7. Jouw keuzes',
        body: 'Je kunt data in de app wissen of de app de-installeren om alle lokale gegevens direct te verwijderen.',
      },
      {
        title: '8. Contact',
        body: 'Vragen over dit beleid:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    updated: '最終更新: 2026年9月27日',
    intro: `${APP_NAME} はプライバシーを完全に尊重します。本アプリは完全無料で広告はなく、個人データを収集・追跡したりサーバーへ送信したりすることはありません。`,
    sections: [
      {
        title: '1. 収集するデータ',
        body: '入力したデータ：日付、タイトル、場所、写真は端末内にのみ保存され、開発者や外部サーバーへ送信されることはありません。',
      },
      {
        title: '2. 広告なし・トラッキングなし',
        body: 'アプリ内に広告は一切ありません。App Tracking Transparency や広告識別子（IDFA）を使用せず、行動履歴を追跡することもありません。',
      },
      {
        title: '3. 利用目的',
        body: 'カウントダウン、ホーム画面およびロック画面のウィジェット、端末内のローカル通知の動作にのみ使用されます。',
      },
      {
        title: '4. 共有',
        body: '入力したデータが第三者に共有または販売されることはありません。第三者の広告・解析SDKは含まれていません。',
      },
      {
        title: '5. 保管と削除',
        body: 'データはアプリ内で削除するか、アプリをアンインストールするまで端末上にのみ残ります。',
      },
      {
        title: '6. 子どものプライバシー',
        body: '子どもを含むいかなるユーザーからも個人データを収集しません。',
      },
      {
        title: '7. あなたの権利',
        body: 'アプリ内でいつでもデータを削除でき、アンインストールによりすべてのローカルデータを消去できます。',
      },
      {
        title: '8. お問い合わせ',
        body: '本ポリシーに関するお問い合わせ:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  ko: {
    title: '개인정보 처리방침',
    updated: '최종 업데이트: 2026년 9월 27일',
    intro: `${APP_NAME}은(는) 사용자의 개인정보를 온전히 존중합니다. 본 앱은 완전 무료이며 광고가 없습니다. 어떠한 개인정보도 수집, 추적 또는 서버로 전송하지 않습니다.`,
    sections: [
      {
        title: '1. 수집하는 정보',
        body: '직접 입력한 데이터: 날짜, 제목, 위치, 사진은 오직 이 기기에만 저장되며 개발자나 외부 서버로 전송되지 않습니다.',
      },
      {
        title: '2. 광고 및 추적 없음',
        body: '앱에는 광고가 전혀 없습니다. App Tracking Transparency 권한이나 광고 ID(IDFA)를 사용하지 않으며 사용자를 추적하지 않습니다.',
      },
      {
        title: '3. 이용 목적',
        body: '카운트다운, 홈 화면 및 잠금 화면 위젯, 기기 내 로컬 알림을 제공하는 데에만 사용됩니다.',
      },
      {
        title: '4. 공유',
        body: '입력한 데이터는 제3자에게 공유되거나 판매되지 않습니다. 서드파티 광고나 분석 SDK가 포함되어 있지 않습니다.',
      },
      {
        title: '5. 보관 및 삭제',
        body: '데이터는 앱 내에서 삭제하거나 앱을 삭제할 때까지 기기에만 남습니다.',
      },
      {
        title: '6. 아동 개인정보',
        body: '아동을 포함하여 어떠한 개인정보도 수집하지 않습니다.',
      },
      {
        title: '7. 권리',
        body: '언제든 앱 내에서 데이터를 삭제하거나 앱을 삭제하여 로컬 데이터를 완전히 지울 수 있습니다.',
      },
      {
        title: '8. 문의',
        body: '본 방침에 대한 문의:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'zh-Hans': {
    title: '隐私政策',
    updated: '最后更新：2026年9月27日',
    intro: `${APP_NAME} 完全尊重您的隐私。本应用完全免费且无广告，不收集、不追踪任何个人数据，亦不向服务器发送任何信息。`,
    sections: [
      {
        title: '1. 我们收集的数据',
        body: '您输入的内容：日期、标题、地点和照片仅保存在本机，绝不上传至开发者或任何第三方服务器。',
      },
      {
        title: '2. 无广告与无追踪',
        body: '本应用完全无广告，不使用 App Tracking Transparency 或广告标识符（IDFA），绝不追踪您的任何行为。',
      },
      {
        title: '3. 使用目的',
        body: '仅用于本机倒计时、主屏幕与锁定屏幕小组件以及本地提醒通知的运行。',
      },
      {
        title: '4. 共享',
        body: '您输入的数据绝不会与第三方共享或出售。应用内不包含任何第三方广告或数据分析 SDK。',
      },
      {
        title: '5. 保存与删除',
        body: '数据仅保存在设备上，直到您手动删除或卸载应用。卸载应用会立即清除所有本地数据。',
      },
      {
        title: '6. 儿童隐私',
        body: '本应用不收集任何个人数据，对儿童安全无害。',
      },
      {
        title: '7. 您的选择',
        body: '您可以随时在应用内删除数据，或通过卸载应用彻底清除所有本地存储。',
      },
      {
        title: '8. 联系我们',
        body: '关于本政策的疑问：',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'zh-Hant': {
    title: '隱私權政策',
    updated: '最後更新：2026年9月27日',
    intro: `${APP_NAME} 完全尊重您的隱私。本應用程式完全免費且無廣告，不蒐集、不追蹤任何個人資料，亦不傳送至任何伺服器。`,
    sections: [
      {
        title: '1. 我們蒐集的資料',
        body: '您輸入的內容：日期、標題、地點與照片只存在本機，絕不上傳至開發者或任何第三方伺服器。',
      },
      {
        title: '2. 無廣告與無追蹤',
        body: '本應用程式完全無廣告，不使用 App Tracking Transparency 或廣告識別碼（IDFA），絕不追蹤您的任何行為。',
      },
      {
        title: '3. 使用目的',
        body: '僅用於本機倒數、主畫面與鎖定畫面小工具以及本機提醒通知。',
      },
      {
        title: '4. 分享',
        body: '您輸入的資料絕不與第三方分享或販售。應用程式內不含任何第三方廣告或分析 SDK。',
      },
      {
        title: '5. 保存與刪除',
        body: '資料只會留在裝置上，直到您手動刪除或解除安裝應用程式。',
      },
      {
        title: '6. 兒童隱私',
        body: '本應用程式不蒐集任何個人資料。',
      },
      {
        title: '7. 您的選擇',
        body: '隨時可在應用程式內刪除資料，或透過解除安裝徹底清除所有本機資料。',
      },
      {
        title: '8. 聯絡我們',
        body: '關於本政策的疑問：',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'ar-SA': {
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: 27 سبتمبر 2026',
    intro: `${APP_NAME} يحترم خصوصيتك بالكامل. التطبيق مجاني تمامًا وخالٍ من الإعلانات، ولا يجمع أي بيانات شخصية أو يتتبعها أو يرسلها إلى خوادم.`,
    sections: [
      {
        title: '1. البيانات التي نجمعها',
        body: 'البيانات التي تُدخلها: التواريخ والعناوين والمواقع والصور تُحفظ فقط على جهازك، ولا تُرسل إطلاقًا إلى المطوّر أو أي خادم.',
      },
      {
        title: '2. بدون إعلانات وبدون تتبع',
        body: 'التطبيق خالٍ تمامًا من الإعلانات ولا يستخدم App Tracking Transparency أو معرّف الإعلانات (IDFA)، ولا يتتبع نشاطك مطلقًا.',
      },
      {
        title: '3. الغرض من الاستخدام',
        body: 'تُستخدم بياناتك فقط لتشغيل العد التنازلي، وودجات الشاشة الرئيسية وشاشة القفل، والتذكيرات المحلية على جهازك.',
      },
      {
        title: '4. المشاركة',
        body: 'لا تتم مشاركة بياناتك أو بيعها لأي أطراف ثالثة. لا يحتوي التطبيق على أي حزم برمجية (SDK) تابعة لجهات خارجية للإعلانات أو التحليلات.',
      },
      {
        title: '5. الاحتفاظ والحذف',
        body: 'تبقى التواريخ على جهازك حتى تحذفها بنفسك أو تزيل التطبيق لمسح جميع البيانات المحلية فورًا.',
      },
      {
        title: '6. خصوصية الأطفال',
        body: 'التطبيق لا يجمع أي بيانات شخصية من أي مستخدم بما في ذلك الأطفال.',
      },
      {
        title: '7. حقوقك',
        body: 'يمكنك حذف بياناتك في أي وقت داخل التطبيق أو إزالة التطبيق لمسح كل شيء.',
      },
      {
        title: '8. التواصل',
        body: 'للأسئلة حول هذه السياسة:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  'pt-BR': {
    title: 'Política de privacidade',
    updated: 'Última atualização: 27 de setembro de 2026',
    intro: `${APP_NAME} respeita totalmente sua privacidade. O aplicativo é 100% gratuito e sem anúncios; não coleta, não rastreia e não envia dados pessoais a servidores.`,
    sections: [
      {
        title: '1. Dados que coletamos',
        body: 'O que você digita: datas, títulos, locais e fotos ficam exclusivamente neste aparelho. Nunca são enviados ao desenvolvedor nem a servidores.',
      },
      {
        title: '2. Sem anúncios e sem rastreamento',
        body: 'O aplicativo não contém anúncios. Não utilizamos App Tracking Transparency nem identificadores de publicidade (IDFA). Não rastreamos sua atividade.',
      },
      {
        title: '3. Para que usamos',
        body: 'Apenas para a contagem regressiva, widgets de tela de início/bloqueio e lembretes locais configurados no seu aparelho.',
      },
      {
        title: '4. Compartilhamento',
        body: 'Suas datas e fotos nunca são compartilhadas ou vendidas a terceiros. Não incluímos SDKs de terceiros para anúncios ou métricas.',
      },
      {
        title: '5. Retenção e exclusão',
        body: 'As datas ficam no aparelho até você apagar ou desinstalar o app. Desinstalar limpa todos os dados locais imediatamente.',
      },
      {
        title: '6. Crianças',
        body: 'O aplicativo não coleta dados de nenhuma pessoa, incluindo crianças.',
      },
      {
        title: '7. Suas escolhas',
        body: 'Você pode apagar itens no app a qualquer momento ou desinstalar para limpar tudo localmente.',
      },
      {
        title: '8. Contato',
        body: 'Dúvidas sobre esta política:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    updated: 'Обновлено: 27 сентября 2026',
    intro: `${APP_NAME} полностью уважает вашу конфиденциальность. Приложение на 100% бесплатное и без рекламы; оно не собирает, не отслеживает и не передаёт личные данные.`,
    sections: [
      {
        title: '1. Какие данные мы собираем',
        body: 'Введённые вами данные: даты, названия, места и фото хранятся исключительно на этом устройстве и никогда не отправляются разработчику или на сервер.',
      },
      {
        title: '2. Без рекламы и трекинга',
        body: 'В приложении нет рекламы. Мы не используем App Tracking Transparency или рекламные идентификаторы (IDFA) и не отслеживаем вашу активность.',
      },
      {
        title: '3. Цели',
        body: 'Только для работы обратного отсчёта, виджетов на экране «Домой» и экране блокировки, а также локальных напоминаний.',
      },
      {
        title: '4. Передача',
        body: 'Ваши данные никогда не передаются и не продаются третьим лицам. В приложении отсутствуют сторонние библиотеки (SDK) рекламы или аналитики.',
      },
      {
        title: '5. Хранение и удаление',
        body: 'Даты остаются на устройстве до тех пор, пока вы их не удалите или не удалите приложение.',
      },
      {
        title: '6. Дети',
        body: 'Приложение не собирает персональные данные детей или любых других пользователей.',
      },
      {
        title: '7. Ваши права',
        body: 'Вы можете удалить данные в приложении в любой момент или удалить приложение, чтобы полностью очистить локальное хранилище.',
      },
      {
        title: '8. Контакты',
        body: 'По вопросам этой политики:',
        linkUrl: `mailto:${SUPPORT_EMAIL}`,
        linkLabel: SUPPORT_EMAIL,
      },
    ],
  },
};

function privacySource(locale: AppLocale): AppLocale {
  if (locale.startsWith('en-')) return 'en-US';
  if (locale === 'fr-CA') return 'fr-FR';
  if (locale === 'es-MX') return 'es-ES';
  if (locale === 'pt-PT') return 'pt-BR';
  return locale;
}

export function getPrivacyDoc(locale: AppLocale): PrivacyDoc {
  return docs[locale] ?? docs[privacySource(locale)] ?? docs['en-US']!;
}
