// !!!!! 注意引入 JS 只能写相对路径，注意全局路径的修改。
import { myAxios } from 'utils/myAxios';
App({
    myAxios,
    gloablData: {
        aa:11
    }
})