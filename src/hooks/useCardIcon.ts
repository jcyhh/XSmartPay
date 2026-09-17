import card1 from '@/assets/card/1.webp'
import card2 from '@/assets/card/2.webp'
import card3 from '@/assets/card/3.webp'
import card4 from '@/assets/card/4.webp'
import card5 from '@/assets/card/5.webp'
import card6 from '@/assets/card/6.webp'
import card7 from '@/assets/card/7.webp'

export function useCardIcon () {
    const getCardIcon = (id:number) => {
        if(id==1)return card1
        else if(id==2)return card2
        else if(id==3)return card3
        else if(id==4)return card4
        else if(id==5)return card5
        else if(id==6)return card6
        else if(id==7)return card7
        else return card1
    }
    return {
        getCardIcon
    }
}
