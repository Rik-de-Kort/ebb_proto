import {test, assert} from 'vitest';
import {Selection, Direction} from "$lib/Selection";

test('selection object', () => {
    let selection = new Selection();
    assert(selection.size === 0);

    selection.seed([0, 0]);
    assert(selection.topLeft && selection.bottomRight
        && selection.topLeft[0] === 0 && selection.topLeft[1] === 0
        && selection.bottomRight[0] === 0 && selection.bottomRight[1] === 0);
    assert(selection.has([0, 0]));

    selection.expand(Direction.right);
    selection.expand(Direction.right);
    selection.expand(Direction.down);
    selection.expand(Direction.down);
    selection.expand(Direction.down);
    assert(selection.topLeft[0] === 0);
    assert(selection.topLeft[1] === 0);
    assert(selection.bottomRight[0] === 3);
    assert(selection.bottomRight[1] === 2);
    assert(selection.has([1, 1]));
    assert(selection.size === 12);

    selection.shrink(Direction.left);
    assert(selection.topLeft && selection.bottomRight
        && selection.topLeft[0] === 0 && selection.topLeft[1] === 0
        && selection.bottomRight[0] === 3 && selection.bottomRight[1] === 1);

    selection.shrink(Direction.up);
    assert(selection.topLeft && selection.bottomRight
        && selection.topLeft[0] === 0 && selection.topLeft[1] === 0
        && selection.bottomRight[0] === 2 && selection.bottomRight[1] === 1);
    assert(!selection.has([3, 2]));

    selection.clear();
    assert(!selection.topLeft && !selection.bottomRight)
    assert(selection.size === 0);
})
