import _ from "lodash";

interface Orderable {
    order: number;
}

interface ReorderArrayOptions<T extends Orderable> {
    source: T[];
    destination: T[];
    fromIndex: number;
    toIndex: number;
}

export default function reorderArray<T extends Orderable>({
    source,
    destination,
    fromIndex,
    toIndex,
}: ReorderArrayOptions<T>) {
    const temp = source.splice(fromIndex, 1)[0];

    for (let i = fromIndex; i < source.length; i++) {
        source[i].order--;
    }

    for (let i = toIndex; i < destination.length; i++) {
        destination[i].order++;
    }

    destination.splice(toIndex, 0, temp);
    destination[toIndex].order = toIndex;
}
