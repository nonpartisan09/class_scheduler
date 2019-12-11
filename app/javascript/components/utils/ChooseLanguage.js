import { ENGLISH, SPANISH } from './availableLocales';

function ChooseLanguage(setLang, languageInferredFromServer) {
  
  
  const re = /(\/[a-z]{2})?(\/.*)?$/
  let path =  window.location.pathname.match(re);

  if (path[0].includes(`/${ENGLISH}`)) return setLang(ENGLISH)
  if (path[0].includes(`/${SPANISH}`)) return setLang(SPANISH)

  const guestLocale = localStorage.getItem('locale');
  let defineLocale = guestLocale || languageInferredFromServer;

  return window.location.replace(`${window.location.origin}/${defineLocale}${path[2]}`)
  
}
  
export default ChooseLanguage;