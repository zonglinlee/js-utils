// common
import typeCheck from './common/typeCheck'
import {
    isValidUrl,
    isPasswordType1,
    isMobile,
    isIdCard,
} from './common/regexp'
import { HttpStatusCode } from './common/consts'
import { throttle, debounce } from './common/throttleDebounce'
import { loadJs } from './common/loadJs'
import {
    uniqueArrBySet,
    uniqueArrByDoubleForLoop,
    uniqueArrByFilter,
} from './common/uniqueArr'
// others
import { chooseFile } from './others/chooseFile'
import { uploadFileToOss } from './others/upload'
import {
    downloadFileByFormSubmit,
    downloadFileByBlob,
} from './others/downloadFile'
import { saveAs } from './others/fileSaver'

export {
    typeCheck,
    isValidUrl,
    isPasswordType1,
    isMobile,
    isIdCard,
    HttpStatusCode,
    throttle,
    debounce,
    loadJs,
    uniqueArrBySet,
    uniqueArrByDoubleForLoop,
    uniqueArrByFilter,
    chooseFile,
    uploadFileToOss,
    downloadFileByFormSubmit,
    downloadFileByBlob,
    saveAs,
}
