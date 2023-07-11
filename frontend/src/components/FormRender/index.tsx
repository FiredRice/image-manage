import { Form } from 'antd';
import RForm from './components/RFrom';
import Renders from './components/Renders';
import Search from './components/Search';
import { scrollToField, useFormInstance, useSchema, useShouldUpdate } from './hooks';
import { createSearch, useSearch } from './components/Search/hooks';
import './style/index.less'; 

type IRFromProps = typeof RForm;

interface IFormRenderV4Props extends IRFromProps {
    useSchema: typeof useSchema;
    useForm: typeof Form.useForm;
    useFormInstance: typeof useFormInstance;
    useShouldUpdate: typeof useShouldUpdate;
    useSearch: typeof useSearch;
    createSearch: typeof createSearch;
    scrollToField: typeof scrollToField;
    Renders: typeof Renders;
    Search: typeof Search;
    Item: typeof Form.Item;
}

const FormRenderV4 = RForm as IFormRenderV4Props;

FormRenderV4.useSchema = useSchema;
FormRenderV4.useForm = Form.useForm;
FormRenderV4.useFormInstance = useFormInstance;
FormRenderV4.useShouldUpdate = useShouldUpdate;
FormRenderV4.useSearch = useSearch;
FormRenderV4.createSearch = createSearch;
FormRenderV4.scrollToField = scrollToField;
FormRenderV4.Renders = Renders;
FormRenderV4.Search = Search;
FormRenderV4.Item = Form.Item;

export default FormRenderV4;