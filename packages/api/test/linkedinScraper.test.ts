import { getCompanyInfosFromLinkedIn } from '../src/scraper/linkedinScraper'

void getCompanyInfosFromLinkedIn('google', 25000).then((r) => console.log(r))
