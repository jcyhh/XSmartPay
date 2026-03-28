import { t } from '@/locale';
import { message } from '@/utils/message';
import copy from 'copy-to-clipboard';

interface RippleHTMLElement extends HTMLElement {
    _copyValue: string
}

export default {
    mounted(el: RippleHTMLElement, binding: any) {
        el.addEventListener('click', () => {
            let valueToCopy = el._copyValue || binding.value
            const result = copy(valueToCopy);
            if (result) message(t('复制成功'), 'success')
            else message(t('复制失败'), 'fail')
        });
    },
    updated(el: RippleHTMLElement, binding: any) {
        el._copyValue = binding.value;
    }
};