import _ from "lodash";

interface Orderable {
    order: number;
}

interface ReorderArrayOptions<T extends Orderable> {
    array: T[];
    fromIndex: number;
    toIndex: number;
    clone?: boolean;
}

interface RemoveFromAndInsertToOptions<T extends Orderable> {
    fromArray: T[];
    toArray: T[];
    fromIndex: number;
    toIndex: number;
}

export function removeFromAndInsertTo<T extends Orderable>({
    fromArray,
    toArray,
    fromIndex,
    toIndex,
}: RemoveFromAndInsertToOptions<T>) {
    const temp = fromArray.splice(fromIndex, 1)[0];
    toArray.splice(toIndex, 0, temp);
}

export default function reorderArray<T extends Orderable>({
    array,
    fromIndex,
    toIndex,
    clone = true,
}: ReorderArrayOptions<T>) {
    if (array.length === 0) {
        return clone ? [] : array;
    }

    if (clone) {
        array = _.cloneDeep(array);
    }

    removeFromAndInsertTo({
        fromArray: array,
        toArray: array,
        fromIndex,
        toIndex,
    });

    const isAscending = toIndex > fromIndex;
    const stopCondition = (i: number) =>
        isAscending ? i <= toIndex : i >= toIndex;
    const direction = isAscending ? 1 : -1;

    for (let i = fromIndex; stopCondition(i); i += direction) {
        array[i].order = i;
    }

    return array;
}
