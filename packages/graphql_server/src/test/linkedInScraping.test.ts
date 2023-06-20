import { getCompanyInfosFromLinkedIn } from '../scraping/linkedInScraping'

// Testfall 1: Gültiger LinkedIn-Handle
void getCompanyInfosFromLinkedIn('google').then((companyInfo) =>
  console.log('Testfall 1:', companyInfo)
)

// Testfall 2: Ungültiger LinkedIn-Handle
void getCompanyInfosFromLinkedIn('').then((companyInfo) => console.log('Testfall 2:', companyInfo))

// Testfall 3: Gültiger LinkedIn-Handle mit einer längeren Wartezeit
void getCompanyInfosFromLinkedIn('google', 60000).then((companyInfo) =>
  console.log('Testfall 3:', companyInfo)
)

// Testfall 4: Keine Daten für das Unternehmen gefunden
void getCompanyInfosFromLinkedIn('unknowncompany').then((companyInfo) =>
  console.log('Testfall 4:', companyInfo)
)

// Testfall 5: Unternehmen gibts nicht
void getCompanyInfosFromLinkedIn('unternehmengibtsnicht').then((companyInfo) =>
  console.log('Testfall 5:', companyInfo)
)

// Testfall 6: Unternehmen gibts nicht mit Wartezeit
void getCompanyInfosFromLinkedIn('unternehmengibtsnicht', 20000).then((companyInfo) =>
  console.log('Testfall 6:', companyInfo)
)
