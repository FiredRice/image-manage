import { createContext } from './components/Context';
import { useRefInstance } from './hooks';

const RefContext = {
    /**
     * 创建上下文
     */
    createContext,
    /**
     * 创建上下文实例
     */
    useRefInstance
}

export default RefContext;