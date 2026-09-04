import { BindingApi } from '../../blade/binding/api/binding.js';
import { InputBindingApi } from '../../blade/binding/api/input-binding.js';
import { InputBindingController } from '../../blade/binding/controller/input-binding.js';
import { ListItem } from '../constraint/list.js';
import { ListController } from '../controller/list.js';
export declare class ListInputBindingApi<T> extends BindingApi<T, T, InputBindingController<T, ListController<T>>> implements InputBindingApi<T, T> {
    get options(): ListItem<T>[];
    set options(options: ListItem<T>[]);
}
