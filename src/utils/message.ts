import success from '@/assets/common/success.png'
import info from '@/assets/common/info.png'
import fail from '@/assets/common/fail.png'
import warning from '@/assets/common/warning.png'
import close from '@/assets/common/close.png'

type Message = 'success' | 'info' | 'fail' | 'warning'

let isShow:boolean = false // 是否打开
let timer:any = 0
let timer1:any = 0

export function message(title:string, type:Message='warning'){
    if(isShow){
        const element = document.getElementById('cusMessage');
        if(element)element.remove()
        if(timer){
            clearTimeout(timer)
            timer = 0
        }
        if(timer1){
            clearTimeout(timer1)
            timer1 = 0
        }
    }
    let bg = ''
    let icon = ''
    if(type=='success'){
        bg = 'messageSuccess'
        icon = success
    }else if(type=='info'){
        bg = 'messageGray'
        icon = info
    }else if(type=='fail'){
        bg = 'messageFail'
        icon = fail
    }else{
        bg = 'messageWarning'
        icon = warning
    }
    const htmlStr = `
    <div id="cusMessage" class="message animate__animated animate__slideInUp ani5 ${bg}">
        <div class="messageBox flex ac">
            <img src="${icon}" class="img46 mr20 flex0">
            <div class="size24 flex1">${title}</div>
            <img id="messageClose" src="${close}" class="img24 flex0">
        </div>
    </div>
    `
    isShow = true
    document.body.insertAdjacentHTML('beforeend', htmlStr);
    document.getElementById('messageClose')?.addEventListener('click',closeMessage)
    timer = setTimeout(() => {
        closeMessage()
    }, 1500);
}

export function closeMessage(){
    if(timer){
        clearTimeout(timer)
        timer = 0
    }
    const element = document.getElementById('cusMessage');
    if(element){
        element.classList.remove('animate__slideInUp', 'ani5')
        element.classList.add('animate__zoomOut')
        timer1 = setTimeout(() => {
            element.remove()
            isShow = false
        }, 500);
    }
}